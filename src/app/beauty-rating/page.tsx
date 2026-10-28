'use client';

/**
 * GABRU — BEAUTY RATING ROUTE ENTRYPOINT
 * 
 * Delegates to the modular BeautyRatingFeaturePage.
 */

import BeautyRatingFeaturePage from '@/features/facial-beauty/pages/BeautyRatingFeaturePage';

export { BEAUTY_PARAMETERS, FRAMEWORK_LIMITS } from '@/features/facial-beauty/constants/FacialBeautyConstants';
export type { BeautyParameterDef, BeautySubfactor } from '@/features/facial-beauty/types/FacialBeautyTypes';

export default function BeautyRatingPage() {
  return <BeautyRatingFeaturePage />;
}
