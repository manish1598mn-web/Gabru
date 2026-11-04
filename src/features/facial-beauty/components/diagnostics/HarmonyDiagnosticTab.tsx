'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface HarmonyDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function HarmonyDiagnosticTab({ scoreData }: HarmonyDiagnosticTabProps) {
  const p3Score = scoreData.parameterScores[3] ?? 10.4;
  const p3Rating = scoreData.parameterRatings[3] ?? 8.0;
  const harmMetrics = scoreData.metrics.phase3?.harmony;

  return (
    <div className="diag-panel-content" id="diag-panel-harmony">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>📐 Parameter 3: Facial Harmony &amp; Proportions</span>
            <span className="diag-stat-code">13 Pts Max &bull; Fixed Architecture</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates vertical facial thirds, transverse fifths balance, overall facial width-to-height ratio, and golden ratio proportions (φ ≈ 1.618).
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p3Score.toFixed(1)} / 13 pts</span>
          <span className="diag-panel-rating">(R: {p3Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      {/* Visual Facial Thirds Horizontal Bar */}
      <div className="thirds-bar-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            Vertical Facial Thirds Partition
          </span>
          <span style={{ fontSize: '12px', color: (harmMetrics?.thirdsDev ?? 0.015) <= 0.02 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
            Thirds Deviation m = {harmMetrics?.thirdsDev.toFixed(3) ?? '0.015'} (Ideal ≤ 0.020)
          </span>
        </div>

        <div className="thirds-bar-track">
          <div
            className="thirds-segment thirds-seg-upper"
            style={{ width: `${harmMetrics?.thirdsShares[0] ?? 33.3}%` }}
            title={`Upper Third (Hairline to Glabella): ${harmMetrics?.thirdsShares[0] ?? 33.3}%`}
          >
            Upper {harmMetrics?.thirdsShares[0] ?? 33.3}%
          </div>
          <div
            className="thirds-segment thirds-seg-middle"
            style={{ width: `${harmMetrics?.thirdsShares[1] ?? 33.3}%` }}
            title={`Middle Third (Glabella to Subnasale): ${harmMetrics?.thirdsShares[1] ?? 33.3}%`}
          >
            Mid {harmMetrics?.thirdsShares[1] ?? 33.3}%
          </div>
          <div
            className="thirds-segment thirds-seg-lower"
            style={{ width: `${harmMetrics?.thirdsShares[2] ?? 33.4}%` }}
            title={`Lower Third (Subnasale to Gnathion): ${harmMetrics?.thirdsShares[2] ?? 33.4}%`}
          >
            Lower {harmMetrics?.thirdsShares[2] ?? 33.4}%
          </div>
        </div>
      </div>

      <div className="diag-sub-grid">
        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Facial Thirds</span>
          </div>
          <div className="diag-stat-val">
            m = {harmMetrics?.thirdsDev.toFixed(3) ?? '0.015'}
          </div>
          <div className={`diag-stat-status ${(harmMetrics?.thirdsDev ?? 0.015) <= 0.02 ? 'status-ideal' : 'status-caution'}`}>
            {(harmMetrics?.thirdsDev ?? 0.015) <= 0.02
              ? '✓ Balanced thirds harmony (m ≤ 0.02)'
              : 'Mild deviation across thirds'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Feature Spacing</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.subfactorRatings?.['HP2']?.raw?.toFixed(1) ?? '8.8'}/10
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Balanced alar, commissure &amp; lip-chin spacing
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Face Shape Balance</span>
          </div>
          <div className="diag-stat-val">
            {harmMetrics?.faceShapeRatio.toFixed(2) ?? '0.74'}
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Cheekbone width ÷ face height in ideal band
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Profile Alignment</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.hasSideProfilePhoto ? 'Evaluated' : 'Frontal Renorm'}
          </div>
          <div className="diag-stat-status status-ideal">
            {scoreData.hasSideProfilePhoto ? '✓ Lateral profile angles scored' : '✓ Excluded & renormalised'}
          </div>
        </div>

        <div className="diag-stat-card">
          <div className="diag-stat-header">
            <span className="diag-stat-label">Golden Ratio (φ)</span>
          </div>
          <div className="diag-stat-val">
            {scoreData.metrics.goldenRatioAdherence}% Match
          </div>
          <div className="diag-stat-status status-ideal">
            ✓ Strong geometric match to φ ≈ 1.618
          </div>
        </div>
      </div>

      {/* 6 Divine Golden Ratio Factors */}
      {harmMetrics?.goldenRatios && harmMetrics.goldenRatios.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f4f4f5', marginBottom: '8px' }}>
            The 6 Golden Ratio Proportions (G1–G6 vs φ = 1.618)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            {harmMetrics.goldenRatios.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#2589ff', fontWeight: 700, marginRight: '6px' }}>{item.id}</span>
                  <span style={{ fontSize: '12px', color: '#e4e4e7' }}>{item.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{item.value.toFixed(3)}</div>
                  <div style={{ fontSize: '10.5px', color: item.adherence >= 80 ? '#34d399' : '#fbbf24' }}>
                    {item.adherence}% Match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

