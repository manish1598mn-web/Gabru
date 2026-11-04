/**
 * GABRU — FACIAL BEAUTY TYPES
 * 
 * Canonical type definitions for the 10-parameter facial attractiveness
 * evaluation framework (v2), landmark geometry, and score assemblies.
 */

import type {
  CompleteFacialAnalysisResult,
} from '../services/FacialScoringEngine';

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface CanonicalLandmarks {
  tr: NormalizedLandmark;
  g: NormalizedLandmark;
  n: NormalizedLandmark;
  sn: NormalizedLandmark;
  al_left: NormalizedLandmark;
  al_right: NormalizedLandmark;
  en_left: NormalizedLandmark;
  en_right: NormalizedLandmark;
  ex_left: NormalizedLandmark;
  ex_right: NormalizedLandmark;
  p_left: NormalizedLandmark;
  p_right: NormalizedLandmark;
  ch_left: NormalizedLandmark;
  ch_right: NormalizedLandmark;
  sto: NormalizedLandmark;
  upper_lip_top: NormalizedLandmark;
  lower_lip_bottom: NormalizedLandmark;
  gn: NormalizedLandmark;
  zy_left: NormalizedLandmark;
  zy_right: NormalizedLandmark;
  go_left: NormalizedLandmark;
  go_right: NormalizedLandmark;
  left_brow_peak: NormalizedLandmark;
  right_brow_peak: NormalizedLandmark;
  infraorbital_left: NormalizedLandmark;
  infraorbital_right: NormalizedLandmark;
  cheek_left: NormalizedLandmark;
  cheek_right: NormalizedLandmark;
  forehead_center: NormalizedLandmark;
}

export interface SoftCheckReport {
  yawDeg: number;
  pitchDeg: number;
  rollDeg: number;
  ipdPx: number;
  vYaw: number;
  vPitch: number;
  vRes: number;
  vLight: number;
  vComposite: number;
  notes: string[];
  isFilteredOrMirrored: boolean;
}

export interface HardStopReport {
  triggered: boolean;
  code?: 'NO_FACE_DETECTED' | 'LOW_RESOLUTION' | 'HEAVY_FILTER_AI';
  message?: string;
}

export interface FaceDetectionResult {
  faceDetected: boolean;
  detectedCount: number;
  hardStop: HardStopReport;
  softChecks: SoftCheckReport;
  rawLandmarks: NormalizedLandmark[];
  canonical: CanonicalLandmarks | null;
  blendshapes: Record<string, number>;
  rollCorrectedCanvas: HTMLCanvasElement | null;
  rollAngleDeg: number;
}

export type DeepDiveTabKey =
  | 'skin'
  | 'eyes'
  | 'harmony'
  | 'expression'
  | 'grooming'
  | 'features'
  | 'symmetry'
  | 'averageness'
  | 'jaw'
  | 'neck';

export interface BeautyScoreData extends CompleteFacialAnalysisResult {
  rawDetection?: FaceDetectionResult;
}

// Re-export canonical engine types from the single source of truth
export type {
  EvidenceLevel,
  BeautySubfactor,
  BeautyParameterDef,
  ParameterEngineConfig,
  FactorInput,
  EngineRunResult,
  ScoreCalculationInput,
  ScoreCalculationResult,
  BeautyPillarsBreakdown,
  DimorphismNorms,
  FacialEvaluationOptions,
  Phase3Metrics,
  Phase4Metrics,
  CompleteFacialAnalysisResult,
  BiometricExtractionResult,
} from '../services/FacialScoringEngine';
