'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface DimorphismDiagnosticTabProps {
  scoreData: BeautyScoreData;
  dimorphismRef: 'skip' | 'M-typical' | 'F-typical';
  onSelectDimorphism: (ref: 'skip' | 'M-typical' | 'F-typical') => void;
}

export function DimorphismDiagnosticTab({
  scoreData,
  dimorphismRef,
  onSelectDimorphism,
}: DimorphismDiagnosticTabProps) {
  const p7Score = scoreData.parameterScores[7] ?? 5.5;
  const p7Rating = scoreData.parameterRatings[7] ?? 7.8;
  const dimFeatures = scoreData.metrics.phase4?.dimorphism.features;

  return (
    <div className="diag-panel-content" id="diag-panel-dimorphism">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>🧬 Parameter 7: Sexual Dimorphism</span>
            <span className="diag-stat-code">7 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Statistical anthropometric comparison against reference distribution (M-typical, F-typical, or Neutral/Skip). Reference sets are voluntary comparative distributions and do not infer identity or gender (Rule A5).
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p7Score.toFixed(1)} / 7 pts</span>
          <span className="diag-panel-rating">(R: {p7Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      {/* Dimorphism Selector Bar inside Tab */}
      <div className="dimorphism-toggle-bar" style={{ margin: '0 0 10px 0' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.55)', marginRight: '6px' }}>
          Active Reference Group:
        </span>
        <button
          type="button"
          className={`dimorphism-btn ${dimorphismRef === 'skip' ? 'is-active' : ''}`}
          onClick={() => onSelectDimorphism('skip')}
        >
          Skip / Neutral (Renormalised to 100 Pts)
        </button>
        <button
          type="button"
          className={`dimorphism-btn ${dimorphismRef === 'M-typical' ? 'is-active' : ''}`}
          onClick={() => onSelectDimorphism('M-typical')}
        >
          M-typical Reference
        </button>
        <button
          type="button"
          className={`dimorphism-btn ${dimorphismRef === 'F-typical' ? 'is-active' : ''}`}
          onClick={() => onSelectDimorphism('F-typical')}
        >
          F-typical Reference
        </button>
      </div>

      {dimorphismRef === 'skip' ? (
        <div style={{
          background: 'rgba(37, 137, 255, 0.08)',
          border: '1px solid rgba(37, 137, 255, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.5,
        }}>
          <strong>⚡ Neutral Reference Active:</strong> Sexual Dimorphism scoring is marked N/A at your choice. The remaining 93 points of the framework have been mathematically renormalised to 100 points, guaranteeing no score penalty.
        </div>
      ) : (
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
            Anthropometric Dimorphic Traits vs. {dimorphismRef} Distribution
          </span>
          <div className="golden-ratio-grid">
            {(dimFeatures || []).map((feat, idx) => {
              const clampedZ = Math.max(-2.5, Math.min(2.5, feat.zScore));
              const posPct = Math.round(((clampedZ + 2.5) / 5) * 100);

              return (
                <div key={idx} className="golden-ratio-card">
                  <div className="golden-ratio-card-top">
                    <span className="golden-ratio-title">{feat.name}</span>
                    <span className="golden-ratio-value" style={{ color: feat.penalty === 0 ? '#34d399' : '#fbbf24' }}>
                      z = {feat.zScore.toFixed(2)}
                    </span>
                  </div>

                  <div className="zscore-wrapper">
                    <div className="zscore-distribution-bar">
                      <div className="zscore-zone-normal" title="Ideal dimorphic band (-0.5 to +1.0)" />
                      <div className="zscore-center-marker" title="Distribution Center" />
                      <div
                        className="zscore-indicator-dot zscore-dot-normal"
                        style={{ left: `${posPct}%`, background: feat.penalty === 0 ? '#34d399' : '#fbbf24' }}
                        title={`Z-Score: ${feat.zScore.toFixed(2)}`}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                      <span>-2.0σ</span>
                      <span style={{ color: feat.penalty === 0 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                        {feat.penalty === 0 ? '✓ High typicality (0 pen)' : `-${feat.penalty.toFixed(1)} pen`}
                      </span>
                      <span>+2.0σ</span>
                    </div>

                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.50)', marginTop: '4px' }}>
                      {feat.note}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fairness Rule A5 Banner */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.50)',
        lineHeight: 1.45,
      }}>
        <strong>Fairness Guarantee (Rule A5):</strong> Identity, gender, age, or medical differences are never inferred from photos. Comparative reference norms serve strictly as statistical benchmarks and can be skipped at any time.
      </div>
    </div>
  );
}
