import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CssInspectorCompanion } from '@/shared';

export const metadata: Metadata = {
  metadataBase: new URL('https://gabru.app'),
  title: {
    default: 'Gabru — Aesthetic & Visual Intelligence Studio',
    template: '%s | Gabru',
  },
  description:
    'Visual analysis for outfit tailoring, facial proportions, social media content, and traditional palmistry.',
  keywords: [
    'Gabru',
    'Style Analysis',
    'Fit Check',
    'Facial Proportions',
    'Content Rating',
    'Hand Reading',
    'Biometrics',
    'Aesthetic Score',
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
    url: 'https://gabru.app',
    siteName: 'Gabru Studio',
    title: 'Gabru — Aesthetic & Visual Intelligence Studio',
    description:
      'Instant, private visual analysis for outfit tailoring, facial proportions, social media content, and traditional palmistry.',
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
    title: 'Gabru — Aesthetic & Visual Intelligence Studio',
    description:
      'Instant, private visual analysis for outfit tailoring, facial proportions, social media content, and traditional palmistry.',
    images: ['/hero_fashion_mosaic.jpg'],
  },
  alternates: {
    canonical: 'https://gabru.app',
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
