/**
 * GABRU — FACIAL BEAUTY CONSTANTS
 * 
 * 10-Parameter Framework (v2) mappings and styling tokens.
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
  2: 'eyes',
  3: 'harmony',
  4: 'expression',
  5: 'grooming',
  6: 'features',
  7: 'symmetry',
  8: 'averageness',
  9: 'jaw',
  10: 'neck',
};

export const BEAUTY_CARD_BACKGROUNDS: Record<number, string> = {
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
