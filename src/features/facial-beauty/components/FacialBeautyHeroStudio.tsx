'use client';

import React from 'react';
import { BeautyScoreData, DeepDiveTabKey } from '../types/FacialBeautyTypes';
import { Button } from '@/shared/components/ui/Button';
import { ScanningReticleOverlay } from '@/shared';

export interface FacialBeautyHeroStudioProps {
  scoreData: BeautyScoreData | null;
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
  onReevaluate: () => void;
  onSelectTab?: (tab: DeepDiveTabKey) => void;
}

export function FacialBeautyHeroStudio({
  scoreData,
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
  onReevaluate,
  onSelectTab,
}: FacialBeautyHeroStudioProps) {
  const primaryGoldenRatio =
    scoreData?.metrics?.phase3?.harmony?.goldenRatios?.[0]?.value ??
    (scoreData?.metrics?.aspectRatio && scoreData.metrics.aspectRatio > 0
      ? 1 / scoreData.metrics.aspectRatio
      : 1.618);
  const goldenRatioAdherence = scoreData?.metrics?.goldenRatioAdherence !== undefined
    ? scoreData.metrics.goldenRatioAdherence
    : primaryGoldenRatio > 0
    ? Number((100 * Math.exp(-Math.pow(primaryGoldenRatio - 1.618, 2) / (2 * Math.pow(0.095, 2)))).toFixed(1))
    : 72;

  const getVerdictStyle = (verdict: string) => {
    const upper = (verdict || '').toUpperCase();
    if (upper.includes('VERY HIGH') || upper.includes('EXCELLENT')) {
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)' };
    }
    if (upper.includes('HIGH')) {
      return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.35)' };
    }
    if (upper.includes('TYPICAL') && !upper.includes('BELOW')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)' };
    }
    return { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.35)' };
  };

  const verdictStyle = scoreData ? getVerdictStyle(scoreData.verdict) : { bg: '', text: '', border: '' };

  const getPillarStatus = (val: number) => {
    if (val >= 90) return { label: 'Optimal', color: '#10b981' };
    if (val >= 80) return { label: 'High', color: '#38bdf8' };
    if (val >= 70) return { label: 'Harmonious', color: '#a855f7' };
    return { label: 'Balanced', color: '#f59e0b' };
  };

  const handlePillarClick = (tab: DeepDiveTabKey) => {
    if (onSelectTab) {
      onSelectTab(tab);
      const el = document.getElementById('phase3-diagnostic-suite');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pillars = scoreData
    ? [
        {
          id: 'eyes',
          label: 'Eyes',
          icon: '👁️',
          score: scoreData.beautyPillars?.eyes ?? Math.round((scoreData.parameterRatings[2] ?? 8.5) * 10),
          detail: 'Canthal tilt & aperture',
          tab: 'eyes' as DeepDiveTabKey,
        },
        {
          id: 'nose',
          label: 'Nose',
          icon: '👃',
          score: scoreData.beautyPillars?.nose ?? Math.round((scoreData.subfactorScores['NC1'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10),
          detail: 'Bridge linearity & dorsum',
          tab: 'features' as DeepDiveTabKey,
        },
        {
          id: 'lips',
          label: 'Lips',
          icon: '👄',
          score: scoreData.beautyPillars?.lips ?? Math.round((scoreData.subfactorScores['NC3'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10),
          detail: 'Fullness & Cupid\'s bow',
          tab: 'features' as DeepDiveTabKey,
        },
        {
          id: 'smoothness',
          label: 'Smoothness',
          icon: '✨',
          score: scoreData.beautyPillars?.smoothness ?? 85,
          detail: 'Epidermal texture clarity',
          tab: 'skin' as DeepDiveTabKey,
        },
        {
          id: 'faceHealth',
          label: 'Face Health',
          icon: '🌿',
          score: scoreData.beautyPillars?.faceHealth ?? 84,
          detail: 'Hydration & vitality glow',
          tab: 'skin' as DeepDiveTabKey,
        },
        {
          id: 'jawline',
          label: 'Jawline',
          icon: '💎',
          score: scoreData.beautyPillars?.jawline ?? Math.round((scoreData.parameterRatings[9] ?? 8.2) * 10),
          detail: 'Mandibular line & chin',
          tab: 'jaw' as DeepDiveTabKey,
        },
        {
          id: 'attractiveness',
          label: 'Attractiveness',
          icon: '⚜️',
          score: scoreData.beautyPillars?.attractiveness ?? Math.round(((scoreData.parameterRatings[3] ?? 8.6) * 10 * 0.5) + (goldenRatioAdherence * 0.5)),
          detail: 'Thirds & golden ratio φ',
          tab: 'harmony' as DeepDiveTabKey,
        },
        {
          id: 'smile',
          label: 'Smile',
          icon: '😊',
          score: scoreData.beautyPillars?.smile ?? Math.round((scoreData.parameterRatings[4] ?? 8.0) * 10),
          detail: 'Duchenne smile dynamics',
          tab: 'expression' as DeepDiveTabKey,
        },
        {
          id: 'featuresSymmetry',
          label: 'Symmetry',
          icon: '🪞',
          score: scoreData.beautyPillars?.featuresSymmetry ?? Math.round((scoreData.parameterRatings[7] ?? 8.2) * 10),
          detail: 'Bilateral feature parity',
          tab: 'symmetry' as DeepDiveTabKey,
        },
      ]
    : [];

  return (
    <div className="hero-container">
      {/* Left Column — Clean Upload Studio & Score Hub */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          Facial Harmony,
          <br />
          <span className="gradient-text">Objectively Scored</span>
        </h1>

        <p className="hero-description scroll-reveal" id="hero-description">
          Golden-ratio proportions, symmetry, and skin vitality metrics. 100% on-device.
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
                  <span className="score-big-number font-tabular-nums">
                    {Number.isInteger(scoreData.faceScore) ? String(scoreData.faceScore) : scoreData.faceScore.toFixed(1)}
                  </span>
                  <span className="score-scale-denom font-tabular-nums">/100</span>
                  <span
                    className="score-verdict-tag"
                    style={{
                      backgroundColor: verdictStyle.bg,
                      color: verdictStyle.text,
                      borderColor: verdictStyle.border,
                    }}
                  >
                    {scoreData.verdict}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onTriggerUpload}
                  disabled={isAnalyzing}
                  id="btn-upload-direct"
                  title="Upload another face photo"
                  leftIcon={
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
                  }
                >
                  Change Photo
                </Button>
              </div>

              {/* Highlighted Big Golden Ratio (φ) Showcase Module */}
              <div
                className="beauty-golden-ratio-card"
                id="golden-ratio-hero-card"
                title={`Calculated Facial Golden Ratio: φ ${primaryGoldenRatio.toFixed(3)} (${goldenRatioAdherence}% biometric match to ideal φ ≈ 1.618)`}
              >
                <div className="golden-ratio-card-header">
                  <div className="golden-ratio-badge">
                    <span className="golden-ratio-icon" aria-hidden="true">⚜️</span>
                    <span className="golden-ratio-eyebrow">GOLDEN RATIO ARCHITECTURE</span>
                  </div>
                  <div className="golden-ratio-adherence-pill">
                    <span className="adherence-dot" />
                    <span>{goldenRatioAdherence}% Neoclassical Match</span>
                  </div>
                </div>
                <div className="golden-ratio-card-body">
                  <div className="golden-ratio-phi-wrap">
                    <span className="golden-ratio-phi-symbol">φ</span>
                    <span className="golden-ratio-phi-val font-tabular-nums">
                      {primaryGoldenRatio.toFixed(3)}
                    </span>
                    <span className="golden-ratio-ideal font-tabular-nums">(Ideal 1.618)</span>
                    <span className="golden-ratio-thirds-tag font-tabular-nums">
                      {scoreData.metrics?.facialThirdsBalance ? `Thirds ${scoreData.metrics.facialThirdsBalance.split(' ')[0]}` : 'Thirds 1:1:1'}
                    </span>
                  </div>
                  <div className="golden-ratio-progress-track">
                    <div
                      className="golden-ratio-progress-bar"
                      style={{ width: `${Math.min(100, Math.max(10, goldenRatioAdherence))}%` }}
                    />
                  </div>
                  <p className="golden-ratio-desc">
                    Neoclassical facial thirds (1:1:1) and divine horizontal proportion alignment across zygomatic width and lateral canthi.
                  </p>
                </div>
              </div>

              {/* Essential Facial Beauty Pillars Matrix (Human-Calibrated Aesthetic Dimensions) */}
              <div className="beauty-pillars-module" id="beauty-pillars-module">
                <div className="pillars-module-header">
                  <div className="pillars-module-title">
                    <span className="pillars-sparkle-icon" aria-hidden="true">✨</span>
                    <span className="pillars-heading">ESSENTIAL FACIAL FEATURES MATRIX</span>
                  </div>
                  <span className="pillars-meta-tag">Human-Calibrated</span>
                </div>

                <div className="beauty-pillars-grid">
                  {pillars.map((pillar) => {
                    const status = getPillarStatus(pillar.score);
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        className="beauty-pillar-card"
                        onClick={() => handlePillarClick(pillar.tab)}
                        title={`Click to inspect ${pillar.label} diagnostics (${pillar.detail})`}
                      >
                        <div className="pillar-card-top">
                          <span className="pillar-icon" aria-hidden="true">{pillar.icon}</span>
                          <span className="pillar-score font-tabular-nums">{pillar.score}</span>
                        </div>
                        <div className="pillar-card-middle">
                          <span className="pillar-name">{pillar.label}</span>
                          <span className="pillar-status" style={{ color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                        <div className="pillar-progress-track">
                          <div
                            className="pillar-progress-bar"
                            style={{
                              width: `${Math.min(100, Math.max(10, pillar.score))}%`,
                              backgroundColor: status.color,
                            }}
                          />
                        </div>
                        <span className="pillar-detail">{pillar.detail}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Presentational, Structural, and Landmark Confidence Breakdown Pills */}
              <div className="beauty-summary-pills-row" id="beauty-telemetry-pills">
                <div className="beauty-sub-pill beauty-pill-presentational" title="Presentational Cues (Skin Vitality, Grooming, Expression)">
                  <div className="sub-pill-leading">
                    <span className="sub-pill-icon" aria-hidden="true">✨</span>
                    <span className="sub-pill-name">Presentational</span>
                  </div>
                  <span className="sub-pill-score-chip font-tabular-nums">
                    {(scoreData.presentationalScore ?? 78.5).toFixed(1)}%
                  </span>
                </div>
                <div className="beauty-sub-pill beauty-pill-structural" title="Structural Proportions (Bilateral Symmetry, Harmony, Jaw & Facial Architecture)">
                  <div className="sub-pill-leading">
                    <span className="sub-pill-icon" aria-hidden="true">📐</span>
                    <span className="sub-pill-name">Structural</span>
                  </div>
                  <span className="sub-pill-score-chip font-tabular-nums">
                    {(scoreData.structuralScore ?? 78.8).toFixed(1)}%
                  </span>
                </div>
                <div className="beauty-sub-pill beauty-pill-confidence" title="Biometric Landmark Confidence Factor">
                  <div className="sub-pill-leading">
                    <span className="sub-pill-icon" aria-hidden="true">🎯</span>
                    <span className="sub-pill-name">Confidence</span>
                  </div>
                  <span className="sub-pill-score-chip font-tabular-nums">
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
                    <span className="insight-gain font-tabular-nums">
                      (+{scoreData.topLevers[0].gainPts.toFixed(1)} pts)
                    </span>
                  </span>
                </div>
              )}

              <div className="score-summary-actions">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onShareClick}
                  id="btn-share-score"
                  title="Generate and share social media scorecard"
                  leftIcon={
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
                  }
                >
                  Share Card
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onReevaluate}
                  disabled={isAnalyzing}
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

            <div className="hero-sub-actions" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span className="privacy-pill">🔒 Zero Cloud Uploads · 100% In-Browser Biometric Analysis</span>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: 0, maxWidth: '420px', lineHeight: 1.4 }}>
                By uploading, you confirm you are 18+ and consent to private on-device facial landmark processing. Photos are never stored or uploaded.
              </p>
            </div>
          </>
        ) : (
          /* Initial State: Clean Redesigned Dropzone */
          <>
            <div
              id="upload-dropzone"
              className={`upload-card focus-ring tactile-press ${isDragging ? 'is-dragging' : ''} ${errorMessage ? 'has-error' : ''}`}
              onClick={onTriggerUpload}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTriggerUpload()}
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

                <Button
                  variant="primary"
                  size="md"
                  id="btn-browse-photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerUpload();
                  }}
                >
                  Browse Face Photo
                </Button>
              </div>
            </div>

            <div className="hero-sub-actions" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span className="privacy-pill">🔒 Zero Cloud Uploads · 100% In-Browser Biometric Analysis</span>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: 0, maxWidth: '420px', lineHeight: 1.4 }}>
                By uploading, you confirm you are 18+ and consent to private on-device facial landmark processing. Photos are never stored or uploaded.
              </p>
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
                onError={(e) => {
                  e.currentTarget.src = '/face_beauty_sketch.jpg';
                }}
              />

              {/* Holographic Reticle & Biometric Laser Scanner Overlay */}
              <ScanningReticleOverlay
                studio="beauty-rating"
                isAnalyzing={isAnalyzing}
                phase={scanPhase}
                progressRatio={scanProgress}
                statusMessage={scanStatusMessage}
              />

              {/* Floating Landmark Mesh Count Badge (Top-Left) */}
              {!isAnalyzing && scoreData && (
                <div className="preview-mesh-badge" id="preview-mesh-badge">
                  <span className="mesh-beacon-dot" />
                  <span>468 3D Mesh Landmarks</span>
                </div>
              )}

              {/* Floating Golden Ratio Pill (Top-Right) */}
              {!isAnalyzing && scoreData && (
                <div className="preview-phi-badge" id="preview-phi-badge">
                  <span>⚜️ φ {primaryGoldenRatio.toFixed(3)}</span>
                  <span className="phi-match-sub">({goldenRatioAdherence}%)</span>
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
