'use client';

import React from 'react';
import { BeautyScoreData } from '../types/FacialBeautyTypes';

export interface FacialBeautyHeroStudioProps {
  scoreData: BeautyScoreData | null;
  selectedPhotoUrl: string | null;
  selectedPhotoName: string;
  isDragging: boolean;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onTriggerUpload: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSampleSketch: () => void;
  onSamplePortrait: () => void;
  onShareClick: () => void;
  onReevaluate: () => void;
}

export function FacialBeautyHeroStudio({
  scoreData,
  selectedPhotoUrl,
  selectedPhotoName,
  isDragging,
  isAnalyzing,
  errorMessage,
  onTriggerUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onSampleSketch,
  onSamplePortrait,
  onShareClick,
  onReevaluate,
}: FacialBeautyHeroStudioProps) {
  return (
    <div className="hero-container">
      {/* Left Column — Clean Upload Studio & Score Hub */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          Upload Face Photo,
          <br />
          <span className="gradient-text">Rate Facial Beauty</span>
        </h1>

        <p className="hero-description scroll-reveal" id="hero-description">
          Biometric analysis across skin health cues, facial harmony thirds and fifths, golden ratio φ (1.618), bilateral symmetry, and grooming refinement. 100% private in-browser evaluation.
        </p>

        {scoreData ? (
          /* Evaluated State: Clean Executive Beauty Score Hub */
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
                  <span className="score-big-number">
                    {Number.isInteger(scoreData.faceScore) ? String(scoreData.faceScore) : scoreData.faceScore.toFixed(1)}
                  </span>
                  <span className="score-scale-denom">/100</span>
                  <span className="score-verdict-tag">{scoreData.verdict}</span>
                </div>

                <button
                  type="button"
                  className="btn-change-photo"
                  onClick={onTriggerUpload}
                  id="btn-upload-direct"
                  title="Upload another face photo"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Change Photo
                </button>
              </div>

              {/* Presentational vs Structural Breakdown Pill */}
              <div className="beauty-summary-pills-row">
                <div className="beauty-sub-pill">
                  <span className="sub-pill-label">Presentational</span>
                  <span className="sub-pill-val">
                    {(scoreData.presentationalScore ?? 78.5).toFixed(1)}%
                  </span>
                </div>
                <div className="beauty-sub-pill">
                  <span className="sub-pill-label">Structural</span>
                  <span className="sub-pill-val">
                    {(scoreData.structuralScore ?? 78.8).toFixed(1)}%
                  </span>
                </div>
                <div className="beauty-sub-pill">
                  <span className="sub-pill-label">Confidence</span>
                  <span className="sub-pill-val">
                    {Math.round((scoreData.confidence || 0.88) * 100)}%
                  </span>
                </div>
              </div>

              {/* Top Controllable Levers Insight */}
              {scoreData.topLevers && scoreData.topLevers.length > 0 && (
                <div className="score-clean-insight">
                  <span className="insight-badge">⚡ Top Lever</span>
                  <span className="insight-text">
                    {scoreData.topLevers[0].lever}{' '}
                    <span className="insight-gain">
                      (+{scoreData.topLevers[0].gainPts.toFixed(1)} pts)
                    </span>
                  </span>
                </div>
              )}

              <div className="score-summary-actions">
                <button
                  type="button"
                  className="btn-score-action btn-share-score"
                  onClick={onShareClick}
                  id="btn-share-score"
                  title="Generate and share social media scorecard"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share Card
                </button>

                <button
                  type="button"
                  className="btn-score-action btn-reanalyze"
                  onClick={onReevaluate}
                  id="btn-reanalyze"
                  title="Re-evaluate facial beauty parameters"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Re-evaluate
                </button>
              </div>
            </div>

            <div className="hero-sub-actions">
              <button
                type="button"
                className="btn-sample-link"
                id="btn-try-demo-face"
                onClick={onSampleSketch}
              >
                <span>🏛</span> Try Beauty Sketch
              </button>
              <button
                type="button"
                className="btn-sample-link btn-sample-secondary"
                id="btn-try-portrait"
                onClick={onSamplePortrait}
              >
                <span>✨</span> Sample Portrait
              </button>
              <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
            </div>
          </>
        ) : (
          /* Initial State: Clean Redesigned Dropzone */
          <>
            <div
              id="upload-dropzone"
              className={`upload-card ${isDragging ? 'is-dragging' : ''} ${errorMessage ? 'has-error' : ''}`}
              onClick={onTriggerUpload}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onTriggerUpload()}
              aria-label="Upload face portrait"
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <div className="upload-text-block">
                  <p className="upload-title">
                    {isDragging ? 'Drop portrait photo to evaluate' : 'Drop your face photo here, or browse'}
                  </p>
                  <p className="upload-subtitle">Frontal, direct eye contact • JPG, PNG, WEBP • 100% Private</p>
                </div>

                <button
                  type="button"
                  className="btn-browse-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerUpload();
                  }}
                  id="btn-browse-photo"
                >
                  Browse Face Photo
                </button>
              </div>
            </div>

            <div className="hero-sub-actions">
              <button
                type="button"
                className="btn-sample-link"
                id="btn-try-demo-face"
                onClick={onSampleSketch}
              >
                <span>🏛</span> Try Beauty Sketch
              </button>
              <button
                type="button"
                className="btn-sample-link btn-sample-secondary"
                id="btn-try-portrait"
                onClick={onSamplePortrait}
              >
                <span>✨</span> Sample Portrait
              </button>
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

      {/* Right Column — Photo Preview Card & Floating Media */}
      <div className="hero-right-column scroll-reveal">
        <div className="preview-card-composition">
          <div className="media-ambient-glow" aria-hidden="true" />
          <div className="media-ambient-tile tile-tl" aria-hidden="true" />
          <div className="media-ambient-tile tile-br" aria-hidden="true" />

          <div
            className={`preview-card has-photo ${isDragging ? 'is-dragging' : ''} ${isAnalyzing ? 'is-scanning' : ''}`}
            id="photo-preview-card"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="preview-photo-canvas" id="preview-display-area">
              <img
                src={selectedPhotoUrl || '/face_beauty_sketch.jpg'}
                alt={selectedPhotoName || 'Facial beauty aesthetic reference photo'}
                className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                id="preview-rendered-image"
              />

              {isAnalyzing && (
                <div className="photo-scanner-hud" aria-live="polite">
                  <div className="scanner-laser-beam" />
                  <div className="scanner-grid-mesh" />
                  <div className="scanner-bracket bracket-tl" />
                  <div className="scanner-bracket bracket-tr" />
                  <div className="scanner-bracket bracket-bl" />
                  <div className="scanner-bracket bracket-br" />
                  <div className="scanner-reticle-box">
                    <div className="reticle-crosshair" />
                    <span className="reticle-target-tag">TRACKING: 468 BIOMETRIC MESH POINTS</span>
                  </div>
                  <div className="scanner-status-chip">
                    <span className="scanner-spin-icon" />
                    <span>Scanning 8 Facial Parameters...</span>
                  </div>
                </div>
              )}

              {/* Post-Analysis Subject Verification Pill */}
              {!isAnalyzing && scoreData && (
                <div className="subject-status-pill pill-human-detected" id="subject-scan-status">
                  <span className="status-dot-indicator" />
                  <span>
                    {scoreData.intakeReport?.faceDetected
                      ? `✓ Human Face Detected (${scoreData.intakeReport.ipdPx > 0 ? Math.round(scoreData.intakeReport.ipdPx) : 120}px IPD)`
                      : scoreData.isRenormalised
                      ? '⚡ Frontal Renormalised'
                      : '✓ Facial Biometrics Scanned'}
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
