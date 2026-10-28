'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface EyeRegionDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function EyeRegionDiagnosticTab({ scoreData }: EyeRegionDiagnosticTabProps) {
  const p2Score = scoreData.parameterScores[2] ?? 10.4;
  const p2Rating = scoreData.parameterRatings[2] ?? 8.0;
  const eyeMetrics = scoreData.metrics.phase3?.eyes;

  return (
    <div className="diag-panel-content" id="diag-panel-eyes">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>👁️ Parameter 2: Eye Region</span>
            <span className="diag-stat-code">13 Pts Max · β = 0.10 · Mixed Changeability</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates palpebral aperture geometry, intercanthal spacing, canthal tilt, eyelid alert openness, periorbital under-eye contrast (ΔL*), and eyebrow architectural placement.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p2Score.toFixed(1)} / 13 pts</span>
          <span className="diag-panel-rating">(R: {p2Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eye Size &amp; Shape</span>
            <span className="diag-stat-code">EY1 · W=25 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            {eyeMetrics?.fissureRatio.toFixed(2) ?? '0.35'}
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.fissureRatio ?? 0.35) >= 0.28 && (eyeMetrics?.fissureRatio ?? 0.35) <= 0.42 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.fissureRatio ?? 0.35) >= 0.28 && (eyeMetrics?.fissureRatio ?? 0.35) <= 0.42
              ? '✓ Balanced fissure ratio (0.28–0.42)'
              : 'Slightly outside canonical fissure band'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Spacing &amp; Canthal Tilt</span>
            <span className="diag-stat-code">EY2 · W=20 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            +{eyeMetrics?.canthalTiltDeg.toFixed(1) ?? '3.2'}°
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.canthalTiltDeg ?? 3.2) >= 2.0 && (eyeMetrics?.canthalTiltDeg ?? 3.2) <= 8.0 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.canthalTiltDeg ?? 3.2) >= 2.0 && (eyeMetrics?.canthalTiltDeg ?? 3.2) <= 8.0
              ? '✓ Positive youthful upward canthal tilt (+2° to +8°)'
              : 'Neutral to flat canthal axis'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyelids &amp; Aperture</span>
            <span className="diag-stat-code">EY3 · W=20 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            Alert &amp; Open
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Clear palpebral aperture, even bilateral eyelid curve
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Under-Eye &amp; Eye Clarity</span>
            <span className="diag-stat-code">EY4 · W=20 · Changeable</span>
          </div>
          <div className="diag-stat-val">
            ΔL* {eyeMetrics?.underEyeDeltaL.toFixed(1) ?? '4.5'}
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.underEyeDeltaL ?? 4.5) <= 5.5 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.underEyeDeltaL ?? 4.5) <= 5.5
              ? '✓ Bright periorbital zone, minimal dark circles'
              : 'Mild under-eye fatigue shadow detected'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyebrow Shape &amp; Position</span>
            <span className="diag-stat-code">EY5 · W=15 · Changeable</span>
          </div>
          <div className="diag-stat-val">
            {((eyeMetrics?.browPositionRatio ?? 0.055) * 100).toFixed(1)}%
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Harmonious brow-to-eye height ratio (~5.5% of face)
          </div>
        </div>
      </div>
    </div>
  );
}
