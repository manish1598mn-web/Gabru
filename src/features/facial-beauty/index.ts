/**
 * GABRU — FACIAL BEAUTY FEATURE BARREL
 *
 * Unified public entry point for the Facial Beauty & Attractiveness feature module.
 */

// Pages
export { default as BeautyRatingFeaturePage } from './pages/BeautyRatingFeaturePage';

// Components
export { FacialBeautyHeroStudio } from './components/FacialBeautyHeroStudio';
export { FacialBeautyScorecard } from './components/FacialBeautyScorecard';
export { FacialDeepDiveSection } from './components/FacialDeepDiveSection';
export { FacialBeautyAboutSection } from './components/FacialBeautyAboutSection';
export { FacialMethodologyModal } from './components/FacialMethodologyModal';
export { FacialShareModal } from './components/FacialShareModal';

// Diagnostic Tabs
export { SkinDiagnosticTab } from './components/diagnostics/SkinDiagnosticTab';
export { EyeRegionDiagnosticTab } from './components/diagnostics/EyeRegionDiagnosticTab';
export { HarmonyDiagnosticTab } from './components/diagnostics/HarmonyDiagnosticTab';
export { ProportionsDiagnosticTab } from './components/diagnostics/ProportionsDiagnosticTab';
export { ExpressionDiagnosticTab } from './components/diagnostics/ExpressionDiagnosticTab';
export { GroomingDiagnosticTab } from './components/diagnostics/GroomingDiagnosticTab';
export { FeaturesDiagnosticTab } from './components/diagnostics/FeaturesDiagnosticTab';
export { SymmetryDiagnosticTab } from './components/diagnostics/SymmetryDiagnosticTab';
export { AveragenessDiagnosticTab } from './components/diagnostics/AveragenessDiagnosticTab';
export { JawChinDiagnosticTab } from './components/diagnostics/JawChinDiagnosticTab';
export { DimorphismDiagnosticTab } from './components/diagnostics/DimorphismDiagnosticTab';
export { NeckPostureDiagnosticTab } from './components/diagnostics/NeckPostureDiagnosticTab';

// Services
export {
  getFaceLandmarker,
  detectFaceAndLandmarks,
  extractCanonicalLandmarks,
  extractHeadEulerAngles,
  createRollNormalisedCanvas,
} from './services/FaceLandmarksService';

export {
  calculateBeautyScore,
  evaluateFacialBiometrics,
  extractBiometricFeaturesFromCanvas,
  assembleFinalBeautyScore,
  samplePatchLab,
  computeProcrustesShapeDistance,
  runEngine,
} from './services/FacialScoringEngine';

// Constants
export {
  BEAUTY_PARAMETERS,
  FRAMEWORK_LIMITS,
  BEAUTY_CARD_BACKGROUNDS,
  PARAM_TO_TAB,
  PHI,
  BAYESIAN_PRIOR,
  ENGINE_CONFIGS,
} from './constants/FacialBeautyConstants';

// Types
export type {
  BeautyParameterDef,
  BeautySubfactor,
  BeautyScoreData,
  DeepDiveTabKey,
  NormalizedLandmark,
  CanonicalLandmarks,
  SoftCheckReport,
  HardStopReport,
  FaceDetectionResult,
  EvidenceLevel,
  FactorInput,
  EngineRunResult,
  ScoreCalculationInput,
  ScoreCalculationResult,
  CompleteFacialAnalysisResult,
  BiometricExtractionResult,
  Phase3Metrics,
  Phase4Metrics,
  FacialEvaluationOptions,
} from './types/FacialBeautyTypes';

// Utils
export { drawBeautySocialCard } from './utils/BeautyShareCardUtil';

