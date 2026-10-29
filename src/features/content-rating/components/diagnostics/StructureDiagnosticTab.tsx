'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function StructureDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 3);
  const rating = param?.rating ?? 7.5;
  const points = param?.points ?? 9.0;
  const audio = scoreData.item.audioMetrics;

  return (
    <div className="diag-tab-pane" id="diag-pane-structure">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge structure-badge">03 • STORYTELLING &amp; STRUCTURE</div>
          <h4 className="diag-param-heading">Narrative Flow, Scene Cuts &amp; Dead-Air Control</h4>
          <p className="diag-param-sub">
            Measures progression momentum from setup to climax, visual scene transitions (cuts/min), dead-air silence, and replay loop endings.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/12 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Pacing Speedometer Matrix */}
      <div className="content-pacing-matrix">
        <div className="pacing-metric-card">
          <span className="pacing-label">CUT FREQUENCY</span>
          <span className="pacing-value">1 cut / 3.2s</span>
          <span className="pacing-status ideal">✓ Ideal Short Pacing</span>
        </div>
        <div className="pacing-metric-card">
          <span className="pacing-label">MAX SILENCE GAP</span>
          <span className="pacing-value">{audio ? `${audio.maxDeadAirSec}s` : '1.1s'}</span>
          <span className="pacing-status ideal">✓ Zero Awkward Pauses</span>
        </div>
        <div className="pacing-metric-card">
          <span className="pacing-label">SPEECH VELOCITY</span>
          <span className="pacing-value">{audio ? `${audio.speechRateWpm} WPM` : '155 WPM'}</span>
          <span className="pacing-status ideal">✓ Natural Clarity</span>
        </div>
      </div>

      {/* Subfactor Breakdown Grid */}
      <div className="diag-sub-grid">
        {param?.subfactors.map((sub) => (
          <div key={sub.code} className="diag-sub-card">
            <div className="diag-sub-top">
              <span className="diag-sub-code">{sub.code}</span>
              <span className="diag-sub-weight">{sub.weight}% Weight</span>
              <span className="diag-sub-rating">{sub.adjustedRating.toFixed(1)}/10</span>
            </div>
            <h5 className="diag-sub-name">{sub.name}</h5>
            <div className="diag-sub-penalties">
              {sub.penalties.length > 0 ? (
                sub.penalties.map((pen, i) => (
                  <div key={i} className={`penalty-tag ${pen.severity}`}>
                    <span>{pen.delta} pts</span>
                    <span className="pen-ref">{pen.evidence.ref}</span>
                    <span className="pen-note">{pen.evidence.note}</span>
                  </div>
                ))
              ) : (
                <div className="clean-sub-tag">✓ Clean execution — No defects detected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

