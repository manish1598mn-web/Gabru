'use client';

/**
 * GABRU — STUDIO HERO BACKDROP
 * 
 * Mode-Reactive (Dark & Light) master architectural background blueprint.
 * Renders high-precision vector engineering drawings (Neoclassical facial thirds,
 * sartorial 8-head canons, 9:16 viral cinematography, and Vedic palmistry)
 * behind each studio hero. Zero medical x-ray radiograph look; 100% pure
 * mathematical and architectural aesthetic intelligence.
 */

import React from 'react';
import { FitCheckSkeleton } from './skeletons/FitCheckSkeleton';
import { BeautySkeleton } from './skeletons/BeautySkeleton';
import { ContentSkeleton } from './skeletons/ContentSkeleton';
import { HandReadingSkeleton } from './skeletons/HandReadingSkeleton';

export type StudioBackdropType = 'fit-check' | 'beauty-rating' | 'content-rating' | 'hand-reading';

export interface StudioHeroBackdropProps {
  studio: StudioBackdropType;
  className?: string;
}

export function StudioHeroBackdrop({ studio, className = '' }: StudioHeroBackdropProps) {
  const renderSkeleton = () => {
    switch (studio) {
      case 'fit-check':
        return <FitCheckSkeleton />;
      case 'beauty-rating':
        return <BeautySkeleton />;
      case 'content-rating':
        return <ContentSkeleton />;
      case 'hand-reading':
        return <HandReadingSkeleton />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`studio-hero-backdrop studio-backdrop-${studio} ${className}`}
      aria-hidden="true"
    >
      {renderSkeleton()}
      {/* Radial Atmospheric Lighting Aura */}
      <div className="studio-sketch-ambient-glow" />
      {/* Soft Vignette & Readability Gradient Overlay */}
      <div className="studio-sketch-readability-mask" />
    </div>
  );
}
