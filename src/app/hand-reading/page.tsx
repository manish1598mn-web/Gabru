import type { Metadata } from 'next';
import HandReadingFeaturePage from '@/features/hand-reading/pages/HandReadingFeaturePage';

export const metadata: Metadata = {
  title: 'AI Palm Reading & Hand Line Analyzer | Free Online Palmistry — Gabru',
  description:
    'Free AI palm reading and online palmistry scan. Instant computer vision analysis of Life Line, Head Line, Heart Line, Fate Line, and planetary mounts with zero data retention.',
  keywords: [
    'AI palm reading',
    'Online palmistry',
    'Palm line reader free',
    'Free palm scan AI',
    'Life line reading',
    'Hand reading online',
    'Palmistry analyzer',
    'Heart line reading online',
    'Fate line test',
    'Vedic palmistry scan',
    'Samudrika Shastra AI',
  ],
  alternates: {
    canonical: 'https://gabru.online/hand-reading',
  },
  openGraph: {
    title: 'AI Palm Reading & Hand Line Analyzer | Free Online Palmistry — Gabru',
    description:
      'Free AI palm reading and online palmistry scan. Instant computer vision analysis of major palm lines and mounts.',
    url: 'https://gabru.online/hand-reading',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Palm Reading & Hand Line Analyzer | Free Online Palmistry — Gabru',
    description:
      'Free AI palm reading and online palmistry scan. Instant computer vision analysis of major palm lines and mounts.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
};

export default function HandReadingPage() {
  return <HandReadingFeaturePage />;
}
