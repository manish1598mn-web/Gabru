import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CssInspectorCompanion } from '@/shared';

export const metadata: Metadata = {
  title: 'Gabru — Aesthetic & Visual Intelligence Studio',
  description:
    'Instant, private visual analysis for outfit tailoring, facial proportions, social media content, and traditional palmistry.',
  keywords: ['Gabru', 'Style Analysis', 'Fit Check', 'Facial Proportions', 'Content Rating', 'Hand Reading'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
