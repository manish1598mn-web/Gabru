'use client';

/**
 * GABRU — CONTENT RATING SCORECARD
 * 
 * 10-Parameter Social Media Craft & Performance Scorecard:
 * - Executive Strip Header with Quality vs Performance allocation pills
 * - 10 Responsive Metric Cards with distinct luxury gradient tokens
 * - Click-to-navigate directly to the corresponding Diagnostic Deep Dive
 */

import React from 'react';
import { ContentScoreData, DeepDiveContentTabKey } from '../types/ContentRatingTypes';
import {
  CONTENT_PARAMETERS,
  CONTENT_CARD_BACKGROUNDS,
  PARAM_TO_TAB,
} from '../constants/ContentRatingConstants';

export interface ContentRatingScorecardProps {
  scoreData: ContentScoreData | null;
  isAnalyzing: boolean;
  onSelectTab: (tab: DeepDiveContentTabKey) => void;
  onShareScore: () => void;
}

export function ContentRatingScorecard({
  scoreData,
  isAnalyzing,
  onSelectTab,
  onShareScore,
}: ContentRatingScorecardProps) {
  const handleCardClick = (paramId: number) => {
    if (!scoreData) return;
    const tabKey = PARAM_TO_TAB[paramId];
    if (tabKey) {
      onSelectTab(tabKey);
      const el = document.getElementById('content-diagnostic-suite');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="content-scorecard-wrapper" id="content-scorecard-section">
      {/* Executive Section Header Strip */}
      <div className="scorecard-clean-strip content-strip" id="scorecard-clean-strip">
        <div className="scorecard-strip-info">
          <div className="about-section-eyebrow">
            <span>10-PARAMETER CRAFT &amp; REACH RUBRIC</span>
          </div>
          <h3 className="scorecard-strip-title">10-Parameter Craft &amp; Reach Breakdown</h3>
          <p className="scorecard-strip-sub">
            {scoreData
              ? `Audited ${scoreData.item.platform.toUpperCase()} ${scoreData.item.format.replace('_', ' ')}: Quality Score ${scoreData.qualityScore.toFixed(1)}/100, Performance Score ${scoreData.performanceScore !== null ? scoreData.performanceScore.toFixed(1) : 'Provisional'}/100.`
              : 'Deterministic evaluation across Hook (18), Value (16), Structure (12), Visual & Audio (14), Copy (10), CTA (7), Platform Fit (8), Originality (6), Timing (4), and Trust & Compliance (5).'}
          </p>
        </div>

        {/* Evidence Allocation & Score Indicators */}
        <div className="scorecard-tier-pills" id="scorecard-tier-pills">
          <div className="tier-pill-box quality-border" title="Craft Score judged directly from the content itself">
            <span className="tier-pill-name">Craft Quality</span>
            <span className="tier-pill-score">
              {scoreData ? (
                <>
                  <strong className="tier-val">{scoreData.qualityScore.toFixed(1)}%</strong>
                  <span className="tier-max">(70% Weight)</span>
                </>
              ) : (
                <span className="tier-unscored">70% Weight</span>
              )}
            </span>
          </div>

          <div className="tier-pill-box perf-border" title="Empirical metrics benchmarked against the creator's historical baseline">
            <span className="tier-pill-name">Creator Baseline</span>
            <span className="tier-pill-score">
              {scoreData && scoreData.performanceScore !== null ? (
                <>
                  <strong className="tier-val">{scoreData.performanceScore.toFixed(1)}%</strong>
                  <span className="tier-max">(30% Weight)</span>
                </>
              ) : (
                <span className="tier-unscored">
                  {scoreData ? 'Too Fresh' : '30% Weight'}
                </span>
              )}
            </span>
          </div>

          <div className="tier-pill-box conf-border" title="Measurement confidence based on data completeness">
            <span className="tier-pill-name">Confidence</span>
            <span className="tier-pill-score">
              {scoreData ? (
                <>
                  <strong className="tier-val">{Math.round(scoreData.confidenceScore * 100)}%</strong>
                  <span className="tier-max">{scoreData.confidence}</span>
                </>
              ) : (
                <span className="tier-unscored">--</span>
              )}
            </span>
          </div>

          {scoreData && (
            <button
              type="button"
              className="btn-strip-share-card content-share-btn"
              onClick={onShareScore}
              id="btn-strip-share-card"
              title="Generate High-Res 1080x1350 Style Card"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Export Card</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 METRIC CARDS (2 ROWS OF 5 ON DESKTOP) */}
      <div className="compact-cards-grid cards-10-grid" id="compact-cards-grid">
        {CONTENT_PARAMETERS.map((param) => {
          const score = scoreData ? scoreData.qualityBreakdown.parameterScores[param.id] : null;
          const rating = scoreData ? scoreData.qualityBreakdown.parameterRatings[param.id] : null;
          const paramResult = scoreData?.qualityBreakdown.parameters.find((p) => p.id === param.id);
          const isExcluded = paramResult?.isRenormalized && paramResult?.points === 0;

          return (
            <div
              key={param.id}
              className={`compact-metric-card scroll-reveal ${
                score === null && !isAnalyzing
                  ? 'compact-metric-card-unscored'
                  : 'compact-metric-card-scored'
              }`}
              id={`content-card-${param.id}`}
              style={{
                background: CONTENT_CARD_BACKGROUNDS[param.id],
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                cursor: scoreData ? 'pointer' : 'default',
              }}
              title={
                scoreData
                  ? `Click to inspect ${param.name} diagnostic evidence and recommendations`
                  : param.name
              }
              onClick={() => handleCardClick(param.id)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <span className="card-param-name">{param.name}</span>
                {rating !== null && rating !== undefined && !isAnalyzing && !isExcluded && (
                  <span className="card-rating-badge content-rating-badge">R: {rating.toFixed(1)}/10</span>
                )}
                {isExcluded && (
                  <span className="card-rating-badge excluded-badge">V=0 EXCLUDED</span>
                )}
              </div>

              <div className="card-score-value-row">
                {isAnalyzing ? (
                  <span className="shuffling-number">
                    {Math.floor(Math.random() * (param.weight + 1))}
                    <span className="score-max-denom">/{param.weight}</span>
                  </span>
                ) : isExcluded ? (
                  <span className="unscored-number" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                    Excluded<span className="score-max-denom">/{param.weight}</span>
                  </span>
                ) : score !== null && score !== undefined ? (
                  <span className="calculated-number">
                    {score.toFixed(1)}
                    <span className="score-max-denom">/{param.weight}</span>
                  </span>
                ) : (
                  <span className="unscored-number">
                    --<span className="score-max-denom">/{param.weight}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

