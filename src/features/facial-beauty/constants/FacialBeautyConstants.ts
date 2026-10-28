/**
 * GABRU — FACIAL BEAUTY CONSTANTS
 */

import type { DeepDiveTabKey } from '../types/FacialBeautyTypes';

export {
  BEAUTY_PARAMETERS,
  FRAMEWORK_LIMITS,
  ARCHETYPE_16_LANDMARKS_REF,
  DIMORPHISM_NORMS_M,
  DIMORPHISM_NORMS_F,
  ENGINE_CONFIGS,
  PENALTY_MAP,
  BAYESIAN_PRIOR,
  PHI,
} from '../services/FacialScoringEngine';

export const PARAM_TO_TAB: Record<number, DeepDiveTabKey> = {
  1: 'skin',
  2: 'proportions',
  3: 'expression',
  4: 'averageness',
  5: 'symmetry',
  6: 'grooming',
  7: 'dimorphism',
  8: 'features',
};

export const BEAUTY_CARD_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(135deg, #2b1f1a 0%, #6b3f2a 55%, #3a2418 100%)',
  2: 'linear-gradient(135deg, #2a2418 0%, #7a6228 55%, #3a2e14 100%)',
  3: 'linear-gradient(135deg, #2a1a24 0%, #7a3a5a 55%, #3a1828 100%)',
  4: 'linear-gradient(135deg, #1a2430 0%, #4a6a8a 55%, #182430 100%)',
  5: 'linear-gradient(135deg, #1a2e2e 0%, #3a8a8a 55%, #142828 100%)',
  6: 'linear-gradient(135deg, #1a2a1e 0%, #3a8a4f 55%, #142418 100%)',
  7: 'linear-gradient(135deg, #241a30 0%, #6a3a8a 55%, #1e1428 100%)',
  8: 'linear-gradient(135deg, #2a2018 0%, #8a5a2a 55%, #241a12 100%)',
};
