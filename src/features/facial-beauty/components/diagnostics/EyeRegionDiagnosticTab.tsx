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
            <span className="diag-stat-code">ER1 · W=25 · Fixed</span>
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
            <span className="diag-stat-code">ER2 · W=20 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            +{eyeMetrics?.canthalTiltDeg.toFixed(1) ?? '3.2'}°
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.canthalTiltDeg ?? 3.2) >= -2.0 && (eyeMetrics?.canthalTiltDeg ?? 3.2) <= 10.0 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.canthalTiltDeg ?? 3.2) >= -2.0 && (eyeMetrics?.canthalTiltDeg ?? 3.2) <= 10.0
              ? '✓ Upward / neutral canthal tilt (−2° to +10°)'
              : 'Canthal tilt outside standard band'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyelids &amp; Iris Coverage</span>
            <span className="diag-stat-code">ER3 · W=20 · Fixed</span>
          </div>
          <div className="diag-stat-val">
            {(((eyeMetrics?.irisCoverageRatio ?? 0.12)) * 100).toFixed(0)}% Cover
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.irisCoverageRatio ?? 0.12) <= 0.25 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.irisCoverageRatio ?? 0.12) <= 0.15
              ? '✓ Clear palpebral aperture (c ≤ 15%)'
              : (eyeMetrics?.irisCoverageRatio ?? 0.12) <= 0.25
              ? 'Mild upper lid iris drape (c ≤ 25%)'
              : 'Pronounced upper lid iris coverage'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Under-Eye &amp; Eye Clarity</span>
            <span className="diag-stat-code">ER4 · W=20 · Changeable</span>
          </div>
          <div className="diag-stat-val">
            ΔL* {eyeMetrics?.underEyeDeltaL.toFixed(1) ?? '4.5'}
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.underEyeDeltaL ?? 4.5) <= 7.0 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.underEyeDeltaL ?? 4.5) <= 4.0
              ? '✓ Bright periorbital zone (ΔL* ≤ 4)'
              : (eyeMetrics?.underEyeDeltaL ?? 4.5) <= 7.0
              ? 'Mild under-eye contrast (ΔL* ≤ 7)'
              : 'Moderate under-eye fatigue shadow'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Eyebrow Shape &amp; Position</span>
            <span className="diag-stat-code">ER5 · W=15 · Changeable</span>
          </div>
          <div className="diag-stat-val">
            {((eyeMetrics?.browPositionRatio ?? 0.065) * 100).toFixed(1)}%
          </div>
          <div className={`diag-stat-status ${(eyeMetrics?.browPositionRatio ?? 0.065) >= 0.050 && (eyeMetrics?.browPositionRatio ?? 0.065) <= 0.085 ? 'status-ideal' : 'status-caution'}`}>
            {(eyeMetrics?.browPositionRatio ?? 0.065) >= 0.050 && (eyeMetrics?.browPositionRatio ?? 0.065) <= 0.085
              ? '✓ Harmonious brow-to-eye height ratio (5.0%–8.5% of face)'
              : 'Brow position slightly outside canonical ratio'}
          </div>
        </div>
      </div>
    </div>
  );
}

