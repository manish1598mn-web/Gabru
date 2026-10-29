/**
 * GABRU — CONTENT RATING CONSTANTS & PRESETS
 * 
 * 10-Parameter Rubrics, Weight Allocations, Calibration Presets,
 * and 3 Pre-Parsed Demo Datasets (including the Section 6 Worked Example).
 */

import {
  ContentParameterDef,
  DeepDiveContentTabKey,
  UnifiedContentItem,
  EffortTier,
} from '../types/ContentRatingTypes';

// -------------------------------------------------------------
// 10 Canonical Parameters & Subfactors
// -------------------------------------------------------------

export const CONTENT_PARAMETERS: ContentParameterDef[] = [
  {
    id: 1,
    code: 'HOOK',
    name: 'Hook & Opening',
    weight: 18,
    evidenceSummary: 'First 3 seconds, verbal hook, title alignment, and curiosity gap.',
    subfactors: [
      {
        code: 'HK1',
        name: 'First 3 Seconds & Verbal Punchline',
        weight: 35,
        observableChecks: 'Clear visual movement, verbal hook, and absence of intro logos/delays.',
        objectiveRule: 'Time to hook <= 3s is 0; 3-5s: -1.0; 5-8s: -2.5; > 8s: -4.5.',
      },
      {
        code: 'HK2',
        name: 'Title & Thumbnail Payoff Match',
        weight: 25,
        observableChecks: 'Content directly addresses the promise made in the title/thumbnail.',
        objectiveRule: 'Exact match: 0; slight deviation: -1.0; misleading clickbait: -4.5.',
      },
      {
        code: 'HK3',
        name: 'Curiosity Gap & Stakes',
        weight: 20,
        observableChecks: 'Establishes clear why-to-watch within the opening sentence.',
        objectiveRule: 'High intrigue: 0; predictable: -1.0; zero emotional stake: -2.5.',
      },
      {
        code: 'HK4',
        name: 'Time to First Value Delivery',
        weight: 20,
        observableChecks: 'Time elapsed before the viewer receives the first useful insight.',
        objectiveRule: '<= 5s: 0; 5-10s: -1.0; 10-20s: -2.5; > 20s: -4.5.',
      },
    ],
  },
  {
    id: 2,
    code: 'VALUE',
    name: 'Value & Relevance',
    weight: 16,
    evidenceSummary: 'Single core message, educational or entertainment utility, depth, and fluff control.',
    subfactors: [
      {
        code: 'VL1',
        name: 'Core Takeaway Clarity',
        weight: 35,
        observableChecks: 'One clear, memorable thesis that the viewer can summarize in one line.',
        objectiveRule: 'Crystal clear: 0; multiple competing ideas: -1.0; vague/unfocused: -2.5.',
      },
      {
        code: 'VL2',
        name: 'Utility or Entertainment Depth',
        weight: 30,
        observableChecks: 'Substantive depth beyond superficial platitudes or recycled basics.',
        objectiveRule: 'High novelty & actionable depth: 0; generic: -1.0; empty filler: -2.5.',
      },
      {
        code: 'VL3',
        name: 'Niche & Target Audience Fit',
        weight: 20,
        observableChecks: 'Vocabulary, references, and pacing match target demographic.',
        objectiveRule: 'Tailored fit: 0; slightly misaligned: -1.0; alienates core viewer: -2.5.',
      },
      {
        code: 'VL4',
        name: 'Repetition & Fluff Control',
        weight: 15,
        observableChecks: 'Absence of rambling, repetitive phrases, and redundant pauses.',
        objectiveRule: 'Tight edit: 0; minor circular points: -1.0; bloated runtime: -2.5.',
      },
    ],
  },
  {
    id: 3,
    code: 'STRUCTURE',
    name: 'Storytelling & Structure',
    weight: 12,
    evidenceSummary: 'Narrative arc, scene cut velocity, dead-air control, and seamless loop ending.',
    subfactors: [
      {
        code: 'ST1',
        name: 'Narrative Flow (Setup -> Build -> Climax)',
        weight: 30,
        observableChecks: 'Clear progression with micro-payoffs every 5-8 seconds.',
        objectiveRule: 'Continuous momentum: 0; mid-video energy slump: -1.0; disjointed: -2.5.',
      },
      {
        code: 'ST2',
        name: 'Scene Cut Velocity & Visual Variety',
        weight: 25,
        observableChecks: 'Angle changes, B-roll cut-ins, zoom punches, and visual resets.',
        objectiveRule: 'Cut rate matches format norm (1 cut per 2-4s for short-form): 0; static talking head > 6s: -1.0.',
      },
      {
        code: 'ST3',
        name: 'Dead Air & Silence Suppression',
        weight: 25,
        observableChecks: 'Detects silent pauses, stuttering, and hesitation segments.',
        objectiveRule: 'Max silence <= 0.8s: 0; 0.8-1.5s: -1.0; > 2.0s: -2.5.',
      },
      {
        code: 'ST4',
        name: 'Payoff & Loop Seamlessness',
        weight: 20,
        observableChecks: 'Strong satisfying payoff and smooth circular ending loop for replay.',
        objectiveRule: 'Infinite loop or clean finish: 0; abrupt cutoff: -1.0; fizzles out: -2.5.',
      },
    ],
  },
  {
    id: 4,
    code: 'MEDIA',
    name: 'Visual & Audio Quality',
    weight: 14,
    evidenceSummary: '1080p+ resolution, -14 LUFS vocal clarity, animated subtitles, and composition.',
    subfactors: [
      {
        code: 'VA1',
        name: 'Resolution, Bitrate & Sharpness',
        weight: 25,
        observableChecks: 'Min side >= 1080px, sharp facial details, absence of compression artifacts.',
        objectiveRule: '>= 1080p: 0; 720p: -1.0; 480p: -2.5; < 480p: -4.5.',
      },
      {
        code: 'VA2',
        name: 'Lighting, Exposure & Color Grade',
        weight: 25,
        observableChecks: 'Balanced subject illumination, separated subject from background.',
        objectiveRule: 'Studio balance: 0; underexposed/flat: -1.0; blown-out highlights/grain: -2.5.',
      },
      {
        code: 'VA3',
        name: 'Integrated Loudness & Voice Clarity',
        weight: 25,
        observableChecks: 'Audio measured at -14 ± 3 LUFS, zero clipping, clean noise floor.',
        objectiveRule: 'Loudness in -14 ± 3 LUFS: 0; -18 to -11 LUFS: -1.0; background hiss/clipping: -2.5.',
      },
      {
        code: 'VA4',
        name: 'Captions & Animated Subtitles',
        weight: 25,
        observableChecks: 'On-screen dynamic word captions for silent viewing (75%+ mobile view rate).',
        objectiveRule: 'Synchronized animated subtitles: 0; static captions: -1.0; zero subtitles on spoken video: -2.5.',
      },
    ],
  },
  {
    id: 5,
    code: 'COPY',
    name: 'Caption, Copy & Hashtags',
    weight: 10,
    evidenceSummary: 'Flesch-Kincaid readability, keyword richness, first-line preview, and hashtag bands.',
    subfactors: [
      {
        code: 'CP1',
        name: 'Caption Hook & First Line Preview',
        weight: 35,
        observableChecks: 'First line encourages "more..." click before truncation.',
        objectiveRule: 'High curiosity hook: 0; generic summary: -1.0; empty/emoji-only: -2.5.',
      },
      {
        code: 'CP2',
        name: 'Keyword & Semantic Search Alignment',
        weight: 25,
        observableChecks: 'Searchable topic keywords present in caption body for SEO indexing.',
        objectiveRule: 'High relevance SEO text: 0; thin text: -1.0; zero searchable copy: -2.5.',
      },
      {
        code: 'CP3',
        name: 'Hashtag Count & Relevancy Band',
        weight: 25,
        observableChecks: 'Hashtags match platform best-practice density (IG: 3-5, YT: 2-4, X: 1-2).',
        objectiveRule: 'Inside ideal band: 0; 1 tag or slightly under: -1.0; spammy 15+ tags: -2.5.',
      },
      {
        code: 'CP4',
        name: 'Formatting, Spacing & Readability',
        weight: 15,
        observableChecks: 'Clean line breaks, bullet points, and comfortable reading cadence.',
        objectiveRule: 'Clean layout: 0; dense wall of text: -1.0.',
      },
    ],
  },
  {
    id: 6,
    code: 'CTA',
    name: 'Call-to-Action & Engagement',
    weight: 7,
    evidenceSummary: 'Single focal action, genuine discussion prompt, and natural closing placement.',
    subfactors: [
      {
        code: 'CT1',
        name: 'Single Focal Action Clarity',
        weight: 40,
        observableChecks: 'Exactly one clear directive (save, share, follow, or comment).',
        objectiveRule: '1 focused CTA: 0; 2 competing CTAs: -1.0; zero CTA: -2.5; >= 3 CTAs: -2.5.',
      },
      {
        code: 'CT2',
        name: 'Discussion Prompt & Comment Catalyst',
        weight: 35,
        observableChecks: 'Asks a specific, debatable question that stimulates replies.',
        objectiveRule: 'Debatable prompt: 0; generic "agree or disagree?": -1.0; no question: -2.5.',
      },
      {
        code: 'CT3',
        name: 'Placement & Natural Integration',
        weight: 25,
        observableChecks: 'Delivered in final 10% of runtime or pinned in top comment.',
        objectiveRule: 'Seamless finish: 0; intrudes too early in video: -2.5.',
      },
    ],
  },
  {
    id: 7,
    code: 'FORMAT',
    name: 'Platform Fit & Format',
    weight: 8,
    evidenceSummary: 'Aspect ratio, duration norms, native platform UI safe-zone margins.',
    subfactors: [
      {
        code: 'PF1',
        name: 'Aspect Ratio & Orientation Compliance',
        weight: 35,
        observableChecks: 'Vertical 9:16 for short-form, horizontal 16:9 for YouTube, 4:5 for feed.',
        objectiveRule: 'Native format: 0; letterboxed/pillarboxed: -2.5; wrong orientation: -4.5.',
      },
      {
        code: 'PF2',
        name: 'UI Safe Zones & Button Clearance',
        weight: 30,
        observableChecks: 'Critical text/actions avoid bottom caption area and right action buttons.',
        objectiveRule: 'Clean margins: 0; text partially covered by like button: -1.0; obstructed: -2.5.',
      },
      {
        code: 'PF3',
        name: 'Format Runtime Duration Norms',
        weight: 20,
        observableChecks: 'Short video duration aligns with retention sweet spot (20-45s).',
        objectiveRule: 'In ideal band: 0; over-extended for concept: -1.0; dragging: -2.5.',
      },
      {
        code: 'PF4',
        name: 'Native Platform Features Usage',
        weight: 15,
        observableChecks: 'Leverages sound tags, location tag, chapters, or pinned comments.',
        objectiveRule: 'Fully utilized: 0; unoptimized tags: -1.0.',
      },
    ],
  },
  {
    id: 8,
    code: 'ORIGINALITY',
    name: 'Originality & Consistency',
    weight: 6,
    evidenceSummary: 'Personal voice, brand consistency, unique perspective, template credit.',
    subfactors: [
      {
        code: 'OG1',
        name: 'Distinctive Style & Personal Voice',
        weight: 40,
        observableChecks: 'Demonstrates unique creator signature in delivery, humor, or aesthetic.',
        objectiveRule: 'Authentic signature: 0; generic influencer delivery: -1.0.',
      },
      {
        code: 'OG2',
        name: 'Template & Trending Sound Credit',
        weight: 35,
        observableChecks: 'Creative remix of trends rather than 1:1 derivative copy.',
        objectiveRule: 'Original angle on trend: 0; lazy template copy: -1.0; uncredited copy: -2.5.',
      },
      {
        code: 'OG3',
        name: 'Consistency with Creator Topic Niche',
        weight: 25,
        observableChecks: 'Aligns with established thematic authority of the creator.',
        objectiveRule: 'Matches authority: 0; unrelated trend chasing: -1.0.',
      },
    ],
  },
  {
    id: 9,
    code: 'TIMING',
    name: 'Timing & Frequency',
    weight: 4,
    evidenceSummary: 'Audience active hours match, gap consistency (Requires Path B/C analytics).',
    subfactors: [
      {
        code: 'TM1',
        name: 'Audience Active Window Alignment',
        weight: 50,
        observableChecks: 'Posted within peak engagement hours for follower geography.',
        objectiveRule: 'Within peak window: 0; off-peak by 2-4h: -1.0; off-peak by >4h: -2.5. V=0 without analytics.',
      },
      {
        code: 'TM2',
        name: 'Posting Cadence Consistency',
        weight: 50,
        observableChecks: 'Predictable cadence maintaining algorithmic momentum.',
        objectiveRule: 'Regular cadence: 0; erratic multi-week gap: -2.5. V=0 without analytics.',
      },
    ],
  },
  {
    id: 10,
    code: 'TRUST',
    name: 'Trust & Compliance',
    weight: 5,
    evidenceSummary: 'Sponsorship disclosure, copyright flags, misleading claims, safety checks.',
    subfactors: [
      {
        code: 'TC1',
        name: 'Commercial & Sponsorship Disclosure',
        weight: 35,
        observableChecks: 'Clear `#ad`, `#sponsored`, or paid partnership tag if commercial.',
        objectiveRule: 'Fully disclosed: 0; buried hashtag: -1.0; undisclosed paid promo: -4.5 (Cap at 60).',
      },
      {
        code: 'TC2',
        name: 'Music & Asset Copyright Licensing',
        weight: 30,
        observableChecks: 'Uses cleared commercial sounds or native platform library audio.',
        objectiveRule: 'Cleared: 0; copyright muted risk: -2.5.',
      },
      {
        code: 'TC3',
        name: 'Accuracy & Deception Prevention',
        weight: 35,
        observableChecks: 'No dangerous medical, financial, or conspiratorial falsehoods.',
        objectiveRule: 'Truthful: 0; unsubstantiated claim: -1.0; dangerous misinformation: -4.5 (Cap at 60).',
      },
    ],
  },
];

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
 * YouTube Short via Public Link (Path A)
 * Timing is unavailable (V=0). Quality = 70.8, Performance = 70.7, Content = 70.8 "Good"
 */
export const DEMO_VIRAL_SHORT: UnifiedContentItem = {
  id: 'yt:short_sec6_worked_example',
  url: 'https://youtube.com/shorts/5xGqM90abcZ',
  platform: 'youtube',
  format: 'short_video',
  inputMode: 'demo',
  creator: {
    id: 'creator_tech_tips',
    handle: '@TechCraftLab',
    name: 'Tech Craft Lab',
    followerCount: 42500,
    niche: 'Developer Productivity & Tech Tips',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-22T14:30:00Z',
  title: 'How I doubled my coding speed with this one keyboard shortcut',
  caption: 'Stop wasting clicks in VS Code. Here is the hidden keybinding that saves 30 minutes a day #vscode',
  hashtags: ['vscode'],
  mentions: [],
  media: {
    durationSec: 34,
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    fps: 30,
    bitrateKbps: 8200,
    thumbnailUrl: '/face_beauty_hero_bg.jpg',
  },
  audioMetrics: {
    integratedLufs: -14.2,
    truePeakDbfs: -1.1,
    silenceSegmentsCount: 2,
    maxDeadAirSec: 1.1,
    speechRateWpm: 155,
    voiceClarityRatio: 0.92,
  },
  transcriptSegments: [
    { startSec: 0, endSec: 3.5, text: 'Most developers waste hundreds of clicks searching through project files every single day.' },
    { startSec: 3.5, endSec: 6.2, text: 'Instead of touching your mouse, let me show you what senior engineers actually do.' },
    { startSec: 6.2, endSec: 14.0, text: 'Press Control+P, type @, and instantly jump between symbols without scrolling.' },
    { startSec: 14.0, endSec: 24.5, text: 'Add a colon to jump straight to any line number, or type > to run any command instantly.' },
    { startSec: 24.5, endSec: 34.0, text: 'Try it right now and tell me how many clicks you saved today.' },
  ],
  keyframes: [
    {
      timestampSec: 1.5,
      imageUrl: '/face_beauty_hero_bg.jpg',
      ocrText: 'STOP WASTING CLICKS IN VS CODE',
      visualSharpness: 88,
      visualBrightness: 72,
      facesDetected: 1,
    },
    {
      timestampSec: 8.0,
      imageUrl: '/face_beauty_hero_bg.jpg',
      ocrText: 'CTRL + P -> @ (SYMBOL SEARCH)',
      visualSharpness: 94,
      visualBrightness: 68,
      facesDetected: 0,
    },
    {
      timestampSec: 28.0,
      imageUrl: '/face_beauty_hero_bg.jpg',
      ocrText: 'WHAT SHORTCUT DO YOU USE MOST?',
      visualSharpness: 90,
      visualBrightness: 70,
      facesDetected: 1,
    },
  ],
  metrics: {
    views: 12400,
    likes: 810,
    comments: 64,
    shares: 48,
    saves: 215,
  },
  ownerAnalytics: null, // Path A link-only
  baselineStats: {
    postCount: 18,
    medianViews: 9200,
    medianLikes: 580,
    medianComments: 36,
    medianEngagementRate: 0.058, // 5.8%
    stdDevEngagementRate: 0.012,
  },
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: false,
    mediaFile: true,
    transcript: true,
    keyframes: true,
  },
};

/**
 * Demo 2: High-Performance Educational Carousel (Instagram 8-Slide)
 */
export const DEMO_CAROUSEL: UnifiedContentItem = {
  id: 'ig:carousel_design_tokens',
  url: 'https://instagram.com/p/DBc8910xyz',
  platform: 'instagram',
  format: 'carousel',
  inputMode: 'demo',
  creator: {
    id: 'creator_ui_master',
    handle: '@StudioDesignSystems',
    name: 'Design System Secrets',
    followerCount: 68000,
    niche: 'UI/UX & Design Tokens',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-25T17:00:00Z',
  title: '8 Design Token Rules That Save 100 Engineering Hours',
  caption: 'Never hardcode hex values again. Here is the 3-layer token hierarchy used by Stripe and Airbnb. Save this guide for your next project 🚀 #designsystems #uidesign #figma #webdev',
  hashtags: ['designsystems', 'uidesign', 'figma', 'webdev'],
  mentions: [],
  media: {
    durationSec: 0,
    width: 1080,
    height: 1350,
    aspectRatio: 4 / 5,
    thumbnailUrl: '/face_beauty_sketch.jpg',
  },
  transcriptSegments: [],
  keyframes: [
    {
      timestampSec: 0,
      imageUrl: '/face_beauty_sketch.jpg',
      ocrText: '3-LAYER TOKEN SYSTEM FOR DESIGN ENGINEERS',
      visualSharpness: 98,
      visualBrightness: 80,
      facesDetected: 0,
    },
  ],
  metrics: {
    views: 45000,
    likes: 3400,
    comments: 180,
    shares: 1120,
    saves: 2450,
  },
  ownerAnalytics: {
    reach: 52000,
    retentionPercent: 88,
    avgWatchTimeSec: 42,
    completionRatePercent: 78,
    audienceHours: 120,
  },
  baselineStats: {
    postCount: 24,
    medianViews: 28000,
    medianLikes: 1900,
    medianComments: 95,
    medianEngagementRate: 0.082,
    stdDevEngagementRate: 0.015,
  },
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: true,
    mediaFile: true,
    transcript: false,
    keyframes: true,
  },
};

/**
 * Demo 3: Long-Form Tech Explainer (YouTube 16:9, 12 min)
 */
export const DEMO_LONG_VIDEO: UnifiedContentItem = {
  id: 'yt:long_ai_agents_architecture',
  url: 'https://youtube.com/watch?v=7hKmZ01234',
  platform: 'youtube',
  format: 'long_video',
  inputMode: 'demo',
  creator: {
    id: 'creator_arch_ai',
    handle: '@SystemDesignArchitect',
    name: 'Distributed Systems Academy',
    followerCount: 145000,
    niche: 'Full-Stack Architecture & AI Agents',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-18T16:00:00Z',
  title: 'Building Autonomous AI Multi-Agent Systems from Scratch in 2026',
  caption: 'A deep dive into reactive wakeups, memory compaction, and tool safety sandboxes. Chapters and full GitHub repo in description. #ai #systemdesign #coding',
  hashtags: ['ai', 'systemdesign', 'coding'],
  mentions: [],
  media: {
    durationSec: 740,
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9,
    fps: 60,
    bitrateKbps: 14000,
    thumbnailUrl: '/face_beauty_hero_bg.jpg',
  },
  audioMetrics: {
    integratedLufs: -14.0,
    truePeakDbfs: -1.0,
    silenceSegmentsCount: 8,
    maxDeadAirSec: 0.9,
    speechRateWpm: 142,
    voiceClarityRatio: 0.96,
  },
  transcriptSegments: [
    { startSec: 0, endSec: 4.0, text: 'Most autonomous agents fail because they poll in an infinite loop instead of using event wakeups.' },
  ],
  keyframes: [
    {
      timestampSec: 2.0,
      imageUrl: '/face_beauty_hero_bg.jpg',
      ocrText: 'WHY MULTI-AGENT ARCHITECTURES FAIL',
      visualSharpness: 95,
      visualBrightness: 75,
      facesDetected: 1,
    },
  ],
  metrics: {
    views: 98000,
    likes: 8200,
    comments: 640,
    shares: 1400,
    saves: 3800,
  },
  ownerAnalytics: {
    reach: 110000,
    retentionPercent: 54,
    avgWatchTimeSec: 395,
    completionRatePercent: 46,
    audienceHours: 10700,
  },
  baselineStats: {
    postCount: 15,
    medianViews: 72000,
    medianLikes: 5500,
    medianComments: 410,
    medianEngagementRate: 0.088,
    stdDevEngagementRate: 0.016,
  },
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: true,
    mediaFile: true,
    transcript: true,
    keyframes: true,
  },
};

export const SAMPLE_DEMO_CONTENTS: Record<string, UnifiedContentItem> = {
  short_video: DEMO_VIRAL_SHORT,
  carousel: DEMO_CAROUSEL,
  long_video: DEMO_LONG_VIDEO,
};
