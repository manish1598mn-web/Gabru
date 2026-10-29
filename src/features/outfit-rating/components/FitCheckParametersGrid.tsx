'use client';

import React from 'react';
import { Button } from '@/shared';
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
            <div className="about-section-eyebrow">
              <span>10-PARAMETER SARTORIAL MATRIX</span>
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
              <span className="tier-pill-score font-tabular-nums">
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
              <span className="tier-pill-score font-tabular-nums">
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
              <span className="tier-pill-score font-tabular-nums">
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
              <Button
                variant="secondary"
                size="sm"
                onClick={onShareClick}
                id="btn-strip-share-card"
                title="Generate Social Media Scorecard"
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                }
              >
                Export Card
              </Button>
            )}
          </div>
        </div>

        {/* 10 Metric Cards Grid */}
        <div className="compact-cards-grid" id="compact-cards-grid">
          {OUTFIT_PARAMETERS.map((param) => {
            const score = isAnalyzing
              ? shuffleScores[param.id]
              : photoScore
              ? photoScore.parameterScores[param.id]
              : null;

            return (
              <div
                key={param.id}
                className={`metric-compact-card tier-${param.tier} ${isAnalyzing ? 'shuffling' : ''}`}
                id={`card-param-${param.id}`}
              >
                <div className="card-top-row">
                  <span className="card-param-id">P{param.id}</span>
                  <div className="card-score-pill">
                    <span className="card-score-value font-tabular-nums">
                      {score !== null && score !== undefined ? score : '--'}
                    </span>
                    <span className="card-score-denom">/{param.maxPts}</span>
                  </div>
                </div>

                <div className="card-meta">
                  <h4 className="card-param-name text-truncate">{param.name}</h4>
                  <p className="card-param-desc">{param.whatGetsChecked}</p>
                </div>

                <div className="card-footer-tier">
                  <span className="card-tier-label">Tier {param.tier}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
