'use client';

/**
 * GABRU — HAND READING SCORECARD
 * 
 * Renders:
 * - Executive Palm Prominence Index strip (Overall Score / 100, Neutral Band Label, Mean Confidence)
 * - 10 Parameter Bento Grid Cards with line scores, confidence values, and rule-matched traditional interpretations
 */

import React from 'react';
import { HandReadingResult, HandParameterScore } from '../types/HandReadingTypes';
import { HAND_PARAMETERS, HAND_CARD_BACKGROUNDS } from '../constants/HandReadingConstants';
import { Button } from '@/shared/components/ui/Button';

export interface HandReadingScorecardProps {
  result: HandReadingResult | null;
  isAnalyzing?: boolean;
  shuffleScores?: Record<number, number>;
  cardLockStates?: Record<number, boolean>;
  justLockedCardId?: number | null;
  displayedHeroScore?: number | null;
  onSelectParam: (paramKey: string) => void;
  onShareClick: () => void;
}

function renderHandSketchWatermark(paramId: number) {
  switch (paramId) {
    case 1: // Life Line (Jeevan Rekha: Deep curved crease encircling the Venus mount from index knuckle to wrist)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 70 20 C 66 38, 42 56, 36 86" strokeWidth="2.2" />
          <circle cx="70" cy="20" r="3.5" fill="currentColor" />
          <circle cx="36" cy="86" r="3.5" fill="currentColor" />
          <path d="M 74 24 C 70 44, 46 64, 40 86" strokeDasharray="2 2" />
          <line x1="28" y1="88" x2="72" y2="88" strokeDasharray="3 3" />
        </svg>
      );
    case 2: // Head Line (Mastak Rekha: Strong transverse diagonal crease across palm toward percussion)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 72 32 C 54 36, 30 48, 16 66" strokeWidth="2.2" />
          <circle cx="72" cy="32" r="3.5" fill="currentColor" />
          <circle cx="16" cy="66" r="3.5" fill="currentColor" />
          <line x1="30" y1="48" x2="20" y2="56" strokeDasharray="2 2" />
          <line x1="50" y1="36" x2="48" y2="24" strokeDasharray="2 2" />
        </svg>
      );
    case 3: // Heart Line (Hridaya Rekha: Graceful upper transverse crease sweeping toward index/Jupiter mount)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 16 36 C 36 34, 58 32, 70 18" strokeWidth="2.2" />
          <circle cx="16" cy="36" r="3.5" fill="currentColor" />
          <circle cx="70" cy="18" r="3.5" fill="currentColor" />
          <line x1="58" y1="30" x2="64" y2="16" strokeDasharray="2 2" />
          <line x1="42" y1="34" x2="46" y2="20" strokeDasharray="2 2" />
        </svg>
      );
    case 4: // Fate Line (Bhagya Rekha: Saturnian vertical axis line rising straight from palm base to middle finger mount)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="50" y1="16" x2="50" y2="84" strokeWidth="2.2" />
          <circle cx="50" cy="16" r="3.5" fill="currentColor" />
          <circle cx="50" cy="84" r="3.5" fill="currentColor" />
          <line x1="42" y1="50" x2="58" y2="50" strokeDasharray="2 2" />
          <line x1="44" y1="32" x2="56" y2="32" strokeDasharray="1 2" />
        </svg>
      );
    case 5: // Sun Line / Apollo (Surya Rekha: Vertical line of renown ascending to ring finger mount with radiant sunburst)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="40" y1="20" x2="40" y2="76" strokeWidth="2" />
          <circle cx="40" cy="20" r="5" strokeDasharray="2 2" />
          <circle cx="40" cy="20" r="2" fill="currentColor" />
          <line x1="32" y1="12" x2="48" y2="28" strokeDasharray="1 2" />
          <line x1="48" y1="12" x2="32" y2="28" strokeDasharray="1 2" />
          <circle cx="40" cy="76" r="3" fill="currentColor" />
        </svg>
      );
    case 6: // Mercury Line / Health (Budha Rekha: Diagonal line of intuition & wit rising to pinky mount)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="68" y1="80" x2="26" y2="26" strokeWidth="2" />
          <circle cx="26" cy="26" r="3.5" fill="currentColor" />
          <circle cx="68" cy="80" r="3.5" fill="currentColor" />
          <line x1="38" y1="32" x2="32" y2="42" strokeDasharray="2 2" />
          <line x1="56" y1="56" x2="50" y2="66" strokeDasharray="2 2" />
        </svg>
      );
    case 7: // Relationship Lines (Vivaha Rekha: Fine parallel horizontal affection creases on percussion edge below pinky)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="14" y1="34" x2="48" y2="34" strokeWidth="2.2" />
          <line x1="14" y1="48" x2="40" y2="48" strokeWidth="2.2" />
          <line x1="14" y1="62" x2="34" y2="62" strokeDasharray="2 2" />
          <line x1="14" y1="24" x2="14" y2="72" strokeDasharray="2 2" />
          <circle cx="48" cy="34" r="2.5" fill="currentColor" />
          <circle cx="40" cy="48" r="2.5" fill="currentColor" />
        </svg>
      );
    case 8: // Mounts (7 Regions): Topographical relief contours mapping the 7 elevated mounts of the palm
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <circle cx="50" cy="50" r="36" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="24" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="10" strokeWidth="1.6" />
          <circle cx="28" cy="28" r="6" strokeDasharray="1 2" />
          <circle cx="72" cy="28" r="6" strokeDasharray="1 2" />
          <circle cx="34" cy="74" r="8" strokeDasharray="1 2" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      );
    case 9: // Hand Shape & Fingers: Elemental quadrilateral palm box outline with four finger vectors
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="24" y="36" width="52" height="48" rx="4" strokeDasharray="2 2" />
          <line x1="32" y1="16" x2="32" y2="36" strokeWidth="2" />
          <line x1="44" y1="12" x2="44" y2="36" strokeWidth="2.2" />
          <line x1="56" y1="14" x2="56" y2="36" strokeWidth="2" />
          <line x1="68" y1="20" x2="68" y2="36" strokeWidth="1.8" />
          <circle cx="44" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );
    case 10: // Special Markings: Mystic cross (+) in the plain of Mars, sacred triangle and star
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="50" y1="36" x2="50" y2="64" strokeWidth="2.4" />
          <line x1="36" y1="50" x2="64" y2="50" strokeWidth="2.4" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <polygon points="50,18 64,30 36,30" strokeDasharray="2 2" />
          <line x1="50" y1="74" x2="50" y2="86" strokeDasharray="1 1" />
          <line x1="44" y1="80" x2="56" y2="80" strokeDasharray="1 1" />
        </svg>
      );
    default:
      return null;
  }
}

export function HandReadingScorecard({
  result,
  isAnalyzing = false,
  shuffleScores,
  cardLockStates,
  justLockedCardId,
  displayedHeroScore,
  onSelectParam,
  onShareClick,
}: HandReadingScorecardProps) {
  const overallProminenceIndex = displayedHeroScore !== undefined && displayedHeroScore !== null
    ? displayedHeroScore
    : result?.overallProminenceIndex;
  const overallBandLabel = result?.overallBandLabel || (isAnalyzing ? 'Solving Palms...' : 'Calibrated Baseline');
  const meanConfidence = result?.meanConfidence;
  const confidenceTier = result?.confidenceTier || (isAnalyzing ? 'Scanning' : 'Ready');
  const handTypeLabel = result?.handTypeLabel || (isAnalyzing ? 'Extracting Dimensions...' : '4 Element Archetypes');
  const tradition = result?.tradition || 'western';
  const absentPolicy = result?.absentPolicy || 'exclude';

  const handleCardClick = (paramKey: string) => {
    onSelectParam(paramKey);
    const el = document.getElementById('hand-diagnostic-suite');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hand-scorecard-wrapper" id="hand-scorecard-section">
      {/* Executive Clean Strip */}
      <div className="scorecard-clean-strip hand-clean-strip scroll-reveal">
        <div className="scorecard-strip-info">
          <div className="about-section-eyebrow">
            <span>10 TRADITIONAL PALM PARAMETERS</span>
          </div>
          <h3 className="scorecard-strip-title">Palm Prominence Index &amp; Line Traces</h3>
          <p className="scorecard-strip-sub">
            {typeof overallProminenceIndex === 'number' ? (
              <>
                Overall score: <strong>{overallProminenceIndex.toFixed(1)} / 100</strong> ({overallBandLabel}).
                Policy: <em>{absentPolicy === 'zero' ? 'Include as 0' : 'Exclude from average'}</em>.
                Tradition: <em>{tradition === 'indian' ? 'Indian Samudrika Shastra' : 'Western Chiromancy'}</em>.
              </>
            ) : (
              'Line prominence, mount elevation contours, and hand shape metrics.'
            )}
          </p>
        </div>

        <div className="scorecard-tier-pills">
          <div className="tier-pill-box" title="Overall Palm Prominence Index (Average of readable scores)">
            <span className="tier-pill-name">Prominence Index</span>
            <span className="tier-pill-score">
              <strong className="tier-val tier-val-violet font-tabular-nums">
                {typeof overallProminenceIndex === 'number' ? `${overallProminenceIndex.toFixed(1)}/100` : '--/100'}
              </strong>
            </span>
          </div>

          <div className="tier-pill-box" title="Constitutional elemental archetype based on palm length to width and finger ratios">
            <span className="tier-pill-name">Hand Archetype</span>
            <span className="tier-pill-score">
              <strong className="tier-val tier-val-blue">
                {handTypeLabel}
              </strong>
            </span>
          </div>

          <div className="tier-pill-box" title="Photo quality factor q multiplied by mean detection confidence">
            <span className="tier-pill-name">Mean Confidence</span>
            <span className="tier-pill-score">
              <strong className="tier-val tier-val-emerald font-tabular-nums">
                {meanConfidence !== undefined ? `${meanConfidence.toFixed(2)} (${confidenceTier})` : 'Calibrated'}
              </strong>
            </span>
          </div>

          {result && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onShareClick}
              id="btn-scorecard-share"
              leftIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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

      {/* 10 Bento Cards Grid (Always Visible) */}
      <div className="cards-10-grid hand-cards-grid scroll-reveal" id="hand-cards-grid">
        {HAND_PARAMETERS.map((def) => {
          const scored = result?.parameters.find((p) => p.key === def.key);
          const isCardLocked = !isAnalyzing || (cardLockStates ? cardLockStates[def.id] : true);
          const isJustLocked = justLockedCardId === def.id;
          const shuffleVal = (shuffleScores && shuffleScores[def.id] !== undefined) ? shuffleScores[def.id] : 75;
          const isScored = !!scored && isCardLocked;
          const isAbsent = scored?.isAbsent;
          const isReadable = scored?.isReadable ?? false;

          return (
            <div
              key={def.id}
              className={`compact-metric-card hand-card-${def.id} hand-card-item focus-ring tactile-press ${
                isJustLocked ? 'just-locked' : ''
              } ${
                !isScored && !isAnalyzing
                  ? 'compact-metric-card-unscored'
                  : isAnalyzing && !isCardLocked
                  ? 'is-shuffling-card'
                  : !isReadable
                  ? 'is-unreadable'
                  : isAbsent
                  ? 'is-absent'
                  : 'is-measured'
              }`}
              id={`hand-card-${def.key}`}
              style={{
                background: HAND_CARD_BACKGROUNDS[def.id] || 'rgba(16, 16, 22, 0.78)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
              onClick={() => handleCardClick(def.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(def.key);
                }
              }}
              title={isScored ? `Inspect ${def.name}` : def.name}
              aria-label={`Inspect ${def.name}`}
            >
              {/* SVG Blueprint Sketch Watermark */}
              {renderHandSketchWatermark(def.id)}

              {/* Card Top: Param Name & Clean Rating Badge */}
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
                  <span style={{ marginRight: '6px' }}>{def.icon}</span>
                  {def.name}
                </span>
                {isScored && scored && isReadable && !isAbsent && (
                  <span className="card-rating-badge font-tabular-nums">
                    R: {(scored.score / 10).toFixed(1)}/10
                  </span>
                )}
                {isScored && scored && isAbsent && (
                  <span className="card-rating-badge font-tabular-nums" style={{ color: '#94a3b8', background: 'rgba(148, 163, 184, 0.12)' }}>
                    Absent
                  </span>
                )}
                {isScored && scored && !isReadable && (
                  <span className="card-rating-badge font-tabular-nums" style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.12)' }}>
                    Unreadable
                  </span>
                )}
                {isAnalyzing && !isCardLocked && (
                  <span className="card-rating-badge font-tabular-nums is-shuffling-tag" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}>
                    SOLVING
                  </span>
                )}
              </div>

              {/* Card Middle: Big Numeric Score & Denominator */}
              <div className="card-score-value-row">
                {isScored && scored ? (
                  isReadable ? (
                    isAbsent ? (
                      <span className="calculated-number font-tabular-nums" style={{ color: '#64748b' }}>
                        Absent
                      </span>
                    ) : (
                      <span className="calculated-number font-tabular-nums">
                        {scored.score.toFixed(1)}
                        <span className="score-max-denom font-tabular-nums">/100</span>
                      </span>
                    )
                  ) : (
                    <span className="calculated-number font-tabular-nums" style={{ color: '#ef4444' }}>
                      Unreadable
                    </span>
                  )
                ) : isAnalyzing && !isCardLocked && typeof shuffleVal === 'number' ? (
                  <span className="calculated-number font-tabular-nums is-shuffling-number" style={{ color: '#38bdf8' }}>
                    {shuffleVal.toFixed(1)}
                    <span className="score-max-denom font-tabular-nums">/100</span>
                  </span>
                ) : (
                  <span className="unscored-number font-tabular-nums">
                    --<span className="score-max-denom font-tabular-nums">/100</span>
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

