/**
 * GABRU — FACIAL BEAUTY TYPES
 * 
 * Canonical type definitions for the 8-parameter facial attractiveness
 * evaluation framework, landmark geometry, and score assemblies.
 */

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

export type EvidenceLevel = 'Strong' | 'Moderate';

export interface BeautySubfactor {
  name: string;
  code?: string;
  sharePct?: number; // e.g. 58 for 58%
  weight: number;    // points allocation within parameter
  whatItChecks: string;
  description?: string; // alias for whatItChecks
  score?: number;    // evaluated points
}

export interface BeautyParameterDef {
  id: number;
  code: string;
  name: string;
  weight: number;    // max points on 100 pts scale
  whatItMeasures: string;
  evidence: EvidenceLevel;
  subfactors: BeautySubfactor[];
}

export interface ParameterEngineConfig {
  id: number;
  code: string;
  name: string;
  weight: number;
  evidence: EvidenceLevel;
  betaPrior: number; // Bayesian prior pulling weight
}

export interface FactorInput {
  rawRating: number; // 0.0 - 10.0
  sharePct?: number; // percentage of parameter weight (e.g. 58)
  weight?: number;   // explicit points within parameter
  V?: number;        // visibility multiplier (0.0 - 1.0)
  note?: string;
  fixAction?: string;
}

export interface EngineRunResult {
  paramId: number;
  paramCode: string;
  maxWeight: number;
  V: number;                    // composite visibility factor (0.0 to 1.0)
  subfactors: Record<string, { raw: number; adjusted: number; weight: number; V: number; note?: string; fixAction?: string }>;
  weightedRating: number;       // rating on 0.0 - 10.0 scale
  finalPoints: number;          // points awarded within maxWeight
  confidence: number;           // confidence score (0.0 - 1.0)
  topLever?: { action: string; gainPts: number; currentRating: number; targetRating: number };
}

export interface ScoreCalculationInput {
  ratings: Record<number, number>; // parameter id -> rating (0.0 to 10.0)
  hasSideProfilePhoto?: boolean;    // true if side photo is present
  customSubfactorScores?: Record<string, number>;
  engineResults?: Record<string, EngineRunResult | null>;
}

export interface ScoreCalculationResult {
  faceScore: number;               // 0 to 100
  faceIndex: number;               // 0.0 to 10.0 (faceScore / 10)
  verdict: string;
  verdictDescription: string;
  parameterScores: Record<number, number>; // points allocated per parameter
  parameterRatings: Record<number, number>; // original 0 to 10 ratings
  subfactorScores: Record<string, number>;
  isRenormalised: boolean;
  renormalisationFactor: number;
  excludedWeight: number;
  visibleWeight: number;
  confidence?: number;
  presentationalScore?: number;
  structuralScore?: number;
  capsTriggered?: string[];
  topLevers?: Array<{ lever: string; gainPts: number; currentRating?: number; targetRating?: number }>;
  parameterConfidences?: Record<number, number>;
  subfactorRatings?: Record<string, { raw: number; adjusted: number; weight: number; V: number; note?: string; fixAction?: string }>;
}

export interface DimorphismNorms {
  mean: number;
  sd: number;
}

export interface FacialEvaluationOptions {
  dimorphismRef?: 'F-typical' | 'M-typical' | 'skip';
  hasSideProfilePhoto?: boolean;
  smilePhotoProvided?: boolean;
}

export interface Phase3Metrics {
  skin: {
    deltaE2000: number;
    blemishPct: number;
    specularPct: number;
    underEyeDeltaL: number;
    vitalityTier: string;
  };
  proportions: {
    thirdsShares: [number, number, number];
    thirdsDev: number;
    goldenRatios: Array<{ id: string; name: string; value: number; target: number; adherence: number }>;
    harmonyRatios: Array<{ id: string; name: string; value: number; band: string; rating: number }>;
  };
  expression: {
    smileIntensityPct: number;
    eyeCrinkleAU6Pct: number;
    gazeDevDeg: number;
    isDuchenne: boolean;
    isSmiling: boolean;
    tensionState: string;
  };
  averageness: {
    procrustesDistance: number;
    shapeZ: number;
    sizeRatios: Array<{ name: string; value: number; z: number; flagged: boolean }>;
  };
}

export interface Phase4Metrics {
  symmetry: {
    meanAsymmetryPct: number;
    symmetryIndex: number;
    isFilterSuspected: boolean;
    subfactors: Array<{ id: string; name: string; ah: number; av?: number; rating: number; note: string }>;
  };
  grooming: {
    hairScore: number;
    browScore: number;
    stylingScore: number;
    groomingTier: string;
    subfactors: Array<{ id: string; name: string; rating: number; status: string; note: string }>;
  };
  dimorphism: {
    referenceType: 'skip' | 'M-typical' | 'F-typical';
    isRenormalised: boolean;
    features: Array<{ id: string; name: string; zScore: number; penalty: number; note: string }>;
  };
  features: {
    canthalTiltDeg: number;
    fissureRatio: number;
    nasalLengthRatio: number;
    nasalWidthRatio: number;
    mouthWidthRatio: number;
    lipFullnessRatio: number;
    jawContourRatio: number;
    subfactors: Array<{ id: string; name: string; rating: number; note: string; isProtectedByRuleA4: boolean }>;
  };
}

export interface CompleteFacialAnalysisResult extends ScoreCalculationResult {
  engineResults: Record<string, EngineRunResult | null>;
  colorPalette: {
    skinTone: string;
    lipTone: string;
    undertone: string;
    vitalityLevel: string;
  };
  metrics: {
    symmetryIndex: number;
    goldenRatioAdherence: number;
    facialThirdsBalance: string;
    facialFifthsBalance: string;
    dimorphismType: string;
    canthalTiltDeg: number;
    aspectRatio: number;
    procrustesDistance: number;
    phase3?: Phase3Metrics;
    phase4?: Phase4Metrics;
  };
  intakeReport: {
    faceDetected: boolean;
    detectedCount: number;
    yawDeg: number;
    pitchDeg: number;
    rollDeg: number;
    ipdPx: number;
    notes: string[];
    isFilteredOrMirrored: boolean;
  };
}

export interface BiometricExtractionResult {
  phase3: Phase3Metrics;
  phase4: Phase4Metrics;
  palette: {
    skinTone: string;
    lipTone: string;
    undertone: string;
    vitalityLevel: string;
  };
  engineFactorInputs: Record<string, Record<string, FactorInput>>;
}
