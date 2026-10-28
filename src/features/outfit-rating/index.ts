/**
 * GABRU — OUTFIT RATING FEATURE MODULE BARREL EXPORT
 */

// Page
export { default as FitCheckFeaturePage } from './pages/FitCheckFeaturePage';

// Components
export { FitCheckHeroStudio, type FitCheckHeroStudioProps } from './components/FitCheckHeroStudio';
export { FitCheckParametersGrid, type FitCheckParametersGridProps } from './components/FitCheckParametersGrid';
export { FitCheckAboutSection } from './components/FitCheckAboutSection';
export { FitCheckShareModal, type FitCheckShareModalProps } from './components/FitCheckShareModal';

// Services
export { calculatePhotoScore } from './services/OutfitScoringEngine';
export { detectPose, getPoseLandmarker } from './services/PoseLandmarksService';

// Constants
export { OUTFIT_PARAMETERS, OUTFIT_CARD_BACKGROUNDS } from './constants/OutfitRatingConstants';

// Types
export type {
  OutfitScoreData,
  ParameterDef,
  ParameterRatingDetail,
  SubfactorDetail,
  LandmarkPoint,
} from './types/OutfitRatingTypes';

// Utilities
export { drawOutfitSocialCard } from './utils/OutfitShareCardUtil';
