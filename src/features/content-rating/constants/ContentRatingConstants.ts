/**
 * GABRU — CONTENT RATING CONSTANTS & PRESETS
 * 
 * 10-Parameter Rubrics, Weight Allocations, Calibration Presets,
 * and 3 Pre-Parsed Demo Datasets (including the Section Worked Example).
 */

import {
  ContentParameterDef,
  DeepDiveContentTabKey,
  UnifiedContentItem,
  EffortTier,
  ContentPlatform,
  ContentFormat,
} from '../types/ContentRatingTypes';

// -------------------------------------------------------------
// 10 Canonical Parameters & Subfactors (Parts A & B)
// -------------------------------------------------------------

export const CONTENT_PARAMETERS: ContentParameterDef[] = [
  {
    id: 1,
    code: 'HOOK',
    name: 'Hook & Opening',
    weight: 18,
    beta: 0.10,
    evidenceSummary: 'First 3 seconds, verbal hook, cover/title length, promise-payoff, and time to first value.',
    subfactors: [
      {
        code: 'HK1',
        name: 'Opening grab',
        weight: 35,
        observableChecks: 'Judge severity (0 to 3) of the first 3s, first line, or first visual.',
        objectiveRule: 'Severity penalty: 0 / -1.0 / -2.5 / -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'HK2',
        name: 'Cover and title',
        weight: 25,
        observableChecks: 'Thumbnail clarity and title length outside platform band (YT: 40-70 chars).',
        objectiveRule: 'Severity penalty, plus title length outside band: <= 10 off: -1.0, <= 25 off: -2.5, more: -4.5.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'HK3',
        name: 'Promise-payoff match',
        weight: 20,
        observableChecks: 'Cosine similarity between the opening promise and content summary.',
        objectiveRule: '10 - max(severity penalty, similarity penalty). Cosine >= 0.60: 0; >= 0.45: -1.0; >= 0.30: -2.5; below: -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'HK4',
        name: 'Time to first value',
        weight: 20,
        observableChecks: 'Seconds elapsed until first valuable payoff (short video <= 3s, long-form <= 15s).',
        objectiveRule: 'Short video <= 3s: 0; <= 5s: -1.0; <= 8s: -2.5; > 8s: -4.5. (Long-form cutoffs: 15, 30, 45s).',
        visibilityByTier: { A: 0.0, B: 0.5, C: 1.0 },
      },
    ],
  },
  {
    id: 2,
    code: 'VALUE',
    name: 'Value & Relevance',
    weight: 16,
    beta: 0.10,
    evidenceSummary: 'Core-message clarity, value delivered vs filler, originality against corpus, and audience relevance.',
    subfactors: [
      {
        code: 'VR1',
        name: 'Core-message clarity',
        weight: 30,
        observableChecks: 'Single distinct topic vs multiple competing ideas.',
        objectiveRule: '10 - max(severity penalty, topic penalty). Distinct topics: 1: 0; 2: -1.0; 3: -2.5; 4+: -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VR2',
        name: 'Value delivered',
        weight: 30,
        observableChecks: 'Share of rambling, filler words, or redundant pauses.',
        objectiveRule: '10 - max(severity penalty, filler penalty). Filler share <= 10%: 0; <= 20%: -1.0; <= 35%: -2.5; > 35%: -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VR3',
        name: 'Originality',
        weight: 20,
        observableChecks: 'Highest similarity m to corpus and duplicate scripts.',
        objectiveRule: 'Similarity <= 0.80: 0; <= 0.88: -1.0; <= 0.94: -2.5; > 0.94: -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VR4',
        name: 'Audience relevance',
        weight: 20,
        observableChecks: 'Cosine similarity to the creator\'s top-quartile posts.',
        objectiveRule: 'Similarity >= 0.55: 0; >= 0.45: -1.0; >= 0.35: -2.5; below: -4.5. Intentional pivot is N/A.',
        visibilityByTier: { A: 0.5, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 3,
    code: 'STRUCTURE',
    name: 'Storytelling & Structure',
    weight: 12,
    beta: 0.10,
    evidenceSummary: 'Narrative flow (setup -> build -> payoff), scene cut pacing, delivery rate, and clean ending.',
    subfactors: [
      {
        code: 'ST1',
        name: 'Flow (hook, body, payoff)',
        weight: 35,
        observableChecks: 'Structural continuity from hook to body to satisfying resolution.',
        objectiveRule: 'Severity penalty: weak flow -1.0, missing payoff -2.5, jumbled -4.5.',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
      {
        code: 'ST2',
        name: 'Pacing',
        weight: 30,
        observableChecks: 'Dead-air suppression (>2s silence or >3s static) and cut velocity (6 to 30 cuts/min).',
        objectiveRule: '10 - dead-air penalty (<=3% 0, <=8% -1, <=15% -2.5, >15% -4.5) - cut-rate band penalty (6-30 cuts/min).',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
      {
        code: 'ST3',
        name: 'Delivery rate',
        weight: 20,
        observableChecks: 'Speech rate measured against ideal band (120 to 180 words per minute).',
        objectiveRule: 'Band penalty against 120-180 WPM. N/A if speech is under 30% of runtime.',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
      {
        code: 'ST4',
        name: 'Ending',
        weight: 15,
        observableChecks: 'Payoff completeness and smooth circular loop or outro.',
        objectiveRule: 'Severity penalty, plus -2.5 if speech is cut off mid-sentence.',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
    ],
  },
  {
    id: 4,
    code: 'MEDIA',
    name: 'Visual & Audio Quality',
    weight: 14,
    beta: 0.15, // Non-linear beta = 0.15 for quality
    evidenceSummary: '1080p+ resolution, balanced lighting/exposure, rule-of-thirds composition, subtitles, and -14 LUFS audio.',
    subfactors: [
      {
        code: 'VA1',
        name: 'Resolution and bitrate',
        weight: 20,
        observableChecks: 'Short side dimension, framerate (>=24 fps), and video encoding bitrate.',
        objectiveRule: 'Short side >= 1080px: 0; >= 720: -1.0; >= 480: -2.5; < 480: -4.5. FPS < 24: -1.0. Low bitrate: -1.0.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VA2',
        name: 'Exposure and focus',
        weight: 20,
        observableChecks: 'Share of under/over-exposed or blurred frames.',
        objectiveRule: 'Bad frames share <= 5%: 0; <= 15%: -1.0; <= 30%: -2.5; > 30%: -4.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VA3',
        name: 'Composition',
        weight: 15,
        observableChecks: 'Subject framing, head room, clutter control, and visual balance.',
        objectiveRule: 'Severity penalty (subject cut off, cluttered frame).',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'VA4',
        name: 'Captions and on-screen text',
        weight: 20,
        observableChecks: 'On-screen subtitles for silent mobile viewing, word error rate, and text size.',
        objectiveRule: 'Speech video with no captions: -2.5. Word-error rate > 15%: -1.0. Text height < 4% of frame: -1.0.',
        visibilityByTier: { A: 0.0, B: 0.5, C: 1.0 },
      },
      {
        code: 'VA5',
        name: 'Audio',
        weight: 25,
        observableChecks: 'Integrated loudness (-14 ± 3 LUFS), SNR (>= 25 dB), and digital clipping.',
        objectiveRule: 'Beyond ±3 LU of -14 LUFS, <=2 more: -1.0, <=5 more: -2.5, >5: -4.5. SNR < 25dB: -1, < 18dB: -2.5. Clipping > 0.1%: -1.',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
    ],
  },
  {
    id: 5,
    code: 'COPY',
    name: 'Caption, Copy & Hashtags',
    weight: 10,
    beta: 0.10,
    evidenceSummary: 'Flesch-Kincaid readability, keyword coverage, platform hashtag density, and tone/correctness.',
    subfactors: [
      {
        code: 'CP1',
        name: 'Readability',
        weight: 25,
        observableChecks: 'Reading grade level (<= 9th grade) or sentence length (<= 20 words), and clean line breaks.',
        objectiveRule: 'Reading grade <= 9: 0; <= 12: -1.0; <= 14: -2.5; > 14: -4.5. Dense wall of text with no line breaks: -1.0.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP2',
        name: 'Keyword coverage',
        weight: 25,
        observableChecks: 'Share of core content topic keywords present in title or caption body for search indexing.',
        objectiveRule: 'Keyword share >= 50%: 0; >= 30%: -1.0; >= 15%: -2.5; < 15%: -4.5.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP3',
        name: 'Hashtags',
        weight: 25,
        observableChecks: 'Hashtag count matched to platform profile band and irrelevant tag share.',
        objectiveRule: 'Count outside band: 0 off: 0; <= 1 off: -1.0; <= 3 off: -2.5; more: -4.5. Irrelevant share > 10%: -1. Banned tag: -2.5.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP4',
        name: 'Tone and correctness',
        weight: 25,
        observableChecks: 'Typos per 100 words and tone alignment with audience expectations.',
        objectiveRule: 'Typos <= 1: 0; <= 2.5: -1.0; <= 5: -2.5; > 5: -4.5. Plus tone-mismatch severity penalty.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 6,
    code: 'CTA',
    name: 'Call-to-Action & Engagement Design',
    weight: 7,
    beta: 0.10,
    evidenceSummary: 'Single focal directive, genuine conversational prompt, and non-intrusive placement.',
    subfactors: [
      {
        code: 'CT1',
        name: 'Presence and clarity',
        weight: 40,
        observableChecks: 'Exactly one clear directive (save, share, follow, or comment).',
        objectiveRule: '1 CTA: 0; 2 CTAs: -1.0; 0 CTA: -2.5; >= 3 CTAs: -2.5. Vague CTA ("check it out") adds -1.0.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'CT2',
        name: 'Conversation prompt',
        weight: 30,
        observableChecks: 'Asks a genuine, specific question vs manipulative engagement bait ("comment YES").',
        objectiveRule: 'Debatable question/opinion prompt: 0. None: -2.5. Engagement bait (tag-a-friend, comment YES): -2.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'CT3',
        name: 'Placement',
        weight: 30,
        observableChecks: 'Delivered in final 10% of runtime or pinned in top comment.',
        objectiveRule: 'End of video or caption: 0. Mid-video: -1.0. Contradictory: -2.5. N/A when there is no CTA.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
    ],
  },
  {
    id: 7,
    code: 'FORMAT',
    name: 'Platform Fit & Format',
    weight: 8,
    beta: 0.10,
    evidenceSummary: 'Aspect ratio, duration band alignment, UI safe-zone clearances, and native feature usage.',
    subfactors: [
      {
        code: 'PF1',
        name: 'Aspect ratio',
        weight: 30,
        observableChecks: '9:16 for short video, 16:9 for YouTube, 4:5/1:1 for feed photo.',
        objectiveRule: 'Deviation <= 2%: 0; <= 8%: -1.0; <= 20%: -2.5; > 20%: -4.5. Black bars > 10% of frame: -2.5.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'PF2',
        name: 'Duration band',
        weight: 30,
        observableChecks: 'Runtime measured against platform ideal retention sweet spot.',
        objectiveRule: 'Band penalty against platform duration band (or words for text posts).',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'PF3',
        name: 'Text safe zones',
        weight: 20,
        observableChecks: 'On-screen text avoiding platform button overlays, caption zones, and sound bars.',
        objectiveRule: '-1.0 per overlay inside platform interface zones, up to -4.5.',
        visibilityByTier: { A: 0.0, B: 0.0, C: 1.0 },
      },
      {
        code: 'PF4',
        name: 'Native features',
        weight: 20,
        observableChecks: 'Custom thumbnail, video chapters, sound attribution, or platform stickers.',
        objectiveRule: 'Missing custom thumbnail: -1.0. No chapters on long video: -1.0. Watermark from competing app: -2.5.',
        visibilityByTier: { A: 0.5, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 8,
    code: 'ORIGINALITY',
    name: 'Originality & Consistency',
    weight: 6,
    beta: 0.10,
    evidenceSummary: 'Style consistency against creator history and signature device execution.',
    subfactors: [
      {
        code: 'OC1',
        name: 'Style consistency',
        weight: 50,
        observableChecks: 'Cosine similarity of style embedding to creator\'s previous N posts.',
        objectiveRule: 'Similarity >= 0.60: 0; >= 0.45: -1.0; >= 0.30: -2.5; below: -4.5.',
        visibilityByTier: { A: 0.5, B: 1.0, C: 1.0 },
      },
      {
        code: 'OC2',
        name: 'Signature',
        weight: 50,
        observableChecks: 'Signature formula: R = 5 + gate * min(5, Σ credits) - Σ penalties, clamped to 3..10.',
        objectiveRule: 'Credits: signature +1, distinctive device +1.5, angle +1, twist +1. Gate = 1.0 if Hook & Media >= 5, else 0.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
    ],
  },
  {
    id: 9,
    code: 'TIMING',
    name: 'Timing & Frequency',
    weight: 4,
    beta: 0.10,
    evidenceSummary: 'Audience activity hour alignment and cadence consistency (CV of post gaps).',
    subfactors: [
      {
        code: 'TM1',
        name: 'Posting-time fit',
        weight: 50,
        observableChecks: 'Audience activity at posting hour divided by peak activity hour (rho).',
        objectiveRule: 'rho >= 0.80: 0; >= 0.60: -1.0; >= 0.40: -2.5; below: -4.5. (Needs owner analytics / CSV).',
        visibilityByTier: { A: 0.0, B: 1.0, C: 0.0 }, // 1.0 if CSV is uploaded
      },
      {
        code: 'TM2',
        name: 'Frequency consistency',
        weight: 50,
        observableChecks: 'Coefficient of variation of gaps between posts and gap before this post.',
        objectiveRule: 'CV <= 0.5: 0; <= 1.0: -1.0; <= 1.5: -2.5; > 1.5: -4.5. Gap > 3x median adds -1.0.',
        visibilityByTier: { A: 0.5, B: 1.0, C: 0.5 },
      },
    ],
  },
  {
    id: 10,
    code: 'TRUST',
    name: 'Trust & Compliance',
    weight: 5,
    beta: 0.20, // Non-linear beta = 0.20 (single compliance violation matters)
    evidenceSummary: 'Sponsorship disclosure, copyright audio/footage, truthfulness, safety, and accessibility.',
    subfactors: [
      {
        code: 'TC1',
        name: 'Disclosure',
        weight: 30,
        observableChecks: 'Proper disclosure tags for commercial promotion (#ad, #sponsored, paid partnership).',
        objectiveRule: 'No promo: 10. Promo without disclosure: -4.5 (Major Flag, Cap 60). Disclosed but buried: -1.0.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'TC2',
        name: 'Music and IP',
        weight: 20,
        observableChecks: 'Licensed audio, cleared samples, and absence of copyrighted clips.',
        objectiveRule: 'Unlicensed audio: -2.5. Unlicensed footage: -2.5.',
        visibilityByTier: { A: 0.0, B: 0.5, C: 0.5 },
      },
      {
        code: 'TC3',
        name: 'Claims',
        weight: 25,
        observableChecks: 'Evidence-based claims without deceptive health or financial falsehoods.',
        objectiveRule: 'Severity penalty. Level 3 misleading health/finance claim: -4.5 (Major Flag, Cap 60).',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'TC4',
        name: 'Safety',
        weight: 15,
        observableChecks: 'Community guidelines adherence (harassment, dangerous acts, hate speech).',
        objectiveRule: 'Clean: 0. Borderline: -2.5. Violation: -4.5. Severe violation: Content is Not Rated.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
      {
        code: 'TC5',
        name: 'Accessibility',
        weight: 10,
        observableChecks: 'Image alt text, flashing pattern warnings (photosensitive epilepsy).',
        objectiveRule: 'Missing alt text: -1.0. Flashing content without warning: -2.5.',
        visibilityByTier: { A: 0.5, B: 0.5, C: 1.0 },
      },
    ],
  },
];

// -------------------------------------------------------------
// N/A Content Type Exclusions (Part A2)
// -------------------------------------------------------------

export const CONTENT_TYPE_EXCLUSIONS: Record<string, string[]> = {
  image: ['HK4', 'ST2', 'ST3', 'VA5', 'PF2'],
  text: [
    'HK2',
    'HK4',
    'ST2',
    'ST3',
    'VA1',
    'VA2',
    'VA3',
    'VA4',
    'VA5',
    'PF1',
    'PF2',
    'PF3',
  ],
};

// -------------------------------------------------------------
// Platform Profiles & Band Penalty Function (Part A4)
// -------------------------------------------------------------

export interface PlatformProfile {
  aspectRatio: number | null; // e.g. 9/16, 16/9, 0.8 (4:5)
  durationBandSec: [number, number] | null; // [min, max]
  hashtagBand: [number, number]; // [min, max]
}

export const PLATFORM_PROFILES: Record<string, PlatformProfile> = {
  'instagram:short_video': {
    aspectRatio: 9 / 16,
    durationBandSec: [15, 60],
    hashtagBand: [3, 8],
  },
  'tiktok:short_video': {
    aspectRatio: 9 / 16,
    durationBandSec: [15, 60],
    hashtagBand: [3, 6],
  },
  'youtube:short_video': {
    aspectRatio: 9 / 16,
    durationBandSec: [15, 60],
    hashtagBand: [2, 5],
  },
  'youtube:long_video': {
    aspectRatio: 16 / 9,
    durationBandSec: [480, 1200], // 8 to 20 min
    hashtagBand: [3, 8],
  },
  'instagram:image': {
    aspectRatio: 0.8, // 4:5
    durationBandSec: null,
    hashtagBand: [3, 8],
  },
  'x:text': {
    aspectRatio: null,
    durationBandSec: null,
    hashtagBand: [0, 2],
  },
};

/**
 * Calculates Band Penalty:
 * distance outside band ÷ band midpoint × 100
 * Penalty is 0 if <= 3%, -1.0 up to 7%, -2.5 up to 12%, and -4.5 above 12%.
 */
export function calculateBandPenalty(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 0.0;
  const distance = value < min ? min - value : value - max;
  const midpoint = (min + max) / 2;
  if (midpoint <= 0) return 0.0;
  const pct = (distance / midpoint) * 100;

  if (pct <= 3.0) return 0.0;
  if (pct <= 7.0) return -1.0;
  if (pct <= 12.0) return -2.5;
  return -4.5;
}

export const PARAM_TO_TAB: Record<number, DeepDiveContentTabKey> = {
  1: 'hook',
  2: 'value',
  3: 'structure',
  4: 'media',
  5: 'copy',
  6: 'cta',
  7: 'format',
  8: 'originality',
  9: 'timing',
  10: 'compliance',
};

export const CONTENT_CARD_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(135deg, #2b1836 0%, #7b299e 55%, #3a164c 100%)', // hook: purple
  2: 'linear-gradient(135deg, #182036 0%, #2f458e 55%, #161e38 100%)', // value: indigo
  3: 'linear-gradient(135deg, #162a2a 0%, #297676 55%, #142828 100%)', // structure: teal
  4: 'linear-gradient(135deg, #241c38 0%, #56388e 55%, #1f1430 100%)', // media: violet
  5: 'linear-gradient(135deg, #2a2218 0%, #7a5828 55%, #3a2e14 100%)', // copy: amber
  6: 'linear-gradient(135deg, #2a1824 0%, #7a2b58 55%, #381428 100%)', // cta: rose
  7: 'linear-gradient(135deg, #182820 0%, #2b704c 55%, #142618 100%)', // format: emerald
  8: 'linear-gradient(135deg, #1a2432 0%, #305888 55%, #182434 100%)', // originality: slate blue
  9: 'linear-gradient(135deg, #281a20 0%, #6d3045 55%, #24141a 100%)', // timing: crimson
  10: 'linear-gradient(135deg, #1f2228 0%, #444c5c 55%, #1c2026 100%)', // compliance: steel
};

export const EFFORT_LEVEL_CONFIG: Record<
  EffortTier,
  { label: string; badgeBg: string; textColor: string; icon: string }
> = {
  quick: {
    label: 'Quick (< 5 min)',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    textColor: '#34d399',
    icon: '⚡',
  },
  medium: {
    label: 'Medium (15-30 min)',
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    textColor: '#fbbf24',
    icon: '⏱️',
  },
  heavy: {
    label: 'Heavy (> 1 hour)',
    badgeBg: 'rgba(248, 113, 113, 0.15)',
    textColor: '#f87171',
    icon: '🛠️',
  },
};

export const CRITICAL_CAP_THRESHOLDS = {
  HOOK_MIN_RATING: 4.0,
  HOOK_CAP_SCORE: 75.0,
  VALUE_MIN_RATING: 4.0,
  VALUE_CAP_SCORE: 70.0,
  COMPLIANCE_CAP_SCORE: 60.0,
};

// -------------------------------------------------------------
// 3 Realistic Pre-Parsed Demo Datasets
// -------------------------------------------------------------

/**
 * Demo 1: Canonical Worked Example from Section 6
 * 34s Instagram Reel (Tier C: Uploaded media / CSV)
 * Quality = 88.6, Performance = 88.6, Content Score = 88.6 "Strong", Confidence = 0.92
 */
export const DEMO_VIRAL_SHORT: UnifiedContentItem = {
  id: 'ig:reel_worked_example_34s',
  url: 'https://instagram.com/reel/C8WorkedExample34s',
  platform: 'instagram',
  format: 'short_video',
  inputMode: 'demo',
  dataTier: 'C',
  creator: {
    id: 'creator_studio_demo',
    handle: '@StudioCreator',
    name: 'Studio Creator Lab',
    followerCount: 54000,
    niche: 'Creative & Digital Storytelling',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-25T17:00:00Z',
  title: 'Three cinematic lighting tricks with one bedside lamp',
  caption: 'Transform low-budget video with high-contrast edge lighting. No expensive gear needed #filmmaking #cinematography #videoediting #lighting',
  hashtags: ['filmmaking', 'cinematography', 'videoediting', 'lighting'],
  mentions: [],
  media: {
    durationSec: 34,
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    fps: 30,
    bitrateKbps: 9200,
    thumbnailUrl: '/face_beauty_hero_bg.jpg',
  },
  audioMetrics: {
    integratedLufs: -14.2,
    truePeakDbfs: -1.2,
    silenceSegmentsCount: 1,
    maxDeadAirSec: 0.6,
    speechRateWpm: 154,
    voiceClarityRatio: 0.92,
    snrDb: 28.5,
    clippingShare: 0.0,
  },
  transcriptSegments: [
    { startSec: 0, endSec: 3, text: 'You do not need a three-thousand dollar light to look cinematic.' },
    { startSec: 3, endSec: 7, text: 'Here is what happens when you turn your desk lamp into an edge light.' },
    { startSec: 7, endSec: 15, text: 'Notice how the rim light instantly separates the jawline from the background.' },
    { startSec: 15, endSec: 25, text: 'Step two: bounce the spill onto white card to fill shadows naturally.' },
    { startSec: 25, endSec: 34, text: 'Save this setup for your next shoot and let me know your thoughts.' },
  ],
  keyframes: [
    { timestampSec: 0.5, imageUrl: '/face_beauty_sketch.jpg', ocrText: 'Cinematic Lighting Hack', visualSharpness: 92, visualBrightness: 55, facesDetected: 1 },
    { timestampSec: 7.2, imageUrl: '/face_beauty_sketch.jpg', ocrText: 'Edge Lighting Separation', visualSharpness: 94, visualBrightness: 58, facesDetected: 1 },
    { timestampSec: 20.0, imageUrl: '/face_beauty_sketch.jpg', ocrText: 'Bounce Card Fill', visualSharpness: 91, visualBrightness: 60, facesDetected: 1 },
  ],
  metrics: {
    views: 184500,
    likes: 19200,
    comments: 480,
    shares: 3400,
    saves: 5600,
  },
  ownerAnalytics: {
    reach: 220000,
    retentionPercent: null, // Retention excluded in demo to match z-score setup
    avgWatchTimeSec: 24.5,
    completionRatePercent: null, // Retention excluded to match worked example
    audienceHours: 18,
    shares: 3400,
    saves: 5600,
  },
  performanceZScores: {
    engagement: 1.95,
    views: 1.23,
    commentQuality: 1.19,
    retention: null,
  },
  baselineStats: {
    postCount: 18,
    medianViews: 75000,
    madViews: 28000,
    medianEngagementRate: 0.072,
    madEngagementRate: 0.018,
    medianCommentsPer1k: 1.8,
    madCommentsPer1k: 0.5,
  },
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: true,
    mediaFile: true,
    transcript: true,
    keyframes: true,
  },
};

/**
 * Demo 2: Link-Only (Tier A) Submission of the same reel
 * Demonstrates Storytelling excluded (V=0), confidence 0.57 (Medium), Quality 82.5, Content 84.3
 */
export const DEMO_LINK_ONLY_REEL: UnifiedContentItem = {
  ...DEMO_VIRAL_SHORT,
  id: 'ig:reel_link_tier_a',
  dataTier: 'A',
  inputMode: 'link',
  ownerAnalytics: null,
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: false,
    mediaFile: false,
    transcript: false,
    keyframes: false,
  },
};

/**
 * Demo 3: Flagged Compliance & Flaw Capped Reel
 * Major disclosure flaw (TC1) capping score at 60
 */
export const DEMO_COMPLIANCE_CAPPED: UnifiedContentItem = {
  ...DEMO_VIRAL_SHORT,
  id: 'ig:reel_compliance_capped',
  dataTier: 'B',
  title: 'Secret supplement that cures joint pain overnight',
  caption: 'Grab this miracle bottle before stock runs out link in bio! #health #remedy',
  metrics: {
    views: 12000,
    likes: 420,
    comments: 110,
    shares: 15,
    saves: 30,
  },
};

export const SAMPLE_DEMO_CONTENTS: Record<
  'short_video' | 'carousel' | 'long_video',
  UnifiedContentItem
> = {
  short_video: DEMO_VIRAL_SHORT,
  carousel: DEMO_LINK_ONLY_REEL,
  long_video: DEMO_COMPLIANCE_CAPPED,
};

