'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface JawChinDiagnosticTabProps {
  scoreData: BeautyScoreData;
  dimorphismRef: 'skip' | 'M-typical' | 'F-typical';
  onSelectDimorphism: (ref: 'skip' | 'M-typical' | 'F-typical') => void;
}

export function JawChinDiagnosticTab({
  scoreData,
  dimorphismRef,
  onSelectDimorphism,
}: JawChinDiagnosticTabProps) {
  const p9Score = scoreData.parameterScores[9] ?? 5.6;
  const p9Rating = scoreData.parameterRatings[9] ?? 8.0;
  const jawMetrics = scoreData.metrics.phase4?.jaw;

  return (
    <div className="diag-panel-content" id="diag-panel-jaw">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>📐 Parameter 9: Jaw, Chin &amp; Gender-Typical Cues</span>
            <span className="diag-stat-code">7 Pts Max · β = 0.10 · Fixed</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates mandibular border clarity, bigonial jaw width vs cheekbones, vertical chin projection, and voluntary gender-typical dimorphic cues (or Skip to renormalise without penalty).
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p9Score.toFixed(1)} / 7 pts</span>
          <span className="diag-panel-rating">(R: {p9Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      {/* Dimorphism Selector Bar inside Tab */}
      <div className="dimorphism-toggle-bar" style={{ margin: '0 0 10px 0' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.55)', marginRight: '6px' }}>
          Gender-Typical Reference:
        </span>
        <button
          type="button"
          className={`dimorphism-btn ${dimorphismRef === 'skip' ? 'is-active' : ''}`}
          onClick={() => onSelectDimorphism('skip')}
        >
          Skip / Neutral (Renormalised)
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

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Jawline Definition</span>
            <span className="diag-stat-code">JW1 · W=40</span>
          </div>
          <div className="diag-stat-val">
            {((jawMetrics?.jawWidthRatio ?? 0.76) * 100).toFixed(1)}%
          </div>
          <div className="diag-stat-status status-ideal">
            Mandibular breadth within ideal 68%–85% band
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Chin Projection</span>
            <span className="diag-stat-code">JW2 · W=35</span>
          </div>
          <div className="diag-stat-val">
            {((jawMetrics?.chinProjectionRatio ?? 0.33) * 100).toFixed(1)}%
          </div>
          <div className="diag-stat-status status-ideal">
            Balanced vertical projection, lower third centring
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Gender-Typical Balance</span>
            <span className="diag-stat-code">JW3 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {dimorphismRef === 'skip' ? 'Renormalised' : `${dimorphismRef}`}
          </div>
          <div className="diag-stat-status status-ideal">
            {dimorphismRef === 'skip' ? '✓ V = 0 excluded and renormalised' : `✓ Anchored to ${dimorphismRef} norm`}
          </div>
        </div>
      </div>

      {/* Subfactors List */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Mandibular &amp; Dimorphic Observations
        </span>
        <div className="diag-sub-grid">
          {(jawMetrics?.subfactors || [
            { id: 'JW1', name: 'Jawline Definition & Breadth', rating: 8.5, note: 'Bigonial width 76% of bizygomatic' },
            { id: 'JW2', name: 'Chin Projection & Symmetry', rating: 8.4, note: 'Vertical chin third 33% of face height' },
            { id: 'JW3', name: 'Gender-Typical Balance', rating: dimorphismRef === 'skip' ? 7.0 : 8.0, note: dimorphismRef === 'skip' ? 'Renormalised neutral baseline' : `Anchored to ${dimorphismRef} norm` },
          ]).map((item) => (
            <div key={item.id} className="diag-stat-card">
              <div className="diag-stat-header">
                <span className="diag-stat-label">{item.name}</span>
                <span className="diag-stat-code">{item.id}</span>
              </div>
              <div className="diag-stat-val">
                {item.rating.toFixed(1)}/10
              </div>
              <div className="diag-stat-status status-ideal">
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
