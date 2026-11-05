'use client';

import React from 'react';
import type { BeautyScoreData, DeepDiveTabKey } from '../types/FacialBeautyTypes';
import {
  BEAUTY_PARAMETERS,
  BEAUTY_CARD_BACKGROUNDS,
  PARAM_TO_TAB,
} from '../constants/FacialBeautyConstants';
import { Button } from '@/shared/components/ui/Button';

export interface FacialBeautyScorecardProps {
  scoreData: BeautyScoreData | null;
  isAnalyzing: boolean;
  shuffleScores?: Record<number, number>;
  cardLockStates?: boolean[];
  justLockedCardId?: number | null;
  displayedHeroScore?: number | null;
  dimorphismRef: 'skip' | 'M-typical' | 'F-typical';
  onSelectDimorphism: (ref: 'skip' | 'M-typical' | 'F-typical') => void;
  onSelectTab: (tab: DeepDiveTabKey) => void;
  onShareScore: () => void;
}

const BEAUTY_PARAM_ICONS: Record<number, string> = {
  1: '✨',
  2: '👁️',
  3: '📐',
  4: '😊',
  5: '✂️',
  6: '🏛️',
  7: '🪞',
  8: '📊',
  9: '💎',
  10: '🧘',
};

function renderBeautySketchWatermark(paramId: number) {
  switch (paramId) {
    case 1: // Skin Quality & Glow (Cellular epidermal hexagonal matrix with radiant light emission rays)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <polygon points="50,20 68,30 68,52 50,62 32,52 32,30" strokeWidth="1.5" />
          <polygon points="50,62 68,72 68,94 50,104 32,94 32,72" strokeDasharray="2 2" opacity="0.5" />
          <polygon points="68,30 86,40 86,62 68,72 50,62 50,40" strokeDasharray="2 2" opacity="0.5" />
          <circle cx="50" cy="41" r="5" fill="currentColor" />
          <line x1="50" y1="12" x2="50" y2="4" strokeWidth="1.6" />
          <line x1="72" y1="22" x2="78" y2="16" strokeWidth="1.6" />
          <line x1="28" y1="22" x2="22" y2="16" strokeWidth="1.6" />
        </svg>
      );
    case 2: // Eye Region (Canthal tilt angle line, almond eye arch, iris & pupil)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 12 56 Q 50 20 88 46 Q 50 82 12 56 Z" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="16" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <line x1="8" y1="56" x2="92" y2="46" strokeDasharray="2 2" />
          <path d="M 18 36 Q 50 16 82 30" strokeDasharray="3 3" />
        </svg>
      );
    case 3: // Harmony & φ (Golden ratio phi φ logarithmic spiral inside thirds grid)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="18" y="16" width="64" height="68" rx="2" strokeDasharray="2 2" />
          <line x1="18" y1="38" x2="82" y2="38" strokeDasharray="2 2" />
          <line x1="18" y1="60" x2="82" y2="60" strokeDasharray="2 2" />
          <path d="M 18 84 C 70 84, 82 50, 82 38 C 82 24, 66 16, 50 16 C 36 16, 30 26, 30 38 C 30 48, 40 54, 50 54 C 58 54, 62 48, 62 42" strokeWidth="1.6" />
        </svg>
      );
    case 4: // Expression & Gaze (Dynamic smile arc, zygomaticus crest, bilateral gaze vectors)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 22 46 Q 50 80 78 46" strokeWidth="2" />
          <line x1="22" y1="46" x2="14" y2="38" strokeWidth="1.5" />
          <line x1="78" y1="46" x2="86" y2="38" strokeWidth="1.5" />
          <circle cx="34" cy="28" r="3" fill="currentColor" />
          <circle cx="66" cy="28" r="3" fill="currentColor" />
          <line x1="34" y1="28" x2="34" y2="14" strokeDasharray="2 2" />
          <line x1="66" y1="28" x2="66" y2="14" strokeDasharray="2 2" />
        </svg>
      );
    case 5: // Grooming & Styling (Stylist scissors shaping clean eyebrow arch)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 16 52 Q 48 24 84 46" strokeWidth="1.8" />
          <path d="M 20 24 Q 50 14 80 24" strokeDasharray="2 2" />
          <line x1="30" y1="78" x2="62" y2="38" strokeWidth="1.5" />
          <line x1="50" y1="78" x2="38" y2="44" strokeWidth="1.5" />
          <circle cx="30" cy="78" r="5" />
          <circle cx="50" cy="78" r="5" />
          <circle cx="44" cy="56" r="2" fill="currentColor" />
        </svg>
      );
    case 6: // Central Features (Nasal profile bridge, philtrum column, Cupid's bow contour)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="50" y1="12" x2="50" y2="48" strokeWidth="1.8" />
          <path d="M 38 48 Q 50 44 62 48 L 50 54 Z" strokeWidth="1.4" />
          <line x1="46" y1="56" x2="46" y2="66" strokeDasharray="1 1" />
          <line x1="54" y1="56" x2="54" y2="66" strokeDasharray="1 1" />
          <path d="M 32 72 Q 44 64 50 68 Q 56 64 68 72 Q 50 84 32 72 Z" strokeWidth="1.6" />
        </svg>
      );
    case 7: // Facial Symmetry (Vertical bilateral symmetry mirror axis and cross bisectors)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="2" />
          <line x1="20" y1="38" x2="80" y2="38" strokeDasharray="2 2" />
          <line x1="28" y1="64" x2="72" y2="64" strokeDasharray="2 2" />
          <circle cx="30" cy="38" r="4" fill="currentColor" />
          <circle cx="70" cy="38" r="4" fill="currentColor" />
          <circle cx="34" cy="64" r="3" />
          <circle cx="66" cy="64" r="3" />
        </svg>
      );
    case 8: // Averageness (Gaussian normal distribution bell curve with population mean vector)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 12 78 C 30 78, 40 22, 50 22 C 60 22, 70 78, 88 78" strokeWidth="2" />
          <line x1="50" y1="14" x2="50" y2="84" strokeDasharray="2 2" />
          <line x1="10" y1="78" x2="90" y2="78" strokeWidth="1.5" />
          <circle cx="50" cy="22" r="3.5" fill="currentColor" />
          <line x1="38" y1="46" x2="62" y2="46" strokeDasharray="1 2" />
        </svg>
      );
    case 9: // Jaw, Chin & Cues (Sharp mandibular jawline contour, gonial angle, menton apex)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 16 30 L 26 62 L 50 82 L 74 62 L 84 30" strokeWidth="2" />
          <circle cx="26" cy="62" r="3" fill="currentColor" />
          <circle cx="74" cy="62" r="3" fill="currentColor" />
          <circle cx="50" cy="82" r="3" fill="currentColor" />
          <line x1="26" y1="62" x2="74" y2="62" strokeDasharray="2 2" />
        </svg>
      );
    case 10: // Neck & Carriage (Cervicomental neckline angle and posture plumb line)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="50" y1="14" x2="50" y2="86" strokeWidth="2" />
          <path d="M 32 86 C 36 62, 42 46, 50 46 C 58 46, 64 62, 68 86" strokeWidth="1.6" />
          <line x1="20" y1="86" x2="80" y2="86" strokeWidth="1.6" />
          <circle cx="50" cy="46" r="3" fill="currentColor" />
          <circle cx="50" cy="26" r="8" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * FacialBeautyScorecard
 *
 * Renders the 10-parameter biometrics scorecard (v2):
 * - Executive Section Header Strip (.scorecard-clean-strip)
 * - Evidence allocation pills (Changeable ~43 pts vs Fixed ~57 pts)
 * - Measurement confidence index & Renormalisation indicator
 * - 10 individual parameter score cards with real-time shuffle feedback & deep-dive navigation
 * - Gender-typical reference toggle (Neutral / M-typical / F-typical)
 * - Top 3 actionable presentational levers for instant score improvement
 */
export const FacialBeautyScorecard: React.FC<FacialBeautyScorecardProps> = ({
  scoreData,
  isAnalyzing,
  shuffleScores,
  cardLockStates,
  justLockedCardId,
  displayedHeroScore,
  dimorphismRef,
  onSelectDimorphism,
  onSelectTab,
  onShareScore,
}) => {
  const handleCardClick = (paramId: number) => {
    if (!scoreData) return;
    const tabKey = PARAM_TO_TAB[paramId];
    if (tabKey) {
      onSelectTab(tabKey);
      const el = document.getElementById('phase3-diagnostic-suite');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Executive Section Header Strip */}
      <div className="scorecard-clean-strip" id="scorecard-clean-strip">
        <div className="scorecard-strip-info">
          <div className="about-section-eyebrow">
            <span>FACIAL PROPORTIONS &amp; HARMONY AUDIT</span>
          </div>
          <h3 className="scorecard-strip-title">10-Parameter Proportions Breakdown</h3>
          <p className="scorecard-strip-sub">
            {scoreData
              ? scoreData.verdictDescription
              : 'Objective multi-dimensional facial evaluation across skin quality, facial thirds, symmetry, and bone structure.'}
          </p>
        </div>

        {/* Evidence Allocation & Score Indicators */}
        <div className="scorecard-tier-pills" id="scorecard-tier-pills">
          <div
            className="tier-pill-box"
            title="Skin, Expression, Grooming, Eye under-eye & brows, Neck posture (controllable presentational cues)"
          >
            <span className="tier-pill-name">Changeable</span>
            <span className="tier-pill-score">
              {scoreData ? (
                <>
                  <strong className="tier-val font-tabular-nums">{scoreData.presentationalScore ?? 78.5}%</strong>
                  <span className="tier-max font-tabular-nums">
                    (
                    {(
                      (scoreData.changeablePoints ??
                        (scoreData.parameterScores[1] || 0) +
                        (scoreData.parameterScores[4] || 0) +
                        (scoreData.parameterScores[5] || 0))
                    ).toFixed(1)}
                    /43)
                  </span>
                </>
              ) : (
                <span className="tier-unscored font-tabular-nums">43 Pts</span>
              )}
            </span>
          </div>

          <div
            className="tier-pill-box"
            title="Proportions, Eye shape, Features, Symmetry, Averageness, Jaw & Chin, Neck structure (fixed craniofacial architecture)"
          >
            <span className="tier-pill-name">Fixed</span>
            <span className="tier-pill-score">
              {scoreData ? (
                <>
                  <strong className="tier-val font-tabular-nums">{scoreData.structuralScore ?? 78.8}%</strong>
                  <span className="tier-max font-tabular-nums">
                    (
                    {(
                      (scoreData.fixedPoints ??
                        (scoreData.parameterScores[3] || 0) +
                        (scoreData.parameterScores[6] || 0) +
                        (scoreData.parameterScores[7] || 0) +
                        (scoreData.parameterScores[8] || 0) +
                        (scoreData.parameterScores[9] || 0))
                    ).toFixed(1)}
                    /57)
                  </span>
                </>
              ) : (
                <span className="tier-unscored font-tabular-nums">57 Pts</span>
              )}
            </span>
          </div>

          <div className="tier-pill-box" title="Confidence metric grounded in pose, resolution, and lighting checks">
            <span className="tier-pill-name">Confidence</span>
            <span className="tier-pill-score">
              {scoreData ? (
                <>
                  <strong className="tier-val font-tabular-nums">{Math.round((scoreData.confidence || 0.88) * 100)}%</strong>
                  <span className="tier-max font-tabular-nums">
                    {(scoreData.confidence || 0.88) >= 0.8
                      ? 'High'
                      : (scoreData.confidence || 0.88) >= 0.5
                      ? 'Med'
                      : 'Prov'}
                  </span>
                </>
              ) : (
                <span className="tier-unscored font-tabular-nums">--</span>
              )}
            </span>
          </div>

          {scoreData?.isRenormalised && (
            <div
              className="tier-pill-box"
              title="Profile angles excluded due to frontal capture or dimorphism skip; points renormalised to 100"
            >
              <span className="tier-pill-name">⚡ Renormalised</span>
              <span className="tier-pill-score">
                <strong className="tier-val font-tabular-nums text-accent">
                  ×{(scoreData.renormalisationFactor || 1.031).toFixed(3)}
                </strong>
              </span>
            </div>
          )}

          {scoreData && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onShareScore}
              id="btn-strip-share-card"
              title="Generate High-Res 1080x1920 (Story / 9:16) Style Card"
              leftIcon={
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
              }
            >
              Share Card
            </Button>
          )}
        </div>
      </div>

      {/* ALL 10 FACIAL PARAMETER CARDS (100 PTS SCALE) */}
      <div className="compact-cards-grid cards-10-grid" id="compact-cards-grid">
        {BEAUTY_PARAMETERS.map((param) => {
          const isCardLocked = cardLockStates ? cardLockStates[param.id - 1] : false;
          const isJustLocked = justLockedCardId === param.id;
          const finalScore = scoreData ? scoreData.parameterScores[param.id] : null;
          const currentShuffleVal = (shuffleScores && shuffleScores[param.id] !== undefined)
            ? shuffleScores[param.id]
            : Math.round(param.weight * 0.7);

          const displayScore = isAnalyzing
            ? (isCardLocked && finalScore !== null ? finalScore : currentShuffleVal)
            : finalScore;

          const rating = scoreData ? scoreData.parameterRatings[param.id] : null;

          return (
            <div
              key={param.id}
              className={`compact-metric-card beauty-card-${param.id} focus-ring tactile-press scroll-reveal ${
                displayScore === null && !isAnalyzing ? 'compact-metric-card-unscored' : 'compact-metric-card-scored'
              } ${isAnalyzing ? 'shuffling' : ''} ${isJustLocked ? 'just-locked' : ''}`}
              id={`card-${param.id}`}
              style={{
                background: BEAUTY_CARD_BACKGROUNDS[param.id],
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                cursor: scoreData ? 'pointer' : 'default',
              }}
              title={scoreData ? `Inspect ${param.name} diagnostic breakdown` : param.name}
              role="button"
              tabIndex={scoreData ? 0 : -1}
              aria-label={`Inspect ${param.name} diagnostic breakdown`}
              onClick={() => handleCardClick(param.id)}
              onKeyDown={(e) => {
                if (scoreData && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleCardClick(param.id);
                }
              }}
            >
              {/* SVG Blueprint Sketch Watermark */}
              {renderBeautySketchWatermark(param.id)}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span className="card-param-name text-truncate">
                  <span style={{ marginRight: '6px' }}>{BEAUTY_PARAM_ICONS[param.id]}</span>
                  {param.name}
                </span>
                {rating !== null && rating !== undefined && !isAnalyzing && (
                  <span className="card-rating-badge font-tabular-nums">R: {rating.toFixed(1)}/10</span>
                )}
              </div>

              <div className="card-score-value-row">
                {isAnalyzing && !isCardLocked ? (
                  <span className="shuffling-number font-tabular-nums text-primary/80 animate-pulse">
                    {currentShuffleVal}
                    <span className="score-max-denom font-tabular-nums">/{param.weight}</span>
                  </span>
                ) : displayScore !== null && displayScore !== undefined ? (
                  <span className="calculated-number font-tabular-nums">
                    {displayScore}
                    <span className="score-max-denom font-tabular-nums">/{param.weight}</span>
                  </span>
                ) : (
                  <span className="unscored-number font-tabular-nums">
                    --<span className="score-max-denom font-tabular-nums">/{param.weight}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gender-Typical Reference Selection Bar */}
      {scoreData && !isAnalyzing && (
        <div className="dimorphism-toggle-bar">
          <span className="dimorphism-label">
            Reference Baseline:
          </span>
          <button
            type="button"
            className={`dimorphism-btn ${dimorphismRef === 'skip' ? 'is-active' : ''}`}
            onClick={() => onSelectDimorphism('skip')}
            title="Evaluate without gender dimorphism norms (neutral baseline, renormalised to 100)"
          >
            Skip / Neutral
          </button>
          <button
            type="button"
            className={`dimorphism-btn ${dimorphismRef === 'M-typical' ? 'is-active' : ''}`}
            onClick={() => onSelectDimorphism('M-typical')}
            title="Evaluate against male-typical anthropometric reference distribution"
          >
            M-typical
          </button>
          <button
            type="button"
            className={`dimorphism-btn ${dimorphismRef === 'F-typical' ? 'is-active' : ''}`}
            onClick={() => onSelectDimorphism('F-typical')}
            title="Evaluate against female-typical anthropometric reference distribution"
          >
            F-typical
          </button>
        </div>
      )}

      {/* High-Impact Actionable Levers Section */}
      {scoreData && !isAnalyzing && scoreData.topLevers && scoreData.topLevers.length > 0 && (
        <div className="actionable-levers-section" id="beauty-actionable-levers">
          <div className="levers-header">
            <div className="levers-header-left">
              <div className="levers-eyebrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>ACTION PLAN</span>
              </div>
              <h3 className="levers-title">High-Impact Actionable Levers</h3>
              <p className="levers-subtitle">
                Priority grooming and styling adjustments ranked by estimated score uplift
              </p>
            </div>
            <div className="levers-summary-badge" title="Combined projected score uplift if all priority levers are addressed">
              <span className="levers-summary-label">Potential Uplift:</span>
              <strong className="levers-summary-val font-tabular-nums">
                +{scoreData.topLevers.slice(0, 3).reduce((acc, curr) => acc + curr.gainPts, 0).toFixed(1)} pts
              </strong>
            </div>
          </div>

          <div className="levers-grid">
            {scoreData.topLevers.slice(0, 3).map((item, idx) => {
              // Strip any duplicate inline gain text from lever description
              const cleanLeverText = item.lever.replace(/\s*\(\+[0-9.]+\s*pts\)\s*$/i, '');

              return (
                <div key={idx} className="lever-card">
                  <div className="lever-card-top">
                    <span className="lever-rank-badge font-tabular-nums">
                      0{idx + 1}
                    </span>
                    <span className="lever-gain-badge font-tabular-nums">
                      +{item.gainPts.toFixed(1)} pts
                    </span>
                  </div>

                  <p className="lever-recommendation">
                    {cleanLeverText}
                  </p>

                  <div className="lever-card-bottom">
                    <span className="lever-target-tag">
                      Target: <strong className="font-tabular-nums">{item.targetRating ?? '9.5'}/10</strong>
                    </span>
                    <span className="lever-type-tag">Controllable</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
