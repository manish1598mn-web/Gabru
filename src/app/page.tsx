'use client';

/**
 * GABRU — HOME / FIT CHECK ROUTE ENTRYPOINT
 * 
 * Delegates to the modular FitCheckFeaturePage.
 */

import FitCheckFeaturePage from '@/features/outfit-rating/pages/FitCheckFeaturePage';

export { OUTFIT_PARAMETERS } from '@/features/outfit-rating/constants/OutfitRatingConstants';
export type { ParameterDef, OutfitScoreData } from '@/features/outfit-rating/types/OutfitRatingTypes';

export default function GabruHomePage() {
  return <FitCheckFeaturePage />;
}
