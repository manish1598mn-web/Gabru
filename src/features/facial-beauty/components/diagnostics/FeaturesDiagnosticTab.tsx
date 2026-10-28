'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface FeaturesDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function FeaturesDiagnosticTab({ scoreData }: FeaturesDiagnosticTabProps) {
  const p8Score = scoreData.parameterScores[8] ?? 5.6;
  const p8Rating = scoreData.parameterRatings[8] ?? 8.0;
  const feat = scoreData.metrics.phase4?.features;

  return (
    <div className="diag-panel-content" id="diag-panel-features">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>👁️ Parameter 8: Individual Features</span>
            <span className="diag-stat-code">7 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates isolated feature dimensions (eyes, nose, lips, jaw) against broad anthropometric canons. Includes active Rule A4 protection to prevent double-counting deviations already scored in Parameter 4 Averageness.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p8Score.toFixed(1)} / 7 pts</span>
          <span className="diag-panel-rating">(R: {p8Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Canthal Tilt</span>
            <span className="diag-stat-code">IF1 · W=35</span>
          </div>
          <div className="diag-stat-val">
            +{feat?.canthalTiltDeg.toFixed(1) ?? '3.2'}°
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Positive upward palpebral axis
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Nasal Proportion</span>
            <span className="diag-stat-code">IF2 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {feat?.nasalWidthRatio.toFixed(2) ?? '0.26'}
          </div>
          <div className="diag-stat-status status-ideal">
            Balanced alar width vs bizygomatic
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Lip Vermilion Fullness</span>
            <span className="diag-stat-code">IF3 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {feat?.lipFullnessRatio.toFixed(2) ?? '0.35'}
          </div>
          <div className="diag-stat-status status-ideal">
            Harmonious oral aperture fullness
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Gonial Mandibular Breadth</span>
            <span className="diag-stat-code">IF4 · W=15</span>
          </div>
          <div className="diag-stat-val">
            {feat?.jawContourRatio.toFixed(2) ?? '0.76'}
          </div>
          <div className="diag-stat-status status-ideal">
            Smooth defined jawline contour
          </div>
        </div>
      </div>

      {/* Feature Subfactors with Active Rule A4 Protection Badges */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Feature Dimension Sub-Factors &amp; Rule A4 Protection Status
        </span>
        <div className="diag-sub-grid">
          {(feat?.subfactors || [
            { id: 'IF1', name: 'Orbital Aperture & Canthal Tilt', rating: 8.5, note: 'Canthal tilt +3.2°, fissure ratio 0.35', isProtectedByRuleA4: false },
            { id: 'IF2', name: 'Nasal Proportion & Dorsum Fit', rating: 8.5, note: 'Nasal length 0.44, width 0.26', isProtectedByRuleA4: false },
            { id: 'IF3', name: 'Lip Vermilion Balance & Contour', rating: 8.5, note: 'Mouth width 0.38, fullness 0.35', isProtectedByRuleA4: false },
            { id: 'IF4', name: 'Jaw Contour Smoothness & Angle', rating: 8.5, note: 'Mandibular breadth 0.76', isProtectedByRuleA4: false },
          ]).map((item) => (
            <div key={item.id} className="diag-stat-card">
              <div className="diag-stat-header">
                <span className="diag-stat-label">{item.name}</span>
                <span className="diag-stat-code">{item.id}</span>
              </div>
              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
              <div className="diag-stat-status status-ideal" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span>{item.note}</span>
                {item.isProtectedByRuleA4 && (
                  <span className="outlier-tag" style={{ marginTop: '2px' }}>
                    ⚡ Rule A4 Protection Active: Penalty halved from Averageness flag
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

