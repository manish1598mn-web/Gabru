'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function HookDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 1);
  const rating = param?.rating ?? 6.5;
  const points = param?.points ?? 11.7;

  return (
    <div className="diag-tab-pane" id="diag-pane-hook">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge hook-badge">01 • HOOK &amp; OPENING</div>
          <h4 className="diag-param-heading">First 3 Seconds, Verbal Punchline &amp; Curiosity Gap</h4>
          <p className="diag-param-sub">
            The first 3 seconds determine whether 65%+ of social feed viewers swipe away. Evaluates time to first visual payoff, title match, and curiosity gap.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/18 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="content-hook-timeline-card">
        <div className="timeline-header">
          <span className="timeline-title">ATTENTION TIMELINE (00:00 - 00:08)</span>
          <span className="timeline-tag">FIRST VALUE DELAYED (00:06)</span>
        </div>
        <div className="timeline-track">
          <div className="track-segment hook-window" style={{ width: '37.5%' }}>
            <span className="segment-label">0–3s Golden Hook</span>
            <span className="segment-desc">Initial Verbal Hook</span>
          </div>
          <div className="track-segment build-window" style={{ width: '37.5%' }}>
            <span className="segment-label">3–6s Explanation</span>
            <span className="segment-desc">Talking Head Transition</span>
          </div>
          <div className="track-segment payoff-window" style={{ width: '25%' }}>
            <span className="segment-label">6s+ Payoff</span>
            <span className="segment-desc">First Visual Shortcut</span>
          </div>
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

