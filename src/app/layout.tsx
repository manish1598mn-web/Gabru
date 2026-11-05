import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CssInspectorCompanion } from '@/shared';

export const metadata: Metadata = {
  metadataBase: new URL('https://gabru.online'),
  title: {
    default: 'AI Outfit Rater — Free Fit Check & Style Score | Gabru',
    template: '%s | Gabru',
  },
  description:
    'Free AI outfit rater and fit check studio. Instant, private visual evaluation for outfit tailoring, proportions, silhouette, facial beauty harmony, and style scoring.',
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
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gabru.online',
    siteName: 'Gabru',
    title: 'AI Outfit Rater — Free Fit Check & Style Score | Gabru',
    description:
      'Free AI outfit rater and fit check studio. Instant, private visual evaluation for outfit tailoring, proportions, silhouette, facial beauty harmony, and style scoring.',
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
    title: 'AI Outfit Rater — Free Fit Check & Style Score | Gabru',
    description:
      'Free AI outfit rater and fit check studio. Instant, private visual evaluation for outfit tailoring, proportions, silhouette, facial beauty harmony, and style scoring.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  alternates: {
    canonical: 'https://gabru.online',
  },
  verification: {
    google: [
      '6JlTZypo0ARjTJVK84fZi0xTDMEOcyR4LAKVfTyeBcc',
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
              name: 'Gabru — AI Outfit Rater',
              alternateName: ['AI Outfit Rater', 'Gabru Fit Check', 'Rate My Outfit AI'],
              url: 'https://gabru.online',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              description:
                'Free AI outfit rater and fit check studio. Instant private visual evaluation for outfit tailoring, proportions, silhouette, facial beauty harmony, and style scoring.',
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
        {/* Google FAQ Schema for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is an AI Outfit Rater?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'An AI Outfit Rater analyzes photos of your outfits using computer vision and geometric body proportions to evaluate shoulder tailoring, silhouette balance, color coordination, and sartorial fit.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does Gabru AI rate my outfit?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Gabru checks your outfit across 10 sartorial parameters including shoulder seam placement, pant break, torso-to-leg proportions, and occasion alignment, providing an instant 100-point score with personalized advice.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my outfit photo private and secure?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. All biometric landmark detection and style evaluation runs 100% in your browser. Your images are never saved, stored, or uploaded to any external server.',
                  },
                },
              ],
            }),
          }}
        />
        <meta name="google-site-verification" content="6JlTZypo0ARjTJVK84fZi0xTDMEOcyR4LAKVfTyeBcc" />
        <meta name="google-site-verification" content="-X7HAURLF9GmMD8nXVhAvYAEWbA4mGfyEkaoPXIJ3Ew" />
        <meta name="google-site-verification" content="j9D5_0jqiiuFQDykjHb5UhVSd2mpOujDeqOlm3Ktb94" />
        <meta name="google-site-verification" content="UbGBsiwaVrXYGzC5XJCp-BxyS-x-R0qKgO2IRp0GXWA" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('gabru-theme');var theme=stored==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);document.documentElement.classList.add(theme);var meta=document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',theme==='light'?'#f8fafc':'#09090b');}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/icon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
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
