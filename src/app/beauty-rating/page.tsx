import type { Metadata } from 'next';
import BeautyRatingFeaturePage from '@/features/facial-beauty/pages/BeautyRatingFeaturePage';

export { BEAUTY_PARAMETERS, FRAMEWORK_LIMITS } from '@/features/facial-beauty/constants/FacialBeautyConstants';
export type { BeautyParameterDef, BeautySubfactor } from '@/features/facial-beauty/types/FacialBeautyTypes';

export const metadata: Metadata = {
  title: 'Golden Ratio Check & Face Beauty Calculator | Rate My Face AI — Gabru',
  description:
    'Free Golden Ratio check and facial symmetry test. Accurate in-browser 468-point 3D face mesh analysis for Golden Ratio phi adherence, canthal tilt, and facial harmony.',
  keywords: [
    'Golden ratio check',
    'Golden ratio face test',
    'Golden ratio calculator online',
    'Face beauty calculator',
    'Rate my face AI',
    'Facial symmetry test online',
    'Facial harmony score',
    'Canthal tilt test',
    'Face attractiveness rater',
    'Golden ratio phi test',
    'Rate my face free',
    'Golden ratio face scanner',
  ],
  alternates: {
    canonical: 'https://gabru.online/beauty-rating',
  },
  openGraph: {
    title: 'Golden Ratio Check & Face Beauty Calculator | Rate My Face AI — Gabru',
    description:
      'Free Golden Ratio check and facial symmetry test. 468-point 3D face mesh analysis with zero image uploads.',
    url: 'https://gabru.online/beauty-rating',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Ratio Check & Face Beauty Calculator | Rate My Face AI — Gabru',
    description:
      'Free Golden Ratio check and facial symmetry test. 468-point 3D face mesh analysis with zero image uploads.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
};

export default function BeautyRatingPage() {
  return <BeautyRatingFeaturePage />;
}
