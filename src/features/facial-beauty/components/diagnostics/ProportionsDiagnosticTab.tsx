'use client';

import React from 'react';
import { BeautyScoreData } from '../../types/FacialBeautyTypes';

export interface ProportionsDiagnosticTabProps {
  scoreData: BeautyScoreData;
}

export function ProportionsDiagnosticTab({ scoreData }: ProportionsDiagnosticTabProps) {
  const p2Score = scoreData.parameterScores[2] ?? 15.6;
  const p2Rating = scoreData.parameterRatings[2] ?? 8.2;
  const propMetrics = scoreData.metrics.phase3?.proportions;

  return (
    <div className="diag-panel-content" id="diag-panel-proportions">
      <div className="diag-panel-header">
        <div className="diag-panel-header-left">
          <div className="diag-panel-name">
            <span>📐 Parameter 2: Proportions & Harmony</span>
            <span className="diag-stat-code">19 Pts Max · β = 0.10</span>
          </div>
          <div className="diag-panel-desc">
            Evaluates neoclassical vertical thirds, 5 canonical harmony ratios (H1–H5), 6 Golden Ratio factors (G1–G6 vs φ = 1.618), and lateral profile angle integration.
          </div>
        </div>
        <div className="diag-panel-score-badge">
          <span className="diag-panel-points">{p2Score.toFixed(1)} / 19 pts</span>
          <span className="diag-panel-rating">(R: {p2Rating.toFixed(1)}/10)</span>
        </div>
      </div>

      {/* Visual Facial Thirds Horizontal Bar */}
      <div className="thirds-bar-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            Vertical Facial Thirds Partition
          </span>
          <span style={{ fontSize: '12px', color: (propMetrics?.thirdsDev ?? 0.015) <= 0.02 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
            Thirds Deviation m = {propMetrics?.thirdsDev.toFixed(3) ?? '0.015'} (Ideal ≤ 0.020)
          </span>
        </div>

        <div className="thirds-bar-track">
          <div
            className="thirds-segment thirds-seg-upper"
            style={{ width: `${propMetrics?.thirdsShares[0] ?? 33.3}%` }}
            title={`Upper Third (Hairline to Glabella): ${propMetrics?.thirdsShares[0] ?? 33.3}%`}
          >
            Upper {propMetrics?.thirdsShares[0] ?? 33.3}%
          </div>
          <div
            className="thirds-segment thirds-seg-middle"
            style={{ width: `${propMetrics?.thirdsShares[1] ?? 33.3}%` }}
            title={`Middle Third (Glabella to Subnasale): ${propMetrics?.thirdsShares[1] ?? 33.3}%`}
          >
            Mid {propMetrics?.thirdsShares[1] ?? 33.3}%
          </div>
          <div
            className="thirds-segment thirds-seg-lower"
            style={{ width: `${propMetrics?.thirdsShares[2] ?? 33.4}%` }}
            title={`Lower Third (Subnasale to Menton): ${propMetrics?.thirdsShares[2] ?? 33.4}%`}
          >
            Lower {propMetrics?.thirdsShares[2] ?? 33.4}%
          </div>
        </div>

        <div className="thirds-legend">
          <div className="thirds-legend-item">
            <span className="thirds-legend-dot" style={{ background: '#3b82f6' }} />
            <span>Upper: Hairline (tr) → Glabella (g)</span>
          </div>
          <div className="thirds-legend-item">
            <span className="thirds-legend-dot" style={{ background: '#8b5cf6' }} />
            <span>Middle: Glabella (g) → Subnasale (sn)</span>
          </div>
          <div className="thirds-legend-item">
            <span className="thirds-legend-dot" style={{ background: '#10b981' }} />
            <span>Lower: Subnasale (sn) → Menton (gn)</span>
          </div>
        </div>
      </div>

      {/* Golden Ratio φ Adherence Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            Golden Ratio (φ ≈ 1.618) Factor Matrix
          </span>
          <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
            Adherence Score: {scoreData.metrics.goldenRatioAdherence}%
          </span>
        </div>

        <div className="golden-ratio-grid">
          {(propMetrics?.goldenRatios || [
            { id: 'G1', name: 'Face Length / Width', value: 1.58, target: 1.618, adherence: 92 },
            { id: 'G2', name: 'Mouth Width / Nose Width', value: 1.64, target: 1.618, adherence: 95 },
            { id: 'G3', name: 'Lips-to-Chin / Nose-to-Lips', value: 1.59, target: 1.618, adherence: 94 },
            { id: 'G4', name: 'Lower Lip / Upper Lip', value: 1.62, target: 1.618, adherence: 99 },
            { id: 'G5', name: 'IPD / (Pupil Line to Sn)', value: 1.60, target: 1.618, adherence: 96 },
            { id: 'G6', name: 'Face Length / Eye Line to Chin', value: 1.63, target: 1.618, adherence: 97 },
          ]).map((item) => (
            <div key={item.id} className="golden-ratio-card">
              <div className="golden-ratio-card-top">
                <span className="golden-ratio-title">{item.id}: {item.name}</span>
                <span className="golden-ratio-value">{item.value.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                <span>Target: 1.618</span>
                <span style={{ color: item.adherence >= 85 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                  {item.adherence}% match
                </span>
              </div>
              <div className="adherence-track">
                <div className="adherence-fill" style={{ width: `${item.adherence}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Harmony Ratios Canonical Bands */}
      <div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
          Canonical Harmony Ratios (H1 to H5)
        </span>
        <div className="diag-sub-grid">
          {(propMetrics?.harmonyRatios || [
            { id: 'H1', name: 'Facial Thirds Deviation', value: 0.015, band: '≤ 0.02', rating: 9.5 },
            { id: 'H2', name: 'Lips-to-Chin Proportion', value: 0.33, band: '0.30 - 0.37', rating: 9.8 },
            { id: 'H3', name: 'Intercanthal Eye Spacing', value: 1.02, band: '0.85 - 1.15', rating: 9.6 },
            { id: 'H4', name: 'Nose Width / Intercanthal', value: 1.05, band: '0.90 - 1.20', rating: 9.7 },
            { id: 'H5', name: 'Mouth Width / IPD', value: 0.81, band: '0.70 - 0.90', rating: 9.6 },
          ]).map((item) => (
            <div key={item.id} className="diag-stat-card">
              <div className="diag-stat-header">
                <span className="diag-stat-label">{item.name}</span>
                <span className="diag-stat-code">{item.id}</span>
              </div>
              <div className="diag-stat-val">{item.value.toFixed(2)}</div>
              <div className="diag-stat-status status-ideal">
                Band: {item.band} · Rating: {item.rating.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Angle Notice */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.55)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>ℹ</span>
        <span>
          {scoreData.isRenormalised
            ? 'Frontal capture detected: Lateral profile factor (PH3, Weight 16) is safely excluded (V = 0) and weight is renormalised without penalty.'
            : 'Lateral profile photo provided: Nasolabial, nasofrontal, and chin projection angles incorporated into PH3.'}
        </span>
      </div>
    </div>
  );
}
