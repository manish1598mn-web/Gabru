'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface SymmetryDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function SymmetryDiagnosticTab({ scoreData }: SymmetryDiagnosticTabProps) {
  const p7Score = scoreData.parameterScores[7] ?? 7.4;
  const p7Rating = scoreData.parameterRatings[7] ?? 8.2;
  const symMetrics = scoreData.metrics.phase4?.symmetry;

  return (
    <div className="diag-panel-content" id="diag-panel-symmetry">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>⚖️ Parameter 7: Facial Symmetry</span>
            <span className="diag-stat-code">9 Pts Max · β = 0.10 · Fixed</span>
          </div>
          <div className="diag-panel-desc">
            Bilateral horizontal (Ah) and vertical (Av) parity evaluated across pupils, outer canthi, brow peaks, nasal midline alignment, oral commissure level, and bigonial jaw contours.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p7Score.toFixed(1)} / 9 pts</span>
          <span className="diag-panel-rating">(R: {p7Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      {symMetrics?.isFilterSuspected && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '12px',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>⚠️</span>
          <span>
            <strong>Filter / Mirroring Artifact Guard:</strong> Bilateral asymmetry is unnaturally low (&lt; 0.45%) or digital mirroring was detected. A conservative visibility dampener (V = 0.5) is applied to prevent inflated ratings from beauty filters.
          </span>
        </div>
      )}

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Overall Symmetry Index</span>
            <span className="diag-stat-code">100% Scale</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.metrics.symmetryIndex}%
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ High natural bilateral parity
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Mean Asymmetry (Ah)</span>
            <span className="diag-stat-code">Ah Ideal ≤ 3.0%</span>
          </div>
          <div className="diag-stat-val">
            {symMetrics?.meanAsymmetryPct.toFixed(1) ?? '2.1'}%
          </div>
          <div className={`diag-stat-status ${(symMetrics?.meanAsymmetryPct ?? 2.1) <= 3.0 ? 'status-ideal' : 'status-caution'}`}>
            {(symMetrics?.meanAsymmetryPct ?? 2.1) <= 3.0
              ? '✓ Normal physiological bilateral balance'
              : 'Mild natural facial lateralization'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyes &amp; Brows Parity</span>
            <span className="diag-stat-code">SY1 · W=30</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.subfactorRatings?.['SY1']?.raw?.toFixed(1) ?? '8.5'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Pupil &amp; brow line horizontal level
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Nose &amp; Midline Parity</span>
            <span className="diag-stat-code">SY2 · W=20</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.subfactorRatings?.['SY2']?.raw?.toFixed(1) ?? '8.8'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Nasal tip &amp; nasion midline alignment
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Mouth &amp; Chin Parity</span>
            <span className="diag-stat-code">SY3 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.subfactorRatings?.['SY3']?.raw?.toFixed(1) ?? '8.6'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Horizontal commissures &amp; menton sagittal line
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Cheeks &amp; Jaw Balance</span>
            <span className="diag-stat-code">SY4 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.subfactorRatings?.['SY4']?.raw?.toFixed(1) ?? '8.4'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Bilateral zygion &amp; gonial angle balance
          </div>
        </div>
      </div>
    </div>
  );
}
