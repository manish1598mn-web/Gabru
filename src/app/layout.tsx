import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CssInspectorCompanion } from '@/shared';

export const metadata: Metadata = {
  metadataBase: new URL('https://gabru.vercel.app'),
  title: {
    default: 'Gabru — AI Outfit Rater, Face Beauty & Palm Reading Studio',
    template: '%s | Gabru',
  },
  description:
    'Free AI visual analysis studio. Instant, private evaluation for outfit tailoring and fit check, facial beauty and golden ratio proportions, social media content rating, and palmistry line reading.',
  keywords: [
    'Gabru',
    'AI Outfit Rater',
    'Fit Check AI',
    'Rate My Outfit',
    'Outfit Scoring Test',
    'Fashion AI Analyzer',
    'Face Beauty Calculator',
    'Rate My Face AI',
    'Golden Ratio Face Test',
    'Facial Symmetry Test Online',
    'Face Attractiveness Test',
    'Online Palm Reading',
    'Palmistry Line Reader',
    'Free Palm Scan AI',
    'Life Line Reading',
    'Social Media Content Rater',
    'Viral Post Predictor',
    'Instagram Post Rater',
    'Biometric Style Intelligence',
    'Aesthetic Visual Score',
  ],
  authors: [{ name: 'Gabru Studio' }],
  creator: 'Gabru Studio',
  publisher: 'Gabru Studio',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gabru.vercel.app',
    siteName: 'Gabru Studio',
    title: 'Gabru — AI Outfit Rater, Face Beauty & Palm Reading Studio',
    description:
      'Free AI visual analysis studio. Instant, private evaluation for outfit tailoring and fit check, facial beauty and golden ratio proportions, social media content rating, and palmistry line reading.',
    images: [
      {
        url: '/hero_fashion_mosaic.jpg',
        width: 1200,
        height: 630,
        alt: 'Gabru Visual Intelligence Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gabru — AI Outfit Rater, Face Beauty & Palm Reading Studio',
    description:
      'Free AI visual analysis studio. Instant, private evaluation for outfit tailoring and fit check, facial beauty and golden ratio proportions, social media content rating, and palmistry line reading.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  alternates: {
    canonical: 'https://gabru.vercel.app',
  },
  verification: {
    google: [
      '-X7HAURLF9GmMD8nXVhAvYAEWbA4mGfyEkaoPXIJ3Ew',
      'j9D5_0jqiiuFQDykjHb5UhVSd2mpOujDeqOlm3Ktb94',
      'UbGBsiwaVrXYGzC5XJCp-BxyS-x-R0qKgO2IRp0GXWA',
    ],
  },
};


export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Structured Data / WebApplication Rich Snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Gabru',
              alternateName: 'Gabru AI Studio',
              url: 'https://gabru.vercel.app',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              description:
                'Free AI visual analysis studio for outfit fit check, facial golden ratio beauty scoring, social media content rating, and traditional palm reading.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'AI Outfit Rater and Fit Check',
                'Facial Beauty and Golden Ratio Symmetry Calculator',
                'Social Media Viral Post Engagement Rater',
                'Interactive Palm Reading and Line Analyzer',
              ],
            }),
          }}
        />
        <meta name="google-site-verification" content="-X7HAURLF9GmMD8nXVhAvYAEWbA4mGfyEkaoPXIJ3Ew" />
        <meta name="google-site-verification" content="j9D5_0jqiiuFQDykjHb5UhVSd2mpOujDeqOlm3Ktb94" />
        <meta name="google-site-verification" content="UbGBsiwaVrXYGzC5XJCp-BxyS-x-R0qKgO2IRp0GXWA" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('gabru-theme');var theme=stored==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);document.documentElement.classList.add(theme);var meta=document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',theme==='light'?'#f8fafc':'#09090b');}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body id="gabru-root">
        {children}
        {process.env.NODE_ENV === 'development' && <CssInspectorCompanion />}
      </body>
    </html>
  );
}
