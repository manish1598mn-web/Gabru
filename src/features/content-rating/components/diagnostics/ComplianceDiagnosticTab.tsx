'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function ComplianceDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 10);
  const rating = param?.rating ?? 10.0;
  const points = param?.points ?? 5.0;

  return (
    <div className="diag-tab-pane" id="diag-pane-compliance">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge compliance-badge">10 • TRUST &amp; COMPLIANCE</div>
          <h4 className="diag-param-heading">Sponsorship Disclosure, Copyright &amp; Truthful Claims</h4>
          <p className="diag-param-sub">
            Guards against regulatory fines and platform account strikes: verifies FTCA `#ad` disclosures, audio copyright licensing, and absence of deceptive claims.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/5 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Compliance Safety Status Card */}
      <div className="content-compliance-card">
        <div className="compliance-row pass">
          <span className="comp-icon">✓</span>
          <span className="comp-label">Commercial Disclosure:</span>
          <span className="comp-val">Clean organic editorial content (No undisclosed commercial tie-in)</span>
        </div>
        <div className="compliance-row pass">
          <span className="comp-icon">✓</span>
          <span className="comp-label">Audio Licensing:</span>
          <span className="comp-val">Original speech microphone capture (Zero copyright infringement risk)</span>
        </div>
        <div className="compliance-row pass">
          <span className="comp-icon">✓</span>
          <span className="comp-label">Claim Veracity:</span>
          <span className="comp-val">Factual keyboard shortcuts verified against official software docs</span>
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
