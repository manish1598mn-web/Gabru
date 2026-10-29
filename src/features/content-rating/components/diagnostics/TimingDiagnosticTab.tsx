'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function TimingDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 9);
  const isExcluded = param?.isRenormalized && param?.points === 0;
  const rating = param?.rating ?? 10.0;
  const points = param?.points ?? 0;

  return (
    <div className="diag-tab-pane" id="diag-pane-timing">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge timing-badge">09 • TIMING &amp; FREQUENCY</div>
          <h4 className="diag-param-heading">Audience Active Windows &amp; Publishing Cadence</h4>
          <p className="diag-param-sub">
            Audits post publishing timestamps against audience activity heat maps and regularity of posting cadence. Requires Path B (OAuth) or Path C (Analytics CSV).
          </p>
        </div>
        <div className="diag-pane-score-box">
          {isExcluded ? (
            <span className="diag-excluded-chip">V=0 EXCLUDED</span>
          ) : (
            <>
              <span className="diag-big-score">{points.toFixed(1)}</span>
              <span className="diag-score-denom">/4 pts</span>
              <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
            </>
          )}
        </div>
      </div>

      {/* Analytics Notice Card */}
      <div className="content-timing-notice-card">
        {isExcluded ? (
          <div className="timing-notice-inner">
            <span className="timing-lock-icon">🔒</span>
            <div>
              <h5 className="timing-notice-title">Owner Analytics Required for Timing Audit</h5>
              <p className="timing-notice-desc">
                Public URLs do not expose private audience hourly geography or retention check drops. In accordance with Rule A2.3, Timing &amp; Frequency is cleanly excluded (V=0) and its 4 points are renormalized across observable parameters without penalizing your score.
              </p>
            </div>
          </div>
        ) : (
          <div className="timing-active-card">
            <div className="timing-window-metric">
              <span>PUBLISHED AT: 14:30 UTC</span>
              <span className="timing-tag optimal">✓ Within ±1h of Peak Audience Window</span>
            </div>
          </div>
        )}
      </div>

      {/* Subfactor Breakdown Grid */}
      <div className="diag-sub-grid">
        {param?.subfactors.map((sub) => (
          <div key={sub.code} className="diag-sub-card">
            <div className="diag-sub-top">
              <span className="diag-sub-code">{sub.code}</span>
              <span className="diag-sub-weight">{sub.weight}% Weight</span>
              <span className="diag-sub-rating">
                {sub.visibility === 0 ? 'V=0 (N/A)' : `${sub.adjustedRating.toFixed(1)}/10`}
              </span>
            </div>
            <h5 className="diag-sub-name">{sub.name}</h5>
            <div className="diag-sub-penalties">
              {sub.visibility === 0 ? (
                <div className="clean-sub-tag">Excluded from public link analysis (Renormalized)</div>
              ) : sub.penalties.length > 0 ? (
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
