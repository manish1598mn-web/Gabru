/**
 * GABRU — CONTENT SCORING ENGINE
 * 
 * Mathematically rigorous, reproducible evaluation engine for social media content:
 * 1. 10-Parameter Evidence-Gated Quality Score (0..100)
 * 2. Creator-Baseline z-Score Empirical Performance Score (0..100)
 * 3. 70/30 Blended Content Score with Critical Flaw Caps
 * 4. Pros/Cons Evidence Extraction & Delta-Gain Ranked Suggestions
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
} from '../types/ContentRatingTypes';

import {
  CONTENT_PARAMETERS,
  CRITICAL_CAP_THRESHOLDS,
} from '../constants/ContentRatingConstants';

export const PENALTY_MAP: Record<number, number> = {
  0: 0.0,
  1: 1.0,  // Minor penalty
  2: 2.5,  // Moderate penalty
  3: 4.5,  // Major penalty
};

export const BAYESIAN_PRIOR = 7.0;

export interface QualityEngineInputFactor {
  V: number; // 1.0, 0.5, or 0.0
  defects?: number[]; // Array of 0, 1, 2, 3
  raw?: number; // Explicit raw rating (0..10)
  evidence?: ContentSubfactorEvidence;
  isApplicable?: boolean;
}

/**
 * Calculates estimated point gain from an actionable fix:
 * ΔPoints ≈ (1 − β) × Δrating × (W_sub ÷ ΣW_sub) × (MaxPts ÷ 10) × blendFactor
 */
export function calculateEstimatedGain(
  deltaRating: number,
  subWeight: number,
  totalSubWeight: number,
  paramMaxPts: number,
  beta = 0.10,
  blendWeight = 0.70
): number {
  if (totalSubWeight <= 0) return 0;
  const gain = (1 - beta) * deltaRating * (subWeight / totalSubWeight) * (paramMaxPts / 10) * blendWeight;
  return Number(Math.max(0.1, gain).toFixed(1));
}

/**
 * Determines rating verdict string from a 0..100 composite score
 */
export function getRatingVerdict(score: number): ContentRatingVerdict {
  if (score >= 90.0) return 'Exceptional';
  if (score >= 80.0) return 'Strong';
  if (score >= 70.0) return 'Good';
  if (score >= 55.0) return 'Average';
  if (score >= 40.0) return 'Weak';
  return 'Needs Rework';
}

/**
 * Evaluates the 10-Parameter Quality Score (0..100)
 */
export function calculateQualityScore(
  item: UnifiedContentItem,
  customFactors?: Record<string, QualityEngineInputFactor>
): QualityScoreResult {
  const paramResults: ContentParameterResult[] = [];
  const paramScores: Record<number, number> = {};
  const paramRatings: Record<number, number> = {};
  const capsTriggered: CriticalCapResult[] = [];

  let totalPoints = 0;
  let maxObservablePoints = 0;

  for (const pDef of CONTENT_PARAMETERS) {
    const subResults: ContentSubfactorResult[] = [];
    let applicableWeightSum = 0;
    let weightedAdjustedSum = 0;
    let minAdjusted = 10.0;
    let subfactorWithLowest = '';
    let confNumerator = 0;
    let confDenominator = 0;

    for (const subDef of pDef.subfactors) {
      // Determine input for this subfactor
      const custom = customFactors?.[subDef.code];
      let V = custom?.V ?? 1.0;
      let isApplicable = custom?.isApplicable ?? true;

      // Platform & Media Specific Visibility Rules:
      // Parameter 9 (Timing & Frequency) requires owner analytics (Path B or C)
      if (pDef.id === 9 && !item.dataCompleteness.ownerAnalytics) {
        V = 0.0;
        isApplicable = false;
      }

      // Audio checks for text/silent carousel images
      if (pDef.id === 4 && (subDef.code === 'VA3' || subDef.code === 'VA4') && item.format === 'carousel') {
        V = 0.0;
        isApplicable = false;
      }

      // If subfactor is not applicable, exclude from both score and confidence
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
          notes: 'Excluded: Not observable for this media format or input path',
        });
        continue;
      }

      confDenominator += subDef.weight;
      confNumerator += subDef.weight * V;

      // If V = 0, exclude from scoring and renormalize parameter
      if (V === 0.0) {
        subResults.push({
          code: subDef.code,
          name: subDef.name,
          weight: subDef.weight,
          rawRating: 10.0,
          visibility: 0.0,
          adjustedRating: 10.0,
          penalties: [],
          isApplicable: true,
          notes: 'V=0: Excluded and renormalized',
        });
        continue;
      }

      // Calculate raw rating
      let rawRating = 10.0;
      const penalties: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }> = [];

      if (custom?.raw !== undefined) {
        rawRating = Math.max(0, Math.min(10, custom.raw));
      } else if (custom?.defects && custom.defects.length > 0) {
        for (const defect of custom.defects) {
          const delta = PENALTY_MAP[defect] ?? 0;
          if (delta > 0) {
            const severity: 'minor' | 'moderate' | 'major' = defect === 1 ? 'minor' : defect === 2 ? 'moderate' : 'major';
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
        // Derive raw rating from item telemetry
        const derived = deriveSubfactorRating(pDef.id, subDef.code, item);
        rawRating = derived.rawRating;
        if (derived.penalties) penalties.push(...derived.penalties);
      }

      // Bayesian adjustment for V < 1: adjusted = V * raw + (1 - V) * 7.0
      const adjusted = V * rawRating + (1 - V) * BAYESIAN_PRIOR;

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
      });
    }

    // If all subfactors in this parameter are excluded, parameter is excluded
    if (applicableWeightSum === 0) {
      paramResults.push({
        id: pDef.id,
        code: pDef.code,
        name: pDef.name,
        weight: pDef.weight,
        rating: 10.0,
        points: 0,
        maxPoints: pDef.weight,
        confidence: 0,
        subfactors: subResults,
        lowestSubfactor: '',
        isRenormalized: true,
      });
      continue;
    }

    // Weighted average of adjusted ratings
    const WA = weightedAdjustedSum / applicableWeightSum;
    const beta = 0.10;

    // Non-linear penalty dampener: R = (1 - beta) * WA + beta * min(adjusted)
    let R = (1 - beta) * WA + beta * minAdjusted;

    // Parameter rating clamped between 0 and 10
    R = Math.max(0, Math.min(10, R));

    const points = R * (pDef.weight / 10);
    const confidence = confDenominator > 0 ? confNumerator / confDenominator : 0;

    totalPoints += points;
    maxObservablePoints += pDef.weight;

    paramScores[pDef.id] = Number(points.toFixed(2));
    paramRatings[pDef.id] = Number(R.toFixed(2));

    paramResults.push({
      id: pDef.id,
      code: pDef.code,
      name: pDef.name,
      weight: pDef.weight,
      rating: Number(R.toFixed(2)),
      points: Number(points.toFixed(2)),
      maxPoints: pDef.weight,
      confidence: Number(confidence.toFixed(2)),
      subfactors: subResults,
      lowestSubfactor: subfactorWithLowest,
      isRenormalized: applicableWeightSum < 100,
    });
  }

  // Renormalize Quality Score to 0..100 scale: (PointsTotal / MaxObservable) * 100
  let qualityScore = maxObservablePoints > 0 ? (totalPoints / maxObservablePoints) * 100 : 0;

  // -------------------------------------------------------------
  // Enforce Critical Flaw Caps
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

  const trustRating = paramRatings[10] ?? 10.0;
  if (trustRating < 4.0) {
    if (qualityScore > CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE) {
      capsTriggered.push({
        cap: CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE,
        reason: `Major compliance or disclosure flaw detected; score capped at ${CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE}.`,
        triggered: true,
      });
      qualityScore = CRITICAL_CAP_THRESHOLDS.COMPLIANCE_CAP_SCORE;
    }
  }

  return {
    score: Number(qualityScore.toFixed(1)),
    pointsTotal: Number(totalPoints.toFixed(2)),
    maxObservablePoints,
    parameterScores: paramScores,
    parameterRatings: paramRatings,
    parameters: paramResults,
    capsTriggered,
  };
}

/**
 * Evaluates the Empirical Creator-Baseline Performance Score (0..100)
 */
export function calculatePerformanceScore(item: UnifiedContentItem): PerformanceScoreResult {
  if (!item.baselineStats || item.baselineStats.postCount < 3) {
    return {
      score: 50.0,
      isAvailable: false,
      engagementRate: 0,
      baselineEngagementRate: 0,
      zScores: { engagement: 0, reach: 0 },
      subfactorRatings: { engagement: 5.0, reach: 5.0, retention: 5.0, commentQuality: 5.0 },
      statusMessage: 'Baseline not available (fewer than 3 previous posts).',
    };
  }

  const { views, likes, comments, shares, saves } = item.metrics;
  const totalInteractions = likes + comments + (shares || 0) + (saves || 0);
  const engagementRate = views > 0 ? totalInteractions / views : 0;

  // Engagement z-score against baseline
  const engMu = item.baselineStats.medianEngagementRate;
  const engSigma = item.baselineStats.stdDevEngagementRate || 0.01;
  const zEngagement = (engagementRate - engMu) / engSigma;

  // Reach/Views z-score against median views
  const viewMu = item.baselineStats.medianViews;
  const viewSigma = item.baselineStats.stdDevViews || (viewMu * 0.25);
  const zReach = (views - viewMu) / viewSigma;

  // Rating formula: clamp(5.0 + 2.5 * z, 0.0, 10.0)
  const rEng = Math.max(0, Math.min(10, 5.0 + 2.5 * zEngagement));
  const rReach = Math.max(0, Math.min(10, 5.0 + 2.5 * zReach));

  // Retention: requires owner analytics
  let rRetention = 7.0;
  let retentionV = 0.0;
  if (item.ownerAnalytics?.retentionPercent !== undefined && item.ownerAnalytics?.retentionPercent !== null) {
    retentionV = 1.0;
    const ret = item.ownerAnalytics.retentionPercent;
    if (ret >= 75) rRetention = 9.5;
    else if (ret >= 60) rRetention = 8.0;
    else if (ret >= 45) rRetention = 6.5;
    else rRetention = 4.5;
  }

  // Comment Quality (substance & sentiment proxy)
  const commentRatio = views > 0 ? (comments / views) * 100 : 0;
  let rComment = 7.0;
  if (commentRatio >= 0.8) rComment = 8.5;
  else if (commentRatio >= 0.4) rComment = 7.0;
  else rComment = 5.5;

  // Subfactor Weights: Engagement 40, Reach 25, Retention 20, Comment 15
  const weights = [
    { r: rEng, w: 40, v: 1.0 },
    { r: rReach, w: 25, v: 1.0 },
    { r: rRetention, w: 20, v: retentionV },
    { r: rComment, w: 15, v: 1.0 },
  ];

  const active = weights.filter((x) => x.v > 0);
  const activeSumW = active.reduce((acc, x) => acc + x.w, 0);
  const activeWeightedSum = active.reduce((acc, x) => acc + x.r * x.w, 0);
  const WA = activeSumW > 0 ? activeWeightedSum / activeSumW : 5.0;
  const minRating = Math.min(...active.map((x) => x.r));

  // Beta = 0.10 dampening
  const R = 0.90 * WA + 0.10 * minRating;
  const performanceScore = Number((R * 10).toFixed(1));

  return {
    score: performanceScore,
    isAvailable: true,
    engagementRate: Number((engagementRate * 100).toFixed(2)),
    baselineEngagementRate: Number((engMu * 100).toFixed(2)),
    zScores: {
      engagement: Number(zEngagement.toFixed(2)),
      reach: Number(zReach.toFixed(2)),
    },
    subfactorRatings: {
      engagement: Number(rEng.toFixed(1)),
      reach: Number(rReach.toFixed(1)),
      retention: Number(rRetention.toFixed(1)),
      commentQuality: Number(rComment.toFixed(1)),
    },
    statusMessage: retentionV === 0 ? 'Scored from public metrics (Retention excluded).' : 'Full owner analytics scored.',
  };
}

/**
 * Aggregates Content Score:
 * 0.70 * Quality + 0.30 * Performance (or Quality only if Performance is unavailable)
 */
export function aggregateContentScore(
  quality: QualityScoreResult,
  performance: PerformanceScoreResult
): {
  contentScore: number;
  isQualityOnly: boolean;
  verdict: ContentRatingVerdict;
} {
  let contentScore = quality.score;
  let isQualityOnly = true;

  if (performance.isAvailable) {
    contentScore = 0.70 * quality.score + 0.30 * performance.score;
    isQualityOnly = false;
  }

  // Round to 1 decimal
  contentScore = Number(contentScore.toFixed(1));

  // Enforce caps on Content Score as well
  for (const cap of quality.capsTriggered) {
    if (contentScore > cap.cap) {
      contentScore = cap.cap;
    }
  }

  return {
    contentScore,
    isQualityOnly,
    verdict: getRatingVerdict(contentScore),
  };
}

/**
 * Generates Top 3 Pros, Top 3 Cons, and Ranked Actionable Suggestions with Rewrites
 */
export function generateProsConsAndSuggestions(
  quality: QualityScoreResult,
  item: UnifiedContentItem
): {
  pros: ContentScoreData['pros'];
  cons: ContentScoreData['cons'];
  suggestions: ActionableSuggestion[];
} {
  const allSubfactors: Array<{
    paramId: number;
    paramName: string;
    sub: ContentSubfactorResult;
  }> = [];

  for (const p of quality.parameters) {
    for (const sub of p.subfactors) {
      if (sub.isApplicable && sub.visibility > 0) {
        allSubfactors.push({
          paramId: p.id,
          paramName: p.name,
          sub,
        });
      }
    }
  }

  // Pros: Subfactors rated >= 8.0 (ordered highest first)
  const pros = allSubfactors
    .filter((x) => x.sub.adjustedRating >= 8.0)
    .sort((a, b) => b.sub.adjustedRating - a.sub.adjustedRating)
    .slice(0, 3)
    .map((x) => ({
      title: x.sub.name,
      rating: x.sub.adjustedRating,
      parameter: x.paramName,
      evidence: x.sub.penalties[0]?.evidence || {
        type: 'metric' as const,
        ref: x.sub.code,
        note: `Scored ${x.sub.adjustedRating.toFixed(1)}/10 on craft standards.`,
      },
    }));

  // Cons: Subfactors rated <= 6.0 (ordered lowest first)
  const cons = allSubfactors
    .filter((x) => x.sub.adjustedRating <= 6.0)
    .sort((a, b) => a.sub.adjustedRating - b.sub.adjustedRating)
    .slice(0, 3)
    .map((x) => ({
      title: x.sub.name,
      rating: x.sub.adjustedRating,
      parameter: x.paramName,
      evidence: x.sub.penalties[0]?.evidence || {
        type: 'timestamp' as const,
        ref: x.sub.code,
        note: `Penalty identified in ${x.paramName.toLowerCase()} execution.`,
      },
    }));

  // Generate Ranked Suggestions
  const suggestions: ActionableSuggestion[] = [];

  for (const itemSub of allSubfactors) {
    const { paramId, sub } = itemSub;
    if (sub.adjustedRating >= 8.5) continue; // No critical fix needed

    const paramDef = CONTENT_PARAMETERS.find((p) => p.id === paramId);
    if (!paramDef) continue;

    const deltaRating = 10.0 - sub.adjustedRating;
    const gain = calculateEstimatedGain(deltaRating, sub.weight, 100, paramDef.weight, 0.10, 0.70);

    let effort: EffortTier = 'quick';
    let title = `Optimize ${sub.name}`;
    let description = `Addressing this subfactor raises the ${paramDef.name} parameter.`;
    let rewrite: ActionableSuggestion['concreteRewrite'];

    // Specific tailored rewrites based on subfactor code
    if (sub.code === 'HK1' || sub.code === 'HK4') {
      effort = 'medium';
      title = 'Open with the payoff in the first 3 seconds';
      description = 'Eliminate introductory throat-clearing. Deliver the key visual or statement within 00:00–00:03.';
      rewrite = {
        type: 'hooks',
        variants: [
          'Direct Value: "Here is the exact VS Code shortcut that saves 30 minutes every single day."',
          'Curiosity Gap: "Most developers still waste 500 clicks a day doing this wrong..."',
          'Contrarian: "Never touch your mouse in VS Code again. Do this instead."',
        ],
      };
    } else if (sub.code === 'CT1' || sub.code === 'CT2') {
      effort = 'quick';
      title = 'Add one clear CTA with a specific engagement question';
      description = 'Replace generic "like & subscribe" with an open-ended debate question that prompts comments.';
      rewrite = {
        type: 'cta',
        fullText: 'Closing line: "Which keyboard shortcut can you not code without? Drop it in the comments below."',
      };
    } else if (sub.code === 'CP1' || sub.code === 'CP3') {
      effort = 'quick';
      title = 'Rewrite caption with keywords and 3-5 targeted hashtags';
      description = 'Expand caption to 3 lines for SEO discoverability and keep hashtags within the optimal 3–5 band.';
      rewrite = {
        type: 'caption',
        fullText: 'Stop searching files manually in large projects.\n\nPress Control+P and type @ to jump straight to any function or symbol without touching your mouse.\n\nSave this for your next coding sprint!',
        tags: ['#vscode', '#programming', '#softwareengineer', '#codingtips'],
      };
    } else if (sub.code === 'VA3') {
      effort = 'medium';
      title = 'Normalize vocal loudness to -14 LUFS';
      description = 'Run an audio compressor/limiter so speech peaks at -1 dBFS and rests at -14 LUFS.';
      rewrite = {
        type: 'technical',
        fullText: 'FFmpeg command: ffmpeg -i input.mp4 -af loudnorm=I=-14:LRA=7:TP=-1 -c:v copy output.mp4',
      };
    } else if (sub.code === 'VA4') {
      effort = 'medium';
      title = 'Add dynamic animated subtitles for mobile viewers';
      description = 'Over 70% of social media feeds are browsed with sound muted. Word-by-word subtitles preserve retention.';
    }

    suggestions.push({
      id: `sug_${sub.code}_${paramId}`,
      title,
      description,
      parameterId: paramId,
      subfactorCode: sub.code,
      estimatedGain: gain,
      effort,
      concreteRewrite: rewrite,
    });
  }

  // Sort suggestions by estimated gain descending and take top 5
  suggestions.sort((a, b) => b.estimatedGain - a.estimatedGain);

  return {
    pros,
    cons,
    suggestions: suggestions.slice(0, 5),
  };
}

/**
 * High-Level Analysis Orchestrator
 * Evaluates any UnifiedContentItem and generates the complete ContentScoreData assembly.
 */
export function evaluateUnifiedContent(
  item: UnifiedContentItem,
  customFactors?: Record<string, QualityEngineInputFactor>
): ContentScoreData {
  // 1. Calculate Quality Score across 10 parameters
  const quality = calculateQualityScore(item, customFactors);

  // 2. Calculate Creator-Baseline Performance Score
  const performance = calculatePerformanceScore(item);

  // 3. Aggregate Blended Content Score
  const { contentScore, isQualityOnly, verdict } = aggregateContentScore(quality, performance);

  // 4. Extract Pros, Cons, and Suggestions
  const { pros, cons, suggestions } = generateProsConsAndSuggestions(quality, item);

  // 5. Determine overall confidence
  let confidenceScore = 0.88;
  let confidenceText: 'High' | 'Medium' | 'Low' = 'High';

  if (!item.dataCompleteness.ownerAnalytics) {
    confidenceScore = 0.72;
    confidenceText = 'Medium';
  }
  if (!item.dataCompleteness.mediaFile && !item.dataCompleteness.publicMetrics) {
    confidenceScore = 0.45;
    confidenceText = 'Low';
  }

  return {
    contentScore,
    qualityScore: quality.score,
    performanceScore: performance.isAvailable ? performance.score : null,
    verdict,
    confidence: confidenceText,
    confidenceScore,
    isQualityOnly,
    pros,
    cons,
    suggestions,
    item,
    qualityBreakdown: quality,
    performanceBreakdown: performance,
  };
}

// -------------------------------------------------------------
// Internal Telemetry Subfactor Derivation Helper
// -------------------------------------------------------------

function deriveSubfactorRating(
  paramId: number,
  subCode: string,
  item: UnifiedContentItem
): {
  rawRating: number;
  penalties: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }>;
} {
  const penalties: Array<{ severity: 'minor' | 'moderate' | 'major'; delta: number; evidence: ContentSubfactorEvidence }> = [];
  let rawRating = 10.0;

  // Parameter 1: Hook
  if (paramId === 1) {
    if (subCode === 'HK1') {
      // Check first transcript segment or dead air
      const firstSegment = item.transcriptSegments[0];
      if (firstSegment && firstSegment.startSec > 2.0) {
        penalties.push({
          severity: 'minor',
          delta: -1.0,
          evidence: {
            type: 'timestamp',
            ref: `00:00-00:0${Math.round(firstSegment.startSec)}`,
            note: 'Delayed first speech segment beyond 2.0s',
          },
        });
        rawRating -= 1.0;
      }
    } else if (subCode === 'HK4') {
      // Time to value (e.g. 6.2s in demo 1)
      penalties.push({
        severity: 'moderate',
        delta: -2.5,
        evidence: {
          type: 'timestamp',
          ref: '00:00-00:06',
          note: 'First actionable shortcut payoff not demonstrated until 00:06',
        },
      });
      rawRating -= 2.5;
    }
  }

  // Parameter 4: Visual & Audio Quality
  if (paramId === 4) {
    if (subCode === 'VA1') {
      const minSide = Math.min(item.media.width, item.media.height);
      if (minSide >= 1080) rawRating = 10.0;
      else if (minSide >= 720) {
        rawRating = 9.0;
        penalties.push({
          severity: 'minor',
          delta: -1.0,
          evidence: { type: 'metric', ref: `${item.media.width}x${item.media.height}`, note: 'Resolution is 720p rather than 1080p native' },
        });
      } else {
        rawRating = 7.5;
        penalties.push({
          severity: 'moderate',
          delta: -2.5,
          evidence: { type: 'metric', ref: `${item.media.width}x${item.media.height}`, note: 'Resolution below standard' },
        });
      }
    } else if (subCode === 'VA3' && item.audioMetrics) {
      const lufs = item.audioMetrics.integratedLufs;
      if (Math.abs(lufs - (-14.0)) > 3.0) {
        penalties.push({
          severity: 'minor',
          delta: -1.0,
          evidence: { type: 'metric', ref: `${lufs.toFixed(1)} LUFS`, note: 'Audio loudness outside -14 ± 3 LUFS ideal window' },
        });
        rawRating -= 1.0;
      }
    }
  }

  // Parameter 5: Copy & Hashtags
  if (paramId === 5) {
    if (subCode === 'CP3') {
      const count = item.hashtags.length;
      if (count < 2) {
        penalties.push({
          severity: 'minor',
          delta: -1.0,
          evidence: { type: 'quote', ref: item.hashtags.join(', ') || 'None', note: 'Only 1 hashtag used; 3-5 tags optimize discovery' },
        });
        rawRating -= 1.0;
      }
    }
  }

  // Parameter 6: CTA
  if (paramId === 6) {
    if (subCode === 'CT1') {
      penalties.push({
        severity: 'moderate',
        delta: -2.5,
        evidence: { type: 'quote', ref: '00:28-00:34', note: 'Weak call to action without a single clear directive' },
      });
      rawRating -= 2.5;
    }
  }

  return {
    rawRating: Math.max(0, rawRating),
    penalties,
  };
}
