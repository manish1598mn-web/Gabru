import type { Metadata } from 'next';
import ContentRatingFeaturePage from '@/features/content-rating/pages/ContentRatingFeaturePage';

export const metadata: Metadata = {
  title: 'Instagram Post Rater & Viral Predictor | Social Media AI — Gabru',
  description:
    'Free social media content rater. Audit your Instagram, TikTok, and YouTube posts for hook strength, engagement velocity, bookmark utility, and comment section magnetism.',
  keywords: [
    'Instagram post rater',
    'Viral post predictor',
    'Rate my Instagram post',
    'Social media content rater',
    'TikTok hook analyzer',
    'Viral score calculator',
    'Social media post audit',
    'Content virality test',
    'Post engagement predictor',
    'Viral hook checker',
  ],
  alternates: {
    canonical: 'https://gabru.online/content-rating',
  },
  openGraph: {
    title: 'Instagram Post Rater & Viral Predictor | Social Media AI — Gabru',
    description:
      'Free social media content rater. Audit your posts for hook strength, engagement rate, and virality potential.',
    url: 'https://gabru.online/content-rating',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Post Rater & Viral Predictor | Social Media AI — Gabru',
    description:
      'Free social media content rater. Audit your posts for hook strength, engagement rate, and virality potential.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
};

export default function ContentRatingPage() {
  return <ContentRatingFeaturePage />;
}
