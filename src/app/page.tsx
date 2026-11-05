import type { Metadata } from 'next';
import FitCheckFeaturePage from '@/features/outfit-rating/pages/FitCheckFeaturePage';

export { OUTFIT_PARAMETERS } from '@/features/outfit-rating/constants/OutfitRatingConstants';
export type { ParameterDef, OutfitScoreData } from '@/features/outfit-rating/types/OutfitRatingTypes';

export const metadata: Metadata = {
  title: 'AI Outfit Rater & Fit Check | Rate My Outfit Free — Gabru',
  description:
    'Free AI outfit rater and fit check studio. Upload any full-body photo for instant scoring on shoulder tailoring, silhouette proportions, color harmony, and style advice.',
  keywords: [
    'Fit check',
    'AI fit check',
    'Fit check online',
    'AI Outfit Rater',
    'Rate my outfit',
    'Rate my outfit AI',
    'OOTD rater',
    'Outfit score test',
    'AI fashion analyzer',
    'Style rater AI',
    'Drip rater',
    'Outfit proportions calculator',
  ],
  alternates: {
    canonical: 'https://gabru.online',
  },
  openGraph: {
    title: 'AI Outfit Rater & Fit Check | Rate My Outfit Free — Gabru',
    description:
      'Free AI outfit rater and fit check studio. Instant sartorial evaluation for silhouette, proportions, and tailoring.',
    url: 'https://gabru.online',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Outfit Rater & Fit Check | Rate My Outfit Free — Gabru',
    description:
      'Free AI outfit rater and fit check studio. Instant sartorial evaluation for silhouette, proportions, and tailoring.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
};

export default function GabruHomePage() {
  return <FitCheckFeaturePage />;
}
