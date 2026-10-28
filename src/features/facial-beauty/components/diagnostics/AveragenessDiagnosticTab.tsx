'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface AveragenessDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function AveragenessDiagnosticTab({ scoreData }: AveragenessDiagnosticTabProps) {
  const p4Score = scoreData.parameterScores[4] ?? 9.8;
  const p4Rating = scoreData.parameterRatings[4] ?? 8.2;
  const avgMetrics = scoreData.metrics.phase3?.averageness;

  return (
    <div className="diag-panel-content" id="diag-panel-averageness">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>🧬 Parameter 4: Averageness & Morphometrics</span>
            <span className="diag-stat-code">12 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Quantifies proximity to evolutionary population median via 16-landmark Procrustes shape distance D and 6 anthropometric size distributions. Outliers (|z| &gt; 1.5) safely halve penalties in Parameter 8 to prevent double-counting (Rule A4).
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p4Score.toFixed(1)} / 12 pts</span>
          <span className="diag-panel-rating">(R: {p4Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Procrustes Shape Distance</span>
            <span className="diag-stat-code">AV1 · W=50</span>
          </div>
          <div className="diag-stat-val">
            D = {avgMetrics?.procrustesDistance.toFixed(3) ?? '0.076'}
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ 16-point alignment to population mean archetype
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Shape Typicality Z-Score</span>
            <span className="diag-stat-code">AV1 · W=50</span>
          </div>
          <div className="diag-stat-val">
            z = {avgMetrics?.shapeZ.toFixed(2) ?? '0.25'}
          </div>
          <div className={`diag-stat-status ${(avgMetrics?.shapeZ ?? 0.25) <= 0.5 ? 'status-ideal' : 'status-caution'}`}>
            {(avgMetrics?.shapeZ ?? 0.25) <= 0.5
              ? '✓ High typicality (z ≤ 0.50, no penalty)'
              : 'Moderate deviation from population median'}
          </div>
        </div>
      </div>

      {/* 6 Anthropometric Size Ratios with Z-Score Distributions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            6 Anthropometric Size Ratios &amp; Z-Scores (AV2, W=50)
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)' }}>
            Target: |z| ≤ 1.50
          </span>
        </div>

        <div className="golden-ratio-grid">
          {(avgMetrics?.sizeRatios || [
            { name: 'Eye Width / Bizygomatic', value: 0.22, z: 0.1, flagged: false },
            { name: 'Nose Width / Bizygomatic', value: 0.26, z: -0.2, flagged: false },
            { name: 'Mouth Width / Bizygomatic', value: 0.38, z: 0.3, flagged: false },
            { name: 'Bigonial Jaw / Bizygomatic', value: 0.76, z: -0.1, flagged: false },
            { name: 'Vermilion Lip / Total Face Height', value: 0.092, z: 0.0, flagged: false },
            { name: 'Nasal Dorsum / Subnasal Height', value: 0.44, z: 0.2, flagged: false },
          ]).map((ratio, idx) => {
            const clampedZ = Math.max(-2.5, Math.min(2.5, ratio.z));
            const posPct = Math.round(((clampedZ + 2.5) / 5) * 100);

            return (
              <div key={idx} className="golden-ratio-card">
                <div className="golden-ratio-card-top">
                  <span className="golden-ratio-title">{ratio.name}</span>
                  <span className="golden-ratio-value">{ratio.value.toFixed(3)}</span>
                </div>

                <div className="zscore-wrapper">
                  <div className="zscore-distribution-bar">
                    <div className="zscore-zone-normal" title="Typical range (|z| ≤ 1.5)" />
                    <div className="zscore-center-marker" title="Population Mean (z = 0)" />
                    <div
                      className={`zscore-indicator-dot ${ratio.flagged ? 'zscore-dot-flagged' : 'zscore-dot-normal'}`}
                      style={{ left: `${posPct}%` }}
                      title={`Z-Score: ${ratio.z.toFixed(2)}`}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                    <span>-2.0σ</span>
                    <span style={{ fontWeight: 700, color: ratio.flagged ? '#f87171' : '#34d399' }}>
                      z = {ratio.z.toFixed(2)}
                    </span>
                    <span>+2.0σ</span>
                  </div>

                  {ratio.flagged ? (
                    <span className="outlier-tag">
                      ⚡ Outlier (|z| &gt; 1.5) · Parameter 8 penalty halved (Rule A4)
                    </span>
                  ) : (
                    <span className="normal-tag">
                      ✓ Population typical range
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
