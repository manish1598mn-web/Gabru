'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface SymmetryDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function SymmetryDiagnosticTab({ scoreData }: SymmetryDiagnosticTabProps) {
  const p5Score = scoreData.parameterScores[5] ?? 8.9;
  const p5Rating = scoreData.parameterRatings[5] ?? 8.2;
  const symMetrics = scoreData.metrics.phase4?.symmetry;

  return (
    <div className="diag-panel-content" id="diag-panel-symmetry">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>⚖️ Parameter 5: Facial Symmetry</span>
            <span className="diag-stat-code">11 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Bilateral horizontal (Ah) and vertical (Av) parity evaluated across pupils, exocanthion, brow peaks, nasal midline verticality, oral commissure tilt, and bizygomatic/gonial angle contours.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p5Score.toFixed(1)} / 11 pts</span>
          <span className="diag-panel-rating">(R: {p5Rating.toFixed(1)}/10)</span>
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
          gap: '8px'
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
            Nasion &amp; subnasale sagittal verticality
          </div>
        </div>
      </div>

      {/* Symmetry Subfactors Grid */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Symmetry Sub-Factor Diagnostic Breakdown
        </span>
        <div className="diag-sub-grid">
          {(symMetrics?.subfactors || [
            { id: 'SY1', name: 'Bilateral Eye & Brow Level', ah: 2.1, av: 1.4, rating: 8.5, note: 'Pupil Ah=2.1%, Av=1.4%' },
            { id: 'SY2', name: 'Nose & Midline Verticality', ah: 1.2, rating: 8.8, note: 'Nasal tip offset 1.2% of bizygomatic width' },
            { id: 'SY3', name: 'Oral Commissure & Mandibular Parity', ah: 1.5, av: 1.1, rating: 8.6, note: 'Mouth tilt 1.1% of IPD' },
            { id: 'SY4', name: 'Cheekbone & Gonial Angle Symmetry', ah: 2.3, rating: 8.7, note: 'Cheeks Ah=2.3%, Jaw Ah=2.0%' },
          ]).map((item) => (
            <div key={item.id} className="diag-stat-card">
              <div className="diag-stat-header">
                <span className="diag-stat-label">{item.name}</span>
                <span className="diag-stat-code">{item.id}</span>
              </div>
              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
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

