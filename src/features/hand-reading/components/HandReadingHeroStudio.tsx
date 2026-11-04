'use client';

/**
 * GABRU — HAND READING HERO STUDIO
 * 
 * Clean, focused studio workspace:
 * - Direct Palm Photo Dropzone / File Browser
 * - Evaluated executive score hub with tradition and policy controls
 * - Subtle legal notice
 * - Interactive Palm Visualizer Dock
 */

import React, { useId, useRef } from 'react';
import {
  HandReadingResult,
  PalmTradition,
  AbsentFeaturePolicy,
} from '../types/HandReadingTypes';
import { PalmLinePath, PalmMountRegion } from '../utils/HandImageAnalysisUtil';
import { PalmLandmarkVisualizer } from './PalmLandmarkVisualizer';
import { Button } from '@/shared/components/ui/Button';

export interface HandReadingHeroStudioProps {
  result: HandReadingResult | null;
  isAnalyzing: boolean;
  scanPhase?: 1 | 2 | 3 | 4;
  scanProgress?: number;
  scanStatusMessage?: string;
  tradition: PalmTradition;
  absentPolicy: AbsentFeaturePolicy;
  userImageUri: string | null;
  errorMessage?: string | null;
  linePaths?: PalmLinePath[];
  mountRegions?: PalmMountRegion[];
  activeParamKey?: string | null;
  onSelectParam?: (paramKey: string) => void;
  onTraditionChange: (tradition: PalmTradition) => void;
  onAbsentPolicyChange: (policy: AbsentFeaturePolicy) => void;
  onSamplePalm?: () => void;
  onFileUpload: (file: File) => void;
  onDeleteImage: () => void;
  onShareClick: () => void;
  onRecalculate?: () => void;
}

export function HandReadingHeroStudio({
  result,
  isAnalyzing,
  scanPhase,
  scanProgress,
  scanStatusMessage,
  tradition,
  absentPolicy,
  userImageUri,
  errorMessage,
  linePaths,
  mountRegions,
  activeParamKey,
  onSelectParam,
  onTraditionChange,
  onAbsentPolicyChange,
  onSamplePalm,
  onFileUpload,
  onDeleteImage,
  onShareClick,
  onRecalculate,
}: HandReadingHeroStudioProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="hero-container hand-studio-hero" id="hand-reading-hero">
      <div className="hero-left-column">
        {/* Hero Headline */}
        <h1 className="hero-headline scroll-reveal" id="hand-hero-headline">
          Palm Prominence,
          <br />
          <span className="gradient-text hand-gradient-text">Traditional &amp; Exact</span>
        </h1>

        {/* Hero Description */}
        <p className="hero-description scroll-reveal" id="hand-hero-description">
          Ridge continuity, mount relief, and constitutional archetypes mapped client-side.
        </p>

        {result ? (
          /* Evaluated State: Clean Executive Palm Score Hub */
          <div className="upload-card is-evaluated scroll-reveal">
            <div className="score-summary-header">
              <div className="score-metric-display">
                <span className="score-big-number font-tabular-nums">
                  {typeof result.overallProminenceIndex === 'number'
                    ? result.overallProminenceIndex.toFixed(1)
                    : '--'}
                </span>
                <span className="score-scale-denom font-tabular-nums">/100</span>
                <span className="score-verdict-tag">{result.overallBandLabel}</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                id="btn-upload-direct"
                title="Upload another palm photo"
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                }
              >
                Change Photo
              </Button>
            </div>

            {/* Quick Context Pills */}
            <div className="beauty-summary-pills-row">
              <div className="beauty-sub-pill" title="Hand Elemental Archetype Classification">
                <span className="sub-pill-label">
                  <span className="sub-pill-icon" aria-hidden="true">🖐️</span>
                  Archetype
                </span>
                <span className="sub-pill-val">{result.handTypeLabel}</span>
              </div>
              <div className="beauty-sub-pill" title="Palm Line Edge Clarity & Contrast Confidence">
                <span className="sub-pill-label">
                  <span className="sub-pill-icon" aria-hidden="true">🔍</span>
                  Clarity
                </span>
                <span className="sub-pill-val font-tabular-nums">{result.confidenceTier}</span>
              </div>
              <div className="beauty-sub-pill" title="Active Interpretation School">
                <span className="sub-pill-label">
                  <span className="sub-pill-icon" aria-hidden="true">📜</span>
                  Tradition
                </span>
                <span className="sub-pill-val">
                  {tradition === 'indian' ? 'Samudrika' : 'Chiromancy'}
                </span>
              </div>
            </div>

            {/* Inline Tradition & Absent Line Switchers */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
              <div className="hand-pill-toggle" role="group" aria-label="Tradition">
                <button
                  type="button"
                  className={`toggle-option ${tradition === 'western' ? 'is-active' : ''}`}
                  onClick={() => onTraditionChange('western')}
                >
                  Western
                </button>
                <button
                  type="button"
                  className={`toggle-option ${tradition === 'indian' ? 'is-active' : ''}`}
                  onClick={() => onTraditionChange('indian')}
                >
                  Indian
                </button>
              </div>

              <div className="hand-pill-toggle" role="group" aria-label="Absent Policy">
                <button
                  type="button"
                  className={`toggle-option ${absentPolicy === 'zero' ? 'is-active' : ''}`}
                  onClick={() => onAbsentPolicyChange('zero')}
                  title="Score absent lines as 0"
                >
                  Include 0
                </button>
                <button
                  type="button"
                  className={`toggle-option ${absentPolicy === 'exclude' ? 'is-active' : ''}`}
                  onClick={() => onAbsentPolicyChange('exclude')}
                  title="Exclude absent lines from average"
                >
                  Exclude
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="score-summary-actions" style={{ marginTop: '16px' }}>
              <Button
                variant="primary"
                size="md"
                onClick={onShareClick}
                id="btn-share-score"
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                }
              >
                Share Card
              </Button>

              {onRecalculate && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onRecalculate}
                  id="btn-recalculate-palm"
                  title="Re-calculate palm reading scores"
                  leftIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  }
                >
                  Re-calculate
                </Button>
              )}

              <Button
                variant="secondary"
                size="md"
                onClick={onDeleteImage}
                id="btn-delete-palm-image"
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                }
              >
                Clear
              </Button>
            </div>

            <div className="hero-sub-actions" style={{ marginTop: '14px' }}>
              <span className="privacy-pill">🔒 Zero Data Retention &bull; 100% Private</span>
            </div>
          </div>
        ) : (
          /* Initial State: Clean Semantic Upload Dropzone */
          <>
            <div
              className={`upload-card focus-ring tactile-press ${isAnalyzing ? 'is-scanning' : ''} ${errorMessage ? 'has-error' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
              aria-label="Upload palm photo"
            >
              <div className="upload-card-content">
                <div className="upload-icon-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                </div>

                <div className="upload-text-block">
                  <p className="upload-title">Drop your palm photo here, or browse</p>
                  <p className="upload-subtitle">Spread fingers slightly &bull; Diffuse lighting &bull; JPG, PNG, WebP</p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  id="btn-browse-palm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Palm Photo
                </Button>
              </div>
            </div>

            <div className="hero-sub-actions">
              <span className="privacy-pill">🔒 Zero Data Retention &bull; 100% Private</span>
            </div>
          </>
        )}

        <input
          type="file"
          id={fileInputId}
          ref={fileInputRef}
          className="visually-hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />

        {/* Error Banner */}
        {errorMessage && (
          <div className="upload-error-banner" id="hand-upload-error" role="alert" style={{ marginTop: '12px' }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Subtle Non-Predictive Disclaimer */}
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '12px', lineHeight: 1.4 }}>
          ⚖️ Traditional palmistry is for entertainment only &bull; Non-predictive.
        </p>
      </div>

      {/* Right Column: Sticky Palm Preview / Landmark Visualizer */}
      <div className="hero-right-column hand-sticky-column">
        <div className="hand-preview-dock scroll-reveal">
          <PalmLandmarkVisualizer
            imageUri={userImageUri}
            linePaths={linePaths || []}
            mountRegions={mountRegions || []}
            activeParamKey={activeParamKey || null}
            onSelectParam={onSelectParam || (() => {})}
            isAnalyzing={isAnalyzing}
            scanPhase={scanPhase}
            scanProgress={scanProgress}
            scanStatusMessage={scanStatusMessage}
            handTypeLabel={result?.handTypeLabel}
            overallScore={result?.overallProminenceIndex}
            overallBandLabel={result?.overallBandLabel}
          />

          {result && (
            <div className="preview-dock-footer">
              <Button
                variant="secondary"
                size="md"
                onClick={onShareClick}
                id="btn-hero-share-card"
                leftIcon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                }
              >
                Export Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
