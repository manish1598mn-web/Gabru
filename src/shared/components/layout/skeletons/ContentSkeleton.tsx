'use client';

import React from 'react';

/**
 * GABRU — CONTENT CINEMATOGRAPHY & ALGORITHMIC HOOK BLUEPRINT
 * 
 * Elegant, architectural cinematography and algorithmic retention vector backdrop.
 * Displays 9:16 vertical safe framing, viral hook trajectory curve, audio harmonics,
 * and rule of thirds vectors. Zero x-ray look; 100% precision video intelligence.
 */
export function ContentSkeleton({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`studio-blueprint-vector content-blueprint ${className}`}
      viewBox="0 0 1200 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Fine technical grid pattern */}
        <pattern id="content-studio-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
          <circle cx="40" cy="40" r="1" fill="currentColor" fillOpacity="0.1" />
        </pattern>
        <linearGradient id="content-accent-grad" x1="300" y1="150" x2="900" y2="750" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--studio-bp-accent, #6366f1)" stopOpacity="0.45" />
          <stop offset="50%" stopColor="var(--studio-bp-cyan, #06b6d4)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--studio-bp-pink, #ec4899)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* 1. Technical Coordinate Grid */}
      <rect width="1200" height="900" fill="url(#content-studio-grid)" />

      {/* 2. Outer Technical Border & Alignment Targets */}
      <rect x="40" y="40" width="1120" height="820" rx="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="8 8" />
      <circle cx="40" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="40" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="40" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="1160" cy="860" r="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />

      {/* 3. Center 9:16 Vertical Cinematography Viewport Frame (w: 360, h: 640 centered at x: 600, y: 450) */}
      <rect x="420" y="130" width="360" height="640" rx="28" stroke="url(#content-accent-grad)" strokeWidth="1.8" strokeOpacity="0.4" />
      
      {/* 9:16 Platform Safe Zone (Top Header & Bottom Caption clearance margins) */}
      <rect x="444" y="210" width="312" height="460" rx="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.16" strokeDasharray="4 4" />
      <text x="450" y="202" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace">9:16 REELS / TIKTOK SAFE ZONE</text>
      <text x="750" y="682" fill="currentColor" fillOpacity="0.3" fontSize="8" fontFamily="monospace" textAnchor="end">CAPTION CLEARANCE • 120PX</text>

      {/* Rule of Thirds Vertical Lines */}
      <line x1="540" y1="130" x2="540" y2="770" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="2 3" />
      <line x1="660" y1="130" x2="660" y2="770" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="2 3" />
      
      {/* Rule of Thirds Horizontal Lines */}
      <line x1="420" y1="343" x2="780" y2="343" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="2 3" />
      <line x1="420" y1="556" x2="780" y2="556" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="2 3" />

      {/* Golden Ratio Center Reticle Crosshairs */}
      <circle cx="600" cy="450" r="44" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.18" />
      <circle cx="600" cy="450" r="16" stroke="url(#content-accent-grad)" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="570" y1="450" x2="630" y2="450" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="600" y1="420" x2="600" y2="480" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />

      {/* 4. Algorithmic Viewer Retention Trajectory (Left Stage x: 80 to 380) */}
      <g opacity="0.85">
        <text x="80" y="240" fill="currentColor" fillOpacity="0.55" fontSize="11" fontFamily="monospace" fontWeight="bold">VIRAL RETENTION TRAJECTORY</text>
        <text x="80" y="256" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace">0-3s Inflection • Target &gt; 70%</text>
        
        {/* Retention Axes */}
        <line x1="80" y1="420" x2="380" y2="420" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        <line x1="80" y1="280" x2="80" y2="420" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        
        {/* Retention Benchmark Baseline (Average 35%) */}
        <path d="M 80 300 Q 140 370 380 405" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" fill="none" />
        <text x="385" y="408" fill="currentColor" fillOpacity="0.25" fontSize="8" fontFamily="monospace">Median (35%)</text>

        {/* Viral High-Performance Retention Curve */}
        <path d="M 80 290 Q 130 305 210 320 T 380 340" stroke="url(#content-accent-grad)" strokeWidth="2.2" fill="none" />
        
        {/* 3s Hook Marker */}
        <circle cx="150" cy="308" r="4" fill="currentColor" fillOpacity="0.7" />
        <line x1="150" y1="308" x2="150" y2="420" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 2" />
        <text x="150" y="435" fill="currentColor" fillOpacity="0.4" fontSize="8" fontFamily="monospace" textAnchor="middle">t=3.0s</text>
      </g>

      {/* 5. Audio Harmonics & Speech Clarity Spectrum (Right Stage x: 820 to 1120) */}
      <g opacity="0.85">
        <text x="820" y="240" fill="currentColor" fillOpacity="0.55" fontSize="11" fontFamily="monospace" fontWeight="bold">SPECTRAL HARMONICS</text>
        <text x="820" y="256" fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="monospace">Speech Presence 2.5kHz - 5kHz • -14 LUFS</text>

        {/* Spectrum Waveform Bars */}
        {[
          { x: 820, h: 28 }, { x: 835, h: 42 }, { x: 850, h: 70 },
          { x: 865, h: 95 }, { x: 880, h: 120 }, { x: 895, h: 84 },
          { x: 910, h: 62 }, { x: 925, h: 105 }, { x: 940, h: 135 },
          { x: 955, h: 90 }, { x: 970, h: 48 }, { x: 985, h: 32 },
          { x: 1000, h: 56 }, { x: 1015, h: 78 }, { x: 1030, h: 44 },
          { x: 1045, h: 26 }, { x: 1060, h: 18 }
        ].map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={380 - bar.h}
            width="8"
            height={bar.h}
            rx="4"
            fill="url(#content-accent-grad)"
            fillOpacity={i >= 3 && i <= 8 ? '0.65' : '0.25'}
          />
        ))}
        <line x1="820" y1="380" x2="1080" y2="380" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        <text x="870" y="396" fill="currentColor" fillOpacity="0.4" fontSize="8" fontFamily="monospace">PRESENCE BAND</text>
      </g>

      {/* 6. Technical Engineering HUD Corner Metrics */}
      <g opacity="0.4" fontSize="9" fontFamily="monospace" fill="currentColor">
        <text x="70" y="80">CAM: SENSOR 9:16 VERTICAL</text>
        <text x="70" y="96">ASPECT: 0.5625 (1080×1920)</text>
        <text x="70" y="112">TARGET_FRAME_RATE: 60.0 FPS</text>
        
        <text x="1130" y="80" textAnchor="end">INTELLIGENCE: MULTIMODAL</text>
        <text x="1130" y="96" textAnchor="end">FRAME_ANALYSIS: 32 FPS DOWNSAMPLE</text>
        <text x="1130" y="112" textAnchor="end">AUDIO_NORM: EBU R128 (-14.0 LUFS)</text>
      </g>
    </svg>
  );
}

