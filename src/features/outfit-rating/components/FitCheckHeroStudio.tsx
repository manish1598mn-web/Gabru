'use client';

import React from 'react';
import { Button, Badge, ScanningReticleOverlay } from '@/shared';
import { OutfitScoreData } from '../types/OutfitRatingTypes';

export interface FitCheckHeroStudioProps {
  photoScore: OutfitScoreData | null;
  selectedPhotoUrl: string | null;
  selectedPhotoName: string;
  isDragging: boolean;
  isAnalyzing: boolean;
  scanPhase?: 1 | 2 | 3 | 4;
  scanProgress?: number;
  scanStatusMessage?: string;
  errorMessage: string | null;
  onTriggerUpload: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onShareClick: () => void;
  onRecalculate: () => void;
}

export function FitCheckHeroStudio({
  photoScore,
  selectedPhotoUrl,
  selectedPhotoName,
  isDragging,
  isAnalyzing,
  scanPhase = 1,
  scanProgress = 0,
  scanStatusMessage,
  errorMessage,
  onTriggerUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onShareClick,
  onRecalculate,
}: FitCheckHeroStudioProps) {
  const cleanPhotoName = selectedPhotoName || 'Default fit sample';

  return (
    <div className="hero-container">
      {/* Left Column — Human-Grade Editorial Studio */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          AI Outfit Rater:
          <br />
          <span className="gradient-text">Precision Fit Scored in Seconds</span>
        </h1>

        {photoScore ? (
          /* Evaluated State: Clean Executive Style Score Hub */
          <>
            <div
              id="upload-dropzone"
              className={`upload-card is-evaluated ${isDragging ? 'is-dragging' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="score-summary-header">
                <div className="score-metric-display">
                  <span className="score-big-number font-tabular-nums">{photoScore.overallScore}</span>
                  <span className="score-scale-denom">/100</span>
                  <span className="score-verdict-tag">{photoScore.verdict}</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onTriggerUpload}
                  disabled={isAnalyzing}
                  id="btn-upload-direct"
                  title="Upload another outfit photo"
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

              {/* Clean Key Insight (Top Quick Fix or Cap Alert) */}
              {photoScore.topQuickFix && (
                <div className="score-clean-insight">
                  <Badge variant="warning" size="sm">⚡ Quick Fix</Badge>
                  <span className="insight-text text-truncate">
                    {photoScore.topQuickFix.action}{' '}
                    <strong className="insight-gain font-tabular-nums">
                      (+{photoScore.topQuickFix.gainPts.toFixed(1)} pts)
                    </strong>
                  </span>
                </div>
              )}

              {photoScore.capsTriggered && photoScore.capsTriggered.length > 0 && !photoScore.topQuickFix && (
                <div className="score-clean-cap">
                  <Badge variant="destructive" size="sm">Cap Applied</Badge>
                  <span className="text-truncate">{photoScore.capsTriggered[0]}</span>
                </div>
              )}

              {/* Action Buttons: 1 Primary (Share Card), 1 Secondary (Re-calculate) */}
              <div className="score-summary-actions">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onShareClick}
                  id="btn-share-score"
                  title="Generate and share social media style card"
                  leftIcon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onRecalculate}
                  disabled={isAnalyzing}
                  isLoading={isAnalyzing}
                  id="btn-reanalyze"
                  title="Re-calculate parameter scores"
                  leftIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  }
                >
                  Re-calculate
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Initial State: Accessible Semantic Upload Dropzone */
          <>
            <div
              id="upload-dropzone"
              className={`upload-card ${isDragging ? 'is-dragging' : ''} ${errorMessage ? 'has-error' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={onTriggerUpload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTriggerUpload();
                }
              }}
              aria-label="Upload outfit photo. Drag and drop file or press to browse."
            >
              <div className="upload-card-content">
                <div className="upload-icon-badge">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>

                <div className="upload-text-block min-w-0">
                  <p className="upload-title text-truncate">
                    {isDragging ? 'Drop outfit photo to analyze' : 'Drop your outfit photo here, or browse'}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerUpload();
                  }}
                  id="btn-upload-direct"
                >
                  Choose Photo
                </Button>
              </div>
            </div>
          </>
        )}

        {errorMessage && (
          <div className="upload-error-banner" id="upload-error" role="alert">
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
      </div>

      {/* Right Column — Photo Preview Card & Floating Media Composition */}
      <div className="hero-right-column scroll-reveal">
        <div className="preview-card-composition">
          <div className="media-ambient-glow" aria-hidden="true" />

          <div
            className={`preview-card has-photo ${isDragging ? 'is-dragging' : ''} ${isAnalyzing ? 'is-scanning' : ''}`}
            id="photo-preview-card"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="preview-photo-canvas" id="preview-display-area">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhotoUrl || '/sample_female_outfit.jpg'}
                alt={cleanPhotoName || 'High-fashion sartorial tailoring and silhouette reference'}
                className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                id="preview-rendered-image"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== `${window.location.origin}/sample_female_outfit.jpg`) {
                    target.src = '/sample_female_outfit.jpg';
                  }
                }}
              />

              {/* Idle Editorial Stage Badge */}
              {!selectedPhotoUrl && !isAnalyzing && (
                <div className="preview-editorial-overlay">
                  <div className="editorial-pill">
                    <span className="editorial-sparkle">✨</span>
                    <span>EDITORIAL FIT BENCHMARK</span>
                  </div>
                </div>
              )}

              {/* Holographic Reticle & Biometric Laser Scanner Overlay */}
              <ScanningReticleOverlay
                studio="fit-check"
                isAnalyzing={isAnalyzing}
                phase={scanPhase}
                progressRatio={scanProgress}
                statusMessage={scanStatusMessage}
              />

              {!isAnalyzing && errorMessage && (
                <div
                  className="subject-status-pill pill-no-human"
                  id="subject-scan-status"
                >
                  <span className="status-dot-indicator" style={{ background: '#ef4444' }} />
                  <span>✕ Invalid Outfit Image</span>
                </div>
              )}

              {!isAnalyzing && !errorMessage && photoScore && (
                <div
                  className="subject-status-pill pill-human-detected"
                  id="subject-scan-status"
                >
                  <span className="status-dot-indicator" />
                  <span>✓ Outfit Scanned</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
