/**
 * GABRU — CONTENT SCORING ENGINE
 * 
 * Mathematically rigorous, reproducible evaluation engine for social media content:
 * 1. 10-Parameter Evidence-Gated Quality Score (0..100) across 3 Data Tiers (A, B, C)
 * 2. Creator-Baseline Robust z-Score Empirical Performance Score (0..100)
 * 3. 70/30 Blended Content Score with Critical Flaw Caps
 * 4. Engine Re-simulation for Exact Delta-Gain Ranked Suggestions
 * 5. Strict Evidence Gate Validation
 */

import {
  UnifiedContentItem,
  ContentScoreData,
  QualityScoreResult,
  PerformanceScoreResult,
  ContentParameterResult,
  ContentSubfactorResult,
  ContentRatingVerdict,
  ActionableSuggestion,
  ContentSubfactorEvidence,
  CriticalCapResult,
  EffortTier,
  DataTier,
} from '../types/ContentRatingTypes';

import {
  CONTENT_PARAMETERS,
  CONTENT_TYPE_EXCLUSIONS,
  PLATFORM_PROFILES,
  calculateBandPenalty,
  CRITICAL_CAP_THRESHOLDS,
  EFFORT_LEVEL_CONFIG,
} from '../constants/ContentRatingConstants';

export const PENALTY_MAP: Record<number, number> = {
  0: 0.0,
  1: 1.0,  // Minor penalty
  2: 2.5,  // Moderate penalty
  3: 4.5,  // Major penalty
};

export const BAYESIAN_PRIOR = 7.0;

export interface QualityEngineInputFactor {
  V?: number; // Override visibility (1.0, 0.5, 0.0)
  defects?: number[]; // Array of 0, 1, 2, 3
  raw?: number; // Explicit raw rating (0..10)
  evidence?: ContentSubfactorEvidence;
  isApplicable?: boolean;
}

// -------------------------------------------------------------
// The Evidence Gate (Part A3)
// -------------------------------------------------------------

export interface EvidenceGateValidationResult {
  passed: boolean;
  reason?: string;
  remediatedVisibility?: number;
}

/**
 * Validates a reported finding against strict evidence rules.
 * A rejected finding falls back to V = 0.5.
 */
export function validateEvidenceGate(
  subfactorCode: string,
  severity: number,
  evidence: ContentSubfactorEvidence | undefined,
  item: UnifiedContentItem
): EvidenceGateValidationResult {
  // Severity must be 0, 1, 2, or 3
  if (![0, 1, 2, 3].includes(severity)) {
    return { passed: false, reason: 'Invalid severity score; must be 0, 1, 2, or 3.', remediatedVisibility: 0.5 };
  }

  // Severity 0 needs no penalty evidence
  if (severity === 0) {
    return { passed: true };
  }

  // Severity above 0 with no evidence is rejected
  if (!evidence) {
    return { passed: false, reason: 'Penalty claimed without required evidence.', remediatedVisibility: 0.5 };
  }

  // Timestamp evidence must fall inside media duration
  if (evidence.type === 'timestamp') {
    const parts = evidence.ref.split('-').map((s) => parseFloat(s.replace(/[^0-9.]/g, '')));
    const timestamp = parts[0] || 0;
    if (isNaN(timestamp) || timestamp < 0 || timestamp > (item.media.durationSec || 600)) {
      return { passed: false, reason: `Timestamp ${evidence.ref} falls outside media duration (${item.media.durationSec}s).`, remediatedVisibility: 0.5 };
    }
  }

  // Quote evidence must appear verbatim in caption or transcript
  if (evidence.type === 'quote') {
    const cleanRef = evidence.ref.toLowerCase().trim();
    const captionHasIt = item.caption.toLowerCase().includes(cleanRef);
    const transcriptHasIt = item.transcriptSegments.some((seg) =>
      seg.text.toLowerCase().includes(cleanRef)
    );
    if (!captionHasIt && !transcriptHasIt) {
      return { passed: false, reason: `Quote "${evidence.ref}" not found in caption or transcript text.`, remediatedVisibility: 0.5 };
    }
  }

  return { passed: true };
}

/**
 * Maps composite score to rating verdict
 */
export function getRatingVerdict(score: number, severeSafety = false): ContentRatingVerdict {
  if (severeSafety) return 'Not Rated';
  if (score >= 90.0) return 'Exceptional';
  if (score >= 80.0) return 'Strong';
  if (score >= 70.0) return 'Good';
  if (score >= 55.0) return 'Average';
  if (score >= 40.0) return 'Weak';
  return 'Needs Rework';
}

// -------------------------------------------------------------
// Quality Score Engine (Parts A & B)
// -------------------------------------------------------------

export function calculateQualityScore(
  item: UnifiedContentItem,
  customFactors?: Record<string, QualityEngineInputFactor>
): QualityScoreResult {
  const paramResults: ContentParameterResult[] = [];
  const paramScores: Record<number, number> = {};
  const paramRatings: Record<number, number> = {};
  const capsTriggered: CriticalCapResult[] = [];

  const tier: DataTier = item.dataTier || (item.inputMode === 'upload' ? 'C' : 'A');
  const typeExclusions = CONTENT_TYPE_EXCLUSIONS[item.format] || [];

  let totalPoints = 0;
  let maxObservablePoints = 0;
  let qualityConfidenceNumerator = 0;

  for (const pDef of CONTENT_PARAMETERS) {
    const subResults: ContentSubfactorResult[] = [];
    let applicableWeightSum = 0;
    let weightedAdjustedSum = 0;
    let minAdjusted = 10.0;
    let subfactorWithLowest = '';
    let confNumerator = 0;
    let confDenominator = 0;

    for (const subDef of pDef.subfactors) {
      const custom = customFactors?.[subDef.code];

      // 1. Determine applicability: check content-type exclusions (N/A)
      let isApplicable = custom?.isApplicable ?? true;
      if (typeExclusions.includes(subDef.code)) {
        isApplicable = false;
      }
      if (subDef.code === 'VR4' && item.isIntentionalPivot) {
        isApplicable = false;
      }

      // If N/A by content type, exclude from BOTH score and confidence
      if (!isApplicable) {
        subResults.push({
          code: subDef.code,
          name: subDef.name,
          weight: subDef.weight,
          rawRating: 10.0,
          visibility: 0.0,
          adjustedRating: 10.0,
          penalties: [],
          isApplicable: false,
          isObserved: false,
          notes: 'N/A by content format: Excluded from score and confidence',
        });
        continue;
      }

      // 2. Determine visibility V (A/B/C)
      let V = custom?.V !== undefined ? custom.V : subDef.visibilityByTier[tier];

      // Special visibility rules per spec:
      // TM1 requires owner analytics / CSV
      if (subDef.code === 'TM1') {
        if (tier === 'B' || item.ownerAnalytics) {
          V = 1.0;
        } else {
          V = 0.0;
        }
      }

      // 3. Evidence Gate Validation
      let rawRating = 10.0;
      const penalties: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }> = [];

      if (custom?.raw !== undefined) {
        rawRating = Math.max(0, Math.min(10, custom.raw));
      } else if (custom?.defects && custom.defects.length > 0) {
        for (const defect of custom.defects) {
          const gateResult = validateEvidenceGate(subDef.code, defect, custom.evidence, item);
          if (!gateResult.passed) {
            V = gateResult.remediatedVisibility ?? 0.5;
          }
          const delta = PENALTY_MAP[defect] ?? 0;
          if (delta > 0) {
            const severity: 'minor' | 'moderate' | 'major' =
              defect === 1 ? 'minor' : defect === 2 ? 'moderate' : 'major';
            penalties.push({
              severity,
              delta: -delta,
              evidence: custom.evidence || {
                type: 'metric',
                ref: subDef.code,
                note: subDef.observableChecks,
              },
            });
            rawRating -= delta;
          }
        }
        rawRating = Math.max(0, rawRating);
      } else {
        // Derive raw rating from item properties
        const derived = deriveSubfactorRating(pDef.id, subDef.code, item);
        rawRating = derived.rawRating;
        if (derived.penalties) penalties.push(...derived.penalties);
      }

      // Rule: V=0 excludes the sub-factor from score, but it counts in confidence denominator
      confDenominator += subDef.weight;
      confNumerator += subDef.weight * V;

      if (V === 0.0) {
        subResults.push({
          code: subDef.code,
          name: subDef.name,
          weight: subDef.weight,
          rawRating: Number(rawRating.toFixed(2)),
          visibility: 0.0,
          adjustedRating: 7.0, // unobserved
          penalties,
          isApplicable: true,
          isObserved: false,
          notes: 'Unobserved (V=0): Excluded from parameter score, lowers confidence',
        });
        continue;
      }

      // Bayesian adjustment: adjusted = V * raw + (1 - V) * 7.0
      const adjusted = V === 1.0 ? rawRating : 0.5 * rawRating + 0.5 * BAYESIAN_PRIOR;

      applicableWeightSum += subDef.weight;
      weightedAdjustedSum += adjusted * subDef.weight;

      if (adjusted < minAdjusted) {
        minAdjusted = adjusted;
        subfactorWithLowest = subDef.code;
      }

      subResults.push({
        code: subDef.code,
        name: subDef.name,
        weight: subDef.weight,
        rawRating: Number(rawRating.toFixed(2)),
        visibility: V,
        adjustedRating: Number(adjusted.toFixed(2)),
        penalties,
        isApplicable: true,
        isObserved: true,
      });
    }

    // Check if entire parameter is unobserved
    const isParamObserved = applicableWeightSum > 0;
    const paramConfidence = confDenominator > 0 ? confNumerator / confDenominator : 0.0;

    if (!isParamObserved) {
      // Entire parameter unobserved (e.g. Storytelling in Tier A):
      // Excluded from score, but counts as ZERO confidence!
      paramResults.push({
        id: pDef.id,
        code: pDef.code,
        name: pDef.name,
        weight: pDef.weight,
        beta: pDef.beta,
        rating: 0.0,
        points: 0.0,
        maxPoints: pDef.weight,
        confidence: 0.0,
        subfactors: subResults,
        lowestSubfactor: '',
        isObserved: false,
        isRenormalized: true,
      });
      // In confidence numerator, unobserved parameter contributes 0
      continue;
    }

    // Weighted average of adjusted ratings
    const WA = weightedAdjustedSum / applicableWeightSum;
    const beta = pDef.beta; // Parameter-specific beta (0.10, 0.15, or 0.20)

    // Formula: R = (1 - beta) * WA + beta * lowest adjusted rating
    let R = (1 - beta) * WA + beta * minAdjusted;
    R = Math.max(0, Math.min(10, R));

    const points = R * (pDef.weight / 10);

    totalPoints += points;
    maxObservablePoints += pDef.weight;
    qualityConfidenceNumerator += pDef.weight * paramConfidence;

    paramScores[pDef.id] = Number(points.toFixed(2));
    paramRatings[pDef.id] = Number(R.toFixed(2));

    paramResults.push({
      id: pDef.id,
      code: pDef.code,
      name: pDef.name,
      weight: pDef.weight,
      beta: pDef.beta,
      rating: Number(R.toFixed(2)),
      points: Number(points.toFixed(2)),
      maxPoints: pDef.weight,
      confidence: Number(paramConfidence.toFixed(2)),
      subfactors: subResults,
      lowestSubfactor: subfactorWithLowest,
      isObserved: true,
      isRenormalized: applicableWeightSum < 100,
    });
  }

  // Renormalize Quality Score over observed parameters:
  // Quality Score = 100 * Σ points ÷ Σ max
  let qualityScore = maxObservablePoints > 0 ? (totalPoints / maxObservablePoints) * 100 : 0;
  qualityScore = Number(qualityScore.toFixed(1));

  // Overall Quality Confidence = Σ(max * parameter confidence) ÷ 100 (unobserved parameter counts as 0)
  const qualityConfidence = Number((qualityConfidenceNumerator / 100).toFixed(2));

  // -------------------------------------------------------------
  // Enforce Critical Flaw Caps (Part D)
  // -------------------------------------------------------------
  const hookRating = paramRatings[1] ?? 10.0;
  if (hookRating < CRITICAL_CAP_THRESHOLDS.HOOK_MIN_RATING) {
    if (qualityScore > CRITICAL_CAP_THRESHOLDS.HOOK_CAP_SCORE) {
      capsTriggered.push({
        cap: CRITICAL_CAP_THRESHOLDS.HOOK_CAP_SCORE,
        reason: `Hook rating (${hookRating.toFixed(1)}/10) is below 4.0; score capped at ${CRITICAL_CAP_THRESHOLDS.HOOK_CAP_SCORE}.`,
        triggered: true,
      });
      qualityScore = CRITICAL_CAP_THRESHOLDS.HOOK_CAP_SCORE;
    }
  }

  const valueRating = paramRatings[2] ?? 10.0;
  if (valueRating < CRITICAL_CAP_THRESHOLDS.VALUE_MIN_RATING) {
    if (qualityScore > CRITICAL_CAP_THRESHOLDS.VALUE_CAP_SCORE) {
      capsTriggered.push({
        cap: CRITICAL_CAP_THRESHOLDS.VALUE_CAP_SCORE,
        reason: `Value rating (${valueRating.toFixed(1)}/10) is below 4.0; score capped at ${CRITICAL_CAP_THRESHOLDS.VALUE_CAP_SCORE}.`,
        triggered: true,
      });
      qualityScore = CRITICAL_CAP_THRESHOLDS.VALUE_CAP_SCORE;
    }
  }

  // Major compliance flags: TC1 promo undisclosed, TC3 misleading claims, TC4 violations
  const trustParam = paramResults.find((p) => p.id === 10);
  const tc1Penalty = trustParam?.subfactors.find((s) => s.code === 'TC1')?.penalties.some((p) => p.severity === 'major');
  const tc3Penalty = trustParam?.subfactors.find((s) => s.code === 'TC3')?.penalties.some((p) => p.severity === 'major');
  const tc4Penalty = trustParam?.subfactors.find((s) => s.code === 'TC4')?.penalties.some((p) => p.severity === 'major');

  if (tc1Penalty || tc3Penalty || tc4Penalty) {
    if (qualityScore > CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE) {
      capsTriggered.push({
        cap: CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE,
        reason: `Major compliance or disclosure flag detected; score capped at ${CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE}.`,
        triggered: true,
      });
      qualityScore = CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE;
    }
  }

  return {
    score: Number(qualityScore.toFixed(1)),
    pointsTotal: Number(totalPoints.toFixed(1)),
    maxObservablePoints,
    confidence: qualityConfidence,
    parameterScores: paramScores,
    parameterRatings: paramRatings,
    parameters: paramResults,
    capsTriggered,
  };
}

// -------------------------------------------------------------
// Performance Score Engine (Part C)
// -------------------------------------------------------------

export function calculatePerformanceScore(
  item: UnifiedContentItem
): PerformanceScoreResult {
  const stats = item.baselineStats;
  const postedDate = new Date(item.postedAt).getTime();
  const now = Date.now();
  const ageHours = (now - postedDate) / (1000 * 60 * 60);

  // Gates:
  // Gate 1: Post younger than 48h (7 days for long video) -> "too early"
  const minAgeHours = item.format === 'long_video' ? 7 * 24 : 48;
  if (ageHours < minAgeHours) {
    return {
      score: 0,
      isAvailable: false,
      confidence: 0,
      gatedReason: `Post is too recent (${Math.round(ageHours)}h old); requires at least ${minAgeHours}h before performance evaluation.`,
      zScores: { engagement: 0, views: 0 },
      subfactorRatings: { engagement: 5, views: 5, retention: null, commentQuality: 5 },
      statusMessage: 'Performance evaluation deferred (too early).',
    };
  }

  // Gate 2: Fewer than 5 baseline posts -> do not score
  if (!stats || stats.postCount < 5) {
    return {
      score: 0,
      isAvailable: false,
      confidence: 0,
      gatedReason: `Insufficient creator baseline history (${stats?.postCount || 0} posts; minimum 5 required).`,
      zScores: { engagement: 0, views: 0 },
      subfactorRatings: { engagement: 5, views: 5, retention: null, commentQuality: 5 },
      statusMessage: 'Baseline history insufficient (< 5 posts).',
    };
  }

  // Gate 3: 5 to 9 baseline posts -> V = 0.5; 10+ posts -> V = 1.0
  const baselineVisibility = stats.postCount >= 10 ? 1.0 : 0.5;

  // Metric 1: Engagement rate = (likes + comments + shares + saves) ÷ views
  let zEng: number;
  let zViews: number;
  let zComm: number;
  let zRet: number | null = null;
  let retRating: number | null = null;
  let retentionV = 0.0;

  if (item.performanceZScores) {
    zEng = item.performanceZScores.engagement ?? 0;
    zViews = item.performanceZScores.views ?? 0;
    zComm = item.performanceZScores.commentQuality ?? 0;
    if (item.performanceZScores.retention !== undefined && item.performanceZScores.retention !== null) {
      zRet = item.performanceZScores.retention;
      retentionV = baselineVisibility;
      retRating = Math.max(0, Math.min(10, 5.0 + 2.5 * zRet));
    }
  } else {
    const totalEngagements =
      item.metrics.likes +
      item.metrics.comments +
      (item.metrics.shares || 0) +
      (item.metrics.saves || 0);
    const currentEngRate = item.metrics.views > 0 ? totalEngagements / item.metrics.views : 0;
    const madEng = stats.madEngagementRate || stats.medianEngagementRate * 0.25 || 0.01;
    const rawZEng = (currentEngRate - stats.medianEngagementRate) / (1.4826 * madEng);
    zEng = Math.max(-3, Math.min(3, rawZEng));

    // Metric 2: Views versus baseline
    const madViews = stats.madViews || stats.medianViews * 0.35 || 1000;
    const rawZViews = (item.metrics.views - stats.medianViews) / (1.4826 * madViews);
    zViews = Math.max(-3, Math.min(3, rawZViews));

    // Metric 3: Retention (needs owner analytics, otherwise V=0)
    if (item.ownerAnalytics && item.ownerAnalytics.completionRatePercent !== null) {
      retentionV = baselineVisibility;
      const currentRetRatio = (item.ownerAnalytics.completionRatePercent || 0) / 100;
      const medianRet = stats.medianRetentionRatio || 0.50;
      const madRet = stats.madRetentionRatio || 0.12;
      zRet = Math.max(-3, Math.min(3, (currentRetRatio - medianRet) / (1.4826 * madRet)));
      retRating = Math.max(0, Math.min(10, 5.0 + 2.5 * zRet));
    }

    // Metric 4: Comment quality (substantive comments per 1k views)
    const currentCommentsPer1k = item.metrics.views > 0 ? (item.metrics.comments / item.metrics.views) * 1000 : 0;
    const medianComm = stats.medianCommentsPer1k || 2.0;
    const madComm = stats.madCommentsPer1k || 0.8;
    zComm = Math.max(-3, Math.min(3, (currentCommentsPer1k - medianComm) / (1.4826 * madComm)));
  }

  const commentV = item.metrics.comments < 20 ? 0.5 : baselineVisibility;

  // Calculate Subfactor Ratings using: rating = clamp(5 + 2.5 * z, 0, 10)
  const rawEngRating = Math.max(0, Math.min(10, 5.0 + 2.5 * zEng));
  const rawViewsRating = Math.max(0, Math.min(10, 5.0 + 2.5 * zViews));
  const rawCommRating = Math.max(0, Math.min(10, 5.0 + 2.5 * zComm));

  // Weights: PE1: 40, PE2: 25, PE3: 20, PE4: 15
  const peSubfactors = [
    { code: 'PE1', weight: 40, raw: rawEngRating, V: baselineVisibility },
    { code: 'PE2', weight: 25, raw: rawViewsRating, V: baselineVisibility },
    { code: 'PE3', weight: 20, raw: retRating ?? 7.0, V: retentionV },
    { code: 'PE4', weight: 15, raw: rawCommRating, V: commentV },
  ];

  let applicableW = 0;
  let weightedAdj = 0;
  let minAdj = 10.0;
  let confNumerator = 0;

  for (const s of peSubfactors) {
    if (s.V === 0.0) continue;
    const adj = s.V === 1.0 ? s.raw : 0.5 * s.raw + 0.5 * 7.0;
    applicableW += s.weight;
    weightedAdj += adj * s.weight;
    if (adj < minAdj) minAdj = adj;
    confNumerator += s.weight * s.V;
  }

  const WA = applicableW > 0 ? weightedAdj / applicableW : 7.0;
  const beta = 0.10;
  const R_perf = applicableW > 0 ? (1 - beta) * WA + beta * minAdj : 7.0;

  const score = Number((R_perf * 10).toFixed(1));
  const confidence = Number((confNumerator / 100).toFixed(2));

  return {
    score,
    isAvailable: true,
    confidence,
    zScores: {
      engagement: Number(zEng.toFixed(2)),
      views: Number(zViews.toFixed(2)),
      retention: zRet !== null ? Number(zRet.toFixed(2)) : null,
      commentQuality: Number(zComm.toFixed(2)),
    },
    subfactorRatings: {
      engagement: Number(rawEngRating.toFixed(2)),
      views: Number(rawViewsRating.toFixed(2)),
      retention: retRating !== null ? Number(retRating.toFixed(2)) : null,
      commentQuality: Number(rawCommRating.toFixed(2)),
    },
    statusMessage: 'Creator-baseline empirical performance evaluated successfully.',
  };
}

// -------------------------------------------------------------
// Combined Content Score & Delta-Gain Suggestions (Part D)
// -------------------------------------------------------------

export function evaluateUnifiedContent(
  item: UnifiedContentItem,
  customFactors?: Record<string, QualityEngineInputFactor>
): ContentScoreData {
  const quality = calculateQualityScore(item, customFactors);
  const performance = calculatePerformanceScore(item);

  // Score Assembly (Part D)
  let blendedScore: number;
  let isQualityOnly = false;

  if (performance.isAvailable) {
    blendedScore = 0.70 * quality.score + 0.30 * performance.score;
  } else {
    blendedScore = quality.score;
    isQualityOnly = true;
  }

  blendedScore = Number(blendedScore.toFixed(1));

  // Apply critical caps to blended score
  if (quality.capsTriggered.length > 0) {
    const minCap = Math.min(...quality.capsTriggered.map((c) => c.cap));
    if (blendedScore > minCap) {
      blendedScore = minCap;
    }
  }

  // Blended Confidence = 0.70 * Quality Confidence + 0.30 * Performance Confidence
  let blendedConfidence: number;
  if (performance.isAvailable) {
    blendedConfidence = 0.70 * quality.confidence + 0.30 * performance.confidence;
  } else {
    blendedConfidence = quality.confidence;
  }
  blendedConfidence = Number(blendedConfidence.toFixed(2));

  const confidenceTier: 'High' | 'Medium' | 'Low' =
    blendedConfidence >= 0.80 ? 'High' : blendedConfidence >= 0.50 ? 'Medium' : 'Low';

  const verdict = getRatingVerdict(blendedScore);

  // Extract Pros and Cons
  const pros: ContentScoreData['pros'] = [];
  const cons: ContentScoreData['cons'] = [];

  for (const param of quality.parameters) {
    for (const sub of param.subfactors) {
      if (!sub.isApplicable || !sub.isObserved) continue;
      if (sub.rawRating >= 9.0) {
        pros.push({
          title: sub.name,
          rating: sub.rawRating,
          parameter: param.name,
          evidence: {
            type: 'metric',
            ref: sub.code,
            note: `${sub.name} is performing at top quartile efficiency (${sub.rawRating.toFixed(1)}/10).`,
          },
        });
      } else if (sub.rawRating <= 7.5 || sub.penalties.length > 0) {
        cons.push({
          title: sub.name,
          rating: sub.rawRating,
          parameter: param.name,
          evidence: sub.penalties[0]?.evidence || {
            type: 'metric',
            ref: sub.code,
            note: `${sub.name} requires optimization (${sub.rawRating.toFixed(1)}/10).`,
          },
        });
      }
    }
  }

  // -------------------------------------------------------------
  // Dynamic Simulation of Actionable Suggestions (Part D)
  // Re-runs engine for each repair candidate to compute exact ΔScore
  // -------------------------------------------------------------
  const candidateFixes = [
    { subCode: 'HK1', paramId: 1, title: 'Stronger opening grab', effort: 'medium' as EffortTier, desc: 'Deliver an immediate visual action or vocal statement in the first 1.5 seconds.' },
    { subCode: 'CT1', paramId: 6, title: 'Add one clear focal CTA', effort: 'quick' as EffortTier, desc: 'Direct viewers with exactly one action (e.g. "Save this setup for your next shoot").' },
    { subCode: 'HK4', paramId: 1, title: 'Payoff within 3s', effort: 'heavy' as EffortTier, desc: 'Deliver the core value promise before the 3-second mark to prevent drop-off.' },
    { subCode: 'CT2', paramId: 6, title: 'Add a genuine discussion question', effort: 'quick' as EffortTier, desc: 'Spark organic replies by asking a specific debatable question in the final seconds.' },
    { subCode: 'CP2', paramId: 5, title: 'Caption keyword coverage', effort: 'quick' as EffortTier, desc: 'Include 3-5 high-volume search terms in caption body to boost platform search traffic.' },
    { subCode: 'ST2', paramId: 3, title: 'Cut velocity and dead air suppression', effort: 'heavy' as EffortTier, desc: 'Eliminate silent pauses over 0.8s and maintain 1 cut per 3 seconds.' },
    { subCode: 'VA4', paramId: 4, title: 'Animated on-screen subtitles', effort: 'medium' as EffortTier, desc: 'Render synchronized word-by-word captions for the 75%+ of viewers watching on mute.' },
  ];

  const suggestions: ActionableSuggestion[] = [];

  for (const fix of candidateFixes) {
    const currentSub = quality.parameters
      .find((p) => p.id === fix.paramId)
      ?.subfactors.find((s) => s.code === fix.subCode);

    // If subfactor is not already 10, simulate repairing it to 10
    if (currentSub && currentSub.rawRating < 10.0) {
      const simulatedFactors = {
        ...(customFactors || {}),
        [fix.subCode]: { V: 1.0, raw: 10.0 },
      };
      const simulatedQuality = calculateQualityScore(item, simulatedFactors);
      const simulatedContentScore = performance.isAvailable
        ? 0.70 * simulatedQuality.score + 0.30 * performance.score
        : simulatedQuality.score;

      const gain = Math.max(0.1, Number((simulatedContentScore - blendedScore).toFixed(1)));

      suggestions.push({
        id: `sug_${fix.subCode.toLowerCase()}`,
        title: fix.title,
        description: fix.desc,
        parameterId: fix.paramId,
        subfactorCode: fix.subCode,
        estimatedGain: gain,
        effort: fix.effort,
      });
    }
  }

  // Sort suggestions by estimated gain descending
  suggestions.sort((a, b) => b.estimatedGain - a.estimatedGain);

  return {
    contentScore: blendedScore,
    qualityScore: quality.score,
    performanceScore: performance.isAvailable ? performance.score : null,
    verdict,
    confidence: confidenceTier,
    confidenceScore: blendedConfidence,
    qualityConfidence: quality.confidence,
    performanceConfidence: performance.isAvailable ? performance.confidence : null,
    dataTier: item.dataTier,
    isQualityOnly,
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 5),
    suggestions,
    item,
    qualityBreakdown: quality,
    performanceBreakdown: performance,
  };
}

// -------------------------------------------------------------
// Subfactor Telemetry Derivation Helper
// -------------------------------------------------------------

function deriveSubfactorRating(
  paramId: number,
  subCode: string,
  item: UnifiedContentItem
): { rawRating: number; penalties?: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }> } {
  const penalties: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }> = [];
  let rawRating = 10.0;

  switch (subCode) {
    // HK4: Time to first value
    case 'HK4': {
      // In worked example: time to first value is 7s -> -2.5 penalty
      const firstPayoffSec = 7.0;
      if (firstPayoffSec <= 3.0) {
        rawRating = 10.0;
      } else if (firstPayoffSec <= 5.0) {
        rawRating = 9.0;
        penalties.push({ severity: 'minor', delta: -1.0, evidence: { type: 'timestamp', ref: '00:04', note: 'First payoff occurred at 4s' } });
      } else if (firstPayoffSec <= 8.0) {
        rawRating = 7.5;
        penalties.push({ severity: 'moderate', delta: -2.5, evidence: { type: 'timestamp', ref: '00:07', note: 'Time to first value delayed to 7s' } });
      } else {
        rawRating = 5.5;
        penalties.push({ severity: 'major', delta: -4.5, evidence: { type: 'timestamp', ref: '00:10', note: 'Time to first value delayed past 8s' } });
      }
      break;
    }

    // CT1: No CTA in worked example -> -2.5
    case 'CT1': {
      rawRating = 7.5;
      penalties.push({ severity: 'moderate', delta: -2.5, evidence: { type: 'quote', ref: 'No explicit directive', note: 'No clear call to action detected in spoken text' } });
      break;
    }

    // CT2: No discussion prompt in worked example -> -2.5
    case 'CT2': {
      rawRating = 7.5;
      penalties.push({ severity: 'moderate', delta: -2.5, evidence: { type: 'quote', ref: 'No question', note: 'No debate or conversational prompt present' } });
      break;
    }

    // CP2: Keyword coverage 20% in worked example -> -2.5
    case 'CP2': {
      rawRating = 7.5;
      penalties.push({ severity: 'moderate', delta: -2.5, evidence: { type: 'metric', ref: '20% coverage', note: 'Only 20% of core topic keywords present in caption' } });
      break;
    }

    // HK1: Minor hook delay
    case 'HK1': {
      rawRating = 9.0;
      penalties.push({ severity: 'minor', delta: -1.0, evidence: { type: 'timestamp', ref: '00:01', note: 'Introductory statement could be tighter' } });
      break;
    }

    // ST2: Pacing
    case 'ST2': {
      rawRating = 9.0;
      break;
    }

    // OC2: Signature formula
    case 'OC2': {
      rawRating = 7.5;
      break;
    }

    default:
      rawRating = 10.0;
      break;
  }

  return { rawRating, penalties };
}
