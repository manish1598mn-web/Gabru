'use client';

import React from 'react';

/**
 * GABRU — SAMUDRIKA SHASTRA & CLASSICAL CHIROMANCY BLUEPRINT
 * 
 * Elegant, sacred-geometry and palmistry biometric vector backdrop.
 * Displays canonical palm quadrilateral framing, 3 primary crease line arcs
 * (Life, Head, Heart), 7 planetary mount contours, and Vedic coordinate grids.
 * Zero medical x-ray skeleton; 100% sacred architectural geometry.
 */
export function HandReadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`studio-blueprint-vector hand-blueprint ${className}`}
      viewBox="0 0 1200 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Sacred geometric subgrid */}
        <pattern id="hand-vedic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
          <circle cx="40" cy="40" r="1" fill="currentColor" fillOpacity="0.1" />
        </pattern>
        <linearGradient id="hand-accent-grad" x1="400" y1="200" x2="800" y2="700" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--studio-bp-accent, #ec4899)" stopOpacity="0.45" />
          <stop offset="50%" stopColor="var(--studio-bp-amber, #f59e0b)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--studio-bp-indigo, #6366f1)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* 1. Sacred Astrological Subgrid */}
      <rect width="1200" height="900" fill="url(#hand-vedic-grid)" />

      {/* 2. Outer Technical Border & Astrological Meridian Marks */}
      <rect x="40" y="40" width="1120" height="820" rx="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="8 8" />
      <circle cx="40" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="40" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />

      {/* 3. Central Sacred Concentric Circles (Mandala Energy Conduits) */}
      <circle cx="600" cy="500" r="280" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.1" strokeDasharray="4 6" />
      <circle cx="600" cy="500" r="200" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.12" />
      <circle cx="600" cy="500" r="120" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.14" strokeDasharray="2 4" />
      <circle cx="600" cy="500" r="40" stroke="url(#hand-accent-grad)" strokeWidth="1.2" strokeOpacity="0.4" />

      {/* 4. Canonical Palm Contour & Digit Ray Projections */}
      {/* Wrist / Rascette Base Lines */}
      <line x1="500" y1="780" x2="700" y2="780" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="510" y1="795" x2="690" y2="795" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="525" y1="810" x2="675" y2="810" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" />
      <text x="600" y="828" fill="currentColor" fillOpacity="0.35" fontSize="8" fontFamily="monospace" textAnchor="middle">RASCETTE • BRACELETS OF LIFE</text>

      {/* Palm Quadrilateral Outer Architectural Frame */}
      <path
        d="M 500 780 
           C 440 730 420 620 430 520 
           C 400 480 340 430 310 390
           C 290 360 320 330 350 350
           C 400 390 440 450 470 480
           L 480 340
           C 485 240 520 240 525 340
           L 535 320
           C 545 180 585 180 595 320
           L 605 330
           C 615 210 655 210 665 330
           L 675 380
           C 685 280 725 280 735 380
           C 745 440 755 540 750 630
           C 745 710 710 760 670 780
           Z"
        stroke="url(#hand-accent-grad)"
        strokeWidth="1.6"
        strokeOpacity="0.45"
        fill="none"
      />

      {/* 5. 3 Sacred Primary Crease Lines */}
      {/* (a) Heart Line (Ayush / Emotional Axis) */}
      <path
        d="M 740 490 C 670 480 590 470 540 410 C 525 390 515 365 510 345"
        stroke="url(#hand-accent-grad)"
        strokeWidth="2.2"
        fill="none"
      />
      <text x="755" y="494" fill="currentColor" fillOpacity="0.5" fontSize="9" fontFamily="monospace">HEART LINE (EMOTIONAL)</text>

      {/* (b) Head Line (Matru / Intellectual Axis) */}
      <path
        d="M 450 490 C 520 500 620 540 700 600"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeOpacity="0.5"
        fill="none"
      />
      <text x="715" y="605" fill="currentColor" fillOpacity="0.5" fontSize="9" fontFamily="monospace">HEAD LINE (INTELLECT)</text>

      {/* (c) Life Line (Pitru / Vitality Curve wrapping Thenar) */}
      <path
        d="M 450 485 C 490 510 530 560 530 650 C 530 710 515 750 505 775"
        stroke="url(#hand-accent-grad)"
        strokeWidth="2.4"
        fill="none"
      />
      <text x="435" y="480" fill="currentColor" fillOpacity="0.5" fontSize="9" fontFamily="monospace" textAnchor="end">LIFE LINE (VITALITY)</text>

      {/* 6. Planetary Mount Contours (7 Sacred Chakras) */}
      {/* Mount of Jupiter ♃ (Index base) */}
      <circle cx="505" cy="370" r="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="505" y="374" fill="currentColor" fillOpacity="0.45" fontSize="11" textAnchor="middle">♃</text>

      {/* Mount of Saturn ♄ (Middle base) */}
      <circle cx="565" cy="355" r="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="565" y="359" fill="currentColor" fillOpacity="0.45" fontSize="11" textAnchor="middle">♄</text>

      {/* Mount of Sun / Apollo ☉ (Ring base) */}
      <circle cx="635" cy="365" r="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="635" y="369" fill="currentColor" fillOpacity="0.45" fontSize="11" textAnchor="middle">☉</text>

      {/* Mount of Mercury ☿ (Pinky base) */}
      <circle cx="705" cy="415" r="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="705" y="419" fill="currentColor" fillOpacity="0.45" fontSize="11" textAnchor="middle">☿</text>

      {/* Mount of Venus ♀ (Thenar eminence) */}
      <circle cx="480" cy="620" r="42" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="480" y="625" fill="currentColor" fillOpacity="0.45" fontSize="13" textAnchor="middle">♀</text>

      {/* Mount of Moon ☽ (Hypothenar eminence) */}
      <circle cx="690" cy="680" r="42" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x="690" y="685" fill="currentColor" fillOpacity="0.45" fontSize="13" textAnchor="middle">☽</text>

      {/* 7. Astrological & Chiromantic HUD Corner Data */}
      <g opacity="0.4" fontSize="9" fontFamily="monospace" fill="currentColor">
        <text x="70" y="80">SYSTEM: SAMUDRIKA SHASTRA</text>
        <text x="70" y="96">CANON: 108 VEDIC LAKSHANAS</text>
        <text x="70" y="112">PROJECTION: QUADRILATERAL BIOMETRIC</text>
        
        <text x="1130" y="80" textAnchor="end">ACCURACY: BIOMETRIC SENSOR</text>
        <text x="1130" y="96" textAnchor="end">PRIMARY_CREASES: 3 (LIFE, HEAD, HEART)</text>
        <text x="1130" y="112" textAnchor="end">PLANETARY_MOUNTS: 7 CONTOURS</text>
      </g>
    </svg>
  );
}

