'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface NeckPostureDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function NeckPostureDiagnosticTab({ scoreData }: NeckPostureDiagnosticTabProps) {
  const p10Score = scoreData.parameterScores[10] ?? 3.4;
  const p10Rating = scoreData.parameterRatings[10] ?? 8.5;
  const neckMetrics = scoreData.metrics.phase4?.neck;

  return (
    <div className="diag-panel-content" id="diag-panel-neck">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>🦒 Parameter 10: Neck, Ears &amp; Head Carriage</span>
            <span className="diag-stat-code">4 Pts Max · β = 0.10 · Mixed Changeability</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates cervical support line under the jaw, bilateral ear symmetry/placement (or V = 0 if hair-occluded), and Frankfurt horizontal head posture alignment.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p10Score.toFixed(1)} / 4 pts</span>
          <span className="diag-panel-rating">(R: {p10Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Neck Line</span>
            <span className="diag-stat-code">NP1 · W=35 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            Defined Contour
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Clean supportive cervicomental angle under mandible
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Ears</span>
            <span className="diag-stat-code">NP2 · W=25 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            Proportional Placement
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Otobasion level &amp; size balanced (V = 0 if hair-occluded)
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Posture &amp; Head Carriage</span>
            <span className="diag-stat-code">NP3 · W=40 · Changeable</span>
          </div>
          <div className="diag-stat-val">
            {neckMetrics?.postureAlignmentDeg.toFixed(1) ?? '1.8'}° tilt
          </div>
          <div className={`diag-stat-status ${(neckMetrics?.postureAlignmentDeg ?? 1.8) <= 4.0 ? 'status-ideal' : 'status-caution'}`}>
            {(neckMetrics?.postureAlignmentDeg ?? 1.8) <= 4.0
              ? '✓ Frankfurt horizontal level alignment, chin lifted high'
              : 'Mild forward head pitch or lateral tilt detected'}
          </div>
        </div>
      </div>

      {/* Subfactors List */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Head Carriage &amp; Cervical Metrics
        </span>
        <div className="diag-sub-grid">
          {(neckMetrics?.subfactors || [
            { id: 'NP1', name: 'Neck Line & Cervical Support', rating: 8.8, note: 'Smooth transition from mandible to cervical column' },
            { id: 'NP2', name: 'Ears Symmetry & Placement', rating: 7.0, note: 'V = 0 hair-occluded (renormalised without penalty)' },
            { id: 'NP3', name: 'Head Carriage & Posture Alignment', rating: 8.5, note: 'Level pitch and roll alignment' },
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
