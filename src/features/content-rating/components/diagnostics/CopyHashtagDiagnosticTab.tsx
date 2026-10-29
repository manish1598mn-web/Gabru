'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function CopyHashtagDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 5);
  const rating = param?.rating ?? 5.5;
  const points = param?.points ?? 5.5;
  const item = scoreData.item;

  return (
    <div className="diag-tab-pane" id="diag-pane-copy">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge copy-badge">05 • CAPTION, COPY &amp; HASHTAGS</div>
          <h4 className="diag-param-heading">Flesch Readability, SEO Keywords &amp; Hashtag Bands</h4>
          <p className="diag-param-sub">
            Audits the truncated preview line, search engine indexability, formatting line breaks, and hashtag quantity against platform norms (IG: 3–5, YT: 2–4).
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/10 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Caption Preview Box */}
      <div className="content-caption-audit-card">
        <div className="caption-audit-header">
          <span>LIVE CAPTION PREVIEW</span>
          <span className="caption-tag-count">{item.hashtags.length} Hashtags Used</span>
        </div>
        <div className="caption-body-preview">
          &ldquo;{item.caption || 'Stop wasting clicks in VS Code. Here is the hidden keybinding that saves 30 minutes a day #vscode'}&rdquo;
        </div>
        <div className="caption-warning-strip">
          ⚠️ <strong>Optimization Opportunity:</strong> Only 1 hashtag used. Expanding to 3–5 targeted tags improves discoverability without triggering spam filters.
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

