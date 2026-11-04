'use client';

import React from 'react';

/**
 * GABRU — NEOCLASSICAL DIVINE PROPORTIONS & GOLDEN RATIO (φ) BLUEPRINT
 * 
 * Elegant Renaissance geometric framework based on Leonardo da Vinci's
 * facial thirds and fifths, Golden Ratio logarithmic spiral, and bilateral symmetry.
 * Zero medical x-ray teeth or bones; pure artistic neoclassical mathematical architecture.
 */
export function BeautySkeleton({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`studio-blueprint-vector beauty-blueprint ${className}`}
      viewBox="0 0 1200 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Subtle geometric dot grid */}
        <pattern id="beauty-sacred-dots" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="18" cy="18" r="0.8" fill="currentColor" fillOpacity="0.1" />
        </pattern>
        <linearGradient id="beauty-gold-grad" x1="300" y1="200" x2="900" y2="700" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="beauty-violet-grad" x1="200" y1="100" x2="1000" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 1. Sacred Dot Matrix Background */}
      <rect width="1200" height="900" fill="url(#beauty-sacred-dots)" />

      {/* 2. Outer Architectural Frame & Corner Calipers */}
      <rect x="50" y="50" width="1100" height="800" rx="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="6 6" />

      {/* 3. Central Bilateral Symmetry (Sagittal Axis) */}
      <line x1="600" y1="60" x2="600" y2="840" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.24" strokeDasharray="5 4" />

      {/* 4. The Golden Spiral (Divine Ratio φ ≈ 1.618 Arc Sweep) */}
      <path
        d="M 600 450 A 30 30 0 0 1 630 480 A 60 60 0 0 1 570 540 A 120 120 0 0 1 450 420 A 240 240 0 0 1 690 180 A 440 440 0 0 1 1030 620"
        stroke="url(#beauty-gold-grad)"
        strokeWidth="1.8"
        strokeOpacity="0.45"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* 5. Leonardo da Vinci Neoclassical Facial Thirds (Horizontal Bands) */}
      {/* Trichion (Hairline Axis) */}
      <line x1="340" y1="210" x2="860" y2="210" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.18" />
      <text x="325" y="214" fill="currentColor" fillOpacity="0.38" fontSize="10" fontFamily="monospace" textAnchor="end">TRICHION • HAIRLINE</text>

      {/* Glabella / Brow Ridge Axis */}
      <line x1="300" y1="330" x2="900" y2="330" stroke="url(#beauty-gold-grad)" strokeWidth="1.3" strokeOpacity="0.4" />
      <text x="325" y="334" fill="currentColor" fillOpacity="0.55" fontSize="10" fontFamily="monospace" textAnchor="end">GLABELLA • UPPER THIRD (1/3)</text>

      {/* Inter-pupillary Baseline & Canthal Tilt Vector */}
      <line x1="360" y1="385" x2="840" y2="385" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="2 2" />
      <path d="M 460 390 L 530 380 M 670 380 L 740 390" stroke="url(#beauty-violet-grad)" strokeWidth="1.8" />
      <text x="600" y="375" fill="currentColor" fillOpacity="0.45" fontSize="9.5" fontFamily="monospace" textAnchor="middle">CANTHAL TILT: +4.8° POSITIVE OBLIQUE</text>

      {/* Subnasale (Base of Nose Axis) */}
      <line x1="320" y1="490" x2="880" y2="490" stroke="url(#beauty-gold-grad)" strokeWidth="1.3" strokeOpacity="0.4" />
      <text x="325" y="494" fill="currentColor" fillOpacity="0.55" fontSize="10" fontFamily="monospace" textAnchor="end">SUBNASALE • MID THIRD (1/3)</text>

      {/* Stomion (Lip Oral Commissure Axis) */}
      <line x1="420" y1="565" x2="780" y2="565" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.18" />
      <text x="325" y="569" fill="currentColor" fillOpacity="0.35" fontSize="10" fontFamily="monospace" textAnchor="end">STOMION • ORAL COMMISSURE</text>

      {/* Menton / Gnathion (Lowest Chin Axis) */}
      <line x1="340" y1="670" x2="860" y2="670" stroke="url(#beauty-gold-grad)" strokeWidth="1.3" strokeOpacity="0.4" />
      <text x="325" y="674" fill="currentColor" fillOpacity="0.55" fontSize="10" fontFamily="monospace" textAnchor="end">MENTON • LOWER THIRD (1/3)</text>

      {/* 6. Neoclassical Facial Fifths (Vertical Equal Slices) */}
      <line x1="380" y1="180" x2="380" y2="700" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="4 4" />
      <line x1="490" y1="180" x2="490" y2="700" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 4" />
      <line x1="710" y1="180" x2="710" y2="700" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="4 4" />
      <line x1="820" y1="180" x2="820" y2="700" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="4 4" />

      {/* Top Fifths Annotation Brackets */}
      <text x="435" y="165" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace" textAnchor="middle">1/5 LATERAL</text>
      <text x="545" y="165" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace" textAnchor="middle">1/5 OCULAR</text>
      <text x="600" y="165" fill="currentColor" fillOpacity="0.5" fontSize="9" fontFamily="monospace" textAnchor="middle">1/5 NASAL (φ)</text>
      <text x="655" y="165" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace" textAnchor="middle">1/5 OCULAR</text>
      <text x="765" y="165" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace" textAnchor="middle">1/5 LATERAL</text>

      {/* 7. Golden Ratio Caliper Triangle & Harmonic Arcs */}
      <circle cx="600" cy="440" r="230" stroke="url(#beauty-gold-grad)" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="8 6" />
      <circle cx="600" cy="440" r="142" stroke="url(#beauty-gold-grad)" strokeWidth="1" strokeOpacity="0.28" />
      <circle cx="600" cy="440" r="88" stroke="url(#beauty-gold-grad)" strokeWidth="1" strokeOpacity="0.35" />

      {/* Divine Proportion Triangle (Hairline -> Chin -> Zygoma) */}
      <polygon
        points="600,210 780,440 600,670 420,440"
        stroke="url(#beauty-violet-grad)"
        strokeWidth="1.2"
        strokeOpacity="0.25"
        fill="none"
      />

      {/* 8. Technical Engineering Inscriptions & Mathematical Formulas */}
      <g transform="translate(70, 90)">
        <text x="0" y="0" fill="currentColor" fillOpacity="0.7" fontSize="12.5" fontWeight="800" letterSpacing="0.08em">DIVINE PROPORTIONS MATRIX (φ ≈ 1.618)</text>
        <text x="0" y="16" fill="currentColor" fillOpacity="0.38" fontSize="10" fontFamily="monospace">NEOCLASSICAL THIRDS &amp; BILATERAL SYMMETRY HARMONY</text>
        <text x="0" y="32" fill="currentColor" fillOpacity="0.3" fontSize="9" fontFamily="monospace">a/b = (a+b)/a = 1.6180339887...</text>
      </g>

      <g transform="translate(1130, 90)">
        <text x="0" y="0" fill="currentColor" fillOpacity="0.7" fontSize="12.5" fontWeight="800" letterSpacing="0.08em" textAnchor="end">CRANIOFACIAL CANON: v2.4</text>
        <text x="0" y="16" fill="currentColor" fillOpacity="0.38" fontSize="10" fontFamily="monospace" textAnchor="end">LANDMARK CONFIDENCE: 99.4%</text>
      </g>
    </svg>
  );
}

