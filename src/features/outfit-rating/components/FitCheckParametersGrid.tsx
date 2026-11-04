'use client';

import React from 'react';
import { Button } from '@/shared';
import { OutfitScoreData } from '../types/OutfitRatingTypes';
import { OUTFIT_PARAMETERS, OUTFIT_CARD_BACKGROUNDS } from '../constants/OutfitRatingConstants';

export interface FitCheckParametersGridProps {
  photoScore: OutfitScoreData | null;
  isAnalyzing: boolean;
  shuffleScores?: Record<number, number>;
  cardLockStates?: boolean[];
  justLockedCardId?: number | null;
  displayedHeroScore?: number | null;
  onShareClick: () => void;
}

const OUTFIT_PARAM_ICONS: Record<number, string> = {
  1: '📐',
  2: '⚖️',
  3: '🏛️',
  4: '🎨',
  5: '👔',
  6: '🧵',
  7: '👞',
  8: '✨',
  9: '🎯',
  10: '⚡',
};

function renderOutfitSketchWatermark(paramId: number) {
  switch (paramId) {
    case 1: // Fit & Tailoring (Tailor's shears, jacket lapel and chalk lines)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 22 30 L 50 16 L 78 30 L 84 84 L 16 84 Z" strokeDasharray="3 3" />
          <path d="M 50 16 L 36 50 L 50 62 L 64 50 Z" />
          <line x1="50" y1="16" x2="50" y2="84" strokeDasharray="2 2" />
          <circle cx="34" cy="24" r="2" fill="currentColor" />
          <circle cx="66" cy="24" r="2" fill="currentColor" />
          <line x1="28" y1="28" x2="32" y2="34" />
          <line x1="38" y1="36" x2="42" y2="42" />
          <line x1="68" y1="34" x2="72" y2="28" />
          <line x1="58" y1="42" x2="62" y2="36" />
        </svg>
      );
    case 2: // Proportion & Silhouette (Golden ratio vertical division, human silhouette frame)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="20" y1="12" x2="20" y2="88" strokeWidth="1.6" />
          <line x1="15" y1="12" x2="25" y2="12" />
          <line x1="15" y1="41" x2="27" y2="41" strokeWidth="1.8" />
          <line x1="15" y1="88" x2="25" y2="88" />
          <ellipse cx="60" cy="22" rx="10" ry="12" strokeDasharray="2 2" />
          <path d="M 46 38 L 74 38 L 68 64 L 52 64 Z" />
          <line x1="46" y1="38" x2="74" y2="38" strokeDasharray="2 2" />
          <line x1="56" y1="64" x2="53" y2="88" strokeWidth="1.5" />
          <line x1="64" y1="64" x2="67" y2="88" strokeWidth="1.5" />
          <circle cx="20" cy="41" r="2.5" fill="currentColor" />
        </svg>
      );
    case 3: // Occasion Appropriateness (Classical architectural pediment and ionic columns)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <polygon points="50,14 16,30 84,30" strokeWidth="1.5" />
          <line x1="12" y1="34" x2="88" y2="34" strokeWidth="1.5" />
          <rect x="22" y="38" width="9" height="42" rx="1" strokeDasharray="2 2" />
          <rect x="45" y="38" width="10" height="42" rx="1" strokeDasharray="2 2" />
          <rect x="69" y="38" width="9" height="42" rx="1" strokeDasharray="2 2" />
          <rect x="14" y="82" width="72" height="7" rx="1.5" strokeWidth="1.5" />
        </svg>
      );
    case 4: // Color Harmony (Triadic color wheel with harmonic nodes)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <circle cx="50" cy="50" r="36" strokeDasharray="3 3" />
          <polygon points="50,18 78,68 22,68" strokeWidth="1.4" />
          <circle cx="50" cy="18" r="4" fill="currentColor" />
          <circle cx="78" cy="68" r="4" fill="currentColor" />
          <circle cx="22" cy="68" r="4" fill="currentColor" />
          <line x1="50" y1="50" x2="50" y2="18" strokeDasharray="2 2" />
          <line x1="50" y1="50" x2="78" y2="68" strokeDasharray="2 2" />
          <line x1="50" y1="50" x2="22" y2="68" strokeDasharray="2 2" />
        </svg>
      );
    case 5: // Style Cohesion (Tailored necktie, crisp shirt collar, and lapels)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 28 20 L 50 36 L 72 20 L 58 14 L 42 14 Z" strokeWidth="1.5" />
          <polygon points="44,36 56,36 60,68 50,86 40,68" strokeWidth="1.5" />
          <line x1="50" y1="36" x2="50" y2="86" strokeDasharray="2 2" />
          <line x1="28" y1="20" x2="16" y2="55" strokeDasharray="2 2" />
          <line x1="72" y1="20" x2="84" y2="55" strokeDasharray="2 2" />
        </svg>
      );
    case 6: // Fabric, Texture & Condition (Textile weave warp & weft loops)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="18" y1="26" x2="82" y2="26" strokeDasharray="3 3" />
          <line x1="18" y1="42" x2="82" y2="42" strokeDasharray="3 3" />
          <line x1="18" y1="58" x2="82" y2="58" strokeDasharray="3 3" />
          <line x1="18" y1="74" x2="82" y2="74" strokeDasharray="3 3" />
          <line x1="26" y1="18" x2="26" y2="82" strokeDasharray="3 3" />
          <line x1="42" y1="18" x2="42" y2="82" strokeDasharray="3 3" />
          <line x1="58" y1="18" x2="58" y2="82" strokeDasharray="3 3" />
          <line x1="74" y1="18" x2="74" y2="82" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="16" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      );
    case 7: // Accessories & Footwear (Oxford brogue dress shoe & wristwatch)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 16 68 Q 28 50 48 54 Q 68 56 86 64 L 88 78 L 16 78 Z" strokeWidth="1.5" />
          <path d="M 28 78 L 28 84 L 42 84 L 42 78" strokeWidth="1.5" />
          <circle cx="68" cy="28" r="14" strokeDasharray="2 2" />
          <line x1="68" y1="28" x2="68" y2="20" />
          <line x1="68" y1="28" x2="74" y2="28" />
        </svg>
      );
    case 8: // Grooming & Presentation (Razor-crisp collar neckline and precision sparkle stars)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 50 14 Q 50 42 22 42 Q 50 42 50 70 Q 50 42 78 42 Q 50 42 50 14 Z" strokeWidth="1.5" />
          <circle cx="50" cy="42" r="4" fill="currentColor" />
          <circle cx="28" cy="72" r="2.5" fill="currentColor" />
          <circle cx="72" cy="72" r="2.5" fill="currentColor" />
          <line x1="20" y1="84" x2="80" y2="84" strokeDasharray="2 2" />
        </svg>
      );
    case 9: // Focal Point & Hierarchy (Concentric target reticle with depth crosshairs)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <circle cx="50" cy="50" r="35" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="22" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="9" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="2 2" />
          <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="2 2" />
        </svg>
      );
    case 10: // Originality & Expression (Sartorial signature bolt with creative flourish)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <polygon points="56,12 28,50 48,50 42,88 74,42 54,42" strokeWidth="1.6" />
          <circle cx="56" cy="12" r="2.5" fill="currentColor" />
          <circle cx="42" cy="88" r="2.5" fill="currentColor" />
          <path d="M 66 22 Q 82 22 82 38" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return null;
  }
}

export function FitCheckParametersGrid({
  photoScore,
  isAnalyzing,
  shuffleScores,
  cardLockStates,
  justLockedCardId,
  displayedHeroScore,
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
        <div className="compact-cards-grid cards-10-grid" id="compact-cards-grid">
          {OUTFIT_PARAMETERS.map((param) => {
            const isCardLocked = cardLockStates ? cardLockStates[param.id - 1] : false;
            const isJustLocked = justLockedCardId === param.id;
            const finalScore = photoScore ? photoScore.parameterScores[param.id] : null;
            const currentShuffleVal = (shuffleScores && shuffleScores[param.id] !== undefined)
              ? shuffleScores[param.id]
              : Math.round(param.maxPts * 0.7);

            const displayScore = isAnalyzing
              ? (isCardLocked && finalScore !== null ? finalScore : currentShuffleVal)
              : finalScore;

            const ratingDetail = photoScore ? photoScore.parameterRatings[param.id] : null;

            return (
              <div
                key={param.id}
                className={`compact-metric-card fit-card-${param.id} focus-ring tactile-press ${
                  displayScore === null && !isAnalyzing ? 'compact-metric-card-unscored' : 'compact-metric-card-scored'
                } ${isAnalyzing ? 'shuffling' : ''} ${isJustLocked ? 'just-locked' : ''}`}
                id={`card-${param.id}`}
                style={{
                  background: OUTFIT_CARD_BACKGROUNDS[param.id] || 'rgba(16, 16, 22, 0.78)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
                title={param.name}
                tabIndex={0}
                role="region"
                aria-label={`${param.name}: ${displayScore !== null && displayScore !== undefined ? displayScore : 'Not scored'} out of ${param.maxPts} points.`}
              >
                {/* SVG Blueprint Sketch Watermark */}
                {renderOutfitSketchWatermark(param.id)}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%', position: 'relative', zIndex: 1 }}>
                  <span className="card-param-name text-truncate">
                    <span style={{ marginRight: '6px' }}>{OUTFIT_PARAM_ICONS[param.id]}</span>
                    {param.name}
                  </span>
                  {ratingDetail && !isAnalyzing && (
                    <span className="card-rating-badge font-tabular-nums">R: {ratingDetail.ratingR}/10</span>
                  )}
                </div>

                <div className="card-score-value-row">
                  {isAnalyzing && !isCardLocked ? (
                    <span className="shuffling-number font-tabular-nums text-primary/80 animate-pulse">
                      {currentShuffleVal}
                      <span className="score-max-denom">/{param.maxPts}</span>
                    </span>
                  ) : displayScore !== null && displayScore !== undefined ? (
                    <span className="calculated-number font-tabular-nums">
                      {displayScore}
                      <span className="score-max-denom">/{param.maxPts}</span>
                    </span>
                  ) : (
                    <span className="unscored-number font-tabular-nums">
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
