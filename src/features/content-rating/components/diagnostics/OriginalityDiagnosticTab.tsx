'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function OriginalityDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 8);
  const rating = param?.rating ?? 7.0;
  const points = param?.points ?? 4.2;

  return (
    <div className="diag-tab-pane" id="diag-pane-originality">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge orig-badge">08 • ORIGINALITY &amp; CONSISTENCY</div>
          <h4 className="diag-param-heading">Creator Signature, Brand Voice &amp; Creative Remixing</h4>
          <p className="diag-param-sub">
            Evaluates distinctive delivery style, personal brand consistency, and creative remixing of trends rather than 1:1 derivative copycat templates.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/6 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Brand Voice Card */}
      <div className="content-brand-voice-card">
        <div className="brand-voice-header">
          <span>BRAND VOICE PROFILE</span>
          <span className="voice-badge">{scoreData.archetypeTier.toUpperCase()}</span>
        </div>
        <p className="brand-voice-desc">
          Distinctive delivery cadence and narrative framing consistent with the &ldquo;{scoreData.verdictBadge}&rdquo; persona.
        </p>
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

