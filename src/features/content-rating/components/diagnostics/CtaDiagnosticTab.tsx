'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function CtaDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 6);
  const rating = param?.rating ?? 4.0;
  const points = param?.points ?? 2.8;

  return (
    <div className="diag-tab-pane" id="diag-pane-cta">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge cta-badge">06 • CALL-TO-ACTION &amp; ENGAGEMENT</div>
          <h4 className="diag-param-heading">Single Focal Action &amp; Comment Catalyst Prompt</h4>
          <p className="diag-param-sub">
            Checks for exactly one clear closing directive, natural non-intrusive timing in the final 10% of runtime, and an open debate question to catalyze discussion.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/7 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* CTA Status Banner */}
      <div className="content-cta-audit-card">
        <div className="cta-audit-status flagged">
          <span className="cta-flag-icon">⚠️</span>
          <div>
            <div className="cta-flag-title">Engagement Call-To-Action Assessment</div>
            <div className="cta-flag-desc">
              {scoreData.suggestions.find((s) => s.parameterId === 6)?.description ||
                'Audits whether the post concludes with a clear conversational prompt to catalyze comments.'}
            </div>
          </div>
        </div>
        <div className="cta-fix-recommendation">
          💡 <strong>High-Conversion Pattern:</strong> Conclude with a specific, low-friction question that viewers can respond to immediately.
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

