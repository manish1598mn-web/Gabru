/**
 * GABRU — CONTENT RATING DOMAIN TYPES
 * 
 * Strict TypeScript models for the Social Media Content Rating & Advisory Platform:
 * - Unified Multi-Platform Content Ingestion Schema (Paths A, B, and C)
 * - 10-Parameter Evidence-Gated Quality Score Rubric
 * - Empirical Creator-Baseline Performance Model (z-score distribution)
 * - Actionable Advice, Delta-Gain Estimation, and Concrete AI Rewrites
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

export type EffortTier = 'quick' | 'medium' | 'heavy';

export type ContentRatingVerdict =
  | 'Exceptional'
  | 'Strong'
  | 'Good'
  | 'Average'
  | 'Weak'
  | 'Needs Rework';

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
}

export interface CreatorBaselineStats {
  postCount: number;
  medianViews: number;
  stdDevViews?: number;
  medianLikes: number;
  medianComments: number;
  medianEngagementRate: number;
  stdDevEngagementRate: number;
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
}

export interface UnifiedContentItem {
  id: string;
  url?: string;
  platform: ContentPlatform;
  format: ContentFormat;
  inputMode: InputMode;
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
  code: string; // e.g. 'HK1', 'VL1'
  name: string;
  weight: number; // subfactor weight (sum = 100 within parameter)
  observableChecks: string;
  objectiveRule: string;
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
  notes?: string;
}

export interface ContentParameterDef {
  id: number;
  code: string;
  name: string;
  weight: number; // parameter weight (sum = 100 total)
  subfactors: ContentSubfactorDef[];
  evidenceSummary: string;
}

export interface ContentParameterResult {
  id: number;
  code: string;
  name: string;
  weight: number;
  rating: number; // 0..10
  points: number; // Rating * (Weight / 10)
  maxPoints: number;
  confidence: number; // 0..1
  subfactors: ContentSubfactorResult[];
  lowestSubfactor: string;
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
  estimatedGain: number; // e.g. +2.6
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
  parameterScores: Record<number, number>;
  parameterRatings: Record<number, number>;
  parameters: ContentParameterResult[];
  capsTriggered: CriticalCapResult[];
}

export interface PerformanceScoreResult {
  score: number; // 0..100
  isAvailable: boolean;
  engagementRate: number;
  baselineEngagementRate: number;
  zScores: {
    engagement: number;
    reach: number;
    retention?: number;
    commentQuality?: number;
  };
  subfactorRatings: {
    engagement: number;
    reach: number;
    retention: number;
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
  isQualityOnly: boolean;
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

