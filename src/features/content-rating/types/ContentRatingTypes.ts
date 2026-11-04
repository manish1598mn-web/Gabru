/**
 * GABRU — CONTENT RATING DOMAIN TYPES
 * 
 * Strict TypeScript models for the Redesigned Social Media Single-Post Rating & Telemetry Platform:
 * - 4-Step Single-Post Pipeline (RapidAPI/Apify scraper + Multimodal LLM pass)
 * - Raw Telemetry Bar (Likes, Comments, Shares, Saves, Reposts, Views + Derived Flex Badges)
 * - 10 Entertaining Single-Post Rating Parameters (Main Character Energy, Visual Aura, Scroll Hook, etc.)
 * - Exact Mathematical Formulation (40% Hard Math + 60% Hybrid Rubric + Viral Ego Curve)
 * - Deterministic Single-Post Verdict Badges & Archetypes
 */

export type ContentPlatform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'threads'
  | 'facebook';

export type ContentFormat =
  | 'short_video'
  | 'long_video'
  | 'carousel'
  | 'image'
  | 'text';

export type InputMode = 'link' | 'upload' | 'demo';

export type DataTier = 'A' | 'B' | 'C';

export type EffortTier = 'quick' | 'medium' | 'heavy';

export type ContentRatingVerdict =
  | 'Exceptional'
  | 'Strong'
  | 'Good'
  | 'Average'
  | 'Weak'
  | 'Needs Rework'
  | 'Not Rated';

export type DeepDiveContentTabKey =
  | 'main_character'
  | 'visual_aura'
  | 'scroll_hook'
  | 'caption_wit'
  | 'group_chat'
  | 'bookmark_bait'
  | 'comment_chaos'
  | 'upload_timing'
  | 'trend_originality'
  | 'verdict_badge'
  // Legacy aliases for seamless routing
  | 'hook'
  | 'value'
  | 'structure'
  | 'media'
  | 'copy'
  | 'cta'
  | 'format'
  | 'originality'
  | 'timing'
  | 'compliance';

export type SinglePostVerdictBadge =
  | 'Group-Chat Hall of Famer'
  | 'Certified Thirst Trap / Aesthetic Flex'
  | 'Gatekept Goldmine'
  | 'Cinema-Grade Masterpiece'
  | 'Comment Section Warzone'
  | '3 AM Unhinged Chaos Dump'
  | 'Timeline Vibe Check Passed';

export type SinglePostArchetypeTier =
  | 'S-Tier Masterpiece'
  | 'Main Character'
  | 'Micro-Celebrity'
  | 'Gatekept Gem'
  | 'Casual Scroller'
  | 'Goblin Hours Shitposter';

// -------------------------------------------------------------
// Raw Scraped Telemetry & Derived Badges
// -------------------------------------------------------------

export interface SinglePostTelemetry {
  likes: number; // L
  comments: number; // C
  shares: number; // S_share
  saves: number; // S_save
  reposts: number; // R_repost
  views: number; // V
  reach: number; // B_reach = max(V, F, 100)
  authorFollowers: number; // F
  trueEngagementRate: string; // e.g. "8.45%"
  groupChatMultiplier: string; // e.g. "14.2%"
  bookmarkRate: string; // e.g. "9.8%"
  isSharesEstimated: boolean;
  isSavesEstimated: boolean;
}

/**
 * Flexible input payload for scoreSinglePost supporting flat scraper payloads
 * or full UnifiedContentItem structures.
 */
export interface SinglePostInputPayload {
  likes?: number;
  comments?: number;
  shares?: number | null;
  saves?: number | null;
  reposts?: number;
  views?: number;
  authorFollowers?: number;
  firstPersonWords?: number;
  wordCount?: number;
  emojiCount?: number;
  hashtagCount?: number;
  uploadHourLocal?: number; // 0..23
  isTrendingAudio?: boolean;
  slangMatchCount?: number;
  caption?: string;
  title?: string;
  postedAt?: string;
  metrics?: Partial<ContentPublicMetrics>;
  creator?: Partial<CreatorProfile>;
  llmEvaluations?: Partial<SinglePostLlmEvaluations>;
  [key: string]: any;
}

// -------------------------------------------------------------
// Multimodal LLM Rubric Inputs (0..10 or custom bounds)
// -------------------------------------------------------------

export interface SinglePostLlmEvaluations {
  // Parameter 1: Main Character Energy
  subjectSpotlight: number; // V_spot (0..10): 10=solo fit/portrait, 5=group, 2=object
  poseAudacity: number; // V_pose (0..10): Camera confidence & presence
  
  // Parameter 2: Visual Aura & Frame Quality
  lighting: number; // V_light (0..10): Lighting quality & exposure
  colorGrading: number; // V_color (0..10): Color harmony & palette
  composition: number; // V_comp (0..10): Framing & rule-of-thirds
  stylingDrip: number; // V_drip (0..10): Subject styling & setting

  // Parameter 3: Scroll-Stopper Hook
  visualHook: number; // V_hook (0..10): Thumb-stop contrast
  openingLinePunch: number; // A_open (0..10): First 6 words impact

  // Parameter 4: Caption Poetry vs. Cringe
  captionWit: number; // A_wit (0..25): 25=clever one-liner, 0=generic cliche

  // Parameter 5: Group-Chat Forwardability
  shareRelatability: number; // A_share (0..35): Relatability & meme value

  // Parameter 6: Secret Bookmark Bait
  saveUtilityEnvy: number; // A_save (0..35): Envy factor or reference utility

  // Parameter 7: Comment Section Chaos
  commentVibe: number; // A_comm (0..40): 40=wild hype/debates, 10=bot spam

  // Parameter 9: Trend Chaser vs. Original Brain
  conceptOriginality: number; // A_orig (0..60): Fresh visual idea vs copy-paste
}

// -------------------------------------------------------------
// Unified Content Schema for Single Post
// -------------------------------------------------------------

export interface CreatorProfile {
  id: string;
  handle: string;
  name: string;
  avatarUrl?: string;
  followerCount?: number;
  niche?: string;
}

export interface ContentPublicMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number | null;
  saves: number | null;
  reposts?: number | null;
}

export interface ContentOwnerAnalytics {
  reach: number | null;
  retentionPercent: number | null;
  avgWatchTimeSec: number | null;
  completionRatePercent: number | null;
  audienceHours: number | null;
  shares?: number | null;
  saves?: number | null;
}

export interface CreatorBaselineStats {
  postCount: number;
  medianViews: number;
  madViews?: number;
  medianEngagementRate: number;
  madEngagementRate?: number;
  medianCommentsPer1k?: number;
  madCommentsPer1k?: number;
  medianRetentionRatio?: number;
  madRetentionRatio?: number;
}

export interface KeyframeSample {
  timestampSec: number;
  imageUrl: string;
  ocrText: string;
  visualSharpness: number;
  visualBrightness: number;
  facesDetected: number;
}

export interface TranscriptSegment {
  startSec: number;
  endSec: number;
  text: string;
}

export interface AudioAnalysisMetrics {
  integratedLufs: number;
  truePeakDbfs: number;
  silenceSegmentsCount: number;
  maxDeadAirSec: number;
  speechRateWpm: number;
  voiceClarityRatio: number;
  snrDb?: number;
  clippingShare?: number;
}

export interface SampleCommentItem {
  author: string;
  text: string;
  likes?: number;
  sentiment?: 'hype' | 'debate' | 'neutral' | 'cringe';
}

export interface UnifiedContentItem {
  id: string;
  url?: string;
  platform: ContentPlatform;
  format: ContentFormat;
  inputMode: InputMode;
  dataTier: DataTier;
  creator: CreatorProfile;
  postedAt: string;
  title: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  media: {
    durationSec: number;
    width: number;
    height: number;
    aspectRatio: number;
    fps?: number;
    bitrateKbps?: number;
    thumbnailUrl: string;
    mediaUrl?: string;
  };
  audioMetrics?: AudioAnalysisMetrics;
  transcriptSegments: TranscriptSegment[];
  keyframes: KeyframeSample[];
  metrics: ContentPublicMetrics;
  ownerAnalytics?: ContentOwnerAnalytics | null;
  baselineStats?: CreatorBaselineStats | null;
  dataCompleteness: {
    publicMetrics: boolean;
    ownerAnalytics: boolean;
    mediaFile: boolean;
    transcript: boolean;
    keyframes: boolean;
  };

  // Single-Post Specific Parsed Fields
  reposts?: number;
  uploadHourLocal?: number; // 0..23
  firstPersonWords?: number;
  wordCount?: number;
  emojiCount?: number;
  hashtagCount?: number;
  isTrendingAudio?: boolean;
  slangMatchCount?: number;
  slangMatches?: string[];
  sampleComments?: SampleCommentItem[];
  llmEvaluations?: Partial<SinglePostLlmEvaluations>;

  // Optional intent flags
  isIntentionalPivot?: boolean;
  performanceZScores?: {
    engagement?: number;
    views?: number;
    retention?: number | null;
    commentQuality?: number;
  };
}

// -------------------------------------------------------------
// Evaluated Parameter Result
// -------------------------------------------------------------

export interface SinglePostParameterResult {
  id: number; // 1..10
  code: string; // 'MCE', 'VAF', 'SSH', 'CPC', 'GCF', 'SBB', 'CSC', 'UTG', 'TCO', 'SPV'
  name: string;
  weight: number; // Parameter weight in rawScore (sum to 100 for S1..S9)
  score: number; // 0..100
  roastOrCompliment: string;
  verdictTag?: string;
  subScores?: Record<string, number | string>;
  icon: string;
  gradient: string;
  badgeLabel?: string;
}

// -------------------------------------------------------------
// Legacy & Evidence Types for Deep-Dive UI Support
// -------------------------------------------------------------

export interface ContentSubfactorEvidence {
  type: 'timestamp' | 'quote' | 'metric' | 'visual_crop';
  ref: string;
  note: string;
  confidence?: number;
}

export interface ContentPenalty {
  severity: 'minor' | 'moderate' | 'major';
  delta: number;
  evidence: ContentSubfactorEvidence;
}

export interface ContentSubfactorDef {
  code: string;
  name: string;
  weight: number;
  observableChecks: string;
  objectiveRule: string;
  visibilityByTier: {
    A: number;
    B: number;
    C: number;
  };
}

export interface ContentSubfactorResult {
  code: string;
  name: string;
  weight: number;
  rawRating: number;
  visibility: number;
  adjustedRating: number;
  penalties: ContentPenalty[];
  isApplicable: boolean;
  isObserved: boolean;
  notes?: string;
}

export interface ContentParameterDef {
  id: number;
  code: string;
  name: string;
  weight: number;
  beta: number;
  subfactors: ContentSubfactorDef[];
  evidenceSummary: string;
}

export interface ContentParameterResult {
  id: number;
  code: string;
  name: string;
  weight: number;
  beta: number;
  rating: number;
  points: number;
  maxPoints: number;
  confidence: number;
  subfactors: ContentSubfactorResult[];
  lowestSubfactor: string;
  isObserved: boolean;
  isRenormalized?: boolean;
}

export interface CriticalCapResult {
  cap: number;
  reason: string;
  triggered: boolean;
}

export interface ActionableSuggestion {
  id: string;
  title: string;
  description: string;
  parameterId: number;
  subfactorCode: string;
  estimatedGain: number;
  effort: EffortTier;
  concreteRewrite?: {
    type: 'hooks' | 'caption' | 'cta' | 'technical';
    variants?: string[];
    fullText?: string;
    tags?: string[];
  };
}

export interface QualityScoreResult {
  score: number;
  pointsTotal: number;
  maxObservablePoints: number;
  confidence: number;
  parameterScores: Record<number, number>;
  parameterRatings: Record<number, number>;
  parameters: ContentParameterResult[];
  capsTriggered: CriticalCapResult[];
}

export interface PerformanceScoreResult {
  score: number;
  isAvailable: boolean;
  confidence: number;
  gatedReason?: string;
  zScores: {
    engagement: number;
    views: number;
    retention?: number | null;
    commentQuality?: number;
  };
  subfactorRatings: {
    engagement: number;
    views: number;
    retention: number | null;
    commentQuality: number;
  };
  statusMessage: string;
}

// -------------------------------------------------------------
// Overall Score Data (Combined Engine Output)
// -------------------------------------------------------------

export interface ContentScoreData {
  contentScore: number; // Overall Score (0..100 scale)
  rawScore: number; // Raw weighted sum (0..100)
  verdictBadge: SinglePostVerdictBadge;
  archetypeTier: SinglePostArchetypeTier;
  telemetry: SinglePostTelemetry;
  parameters: SinglePostParameterResult[];
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

  // Editorial Callouts & Rewrites
  pros: Array<{
    title: string;
    rating: number;
    parameter: string;
    evidence: ContentSubfactorEvidence;
  }>;
  cons: Array<{
    title: string;
    rating: number;
    parameter: string;
    evidence: ContentSubfactorEvidence;
  }>;
  suggestions: ActionableSuggestion[];
  item: UnifiedContentItem;

  // Compatibility Bridges for Existing Panels
  qualityScore: number;
  performanceScore: number | null;
  verdict: ContentRatingVerdict;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  qualityConfidence: number;
  performanceConfidence: number | null;
  dataTier: DataTier;
  isQualityOnly: boolean;
  isSevereSafetyFlagged?: boolean;
  qualityBreakdown: QualityScoreResult;
  performanceBreakdown?: PerformanceScoreResult;
}
