'use client';

import React from 'react';

/**
 * GABRU — SARTORIAL ANTHROPOMETRY & HAUTE COUTURE BLUEPRINT
 * 
 * Elegant, architectural pattern-making and 8-head canonical proportion
 * vector backdrop. Zero medical/x-ray bones; 100% fine sartorial engineering.
 */
export function FitCheckSkeleton({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`studio-blueprint-vector fit-check-blueprint ${className}`}
      viewBox="0 0 1200 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Subtle grid pattern */}
        <pattern id="fit-atelier-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.07" />
          <circle cx="40" cy="40" r="1" fill="currentColor" fillOpacity="0.12" />
        </pattern>
        <linearGradient id="fit-accent-grad" x1="200" y1="100" x2="1000" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--studio-bp-accent, #a855f7)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--studio-bp-cyan, #38bdf8)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* 1. Atelier Cutting Mat Subgrid */}
      <rect width="1200" height="900" fill="url(#fit-atelier-grid)" />

      {/* 2. Outer Technical Border & Coordinate Stamp */}
      <rect x="40" y="40" width="1120" height="820" rx="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="8 8" />
      <circle cx="40" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="40" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />

      {/* 3. Central Sagittal Axis (True Vertical) */}
      <line x1="600" y1="50" x2="600" y2="850" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.22" strokeDasharray="6 4" />

      {/* 4. 8-Head Canonical Proportion Guidelines */}
      {/* 1H: Crown & Vertex */}
      <line x1="420" y1="110" x2="780" y2="110" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.16" />
      <text x="405" y="114" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">1H • VERTEX</text>

      {/* 2H: Chin & Collarband */}
      <line x1="440" y1="195" x2="760" y2="195" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.16" />
      <text x="405" y="199" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">2H • COLLAR</text>

      {/* 3H: Acromion / Shoulder Baseline & Slope Angle */}
      <line x1="320" y1="245" x2="880" y2="245" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.28" />
      <path d="M 360 262 L 600 235 L 840 262" stroke="url(#fit-accent-grad)" strokeWidth="1.8" fill="none" />
      <text x="405" y="249" fill="currentColor" fillOpacity="0.45" fontSize="10" fontFamily="monospace" textAnchor="end">3H • SHOULDER DROP 22°</text>

      {/* 4H: Sternum & Chest Axis */}
      <line x1="380" y1="355" x2="820" y2="355" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.18" />
      <text x="405" y="359" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">4H • STERNUM / CHEST</text>

      {/* 5H: True Waist & Belt Pivot (Golden Ratio Caliper Zone) */}
      <line x1="410" y1="455" x2="790" y2="455" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <rect x="475" y="445" width="250" height="20" rx="4" stroke="url(#fit-accent-grad)" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeDasharray="3 3" />
      <text x="405" y="459" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="monospace" textAnchor="end">5H • TRUE WAIST φ 1.618</text>

      {/* 6H: High Hip & Crotch Axis */}
      <line x1="390" y1="550" x2="810" y2="550" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.18" />
      <text x="405" y="554" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">6H • HIP / INSEAM</text>

      {/* 7H: Mid-Thigh & Knee Break (Patella) */}
      <line x1="440" y1="670" x2="760" y2="670" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.16" />
      <text x="405" y="674" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">7H • PATELLA BREAK</text>

      {/* 8H: Hem Break & Floor Level */}
      <line x1="450" y1="790" x2="750" y2="790" stroke="currentColor" strokeWidth="1" strokeOpacity="0.24" />
      <text x="405" y="794" fill="currentColor" fillOpacity="0.4" fontSize="10" fontFamily="monospace" textAnchor="end">8H • ANKLE HEM BREAK</text>

      {/* 5. Haute Couture Tailoring Silhouette Vectors (Male & Female Draping Lines) */}
      {/* Outer Silhouette Drape (Jacket & Trouser Contour) */}
      <path
        d="M 520 235 C 470 240, 370 260, 360 270 C 355 350, 420 440, 440 455 C 430 520, 410 650, 435 790 L 515 790 L 525 550 L 600 550 L 675 550 L 685 790 L 765 790 C 790 650, 770 520, 760 455 C 780 440, 845 350, 840 270 C 830 260, 730 240, 680 235 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.2"
        fill="none"
      />

      {/* Lapel Gorge Lines & Button Stance */}
      <path d="M 550 235 L 600 390 L 650 235" stroke="url(#fit-accent-grad)" strokeWidth="1.4" strokeOpacity="0.45" fill="none" />
      <circle cx="600" cy="410" r="3" fill="currentColor" fillOpacity="0.4" />
      <circle cx="600" cy="445" r="3" fill="currentColor" fillOpacity="0.4" />

      {/* Sartorial Caliper Dimensions & Ratio Brackets */}
      {/* Shoulder Width Caliper */}
      <line x1="360" y1="215" x2="840" y2="215" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="360" y1="208" x2="360" y2="222" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="840" y1="208" x2="840" y2="222" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <text x="600" y="210" fill="currentColor" fillOpacity="0.5" fontSize="10.5" fontFamily="monospace" textAnchor="middle">SHOULDER SPAN • ACROMIAL RATIO</text>

      {/* Waist Taper Caliper */}
      <path d="M 460 455 L 430 455 M 740 455 L 770 455" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <text x="600" y="474" fill="currentColor" fillOpacity="0.45" fontSize="10" fontFamily="monospace" textAnchor="middle">WAIST-TO-HIP DROP: 7.2" DROP-INDEX</text>

      {/* Golden Section Spiral (Torso Harmony Curve) */}
      <path
        d="M 600 455 C 680 455, 740 400, 740 330 C 740 240, 660 170, 560 170 C 430 170, 330 270, 330 420 C 330 600, 460 740, 630 740"
        stroke="url(#fit-accent-grad)"
        strokeWidth="1.2"
        strokeOpacity="0.25"
        strokeDasharray="4 4"
        fill="none"
      />

      {/* 6. Technical Engineering HUD Labels */}
      <g transform="translate(60, 80)">
        <text x="0" y="0" fill="currentColor" fillOpacity="0.6" fontSize="12" fontWeight="700" letterSpacing="0.08em">SARTORIAL ANTHROPOMETRY SYSTEM</text>
        <text x="0" y="16" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace">CANONICAL 8-HEAD PROPORTION ARCHITECTURE</text>
      </g>

      <g transform="translate(1140, 80)">
        <text x="0" y="0" fill="currentColor" fillOpacity="0.6" fontSize="12" fontWeight="700" letterSpacing="0.08em" textAnchor="end">TAILORING MATRIX: v2.4</text>
        <text x="0" y="16" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">CALIPER TOLERANCE: ±0.05</text>
      </g>

      {/* Corner Registration Targets */}
      <g transform="translate(80, 820)" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25">
        <circle cx="0" cy="0" r="14" fill="none" />
        <line x1="-18" y1="0" x2="18" y2="0" />
        <line x1="0" y1="-18" x2="0" y2="18" />
        <text x="24" y="4" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace">DATUM 0,0</text>
      </g>
    </svg>
  );
}

