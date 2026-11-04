'use client';

import React from 'react';

export interface GabruLogoIconProps {
  size?: number;
  className?: string;
  idPrefix?: string;
}

/**
 * GABRU — BESPOKE "G-OPTIC" BRAND EMBLEM
 * 
 * Dynamic architectural monogram "G" intertwined with an aesthetic optical
 * diamond spark reticle. Expresses visual intelligence, precision tailoring,
 * and celebratory entertainment energy.
 */
export const GabruLogoIcon: React.FC<GabruLogoIconProps> = ({
  size = 20,
  className = '',
  idPrefix = 'gabru-logo',
}) => {
  const gradId = `${idPrefix}-grad`;
  const sparkGradId = `${idPrefix}-spark-grad`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`gabru-brand-emblem ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id={sparkGradId} x1="16" y1="2" x2="28" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Outer Continuous Precision "G" Loop */}
      <path
        d="M 23 9.5
           C 20.8 6.5 17.5 5 14 5
           C 8.5 5 4 9.5 4 16
           C 4 22.5 8.5 27 15 27
           C 21.5 27 26 23 26 17
           L 26 16
           L 15 16
           M 15 16
           L 26 16"
        stroke={`url(#${gradId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Optical Precision Diamond Spark / Reticle Accent (Top Right) */}
      <path
        d="M 23 3 L 24.5 6 L 27.5 7.5 L 24.5 9 L 23 12 L 21.5 9 L 18.5 7.5 L 21.5 6 Z"
        fill={`url(#${sparkGradId})`}
      />

      {/* Central Visual Focus Dot */}
      <circle cx="15" cy="16" r="2" fill="#ffffff" />
    </svg>
  );
};

