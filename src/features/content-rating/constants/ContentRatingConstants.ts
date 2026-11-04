/**
 * GABRU — CONTENT RATING CONSTANTS & PRESETS
 * 
 * 10 Redesigned Single-Post Parameters:
 * - 40% Hard Scraped Math + 60% Multimodal LLM Rubric + Viral Ego Curve
 * - Raw Telemetry Bar with Derived Flex Badges
 * - Deterministic Single-Post Verdict Badges & Archetypes
 * - 3 High-Impact Single-Post Demo Datasets
 */

import {
  ContentParameterDef,
  DeepDiveContentTabKey,
  UnifiedContentItem,
  EffortTier,
  SinglePostVerdictBadge,
  SinglePostArchetypeTier,
} from '../types/ContentRatingTypes';

// -------------------------------------------------------------
// Entertaining Loading States (Animated Cycles During Analysis)
// -------------------------------------------------------------

export const ENTERTAINING_LOADING_STEPS: string[] = [
  'Judging your selfie angles...',
  'Counting how many times you used the 🔥 emoji...',
  'Inspecting lighting and drip...',
  'Analyzing reference save rate & bookmark velocity...',
  'Reading the comment section chaos...',
  'Calculating group-chat forward velocity...',
  'Detecting 3 AM goblin hours timestamps...',
  'Synthesizing viral archetype badge...',
];

// -------------------------------------------------------------
// Internet Slang & Linguistic Lists
// -------------------------------------------------------------

export const INTERNET_SLANG_LIST: string[] = [
  'pov',
  'era',
  'delulu',
  'aura',
  'dump',
  'core',
  'real',
  'hear me out',
];

export const FIRST_PERSON_PRONOUNS: string[] = [
  'i',
  'me',
  'my',
  'mine',
  'myself',
];

// -------------------------------------------------------------
// 10 Single-Post Parameters & Rubrics
// -------------------------------------------------------------

export const CONTENT_PARAMETERS: ContentParameterDef[] = [
  {
    id: 1,
    code: 'MCE',
    name: 'Main Character Energy',
    weight: 12,
    beta: 0.10,
    evidenceSummary: 'Visual spotlight on the subject, pose confidence, and first-person pronoun density.',
    subfactors: [
      {
        code: 'MC1',
        name: 'Subject Spotlight',
        weight: 45,
        observableChecks: 'Solo person/face command of the frame (10=solo portrait/fit check, 5=group, 2=object).',
        objectiveRule: 'Visual spotlight score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'MC2',
        name: 'Pose & Vibe Audacity',
        weight: 35,
        observableChecks: 'Camera confidence, swagger, and protagonist presence.',
        objectiveRule: 'Camera confidence score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'MC3',
        name: 'Ego Pronoun Density',
        weight: 20,
        observableChecks: 'Share of first-person pronouns (I, me, my, mine, myself) in caption (capped at 12%).',
        objectiveRule: 'Pronoun ratio against 12% cap.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 2,
    code: 'VAF',
    name: 'Visual Aura & Frame Quality',
    weight: 15,
    beta: 0.15,
    evidenceSummary: 'Lighting quality, color grading harmony, rule-of-thirds composition, and subject styling.',
    subfactors: [
      {
        code: 'VA1',
        name: 'Lighting & Exposure',
        weight: 25,
        observableChecks: 'Controlled highlights, soft shadows, and clean key light.',
        objectiveRule: 'Lighting score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'VA2',
        name: 'Color Grading',
        weight: 25,
        observableChecks: 'Color palette coherence, skin tone preservation, and grading mood.',
        objectiveRule: 'Color grading score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'VA3',
        name: 'Composition & Framing',
        weight: 25,
        observableChecks: 'Rule-of-thirds alignment, headroom, and background clutter control.',
        objectiveRule: 'Composition score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'VA4',
        name: 'Styling & Drip',
        weight: 25,
        observableChecks: 'Outfit coordination, environment aesthetics, and visual polish.',
        objectiveRule: 'Styling drip score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 3,
    code: 'SSH',
    name: 'Scroll-Stopper Hook',
    weight: 15,
    beta: 0.10,
    evidenceSummary: 'Conversion efficiency (Likes / Reach), thumbnail contrast, and first 6 words punchiness.',
    subfactors: [
      {
        code: 'SH1',
        name: 'Saturating Conversion Rate',
        weight: 50,
        observableChecks: 'Like-to-Reach percentage mapped through 50 * (1 - exp(-0.35 * CR)).',
        objectiveRule: 'Empirical reach conversion curve.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'SH2',
        name: 'Visual Thumb-Stop',
        weight: 30,
        observableChecks: 'High-contrast visual pop at tiny feed size.',
        objectiveRule: 'Visual hook score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'SH3',
        name: 'Opening Line Punch',
        weight: 20,
        observableChecks: 'Punchiness and intrigue of the first 6 words in caption or overlay.',
        objectiveRule: 'Opening line punch score 0 to 10.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 4,
    code: 'CPC',
    name: 'Caption Poetry vs. Cringe',
    weight: 10,
    beta: 0.10,
    evidenceSummary: 'Base 75 score with LLM wit minus hashtag stuffing, emoji soup, and essay penalties.',
    subfactors: [
      {
        code: 'CP1',
        name: 'Effortless Wit',
        weight: 40,
        observableChecks: 'Clever one-liner vs generic motivational quotes or forced captions.',
        objectiveRule: 'Wit rubric 0 to 25 added to base 75.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP2',
        name: 'Hashtag Restraint',
        weight: 20,
        observableChecks: 'Deducts 2.5 pts per hashtag beyond 5 (max penalty 35).',
        objectiveRule: 'Hashtag stuffing penalty.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP3',
        name: 'Emoji Balance',
        weight: 20,
        observableChecks: 'Penalizes captions where emojis exceed 20% of word count.',
        objectiveRule: 'Emoji soup penalty.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CP4',
        name: 'Essay Suppression',
        weight: 20,
        observableChecks: 'Penalizes captions exceeding 100 words (word wall).',
        objectiveRule: 'Word wall penalty.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 5,
    code: 'GCF',
    name: 'Group-Chat Forwardability',
    weight: 14,
    beta: 0.10,
    evidenceSummary: 'Forward velocity from Shares + 1.5x Reposts relative to Likes, plus viral meme relatability.',
    subfactors: [
      {
        code: 'GC1',
        name: 'Forward Velocity Curve',
        weight: 65,
        observableChecks: '65 * (1 - exp(-25 * (Shares + 1.5*Reposts)/Likes)).',
        objectiveRule: 'Forwarding ratio mathematical saturation curve.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'GC2',
        name: 'Relatability & Meme Quotient',
        weight: 35,
        observableChecks: 'How easily this content is sent to friends with "literally you" or "look at this".',
        objectiveRule: 'Relatability score 0 to 35.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 6,
    code: 'SBB',
    name: 'Secret Bookmark Bait',
    weight: 12,
    beta: 0.10,
    evidenceSummary: 'Saves-to-Likes ratio curve, aesthetic moodboard envy, and reference utility.',
    subfactors: [
      {
        code: 'SB1',
        name: 'Bookmark Saturation Curve',
        weight: 65,
        observableChecks: '65 * (1 - exp(-22 * Saves/Likes)). 10% ratio approaches full marks.',
        objectiveRule: 'Mathematical save curve.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'SB2',
        name: 'Utility & Envy Factor',
        weight: 35,
        observableChecks: 'Aesthetic moodboard envy (outfit/travel) or practical reference utility (tips/recipe).',
        objectiveRule: 'Save utility score 0 to 35.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 7,
    code: 'CSC',
    name: 'Comment Section Chaos',
    weight: 8,
    beta: 0.10,
    evidenceSummary: 'Comments-to-Likes ratio curve and comment section vibe check (hype vs warzone).',
    subfactors: [
      {
        code: 'CC1',
        name: 'Discussion Volume Curve',
        weight: 60,
        observableChecks: '60 * (1 - exp(-35 * Comments/Likes)).',
        objectiveRule: 'Comment volume mathematical curve.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'CC2',
        name: 'Comment Section Vibe',
        weight: 40,
        observableChecks: 'LLM check of top comments: 40=wild hype/debates, 10=generic bot spam.',
        objectiveRule: 'Comment vibe score 0 to 40.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 8,
    code: 'UTG',
    name: 'Upload Timing & Goblin Hours',
    weight: 6,
    beta: 0.10,
    evidenceSummary: 'Circadian timestamp scoring (Prime Time vs 3 AM Goblin Hours) + momentum velocity.',
    subfactors: [
      {
        code: 'UT1',
        name: 'Circadian Timing Clock',
        weight: 60,
        observableChecks: 'Prime time (11-14h, 18-21h) = 60, Normal = 42, Late night = 28, 3 AM Goblin = 15.',
        objectiveRule: 'Local upload hour clock score.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'UT2',
        name: 'Early Momentum Bonus',
        weight: 40,
        observableChecks: 'Weighted interactions relative to reach: 40 * (1 - exp(-0.25 * EngPct)).',
        objectiveRule: 'Initial momentum velocity.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 9,
    code: 'TCO',
    name: 'Trend Chaser vs. Original Brain',
    weight: 8,
    beta: 0.10,
    evidenceSummary: 'Original audio bonus (+15) minus internet slang deductions ("pov", "era", "delulu", "aura").',
    subfactors: [
      {
        code: 'TC1',
        name: 'Concept Originality',
        weight: 60,
        observableChecks: 'Fresh creative premise vs copy-pasting this week’s viral template.',
        objectiveRule: 'Originality score 0 to 60.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'TC2',
        name: 'Audio Origin Bonus',
        weight: 20,
        observableChecks: '+15 if original audio or static photo; 0 if charting viral commercial sound.',
        objectiveRule: 'Original audio bonus.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
      {
        code: 'TC3',
        name: 'Slang Penalty',
        weight: 20,
        observableChecks: 'Deducts 8 pts per overused buzzword (pov, era, delulu, aura, dump, core, real, hear me out).',
        objectiveRule: 'Slang deduction.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
  {
    id: 10,
    code: 'SPV',
    name: 'Single-Post Verdict Badge',
    weight: 0, // Informational Archetype Badge (Weight 0 in rawScore)
    beta: 0.10,
    evidenceSummary: 'Deterministic title awarded based on peak parameters (Group-Chat Hall of Famer, Thirst Trap, etc.).',
    subfactors: [
      {
        code: 'VB1',
        name: 'Deterministic Classifier',
        weight: 100,
        observableChecks: 'Priority tree evaluation against S1, S2, S4, S5, S6, S7, S9, and upload hour.',
        objectiveRule: 'Badge assignment.',
        visibilityByTier: { A: 1.0, B: 1.0, C: 1.0 },
      },
    ],
  },
];

// -------------------------------------------------------------
// Visual Luxury Card Background Gradients
// -------------------------------------------------------------

export const CONTENT_CARD_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  2: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  3: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  4: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  5: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  6: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  7: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  8: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  9: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  10: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
};

export const PARAM_TO_TAB: Record<number, DeepDiveContentTabKey> = {
  1: 'main_character',
  2: 'visual_aura',
  3: 'scroll_hook',
  4: 'caption_wit',
  5: 'group_chat',
  6: 'bookmark_bait',
  7: 'comment_chaos',
  8: 'upload_timing',
  9: 'trend_originality',
  10: 'verdict_badge',
};

export const TAB_LABELS: Record<DeepDiveContentTabKey, string> = {
  main_character: '01 • Main Character',
  visual_aura: '02 • Visual Aura',
  scroll_hook: '03 • Scroll Hook',
  caption_wit: '04 • Caption Poetry',
  group_chat: '05 • Group-Chat',
  bookmark_bait: '06 • Bookmark Bait',
  comment_chaos: '07 • Comment Chaos',
  upload_timing: '08 • Goblin Hours',
  trend_originality: '09 • Original Brain',
  verdict_badge: '10 • Verdict Badge',
  // Legacy aliases
  hook: '03 • Scroll Hook',
  value: '01 • Main Character',
  structure: '05 • Group-Chat',
  media: '02 • Visual Aura',
  copy: '04 • Caption Poetry',
  cta: '06 • Bookmark Bait',
  format: '08 • Goblin Hours',
  originality: '09 • Original Brain',
  timing: '08 • Goblin Hours',
  compliance: '10 • Verdict Badge',
};

// -------------------------------------------------------------
// 3 High-Impact Single-Post Demo Datasets
// -------------------------------------------------------------

/**
 * Demo 1: The Group-Chat Hall of Famer
 * High Likes, massive Shares + Reposts, sharp lighting, witty one-liner.
 * Meets S5 >= 78 -> Badge: "Group-Chat Hall of Famer"
 */
export const DEMO_VIRAL_SHORT: UnifiedContentItem = {
  id: 'ig:reel_group_chat_hall_of_fame',
  url: 'https://instagram.com/reel/C8GroupChatHallOfFame',
  platform: 'instagram',
  format: 'short_video',
  inputMode: 'demo',
  dataTier: 'C',
  creator: {
    id: 'creator_studio_alex',
    handle: '@alex.studio',
    name: 'Alex Rivera',
    followerCount: 68000,
    niche: 'Creative Tech & Visual Aesthetics',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-25T19:15:00Z', // 7:15 PM Prime Time
  uploadHourLocal: 19,
  title: 'Three cinematic lighting tricks with one bedside lamp',
  caption: 'Turning my $12 desk lamp into an anamorphic cinema light. Save this for your next shoot. #filmmaking #cinematography #lighting',
  hashtags: ['filmmaking', 'cinematography', 'lighting'],
  mentions: [],
  firstPersonWords: 2, // "my", "this"
  wordCount: 20,
  emojiCount: 0,
  hashtagCount: 3,
  isTrendingAudio: false,
  slangMatchCount: 0,
  slangMatches: [],
  reposts: 280,
  media: {
    durationSec: 34,
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    fps: 30,
    bitrateKbps: 9200,
    thumbnailUrl: '/face_beauty_hero_bg.jpg',
  },
  metrics: {
    views: 184500,
    likes: 19200,
    comments: 480,
    shares: 3400,
    saves: 5600,
    reposts: 280,
  },
  sampleComments: [
    { author: 'marcus_films', text: 'This lighting trick literally saved my short film shoot today!! 🔥🔥', likes: 142, sentiment: 'hype' },
    { author: 'sarah_visuals', text: 'Sent this directly to our production group chat lmao', likes: 98, sentiment: 'hype' },
    { author: 'cinematic_jay', text: 'Wait the rim light separation is actually genius', likes: 64, sentiment: 'hype' },
  ],
  llmEvaluations: {
    subjectSpotlight: 9.5,
    poseAudacity: 8.8,
    lighting: 9.6,
    colorGrading: 9.2,
    composition: 9.4,
    stylingDrip: 9.0,
    visualHook: 9.2,
    openingLinePunch: 8.8,
    captionWit: 22,
    shareRelatability: 32,
    saveUtilityEnvy: 31,
    commentVibe: 36,
    conceptOriginality: 54,
  },
  transcriptSegments: [
    { startSec: 0, endSec: 3, text: 'You do not need a three-thousand dollar light to look cinematic.' },
    { startSec: 3, endSec: 15, text: 'Here is what happens when you turn your desk lamp into an edge light.' },
    { startSec: 15, endSec: 34, text: 'Notice how the rim light instantly separates the jawline from the background.' },
  ],
  keyframes: [
    { timestampSec: 0.5, imageUrl: '/face_beauty_sketch.jpg', ocrText: 'Cinematic Lighting Hack', visualSharpness: 94, visualBrightness: 58, facesDetected: 1 },
  ],
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: true,
    mediaFile: true,
    transcript: true,
    keyframes: true,
  },
};

/**
 * Demo 2: The Certified Thirst Trap / Aesthetic Flex
 * High solo visual aura, 2 AM secret bookmarks, minimal caption.
 * S6 >= 78 AND S1 >= 75 -> Badge: "Certified Thirst Trap / Aesthetic Flex"
 */
export const DEMO_AESTHETIC_FLEX: UnifiedContentItem = {
  id: 'ig:post_aesthetic_thirst_trap',
  url: 'https://instagram.com/p/C9AestheticFlexPost',
  platform: 'instagram',
  format: 'image',
  inputMode: 'demo',
  dataTier: 'A',
  creator: {
    id: 'creator_elena',
    handle: '@elena.vibe',
    name: 'Elena Rostova',
    followerCount: 142000,
    niche: 'Fashion & Visual Moodboards',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-27T20:45:00Z',
  uploadHourLocal: 20,
  title: 'Golden hour silhouette in Milan',
  caption: 'golden hour in milan. nothing else needed ✨',
  hashtags: ['milan', 'goldenhour'],
  mentions: [],
  firstPersonWords: 0,
  wordCount: 7,
  emojiCount: 1,
  hashtagCount: 2,
  isTrendingAudio: false,
  slangMatchCount: 0,
  slangMatches: [],
  reposts: 95,
  media: {
    durationSec: 0,
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    thumbnailUrl: '/face_beauty_hero_bg.jpg',
  },
  metrics: {
    views: 112000,
    likes: 16800,
    comments: 310,
    shares: 840,
    saves: 3950, // Massive save rate (23.5% of likes)
    reposts: 95,
  },
  sampleComments: [
    { author: 'sofia_k', text: 'EXCUSE ME??? The styling is insane 😭', likes: 180, sentiment: 'hype' },
    { author: 'lucas_art', text: 'The silhouette lighting is perfection', likes: 88, sentiment: 'hype' },
    { author: 'chloe.mood', text: 'Saved to my outfit inspiration board immediately', likes: 112, sentiment: 'hype' },
  ],
  llmEvaluations: {
    subjectSpotlight: 9.8,
    poseAudacity: 9.6,
    lighting: 9.8,
    colorGrading: 9.5,
    composition: 9.6,
    stylingDrip: 9.7,
    visualHook: 9.4,
    openingLinePunch: 8.5,
    captionWit: 21,
    shareRelatability: 20,
    saveUtilityEnvy: 34,
    commentVibe: 35,
    conceptOriginality: 52,
  },
  transcriptSegments: [],
  keyframes: [],
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: false,
    mediaFile: true,
    transcript: false,
    keyframes: false,
  },
};

/**
 * Demo 3: The 3 AM Goblin Hours Chaos Dump
 * Uploaded at 3:42 AM, 12 emojis, hashtag soup, wild comment section debate.
 * Meets uploadHour in [1, 5] AND S4 <= 60 -> Badge: "3 AM Unhinged Chaos Dump"
 */
export const DEMO_GOBLIN_HOURS: UnifiedContentItem = {
  id: 'tiktok:video_3am_chaos_dump',
  url: 'https://tiktok.com/@nocturnal.dev/video/7391823901',
  platform: 'tiktok',
  format: 'short_video',
  inputMode: 'demo',
  dataTier: 'A',
  creator: {
    id: 'creator_night_owl',
    handle: '@nocturnal.coder',
    name: 'Devin at 3AM',
    followerCount: 24000,
    niche: 'Late Night Coding & Tech Chaos',
    avatarUrl: '/favicon.svg',
  },
  postedAt: '2026-10-29T03:42:00Z',
  uploadHourLocal: 3, // 3 AM Goblin Hours!
  title: 'I rewrote the entire backend in Rust at 3am because I lost my mind',
  caption: 'me thinking i could refactor 40k lines of code before sunrise 💀💀💀 was i in my delulu era or did i unlock god mode?? do not try this at home #coding #rust #developer #programming #relatable #tech #viral #help #dump #nightowl',
  hashtags: ['coding', 'rust', 'developer', 'programming', 'relatable', 'tech', 'viral', 'help', 'dump', 'nightowl'],
  mentions: [],
  firstPersonWords: 5, // "me", "i", "i", "my", "i"
  wordCount: 38,
  emojiCount: 10,
  hashtagCount: 12, // 12 hashtags -> (12 - 5) * 2.5 = 17.5 penalty
  isTrendingAudio: true, // Charting trending sound -> 0 audio bonus
  slangMatchCount: 2, // "delulu", "dump"
  slangMatches: ['delulu', 'dump'],
  reposts: 20,
  media: {
    durationSec: 18,
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    fps: 30,
    thumbnailUrl: '/face_beauty_sketch.jpg',
  },
  metrics: {
    views: 48000,
    likes: 3200,
    comments: 240,
    shares: 110,
    saves: 95,
    reposts: 20,
  },
  sampleComments: [
    { author: 'senior_eng', text: 'BRO GO TO SLEEP WHAT ARE YOU DOING', likes: 320, sentiment: 'debate' },
    { author: 'rust_fanatic', text: 'Zero memory leaks though you are legendary', likes: 210, sentiment: 'hype' },
    { author: 'prod_on_fire', text: 'The pull request tomorrow morning is going to be tragic', likes: 185, sentiment: 'debate' },
  ],
  llmEvaluations: {
    subjectSpotlight: 6.5,
    poseAudacity: 7.0,
    lighting: 6.0,
    colorGrading: 6.2,
    composition: 6.5,
    stylingDrip: 6.0,
    visualHook: 8.5,
    openingLinePunch: 8.0,
    captionWit: 4,
    shareRelatability: 15,
    saveUtilityEnvy: 14,
    commentVibe: 20,
    conceptOriginality: 38,
  },
  transcriptSegments: [],
  keyframes: [],
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: false,
    mediaFile: true,
    transcript: false,
    keyframes: false,
  },
};

export const SAMPLE_DEMO_CONTENTS: Record<
  'short_video' | 'carousel' | 'long_video',
  UnifiedContentItem
> = {
  short_video: DEMO_VIRAL_SHORT,
  carousel: DEMO_AESTHETIC_FLEX,
  long_video: DEMO_GOBLIN_HOURS,
};

// Aliases for legacy imports
export const DEMO_LINK_ONLY_REEL = DEMO_AESTHETIC_FLEX;
export const DEMO_COMPLIANCE_CAPPED = DEMO_GOBLIN_HOURS;
