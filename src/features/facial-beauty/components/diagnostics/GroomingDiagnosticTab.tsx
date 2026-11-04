'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface GroomingDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function GroomingDiagnosticTab({ scoreData }: GroomingDiagnosticTabProps) {
  const p5Score = scoreData.parameterScores[5] ?? 8.8;
  const p5Rating = scoreData.parameterRatings[5] ?? 8.0;
  const grooming = scoreData.metrics.phase3?.grooming;

  return (
    <div className="diag-panel-content" id="diag-panel-grooming">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>💈 Parameter 5: Grooming &amp; Styling</span>
            <span className="diag-stat-code">11 Pts Max &bull; Controllable</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates actionable styling signals: hairstyle neatness, clean perimeter edges, facial hair grooming, eyewear coordination, and aesthetic polish.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p5Score.toFixed(1)} / 11 pts</span>
          <span className="diag-panel-rating">(R: {p5Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Hair</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.hairScore.toFixed(1) ?? '9.0'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Clean perimeter lines &amp; flattering silhouette volume
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Facial Hair &amp; Brow Tidiness</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.browScore.toFixed(1) ?? '8.8'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Neatly shaped brows &amp; well-kept beard/shave edges
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Makeup Application</span>
          </div>
          <div className="diag-stat-val">
            Natural Baseline
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Bare face neutral baseline: no penalty or disadvantage
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Glasses</span>
          </div>
          <div className="diag-stat-val">
            Unobstructed
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ No frames detected: excluded and renormalised
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Overall Cohesion</span>
          </div>
          <div className="diag-stat-val">
            {grooming?.stylingScore.toFixed(1) ?? '9.1'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            Volume harmoniously frames natural jawline geometry
          </div>
        </div>
      </div>
    </div>
  );
}
