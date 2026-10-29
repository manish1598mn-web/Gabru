'use client';

import React from 'react';
import {
  ContentScoreData,
  DeepDiveContentTabKey,
} from '../types/ContentRatingTypes';
import { PARAM_TO_TAB } from '../constants/ContentRatingConstants';

interface ContentEvidenceSectionProps {
  scoreData: ContentScoreData | null;
  onSelectTab: (tab: DeepDiveContentTabKey) => void;
}

export function ContentEvidenceSection({
  scoreData,
  onSelectTab,
}: ContentEvidenceSectionProps) {
  if (!scoreData) {
    return null;
  }

  const { pros, cons } = scoreData;

  const navigateToParam = (paramName: string) => {
    const param = scoreData.qualityBreakdown.parameters.find(
      (p) => p.name.toLowerCase() === paramName.toLowerCase()
    );
    if (param && PARAM_TO_TAB[param.id]) {
      onSelectTab(PARAM_TO_TAB[param.id]);
      const el = document.getElementById('content-diagnostic-suite');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="content-evidence-section" id="content-evidence-section">
      <div className="section-header-compact">
        <div className="section-header-eyebrow">
          <span className="badge-pulse-dot content-pulse-dot" />
          <span>OBJECTIVE EVIDENCE AUDIT</span>
          <span className="strip-eyebrow-sep">•</span>
          <span>GROUND TRUTH OBSERVATIONS</span>
        </div>
        <h3 className="section-title-gradient">Evidence Matrix: Strengths &amp; Flaws</h3>
        <p className="section-sub-clean">
          Ground-truth pros and cons derived directly from keyframe timestamps, audio metrics, and transcript analysis.
          Every score is substantiated by concrete physical evidence.
        </p>
      </div>

      <div className="evidence-columns-grid">
        {/* Left Column: Strengths (Top 3 Pros) */}
        <div className="evidence-column pros-column" id="evidence-pros-column">
          <div className="evidence-column-header pros-header">
            <div className="evidence-header-icon-wrap pros-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h4 className="evidence-column-title">Key Craft Strengths</h4>
              <span className="evidence-column-subtitle">Subfactors rated &ge; 8.0/10 with strong execution</span>
            </div>
            <span className="evidence-count-badge pros-badge">{pros.length} Identified</span>
          </div>

          <div className="evidence-cards-list">
            {pros.length > 0 ? (
              pros.map((pro, idx) => (
                <div key={idx} className="evidence-card pro-card" id={`evidence-pro-${idx}`}>
                  <div className="evidence-card-top">
                    <span className="evidence-param-tag">{pro.parameter}</span>
                    <span className="evidence-score-pill pro-pill">{pro.rating.toFixed(1)} / 10</span>
                  </div>

                  <h5 className="evidence-card-title">{pro.title}</h5>

                  <div className="evidence-box pro-evidence-box">
                    <div className="evidence-box-label">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Evidence Reference:</span>
                      <strong className="evidence-ref-code">{pro.evidence.ref}</strong>
                    </div>
                    <p className="evidence-box-note">{pro.evidence.note}</p>
                  </div>

                  <div className="evidence-card-footer">
                    <button
                      type="button"
                      className="btn-evidence-jump"
                      onClick={() => navigateToParam(pro.parameter)}
                    >
                      <span>Inspect Parameter</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="evidence-empty-box">
                <p>No subfactors reached the &ge; 8.0 threshold yet. Apply ranked fixes to unlock higher ratings.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Flaws & Penalties (Top 3 Cons) */}
        <div className="evidence-column cons-column" id="evidence-cons-column">
          <div className="evidence-column-header cons-header">
            <div className="evidence-header-icon-wrap cons-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h4 className="evidence-column-title">Priority Craft Flaws</h4>
              <span className="evidence-column-subtitle">Subfactors rated &le; 6.0/10 pulling down total score</span>
            </div>
            <span className="evidence-count-badge cons-badge">{cons.length} Detected</span>
          </div>

          <div className="evidence-cards-list">
            {cons.length > 0 ? (
              cons.map((con, idx) => (
                <div key={idx} className="evidence-card con-card" id={`evidence-con-${idx}`}>
                  <div className="evidence-card-top">
                    <span className="evidence-param-tag con-tag">{con.parameter}</span>
                    <span className="evidence-score-pill con-pill">{con.rating.toFixed(1)} / 10</span>
                  </div>

                  <h5 className="evidence-card-title">{con.title}</h5>

                  <div className="evidence-box con-evidence-box">
                    <div className="evidence-box-label con-label">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>Flaw Location:</span>
                      <strong className="evidence-ref-code">{con.evidence.ref}</strong>
                    </div>
                    <p className="evidence-box-note">{con.evidence.note}</p>
                  </div>

                  <div className="evidence-card-footer">
                    <button
                      type="button"
                      className="btn-evidence-jump con-jump"
                      onClick={() => navigateToParam(con.parameter)}
                    >
                      <span>View Diagnostic Details</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="evidence-empty-box pristine-box">
                <div className="pristine-icon">✨</div>
                <h5>Zero Critical Flaws Detected</h5>
                <p>All observable subfactors meet or exceed the 6.5 craft baseline. Excellent production discipline.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

