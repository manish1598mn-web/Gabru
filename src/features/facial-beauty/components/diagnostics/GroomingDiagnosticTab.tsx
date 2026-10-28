'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface GroomingDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function GroomingDiagnosticTab({ scoreData }: GroomingDiagnosticTabProps) {
  const p6Score = scoreData.parameterScores[6] ?? 8.9;
  const p6Rating = scoreData.parameterRatings[6] ?? 8.9;
  const grooming = scoreData.metrics.phase4?.grooming;

  return (
    <div className="diag-panel-content" id="diag-panel-grooming">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>💈 Parameter 6: Grooming &amp; Styling</span>
            <span className="diag-stat-code">10 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates highly actionable presentational styling signals: hairline perimeter definition, eyebrow arch architecture, styling silhouette balance, and accessory/eyewear integration.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p6Score.toFixed(1)} / 10 pts</span>
          <span className="diag-panel-rating">(R: {p6Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Hair Architecture</span>
            <span className="diag-stat-code">GS1 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.hairScore.toFixed(1) ?? '9.0'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Clean hairline perimeter &amp; temple edges
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyebrow Definition</span>
            <span className="diag-stat-code">GS2 · W=20</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.browScore.toFixed(1) ?? '8.8'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Defined arch contour &amp; balanced density
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Styling Silhouette</span>
            <span className="diag-stat-code">GS5 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.stylingScore.toFixed(1) ?? '9.1'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Volume frames natural jawline &amp; cheekbones
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Grooming Tier</span>
            <span className="diag-stat-code">Controllable</span>
          </div>
          <div className="diag-stat-val" style={{ fontSize: '16px' }}>
            {grooming?.groomingTier ?? 'Polished & Refined'}
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ High aesthetic cohesion
          </div>
        </div>
      </div>

      {/* Grooming Subfactors Detailed Cards */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Grooming &amp; Styling Sub-Factor Observations
        </span>
        <div className="diag-sub-grid">
          {(grooming?.subfactors || [
            { id: 'GS1', name: 'Hair Architecture & Edges', rating: 9.0, status: 'Clean hairline perimeter and controlled temple edges', note: 'Controlled peripheral flyaways' },
            { id: 'GS2', name: 'Eyebrow Architecture & Grooming', rating: 8.8, status: 'Balanced eyebrow density and defined lower arch', note: 'Defined natural arch line' },
            { id: 'GS3', name: 'Makeup Blending & Application', rating: 7.0, status: 'Natural presentation / bare face', note: 'V = 0 excluded (no disadvantage)' },
            { id: 'GS4', name: 'Eyewear & Accessory Fit', rating: 7.0, status: 'No optical frames detected', note: 'V = 0 excluded (renormalised)' },
            { id: 'GS5', name: 'Styling Cohesion & Silhouette', rating: 9.1, status: 'Hairstyle volume harmoniously frames jawline', note: 'Cohesive aesthetic silhouette' },
          ]).map((item) => (
            <div key={item.id} className="diag-stat-card">
              <div className="diag-stat-header">
                <span className="diag-stat-label">{item.name}</span>
                <span className="diag-stat-code">{item.id}</span>
              </div>
              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
              <div className="diag-stat-status status-ideal" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span>{item.status}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

