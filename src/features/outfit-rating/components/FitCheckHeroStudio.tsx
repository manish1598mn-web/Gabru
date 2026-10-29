'use client';

import React from 'react';
import { Button, Badge } from '@/shared';
import { OutfitScoreData } from '../types/OutfitRatingTypes';

export interface FitCheckHeroStudioProps {
  photoScore: OutfitScoreData | null;
  selectedPhotoUrl: string | null;
  selectedPhotoName: string;
  isDragging: boolean;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onTriggerUpload: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSamplePhoto: () => void;
  onShareClick: () => void;
  onRecalculate: () => void;
}

export function FitCheckHeroStudio({
  photoScore,
  selectedPhotoUrl,
  selectedPhotoName,
  isDragging,
  isAnalyzing,
  errorMessage,
  onTriggerUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onSamplePhoto,
  onShareClick,
  onRecalculate,
}: FitCheckHeroStudioProps) {
  const cleanPhotoName = selectedPhotoName || 'Default fit sample';

  return (
    <div className="hero-container">
      {/* Left Column — Human-Grade Editorial Studio */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          Upload Photo,
          <br />
          <span className="gradient-text">Get a style Score</span>
        </h1>

        <p className="hero-description scroll-reveal" id="hero-description">
          Instant multi-dimensional evaluation across fit, proportions, harmony, and grooming.
          High-fashion intelligence that runs 100% privately in your browser.
        </p>

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

            <div className="hero-sub-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSamplePhoto}
                id="btn-try-demo"
              >
                <span>✨</span> Try Sample Photo
              </Button>
              <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
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
                  <p className="upload-subtitle">Supports JPG, PNG, WEBP • Max 15MB • Client-side private</p>
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

            <div className="hero-sub-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSamplePhoto}
                id="btn-try-demo"
              >
                <span>✨</span> Try Sample Photo
              </Button>
              <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
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
                src={selectedPhotoUrl || '/fit_check_split.jpg'}
                alt={cleanPhotoName}
                className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                id="preview-rendered-image"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== `${window.location.origin}/fit_check_split.jpg`) {
                    target.src = '/fit_check_split.jpg';
                  }
                }}
              />

              {isAnalyzing && (
                <div className="photo-scanner-hud" aria-live="polite">
                  <div className="scanner-status-chip">
                    <span className="scanner-spin-icon" />
                    <span>Evaluating garments and silhouette...</span>
                  </div>
                </div>
              )}

              {!isAnalyzing && photoScore && (
                <div
                  className={`subject-status-pill ${photoScore.humanDetected ? 'pill-human-detected' : 'pill-no-human'}`}
                  id="subject-scan-status"
                >
                  <span className="status-dot-indicator" />
                  <span>
                    {photoScore.humanDetected ? '✓ Outfit Scanned' : '⚠ Visual Estimate'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
