/**
 * GABRU — CONTENT RATING DOMAIN TYPES
 * 
 * Strict TypeScript models for the Social Media Content Rating & Advisory Platform:
 * - 3 Data Tiers (A: Link only, B: Link + OAuth, C: Uploaded media / CSV)
 * - 10-Parameter Evidence-Gated Quality Score Rubric with Parameter-Specific Betas
 * - Empirical Creator-Baseline Performance Model (MAD-based robust z-score)
 * - Exact Delta-Gain Estimation via Engine Re-simulation
 * - Strict Evidence Gate Verification
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

// -------------------------------------------------------------
// Unified Content Schema
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
  visualSharpness: number; // 0..100 proxy
  visualBrightness: number; // 0..100 proxy
  facesDetected: number;
}

export interface TranscriptSegment {
  startSec: number;
  endSec: number;
  text: string;
}

export interface AudioAnalysisMetrics {
  integratedLufs: number; // target: -14 ± 3 LUFS
  truePeakDbfs: number;
  silenceSegmentsCount: number;
  maxDeadAirSec: number;
  speechRateWpm: number;
  voiceClarityRatio: number; // 0..1
  snrDb?: number;
  clippingShare?: number;
}

export interface UnifiedContentItem {
  id: string;
  url?: string;
  platform: ContentPlatform;
  format: ContentFormat;
  inputMode: InputMode;
  dataTier: DataTier; // Tier A, B, or C
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
// Scoring Engine & Evidence Types
// -------------------------------------------------------------

export interface ContentSubfactorEvidence {
  type: 'timestamp' | 'quote' | 'metric' | 'visual_crop';
  ref: string; // e.g. "00:00-00:04", "Caption line 1", "-11.2 LUFS"
  note: string; // e.g. "Hook delivery delayed beyond 5s window"
  confidence?: number;
}

export interface ContentPenalty {
  severity: 'minor' | 'moderate' | 'major';
  delta: number; // -1.0, -2.5, or -4.5
  evidence: ContentSubfactorEvidence;
}

export interface ContentSubfactorDef {
  code: string; // e.g. 'HK1', 'VR1', 'ST1', 'VA1', 'CP1', 'CT1', 'PF1', 'OC1', 'TM1', 'TC1'
  name: string;
  weight: number; // subfactor weight (sum = 100 within parameter)
  observableChecks: string;
  objectiveRule: string;
  visibilityByTier: {
    A: number; // 0.0, 0.5, or 1.0
    B: number;
    C: number;
  };
}

export interface ContentSubfactorResult {
  code: string;
  name: string;
  weight: number;
  rawRating: number; // 0..10
  visibility: number; // 1.0, 0.5, 0.0
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
  weight: number; // parameter weight (sum = 100 total)
  beta: number; // 0.10, 0.15 for VA, 0.20 for TC
  subfactors: ContentSubfactorDef[];
  evidenceSummary: string;
}

export interface ContentParameterResult {
  id: number;
  code: string;
  name: string;
  weight: number;
  beta: number;
  rating: number; // 0..10
  points: number; // Rating * (Weight / 10)
  maxPoints: number;
  confidence: number; // 0..1
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
  estimatedGain: number; // e.g. +1.0
  effort: EffortTier;
  concreteRewrite?: {
    type: 'hooks' | 'caption' | 'cta' | 'technical';
    variants?: string[];
    fullText?: string;
    tags?: string[];
  };
}

export interface QualityScoreResult {
  score: number; // 0..100
  pointsTotal: number;
  maxObservablePoints: number;
  confidence: number; // 0..1
  parameterScores: Record<number, number>;
  parameterRatings: Record<number, number>;
  parameters: ContentParameterResult[];
  capsTriggered: CriticalCapResult[];
}

export interface PerformanceScoreResult {
  score: number; // 0..100
  isAvailable: boolean;
  confidence: number; // 0..1
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

export interface ContentScoreData {
  contentScore: number; // 0..100 blended score
  qualityScore: number; // 0..100
  performanceScore: number | null;
  verdict: ContentRatingVerdict;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number; // 0..1
  qualityConfidence: number; // 0..1
  performanceConfidence: number | null;
  dataTier: DataTier;
  isQualityOnly: boolean;
  isSevereSafetyFlagged?: boolean;
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
  qualityBreakdown: QualityScoreResult;
  performanceBreakdown?: PerformanceScoreResult;
}
