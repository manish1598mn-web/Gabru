/**
 * GABRU — CONTENT RATING SCORING ENGINE
 * 
 * Strict Single-Post Scoring Engine (40% Hard Scraped Math + 60% Multimodal LLM Rubric):
 * - Telemetry derivations (Likes, Comments, Shares, Saves, Reposts, Reach)
 * - Derived Flex Badges (True Engagement Rate, Group-Chat Multiplier, Bookmark Rate)
 * - Parameters S1 to S9 with exponential saturation curves
 * - Deterministic Priority Classifier for Parameter 10 (Single-Post Verdict Badge)
 * - Transparent 100-Point Impact Scale with verified benchmark tiers
 */

import {
  ContentScoreData,
  UnifiedContentItem,
  SinglePostInputPayload,
  SinglePostLlmEvaluations,
  SinglePostTelemetry,
  SinglePostVerdictBadge,
  SinglePostArchetypeTier,
  SinglePostParameterResult,
  ActionableSuggestion,
  ContentRatingVerdict,
  QualityScoreResult,
  ContentParameterResult,
} from '../types/ContentRatingTypes';
import {
  CONTENT_PARAMETERS,
  CONTENT_CARD_BACKGROUNDS,
  INTERNET_SLANG_LIST,
  FIRST_PERSON_PRONOUNS,
} from '../constants/ContentRatingConstants';

// -------------------------------------------------------------
// Mathematical Utility Helpers
// -------------------------------------------------------------

export function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(val)));
}

// -------------------------------------------------------------
// Caption NLP & Telemetry Parsing Helpers
// -------------------------------------------------------------

export function countFirstPersonWords(caption: string): number {
  if (!caption) return 0;
  const words = caption.toLowerCase().match(/\b[a-z']+\b/g) || [];
  let count = 0;
  for (const w of words) {
    if (FIRST_PERSON_PRONOUNS.includes(w)) count++;
  }
  return count;
}

export function countEmojis(caption: string): number {
  if (!caption) return 0;
  const emojiRegex = /(\p{EPres}|\p{ExtPict})/gu;
  const matches = caption.match(emojiRegex);
  return matches ? matches.length : 0;
}

export function detectSlangMatches(caption: string): { count: number; matches: string[] } {
  if (!caption) return { count: 0, matches: [] };
  const lower = caption.toLowerCase();
  const matched: string[] = [];
  for (const slang of INTERNET_SLANG_LIST) {
    // Check boundary or phrase
    const regex = new RegExp(`\\b${slang}\\b`, 'i');
    if (regex.test(lower)) {
      matched.push(slang);
    }
  }
  return { count: matched.length, matches: matched };
}

// -------------------------------------------------------------
// Fallback Scraped Telemetry Engine
// -------------------------------------------------------------

export function resolveSinglePostTelemetry(
  item: UnifiedContentItem | SinglePostInputPayload
): SinglePostTelemetry {
  const rawLikes = item.metrics?.likes ?? (item as any).likes ?? 0;
  const rawComments = item.metrics?.comments ?? (item as any).comments ?? 0;
  const rawViews = item.metrics?.views ?? (item as any).views ?? 0;
  const hasRealMetrics = rawLikes > 0 || rawViews > 0 || rawComments > 0;

  const likes = rawLikes;
  const comments = rawComments;
  const views = rawViews;
  const reposts = item.metrics?.reposts ?? (item as any).reposts ?? 0;
  const authorFollowers = item.creator?.followerCount ?? (item as any).authorFollowers ?? 0;
  const reach = Math.max(views, authorFollowers, likes * 8, hasRealMetrics ? 100 : 0);

  const rawShares = item.metrics?.shares !== undefined ? item.metrics?.shares : (item as any).shares;
  const isSharesEstimated = rawShares === null || rawShares === undefined;
  const shares = !isSharesEstimated
    ? (rawShares as number)
    : (hasRealMetrics ? Math.round(comments * 0.8 + likes * 0.015) : 0);

  const rawSaves = item.metrics?.saves !== undefined ? item.metrics?.saves : (item as any).saves;
  const isSavesEstimated = rawSaves === null || rawSaves === undefined;
  const saves = !isSavesEstimated
    ? (rawSaves as number)
    : (hasRealMetrics ? Math.round(comments * 1.1 + likes * 0.025) : 0);

  const trueEngPct = hasRealMetrics && reach > 0 ? ((likes + comments + shares + saves + reposts) / reach) * 100 : 0;
  const groupChatMult = hasRealMetrics && likes > 0 ? ((shares + reposts) / likes) * 100 : 0;
  const bookmarkRatePct = hasRealMetrics && likes > 0 ? (saves / likes) * 100 : 0;

  return {
    likes,
    comments,
    shares,
    saves,
    reposts,
    views,
    reach,
    authorFollowers,
    trueEngagementRate: hasRealMetrics ? `${trueEngPct.toFixed(2)}%` : '--%',
    groupChatMultiplier: hasRealMetrics ? `${groupChatMult.toFixed(1)}%` : '--%',
    bookmarkRate: hasRealMetrics ? `${bookmarkRatePct.toFixed(1)}%` : '--%',
    isSharesEstimated,
    isSavesEstimated,
  };
}

// -------------------------------------------------------------
// Core Single-Post Scoring Engine (User Specification)
// -------------------------------------------------------------

export function scoreSinglePost(
  item: UnifiedContentItem | SinglePostInputPayload,
  customLlm?: Partial<SinglePostLlmEvaluations>
): {
  telemetry: SinglePostTelemetry;
  scores: {
    S1: number;
    S2: number;
    S3: number;
    S4: number;
    S5: number;
    S6: number;
    S7: number;
    S8: number;
    S9: number;
  };
  badge: SinglePostVerdictBadge;
  archetypeTier: SinglePostArchetypeTier;
  rawScore: number;
  finalCurvedScore: number;
} {
  const telemetry = resolveSinglePostTelemetry(item);
  const { likes, comments, shares, saves, reposts, reach } = telemetry;

  // Merge default or derived LLM evaluations
  const llmItem = (item as any).llmEvaluations;
  const llm: SinglePostLlmEvaluations = {
    subjectSpotlight: customLlm?.subjectSpotlight ?? llmItem?.subjectSpotlight ?? 8.5,
    poseAudacity: customLlm?.poseAudacity ?? llmItem?.poseAudacity ?? 8.0,
    lighting: customLlm?.lighting ?? llmItem?.lighting ?? 8.5,
    colorGrading: customLlm?.colorGrading ?? llmItem?.colorGrading ?? 8.2,
    composition: customLlm?.composition ?? llmItem?.composition ?? 8.4,
    stylingDrip: customLlm?.stylingDrip ?? llmItem?.stylingDrip ?? 8.0,
    visualHook: customLlm?.visualHook ?? llmItem?.visualHook ?? 8.0,
    openingLinePunch: customLlm?.openingLinePunch ?? llmItem?.openingLinePunch ?? 7.8,
    captionWit: customLlm?.captionWit ?? llmItem?.captionWit ?? 18,
    shareRelatability: customLlm?.shareRelatability ?? llmItem?.shareRelatability ?? 26,
    saveUtilityEnvy: customLlm?.saveUtilityEnvy ?? llmItem?.saveUtilityEnvy ?? 25,
    commentVibe: customLlm?.commentVibe ?? llmItem?.commentVibe ?? 28,
    conceptOriginality: customLlm?.conceptOriginality ?? llmItem?.conceptOriginality ?? 46,
  };

  // Derive caption metrics if not provided
  const caption = (item as any).caption || (item as any).title || '';
  const firstPersonWords = (item as any).firstPersonWords ?? countFirstPersonWords(caption);
  const wordCount = (item as any).wordCount ?? Math.max(1, caption.trim().split(/\s+/).filter(Boolean).length);
  const emojiCount = (item as any).emojiCount ?? countEmojis(caption);
  const hashtagCount = (item as any).hashtagCount ?? (item as any).hashtags?.length ?? (caption.match(/#[a-zA-Z0-9_]+/g)?.length || 0);

  // Derive upload hour (local 0..23)
  let hr = (item as any).uploadHourLocal;
  if (hr === undefined || hr === null) {
    const d = (item as any).postedAt ? new Date((item as any).postedAt) : new Date();
    hr = d.getHours();
  }

  const hasMetrics = reach > 0 && likes > 0;

  // 1. Main Character Energy
  const pEgo = Math.min(1.0, (firstPersonWords || 0) / (Math.max(1, wordCount) * 0.12));
  const S1 = clamp(4.5 * llm.subjectSpotlight + 3.5 * llm.poseAudacity + 20 * pEgo);

  // 2. Visual Aura & Frame Quality
  const S2 = clamp(2.5 * (llm.lighting + llm.colorGrading + llm.composition + llm.stylingDrip));

  // 3. Scroll-Stopper Hook
  const cr = hasMetrics ? (likes / reach) * 100 : 0;
  const hConv = hasMetrics ? 50 * (1 - Math.exp(-0.35 * cr)) : 42;
  const S3 = clamp(hConv + 3.0 * llm.visualHook + 2.0 * llm.openingLinePunch);

  // 4. Caption Poetry vs. Cringe
  const pHash = Math.min(35, Math.max(0, (hashtagCount - 5) * 2.5));
  const pEmoji = Math.min(25, Math.max(0, (emojiCount / Math.max(5, wordCount) - 0.20) * 100));
  const pWall = Math.min(20, Math.max(0, (wordCount - 100) / 8));
  const S4 = clamp(75 + llm.captionWit - pHash - pEmoji - pWall);

  // 5. Group-Chat Forwardability (Shares + Reposts)
  const rFwd = hasMetrics ? (shares + 1.5 * reposts) / likes : 0;
  const fMath = hasMetrics ? 65 * (1 - Math.exp(-25 * rFwd)) : 52;
  const S5 = clamp(fMath + llm.shareRelatability);

  // 6. Secret Bookmark Bait (Saves)
  const rSave = hasMetrics ? saves / likes : 0;
  const bMath = hasMetrics ? 65 * (1 - Math.exp(-22 * rSave)) : 54;
  const S6 = clamp(bMath + llm.saveUtilityEnvy);

  // 7. Comment Section Chaos
  const rCL = hasMetrics ? comments / likes : 0;
  const cMath = hasMetrics ? 60 * (1 - Math.exp(-35 * rCL)) : 48;
  const S7 = clamp(cMath + llm.commentVibe);

  // 8. Upload Timing & Goblin Hours
  let tClock = 42;
  if ((hr >= 11 && hr <= 14) || (hr >= 18 && hr <= 21)) tClock = 60;
  else if (hr >= 23 || hr === 0) tClock = 28;
  else if (hr >= 1 && hr <= 5) tClock = 15;

  const weightedEngPct = hasMetrics ? ((likes + 2 * comments + 3 * shares + 3 * saves) / reach) * 100 : 0;
  const mVel = hasMetrics ? 40 * (1 - Math.exp(-0.25 * weightedEngPct)) : 25;
  const S8 = clamp(tClock + mVel);

  // 9. Trend Chaser vs. Original Brain
  const bAudio = (item as any).isTrendingAudio ? 0 : 15;
  const slangMatches = (item as any).slangMatchCount !== undefined
    ? (item as any).slangMatchCount
    : detectSlangMatches(caption).count;
  const pSlang = Math.min(24, (slangMatches || 0) * 8);
  const S9 = clamp(25 + bAudio + llm.conceptOriginality - pSlang);

  // 10. Verdict Badge & Overall Score
  let badge: SinglePostVerdictBadge = 'Timeline Vibe Check Passed';
  if (S5 >= 78) {
    badge = 'Group-Chat Hall of Famer';
  } else if (S6 >= 78 && S1 >= 75) {
    badge = 'Certified Thirst Trap / Aesthetic Flex';
  } else if (S6 >= 78) {
    badge = 'Gatekept Goldmine';
  } else if (S2 >= 82 && S9 >= 75) {
    badge = 'Cinema-Grade Masterpiece';
  } else if (S7 >= 80) {
    badge = 'Comment Section Warzone';
  } else if (hr >= 1 && hr <= 5 && S4 <= 60) {
    badge = '3 AM Unhinged Chaos Dump';
  }

  // Raw weighted score (sum of weights = 1.00)
  const rawScore =
    0.12 * S1 +
    0.15 * S2 +
    0.15 * S3 +
    0.10 * S4 +
    0.14 * S5 +
    0.12 * S6 +
    0.08 * S7 +
    0.06 * S8 +
    0.08 * S9;

  // Calibrated 100-Point Score (Deterministic, transparent, uncurved)
  const finalScore = clamp(Math.round(rawScore), 0, 100);

  // Archetype Tier calibrated for 0-100 scale
  let archetypeTier: SinglePostArchetypeTier = 'Casual Scroller';
  if (finalScore >= 88) {
    archetypeTier = 'S-Tier Masterpiece';
  } else if (badge === '3 AM Unhinged Chaos Dump') {
    archetypeTier = 'Goblin Hours Shitposter';
  } else if (S1 >= 80) {
    archetypeTier = 'Main Character';
  } else if (S5 >= 75 || S3 >= 80) {
    archetypeTier = 'Micro-Celebrity';
  } else if (S6 >= 75) {
    archetypeTier = 'Gatekept Gem';
  }

  return {
    telemetry,
    scores: { S1, S2, S3, S4, S5, S6, S7, S8, S9 },
    badge,
    archetypeTier,
    rawScore: finalScore,
    finalCurvedScore: finalScore,
  };
}

// -------------------------------------------------------------
// Roasts and Compliments Generator
// -------------------------------------------------------------

export function getRoastOrCompliment(paramId: number, score: number, item: UnifiedContentItem): string {
  switch (paramId) {
    case 1: // Main Character Energy
      if (score >= 85) return 'Dominant focal prominence with strong visual presence and commanding subject positioning.';
      if (score >= 70) return 'Clear subject presence with balanced composition and defined focal placement.';
      return 'Subject presence is understated; background or peripheral elements compete for viewer attention.';

    case 2: // Visual Aura & Frame Quality
      if (score >= 85) return 'High aesthetic fidelity with balanced exposure, sharp focus separation, and refined tone gradation.';
      if (score >= 70) return 'Clean visual presentation with balanced ambient lighting and controlled highlight roll-off.';
      return 'Frame exhibits noticeable compression artifacts or uneven lighting contrast; crispness can be enhanced.';

    case 3: // Scroll-Stopper Hook
      if (score >= 85) return 'Strong visual contrast and dynamic subject staging that captures attention within the first 0.3 seconds.';
      if (score >= 70) return 'Clear opening focal hook with sufficient visual distinction to interrupt feed scrolling.';
      return 'Opening frame presents low visual contrast; elevating early visual impact will improve retention.';

    case 4: // Caption Poetry vs. Cringe
      if (score >= 85) return 'Concise, punchy caption delivery with high contextual relevance and focused reader engagement.';
      if (score >= 70) return 'Well-structured caption with clear phrasing and balanced formatting.';
      return 'Caption length or hashtag volume dilutes core message delivery; tighten phrasing for punchier impact.';

    case 5: // Group-Chat Forwardability
      if (score >= 80) return 'High conversational resonance with strong peer-sharing and direct-message distribution appeal.';
      if (score >= 68) return 'Solid conversational interest with steady peer sharing potential across personal networks.';
      return 'Self-contained theme with low outbound sharing stimulus; add relatable hooks to drive shares.';

    case 6: // Secret Bookmark Bait
      if (score >= 80) return 'High reference utility—viewers save this post for future aesthetic, informational, or styling reference.';
      if (score >= 68) return 'Strong informational or aesthetic value prompting saves for later review.';
      return 'Content is experienced in the moment with limited perceived reference or archive utility.';

    case 7: // Comment Section Chaos
      if (score >= 80) return 'High discussion momentum generating active back-and-forth dialogue and viewer responses.';
      if (score >= 68) return 'Consistent community engagement with positive comments and authentic peer interactions.';
      return 'Low engagement velocity; posing an open question or discussion point will prompt conversations.';

    case 8: // Upload Timing & Goblin Hours
      if (score >= 80) return 'Aligned with peak platform active hours, maximizing immediate reach velocity and impressions.';
      if (score >= 68) return 'Standard daytime distribution window capturing steady audience feed refreshes.';
      return 'Published during off-peak hours with lower initial audience activity; schedule for peak hours for faster velocity.';

    case 9: // Trend Chaser vs. Original Brain
      if (score >= 80) return 'Distinctive creative angle with bespoke perspective, strong originality, and unique framing.';
      if (score >= 68) return 'Creative adaptation of a popular aesthetic format with identifiable personal execution.';
      return 'Standard format following widespread conventions; injecting a distinct signature style will differentiate the post.';

    case 10: // Single-Post Verdict Badge
      if (score >= 90) return 'Standout overall execution with exceptional aesthetic and engagement resonance.';
      return 'Solid overall execution with measurable opportunities for elevated visual impact.';

    default:
      return 'Balanced execution across core parameters.';
  }
}

// -------------------------------------------------------------
// Combined Evaluation & Bridge for Feature Page
// -------------------------------------------------------------

export function evaluateUnifiedContent(
  item: UnifiedContentItem,
  customLlm?: Partial<SinglePostLlmEvaluations>
): ContentScoreData {
  const result = scoreSinglePost(item, customLlm);
  const { telemetry, scores, badge, archetypeTier, rawScore, finalCurvedScore } = result;

  // Build the 10 parameter results
  const parameters: SinglePostParameterResult[] = [
    {
      id: 1,
      code: 'MCE',
      name: 'Main Character Energy',
      weight: 12,
      score: scores.S1,
      roastOrCompliment: getRoastOrCompliment(1, scores.S1, item),
      verdictTag: scores.S1 >= 80 ? 'High Prominence' : scores.S1 >= 65 ? 'Balanced Focus' : 'Subtle Presence',
      icon: '👑',
      gradient: CONTENT_CARD_BACKGROUNDS[1],
    },
    {
      id: 2,
      code: 'VAF',
      name: 'Visual Aura & Frame Quality',
      weight: 15,
      score: scores.S2,
      roastOrCompliment: getRoastOrCompliment(2, scores.S2, item),
      verdictTag: scores.S2 >= 82 ? 'Studio Quality' : scores.S2 >= 65 ? 'Clean Frame' : 'Low Contrast',
      icon: '✨',
      gradient: CONTENT_CARD_BACKGROUNDS[2],
    },
    {
      id: 3,
      code: 'SSH',
      name: 'Scroll-Stopper Hook',
      weight: 15,
      score: scores.S3,
      roastOrCompliment: getRoastOrCompliment(3, scores.S3, item),
      verdictTag: scores.S3 >= 80 ? 'High Retention' : scores.S3 >= 65 ? 'Steady Pause' : 'Low Friction',
      icon: '🛑',
      gradient: CONTENT_CARD_BACKGROUNDS[3],
    },
    {
      id: 4,
      code: 'CPC',
      name: 'Caption Poetry vs. Cringe',
      weight: 10,
      score: scores.S4,
      roastOrCompliment: getRoastOrCompliment(4, scores.S4, item),
      verdictTag: scores.S4 >= 80 ? 'Concise Delivery' : scores.S4 >= 60 ? 'Balanced Copy' : 'Dense Text',
      icon: '✍️',
      gradient: CONTENT_CARD_BACKGROUNDS[4],
    },
    {
      id: 5,
      code: 'GCF',
      name: 'Group-Chat Forwardability',
      weight: 14,
      score: scores.S5,
      roastOrCompliment: getRoastOrCompliment(5, scores.S5, item),
      verdictTag: scores.S5 >= 78 ? 'High Shareability' : scores.S5 >= 60 ? 'Direct Share' : 'Standard Reach',
      icon: '🚀',
      gradient: CONTENT_CARD_BACKGROUNDS[5],
    },
    {
      id: 6,
      code: 'SBB',
      name: 'Secret Bookmark Bait',
      weight: 12,
      score: scores.S6,
      roastOrCompliment: getRoastOrCompliment(6, scores.S6, item),
      verdictTag: scores.S6 >= 78 ? 'High Save Utility' : scores.S6 >= 60 ? 'Saved Reference' : 'Standard Save Rate',
      icon: '🔖',
      gradient: CONTENT_CARD_BACKGROUNDS[6],
    },
    {
      id: 7,
      code: 'CSC',
      name: 'Comment Section Chaos',
      weight: 8,
      score: scores.S7,
      roastOrCompliment: getRoastOrCompliment(7, scores.S7, item),
      verdictTag: scores.S7 >= 80 ? 'Active Discussion' : scores.S7 >= 60 ? 'Engaged Comments' : 'Quiet Thread',
      icon: '💬',
      gradient: CONTENT_CARD_BACKGROUNDS[7],
    },
    {
      id: 8,
      code: 'UTG',
      name: 'Upload Timing & Goblin Hours',
      weight: 6,
      score: scores.S8,
      roastOrCompliment: getRoastOrCompliment(8, scores.S8, item),
      verdictTag: scores.S8 >= 75 ? 'Optimal Window' : scores.S8 >= 50 ? 'Standard Window' : 'Off-Peak Window',
      icon: '⏰',
      gradient: CONTENT_CARD_BACKGROUNDS[8],
    },
    {
      id: 9,
      code: 'TCO',
      name: 'Trend Chaser vs. Original Brain',
      weight: 8,
      score: scores.S9,
      roastOrCompliment: getRoastOrCompliment(9, scores.S9, item),
      verdictTag: scores.S9 >= 78 ? 'Original Concept' : scores.S9 >= 60 ? 'Adapted Concept' : 'Standard Format',
      icon: '🧠',
      gradient: CONTENT_CARD_BACKGROUNDS[9],
    },
    {
      id: 10,
      code: 'SPV',
      name: 'Single-Post Verdict Badge',
      weight: 0,
      score: finalCurvedScore,
      roastOrCompliment: badge,
      verdictTag: badge,
      icon: '🏆',
      gradient: CONTENT_CARD_BACKGROUNDS[10],
      badgeLabel: badge,
    },
  ];

  // Derive Pros and Cons
  const pros: ContentScoreData['pros'] = [];
  const cons: ContentScoreData['cons'] = [];

  for (const param of parameters.slice(0, 9)) {
    if (param.score >= 80) {
      pros.push({
        title: param.name,
        rating: Number((param.score / 10).toFixed(1)),
        parameter: param.name,
        evidence: {
          type: 'metric',
          ref: `${param.score}/100`,
          note: param.roastOrCompliment,
        },
      });
    } else if (param.score < 68) {
      cons.push({
        title: param.name,
        rating: Number((param.score / 10).toFixed(1)),
        parameter: param.name,
        evidence: {
          type: 'metric',
          ref: `${param.score}/100`,
          note: param.roastOrCompliment,
        },
      });
    }
  }

  // Actionable Suggestions (Simulated gain)
  const suggestions: ActionableSuggestion[] = [];

  if (scores.S8 < 60) {
    suggestions.push({
      id: 'sug_timing',
      title: 'Optimize Upload Timing to Peak Audience Windows',
      description: 'Reschedule uploads for Prime Time (11 AM–2 PM or 6 PM–9 PM) to capture followers during active feed breaks instead of off-peak hours.',
      parameterId: 8,
      subfactorCode: 'UT1',
      estimatedGain: 3.5,
      effort: 'quick',
    });
  }

  if (scores.S4 < 75) {
    suggestions.push({
      id: 'sug_caption',
      title: 'Streamline Caption & Focus Message Clarity',
      description: 'Keep hashtags under 4 and refine caption copy. Concise, well-crafted captions increase reader engagement and contextual retention.',
      parameterId: 4,
      subfactorCode: 'CP2',
      estimatedGain: 2.8,
      effort: 'quick',
    });
  }

  if (scores.S9 < 75) {
    suggestions.push({
      id: 'sug_audio',
      title: 'Utilize Original Audio & Distinct Perspective',
      description: 'Focus on authentic spoken commentary or bespoke sound design. Distinct perspectives deliver a measurable originality boost.',
      parameterId: 9,
      subfactorCode: 'TC2',
      estimatedGain: 2.4,
      effort: 'medium',
    });
  }

  if (scores.S3 < 75) {
    suggestions.push({
      id: 'sug_hook',
      title: 'Boost First-Frame Visual Contrast & Hook',
      description: 'Deliver high visual contrast in opening frames with clear subject placement to immediately capture audience attention.',
      parameterId: 3,
      subfactorCode: 'SH2',
      estimatedGain: 2.1,
      effort: 'medium',
    });
  }

  if (scores.S5 < 75) {
    suggestions.push({
      id: 'sug_forward',
      title: 'Incorporate Strong Peer-Sharing Stimulus',
      description: 'Incorporate relatable discussion points or compelling perspectives that prompt viewers to share the post with friends or colleagues.',
      parameterId: 5,
      subfactorCode: 'GC2',
      estimatedGain: 1.8,
      effort: 'quick',
    });
  }

  // Map verdict on 100-point scale
  const verdict: ContentRatingVerdict =
    finalCurvedScore >= 88
      ? 'Exceptional'
      : finalCurvedScore >= 75
      ? 'Strong'
      : finalCurvedScore >= 65
      ? 'Good'
      : 'Average';

  // Construct legacy QualityScoreResult bridge
  const paramScores: Record<number, number> = {};
  const paramRatings: Record<number, number> = {};
  const paramResults: ContentParameterResult[] = [];

  for (const p of parameters) {
    paramScores[p.id] = Number((p.score * (p.weight / 100)).toFixed(1));
    paramRatings[p.id] = Number((p.score / 10).toFixed(1));
    paramResults.push({
      id: p.id,
      code: p.code,
      name: p.name,
      weight: p.weight,
      beta: 0.10,
      rating: Number((p.score / 10).toFixed(1)),
      points: Number((p.score * (p.weight / 100)).toFixed(1)),
      maxPoints: p.weight,
      confidence: 1.0,
      subfactors: [],
      lowestSubfactor: '',
      isObserved: true,
    });
  }

  const qualityBreakdown: QualityScoreResult = {
    score: rawScore,
    pointsTotal: rawScore,
    maxObservablePoints: 100,
    confidence: 0.95,
    parameterScores: paramScores,
    parameterRatings: paramRatings,
    parameters: paramResults,
    capsTriggered: [],
  };

  return {
    contentScore: finalCurvedScore,
    rawScore,
    verdictBadge: badge,
    archetypeTier,
    telemetry,
    parameters,
    scores,
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 5),
    suggestions,
    item,
    qualityScore: rawScore,
    performanceScore: Math.round(
      (telemetry.likes / Math.max(1, telemetry.reach)) * 1000 +
        (telemetry.shares / Math.max(1, telemetry.likes)) * 100
    ),
    verdict,
    confidence: 'High',
    confidenceScore: 0.95,
    qualityConfidence: 0.95,
    performanceConfidence: 0.95,
    dataTier: item.dataTier || 'C',
    isQualityOnly: false,
    qualityBreakdown,
  };
}
