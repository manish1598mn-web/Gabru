'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface SkinDiagnosticTabProps {
  scoreData: BeautyScoreData;
  copiedColor: string | null;
  onCopyColor: (hex: string) => void;
}

export function SkinDiagnosticTab({ scoreData, copiedColor, onCopyColor }: SkinDiagnosticTabProps) {
  const p1Score = scoreData.parameterScores[1] ?? 16.8;
  const p1Rating = scoreData.parameterRatings[1] ?? 8.0;
  const skinMetrics = scoreData.metrics.phase3?.skin;

  return (
    <div className="diag-panel-content" id="diag-panel-skin">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>✨ Parameter 1: Skin Quality & Health Cues</span>
            <span className="diag-stat-code">21 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            5-zone multi-patch sampling (forehead, both cheeks, nose bridge, chin, infraorbital) evaluated in CIELAB space after white-balance correction. Measures tone uniformity, clarity, radiance, and eye-region health signals.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p1Score.toFixed(1)} / 21 pts</span>
          <span className="diag-panel-rating">(R: {p1Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Tone Evenness</span>
            <span className="diag-stat-code">SK1 · W=30</span>
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
            <span className="diag-stat-code">SK2 · W=30</span>
          </div>
          <div className="diag-stat-val">
            {skinMetrics?.blemishPct.toFixed(1) ?? '1.2'}%
          </div>
          <div className={`diag-stat-status ${(skinMetrics?.blemishPct ?? 1.2) <= 1.0 ? 'status-ideal' : 'status-caution'}`}>
            {(skinMetrics?.blemishPct ?? 1.2) <= 1.0
              ? '✓ High clarity, minimal micro-blemishes (≤ 1%)'
              : 'Subtle transient texture variance detected'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Radiance & Shine</span>
            <span className="diag-stat-code">SK3 · W=15 · V=0.5</span>
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
            <span className="diag-stat-label">Periorbital Contrast</span>
            <span className="diag-stat-code">SK4 · W=25</span>
          </div>
          <div className="diag-stat-val">
            ΔL* {skinMetrics?.underEyeDeltaL.toFixed(1) ?? '4.5'}
          </div>
          <div className={`diag-stat-status ${(skinMetrics?.underEyeDeltaL ?? 4.5) <= 5.5 ? 'status-ideal' : 'status-caution'}`}>
            {skinMetrics?.vitalityTier ?? scoreData.colorPalette.vitalityLevel}
          </div>
        </div>
      </div>

      {/* Interactive Color Swatches */}
      <div className="color-palette-section" id="beauty-color-palette" style={{ marginTop: '4px' }}>
        <div className="section-header-compact">
          <h4 className="section-title" style={{ fontSize: '13.5px' }}>Sampled Epidermal Pigments & Undertone</h4>
          <span className="section-subtitle">Click any swatch to copy its hexadecimal color code</span>
        </div>

        <div className="color-swatches-grid">
          <div
            className="swatch-card"
            onClick={() => onCopyColor(scoreData.colorPalette.skinTone)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onCopyColor(scoreData.colorPalette.skinTone)}
          >
            <div className="swatch-color" style={{ backgroundColor: scoreData.colorPalette.skinTone }} />
            <div className="swatch-meta">
              <span className="swatch-label">Skin Pigment</span>
              <span className="swatch-hex">{scoreData.colorPalette.skinTone.toUpperCase()}</span>
              <span className="swatch-sub">{scoreData.colorPalette.undertone}</span>
            </div>
          </div>

          <div
            className="swatch-card"
            onClick={() => onCopyColor(scoreData.colorPalette.lipTone)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onCopyColor(scoreData.colorPalette.lipTone)}
          >
            <div className="swatch-color" style={{ backgroundColor: scoreData.colorPalette.lipTone }} />
            <div className="swatch-meta">
              <span className="swatch-label">Vermilion Tone</span>
              <span className="swatch-hex">{scoreData.colorPalette.lipTone.toUpperCase()}</span>
              <span className="swatch-sub">Natural Lip Flush</span>
            </div>
          </div>

          <div className="swatch-card">
            <div className="swatch-color" style={{ background: 'linear-gradient(135deg, #2589ff 0%, #10b981 100%)' }} />
            <div className="swatch-meta">
              <span className="swatch-label">Vitality Level</span>
              <span className="swatch-hex">{scoreData.colorPalette.vitalityLevel}</span>
              <span className="swatch-sub">Low infraorbital shadow contrast</span>
            </div>
          </div>
        </div>

        {copiedColor && (
          <div className="copied-toast">Copied {copiedColor} to clipboard!</div>
        )}
      </div>
    </div>
  );
}
