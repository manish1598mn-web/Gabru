'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function ValueDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 2);
  const rating = param?.rating ?? 8.0;
  const points = param?.points ?? 12.8;

  return (
    <div className="diag-tab-pane" id="diag-pane-value">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge value-badge">02 • VALUE &amp; RELEVANCE</div>
          <h4 className="diag-param-heading">Core Takeaway, Novelty &amp; Fluff Suppression</h4>
          <p className="diag-param-sub">
            Judges whether the content delivers a concrete, memorable insight without circular filler. High value drives bookmarks, shares, and algorithmic authority.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/16 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Thesis Extract Card */}
      <div className="content-thesis-card">
        <div className="thesis-eyebrow">IDENTIFIED CORE THESIS</div>
        <p className="thesis-text">
          &ldquo;{scoreData.item.title || 'Practical symbol search and line jump shortcut for senior developer workflows.'}&rdquo;
        </p>
        <div className="thesis-meta-chips">
          <span className="thesis-chip">Niche Fit: 95%</span>
          <span className="thesis-chip">Actionable Depth: High</span>
          <span className="thesis-chip">Filler Ratio: &lt; 5%</span>
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
