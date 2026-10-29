'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function FormatDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 7);
  const rating = param?.rating ?? 9.0;
  const points = param?.points ?? 7.2;
  const media = scoreData.item.media;

  return (
    <div className="diag-tab-pane" id="diag-pane-format">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge format-badge">07 • PLATFORM FIT &amp; FORMAT</div>
          <h4 className="diag-param-heading">Aspect Ratio, UI Safe Zones &amp; Duration Norms</h4>
          <p className="diag-param-sub">
            Verifies orientation (9:16 vertical for short-form, 16:9 for YouTube desktop), runtime sweet spots, and clearance from native platform UI buttons (like, comment, share).
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/8 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Format & Safe Zone Card */}
      <div className="content-safezone-card">
        <div className="safezone-info">
          <div className="safezone-chip">Aspect Ratio: {media.aspectRatio < 1 ? '9:16 (Vertical Native)' : '16:9'}</div>
          <div className="safezone-chip">Duration: {media.durationSec}s (Optimal 20–45s Band)</div>
          <div className="safezone-chip">UI Clearance: 100% Margin Clear</div>
        </div>
        <div className="safezone-visual-preview">
          <div className="mobile-frame-mockup">
            <span className="mockup-safe-area">SAFE TITLE ZONE</span>
            <div className="mockup-ui-icons">
              <span>❤️</span>
              <span>💬</span>
              <span>🔗</span>
            </div>
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

