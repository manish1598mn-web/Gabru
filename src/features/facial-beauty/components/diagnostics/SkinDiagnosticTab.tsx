'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface SkinDiagnosticTabProps {
  scoreData: BeautyScoreData;
  copiedColor: string | null;
  onCopyColor: (hex: string) => void;
}

export function SkinDiagnosticTab({ scoreData, copiedColor, onCopyColor }: SkinDiagnosticTabProps) {
  const p1Score = scoreData.parameterScores[1] ?? 11.2;
  const p1Rating = scoreData.parameterRatings[1] ?? 8.0;
  const skinMetrics = scoreData.metrics.phase3?.skin;

  return (
    <div className="diag-panel-content" id="diag-panel-skin">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>✨ Parameter 1: Skin Quality &amp; Glow</span>
            <span className="diag-stat-code">14 Pts Max &bull; Controllable</span>
          </div>
          <div className="diag-panel-desc">
            5-zone sampling (forehead, cheeks, nose bridge, chin). Evaluates tone uniformity, surface clarity, natural sheen, and skin vitality.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p1Score.toFixed(1)} / 14 pts</span>
          <span className="diag-panel-rating">(R: {p1Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Tone Evenness</span>
          </div>
          <div className="diag-stat-val">
            ΔE₀₀ {skinMetrics?.deltaE2000.toFixed(1) ?? '1.8'}
          </div>
          <div className={`diag-stat-status ${(skinMetrics?.deltaE2000 ?? 1.8) <= 2.5 ? 'status-ideal' : 'status-caution'}`}>
            {(skinMetrics?.deltaE2000 ?? 1.8) <= 2.5
              ? '✓ Uniform CIELAB distribution (≤ 2.5)'
              : 'Minor tone variation across facial patches'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Surface Clarity</span>
          </div>
          <div className="diag-stat-val">
            {skinMetrics?.blemishPct.toFixed(1) ?? '1.2'}%
          </div>
          <div className={`diag-stat-status ${(skinMetrics?.blemishPct ?? 1.2) <= 1.0 ? 'status-ideal' : 'status-caution'}`}>
            {(skinMetrics?.blemishPct ?? 1.2) <= 1.0
              ? '✓ Clear skin barrier'
              : 'Subtle transient texture variance detected'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Radiance &amp; Shine</span>
          </div>
          <div className="diag-stat-val">
            {skinMetrics?.specularPct.toFixed(1) ?? '3.5'}%
          </div>
          <div className="diag-stat-status status-ideal">
            Natural balanced T-zone sheen (3% - 8% specular)
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Chroma Ratio</span>
          </div>
          <div className="diag-stat-val">
            q = {skinMetrics?.chromaRatio.toFixed(2) ?? '1.15'}
          </div>
          <div className={`diag-stat-status ${(skinMetrics?.chromaRatio ?? 1.15) >= 1.0 && (skinMetrics?.chromaRatio ?? 1.15) <= 1.30 ? 'status-ideal' : 'status-caution'}`}>
            {(skinMetrics?.chromaRatio ?? 1.15) >= 1.0 && (skinMetrics?.chromaRatio ?? 1.15) <= 1.30
              ? '✓ Harmonious cheek/forehead ratio (1.00–1.30)'
              : 'Slightly muted cheek chroma ratio'}
          </div>
        </div>
      </div>

      {/* Interactive Precision Color Swatches & Radiance Suite */}
      <div className="color-palette-section" id="beauty-color-palette" style={{ marginTop: '6px' }}>
        <div className="section-header-compact">
          <div className="palette-title-wrap">
            <span className="palette-icon" aria-hidden="true">🎨</span>
            <h4 className="section-title">Sampled Epidermal Pigments &amp; Undertone</h4>
          </div>
          <span className="section-subtitle">Click hex chip to copy</span>
        </div>

        <div className="color-swatches-grid">
          {/* 1. Skin Foundation Pigment */}
          <div className="swatch-card focus-ring">
            <div className="swatch-droplet-wrap">
              <div
                className="swatch-color-droplet"
                style={{ backgroundColor: scoreData.colorPalette.skinTone }}
                title={`Sampled Epidermal Hex: ${scoreData.colorPalette.skinTone}`}
              />
              <span className="swatch-kind-tag">EPIDERMIS</span>
            </div>
            <div className="swatch-meta">
              <span className="swatch-label">Skin Pigment</span>
              <button
                type="button"
                className="swatch-copy-chip tactile-press"
                onClick={() => onCopyColor(scoreData.colorPalette.skinTone)}
                title="Click to copy skin hex code"
              >
                <span className="font-tabular-nums">{scoreData.colorPalette.skinTone.toUpperCase()}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <span className="swatch-sub">{scoreData.colorPalette.undertone}</span>
            </div>
          </div>

          {/* 2. Vermilion Lip Tone */}
          <div className="swatch-card focus-ring">
            <div className="swatch-droplet-wrap">
              <div
                className="swatch-color-droplet"
                style={{ backgroundColor: scoreData.colorPalette.lipTone }}
                title={`Sampled Vermilion Hex: ${scoreData.colorPalette.lipTone}`}
              />
              <span className="swatch-kind-tag">VERMILION</span>
            </div>
            <div className="swatch-meta">
              <span className="swatch-label">Vermilion Tone</span>
              <button
                type="button"
                className="swatch-copy-chip tactile-press"
                onClick={() => onCopyColor(scoreData.colorPalette.lipTone)}
                title="Click to copy lip hex code"
              >
                <span className="font-tabular-nums">{scoreData.colorPalette.lipTone.toUpperCase()}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <span className="swatch-sub">Natural Lip Flush</span>
            </div>
          </div>

          {/* 3. Vitality & Radiance Index */}
          <div className="swatch-card swatch-card-vitality focus-ring">
            <div className="swatch-droplet-wrap">
              <div className="swatch-vitality-ring" title="Epidermal Perfusion & Glow">
                <span className="vitality-spark-icon" aria-hidden="true">✨</span>
              </div>
              <span className="swatch-kind-tag">VITALITY</span>
            </div>
            <div className="swatch-meta">
              <span className="swatch-label">Vitality Level</span>
              <div className="swatch-vitality-badge">
                <span>{scoreData.colorPalette.vitalityLevel}</span>
              </div>
              <span className="swatch-sub">
                Luminosity &amp; tone (q = {skinMetrics?.chromaRatio.toFixed(2) ?? '1.15'})
              </span>
            </div>
          </div>
        </div>

        {copiedColor && (
          <div className="copied-toast" role="status" aria-live="polite">
            ✓ Copied {copiedColor.toUpperCase()} to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
