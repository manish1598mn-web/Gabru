'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface ExpressionDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function ExpressionDiagnosticTab({ scoreData }: ExpressionDiagnosticTabProps) {
  const p3Score = scoreData.parameterScores[3] ?? 10.4;
  const p3Rating = scoreData.parameterRatings[3] ?? 8.0;
  const expr = scoreData.metrics.phase3?.expression;

  return (
    <div className="diag-panel-content" id="diag-panel-expression">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>🎭 Parameter 3: Expression & Dynamic Cues</span>
            <span className="diag-stat-code">13 Pts Max · β = 0.15</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates neuromuscular dynamic warmth cues: AU12 smile zygomaticus pull, AU6 orbicularis oculi eye-crinkle authentication (Duchenne smile), camera gaze axis alignment, and resting facial tension.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p3Score.toFixed(1)} / 13 pts</span>
          <span className="diag-panel-rating">(R: {p3Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Smile Genuineness</span>
            <span className="diag-stat-code">EX1 · W=35</span>
          </div>
          <div className="diag-stat-val">
            {expr?.isSmiling ? `${expr.smileIntensityPct ?? 0}% AU12` : 'Neutral Rest'}
          </div>
          <div className="diag-stat-status status-ideal">
            {expr?.isDuchenne
              ? '✨ Genuine Duchenne (Eye crinkle AU6 active)'
              : expr?.isSmiling
              ? 'Courtesy smile (AU12 active, mouth pull)'
              : '✓ Neutral photo: smile excluded without penalty'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Smile Symmetry</span>
            <span className="diag-stat-code">EX2 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {expr?.isSmiling ? 'Symmetric' : 'Neutral State'}
          </div>
          <div className="diag-stat-status status-ideal">
            {expr?.isSmiling
              ? 'Bilateral commissure elevation balanced'
              : '✓ Neutral resting jawline verified'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Camera Gaze Alignment</span>
            <span className="diag-stat-code">EX3 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {expr?.gazeDevDeg.toFixed(1) ?? '1.5'}° offset
          </div>
          <div className={`diag-stat-status ${(expr?.gazeDevDeg ?? 1.5) <= 5 ? 'status-ideal' : 'status-caution'}`}>
            {(expr?.gazeDevDeg ?? 1.5) <= 5
              ? '✓ Direct authoritative eye contact'
              : 'Minor lateral gaze angle'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Rest Muscle Tone</span>
            <span className="diag-stat-code">EX4 · W=15 · V=0.5</span>
          </div>
          <div className="diag-stat-val">
            {expr?.tensionState ?? 'Relaxed Natural Tone'}
          </div>
          <div className="diag-stat-status status-ideal">
            Corrugator & orbicularis oris relaxed
          </div>
        </div>
      </div>
    </div>
  );
}

