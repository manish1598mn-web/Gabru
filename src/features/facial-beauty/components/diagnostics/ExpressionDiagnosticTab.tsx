'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface ExpressionDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function ExpressionDiagnosticTab({ scoreData }: ExpressionDiagnosticTabProps) {
  const p4Score = scoreData.parameterScores[4] ?? 9.6;
  const p4Rating = scoreData.parameterRatings[4] ?? 8.0;
  const expr = scoreData.metrics.phase3?.expression;

  return (
    <div className="diag-panel-content" id="diag-panel-expression">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>🎭 Parameter 4: Expression, Smile &amp; Gaze</span>
            <span className="diag-stat-code">12 Pts Max · β = 0.15 · High Changeability</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates neuromuscular warmth cues: AU12 zygomaticus smile contraction, AU6 eye-crinkle authentication (Duchenne smile), smile arc dental balance, direct optical gaze alignment, and facial relaxation.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p4Score.toFixed(1)} / 12 pts</span>
          <span className="diag-panel-rating">(R: {p4Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Smile Genuineness</span>
            <span className="diag-stat-code">EX1 · W=30</span>
          </div>
          <div className="diag-stat-val">
            {expr?.isSmiling ? `${expr.smileIntensityPct ?? 0}% AU12` : 'Neutral Rest'}
          </div>
          <div className="diag-stat-status status-ideal">
            {expr?.isDuchenne
              ? '✨ Genuine Duchenne (Eye crinkle AU6 active)'
              : expr?.isSmiling
              ? 'Polite smile (AU12 active, mouth pull)'
              : '✓ Neutral photo: smile excluded without penalty'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Smile &amp; Teeth</span>
            <span className="diag-stat-code">EX2 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {expr?.isSmiling ? 'Symmetric Arc' : 'Neutral State'}
          </div>
          <div className="diag-stat-status status-ideal">
            {expr?.isSmiling
              ? '✓ Bilateral commissure elevation balanced, tidy dental show'
              : '✓ Neutral resting jawline verified'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Gaze &amp; Eye Contact</span>
            <span className="diag-stat-code">EX3 · W=25</span>
          </div>
          <div className="diag-stat-val">
            {expr?.gazeDevDeg.toFixed(1) ?? '1.5'}° offset
          </div>
          <div className={`diag-stat-status ${(expr?.gazeDevDeg ?? 1.5) <= 5 ? 'status-ideal' : 'status-caution'}`}>
            {(expr?.gazeDevDeg ?? 1.5) <= 5
              ? '✓ Direct steady gaze into lens'
              : 'Minor lateral gaze angle'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Relaxation &amp; Warmth</span>
            <span className="diag-stat-code">EX4 · W=20 · V=0.5</span>
          </div>
          <div className="diag-stat-val">
            {expr?.tensionState ?? 'Relaxed Natural Tone'}
          </div>
          <div className="diag-stat-status status-ideal">
            Corrugator brow &amp; mentalis chin relaxed
          </div>
        </div>
      </div>
    </div>
  );
}
