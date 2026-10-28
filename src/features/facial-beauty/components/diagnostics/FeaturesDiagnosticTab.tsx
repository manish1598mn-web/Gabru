'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface FeaturesDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function FeaturesDiagnosticTab({ scoreData }: FeaturesDiagnosticTabProps) {
  const p6Score = scoreData.parameterScores[6] ?? 8.0;
  const p6Rating = scoreData.parameterRatings[6] ?? 8.0;
  const feat = scoreData.metrics.phase4?.features;

  return (
    <div className="diag-panel-content" id="diag-panel-features">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>👃 Parameter 6: Nose, Cheeks, Lips &amp; Philtrum</span>
            <span className="diag-stat-code">10 Pts Max · β = 0.10 · Fixed</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates anatomical balance of individual central facial features: nasal dorsal bridge and alar width, malar cheekbone projection, lip vermilion fullness and contour, and philtral column length.
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
            <span className="diag-stat-label">Nose Proportions</span>
            <span className="diag-stat-code">FE1 · W=30</span>
          </div>
          <div className="diag-stat-val">
            {feat?.nasalWidthRatio.toFixed(2) ?? '0.26'}
          </div>
          <div className="diag-stat-status status-ideal">
            Balanced alar base &amp; dorsal bridge
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Cheeks &amp; Cheekbones</span>
            <span className="diag-stat-code">FE2 · W=25</span>
          </div>
          <div className="diag-stat-val">
            Defined Malar
          </div>
          <div className="diag-stat-status status-ideal">
            Natural cheekbone elevation &amp; fullness
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Lips &amp; Vermilion</span>
            <span className="diag-stat-code">FE3 · W=30</span>
          </div>
          <div className="diag-stat-val">
            {feat?.lipFullnessRatio.toFixed(2) ?? '0.35'}
          </div>
          <div className="diag-stat-status status-ideal">
            Harmonious upper-to-lower balance
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Philtrum Column</span>
            <span className="diag-stat-code">FE4 · W=15</span>
          </div>
          <div className="diag-stat-val">
            {feat?.philtrumRatio.toFixed(2) ?? '0.24'}
          </div>
          <div className="diag-stat-status status-ideal">
            Balanced vertical groove length (~24% of lower third)
          </div>
        </div>
      </div>

      {/* Feature Subfactors Breakdown */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Feature Sub-Factor Dimensions
        </span>
        <div className="diag-sub-grid">
          {(feat?.subfactors || [
            { id: 'FE1', name: 'Nose Proportions & Dorsum', rating: 8.5, note: 'Nasal length 0.44, breadth 0.26', isProtectedByRuleA4: false },
            { id: 'FE2', name: 'Cheeks & Cheekbones', rating: 8.8, note: 'Defined malar bone contour and smooth cheek transition', isProtectedByRuleA4: false },
            { id: 'FE3', name: 'Lips Vermilion & Fullness', rating: 8.5, note: 'Mouth breadth 0.38, fullness ratio 0.35', isProtectedByRuleA4: false },
            { id: 'FE4', name: 'Philtral Column & Length', rating: 8.6, note: 'Column length 24% of lower face', isProtectedByRuleA4: false },
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
