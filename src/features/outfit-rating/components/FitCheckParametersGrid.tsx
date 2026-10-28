'use client';

import React from 'react';
import { OutfitScoreData } from '../types/OutfitRatingTypes';
import { OUTFIT_PARAMETERS } from '../constants/OutfitRatingConstants';

export interface FitCheckParametersGridProps {
  photoScore: OutfitScoreData | null;
  isAnalyzing: boolean;
  shuffleScores: Record<number, number>;
  onShareClick: () => void;
}

export function FitCheckParametersGrid({
  photoScore,
  isAnalyzing,
  shuffleScores,
  onShareClick,
}: FitCheckParametersGridProps) {
  return (
    <div className="integrated-photo-score-area" id="photo-score-section">
      <div className={`scorecard-wrapper ${isAnalyzing ? 'analyzing' : ''}`} id="photo-score-dashboard">
        {/* Executive Section Header Strip */}
        <div className="scorecard-clean-strip" id="scorecard-clean-strip">
          <div className="scorecard-strip-info">
            <div className="strip-eyebrow">
              <span className="badge-pulse-dot" />
              <span>SARTORIAL MATRIX</span>
              <span className="strip-eyebrow-sep">•</span>
              <span>100-POINT SYSTEM</span>
            </div>
            <h3 className="scorecard-strip-title">10-Parameter Outfit Breakdown</h3>
            <p className="scorecard-strip-sub">
              Standardized multi-dimensional evaluation across fit, harmony, details, and personal polish.
            </p>
          </div>

          {/* 3 Tier Allocation & Score Indicators */}
          <div className="scorecard-tier-pills" id="scorecard-tier-pills">
            <div className="tier-pill-box">
              <span className="tier-pill-name">Foundations</span>
              <span className="tier-pill-score">
                {photoScore ? (
                  <>
                    <strong className="tier-val">{photoScore.tier1Score}</strong>
                    <span className="tier-max">/71</span>
                  </>
                ) : (
                  <span className="tier-unscored">71 Pts</span>
                )}
              </span>
            </div>

            <div className="tier-pill-box">
              <span className="tier-pill-name">Details</span>
              <span className="tier-pill-score">
                {photoScore ? (
                  <>
                    <strong className="tier-val">{photoScore.tier2Score}</strong>
                    <span className="tier-max">/20</span>
                  </>
                ) : (
                  <span className="tier-unscored">20 Pts</span>
                )}
              </span>
            </div>

            <div className="tier-pill-box">
              <span className="tier-pill-name">Polish</span>
              <span className="tier-pill-score">
                {photoScore ? (
                  <>
                    <strong className="tier-val">{photoScore.tier3Score}</strong>
                    <span className="tier-max">/9</span>
                  </>
                ) : (
                  <span className="tier-unscored">9 Pts</span>
                )}
              </span>
            </div>

            {photoScore && (
              <button
                type="button"
                className="btn-strip-share-card"
                onClick={onShareClick}
                id="btn-strip-share-card"
                title="Generate Social Media Scorecard"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share Card</span>
              </button>
            )}
          </div>
        </div>

        {/* All 10 Outfit Parameter Cards */}
        <div className="compact-cards-grid" id="compact-cards-grid">
          {OUTFIT_PARAMETERS.map((param) => {
            const score = photoScore ? photoScore.parameterScores[param.id] : null;
            const ratingDetail = photoScore ? photoScore.parameterRatings[param.id] : null;

            return (
              <div
                key={param.id}
                className={`compact-metric-card scroll-reveal ${score === null && !isAnalyzing ? 'compact-metric-card-unscored' : 'compact-metric-card-scored'}`}
                id={`card-${param.id}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                  <span className="card-param-name">{param.name}</span>
                  {ratingDetail && !isAnalyzing && (
                    <span className="card-rating-badge">R: {ratingDetail.ratingR}/10</span>
                  )}
                </div>

                <div className="card-score-value-row">
                  {isAnalyzing ? (
                    <span className="shuffling-number">
                      {shuffleScores[param.id] ?? Math.floor(Math.random() * (param.maxPts + 1))}
                      <span className="score-max-denom">/{param.maxPts}</span>
                    </span>
                  ) : score !== null ? (
                    <span className="calculated-number">
                      {score}
                      <span className="score-max-denom">/{param.maxPts}</span>
                    </span>
                  ) : (
                    <span className="unscored-number">
                      --<span className="score-max-denom">/{param.maxPts}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

