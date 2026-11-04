'use client';

/**
 * GABRU — CONTENT RATING SCORECARD
 * 
 * Redesigned Single-Post Telemetry & 10-Parameter Bento Scorecard:
 * - Raw Telemetry Bar with Primary Counters (❤️ Likes, 💬 Comments, 🚀 Shares, 🔖 Saves, 🔄 Reposts, 👁️ Views)
 * - 3 Hidden Ratio "Flex" Badges (True Engagement Rate, Group-Chat Multiplier, Bookmark Rate)
 * - Executive Verdict Banner (Single-Post Verdict Badge & Archetype Tier)
 * - 10 Responsive Parameter Bento Cards with 0-100 scores and witty 1-sentence roasts/compliments
 */

import React from 'react';
import { ContentScoreData, DeepDiveContentTabKey } from '../types/ContentRatingTypes';
import {
  CONTENT_PARAMETERS,
  CONTENT_CARD_BACKGROUNDS,
  PARAM_TO_TAB,
} from '../constants/ContentRatingConstants';
import { Button } from '@/shared/components/ui/Button';

const CONTENT_PARAM_ICONS: Record<number, string> = {
  1: '👑',
  2: '✨',
  3: '🛑',
  4: '✍️',
  5: '🚀',
  6: '🔖',
  7: '💬',
  8: '⏰',
  9: '🧠',
  10: '🏆',
};

export interface ContentRatingScorecardProps {
  scoreData: ContentScoreData | null;
  isAnalyzing: boolean;
  shuffleScores?: Record<number, number>;
  cardLockStates?: boolean[];
  justLockedCardId?: number | null;
  displayedHeroScore?: number | null;
  onSelectTab: (tab: DeepDiveContentTabKey) => void;
  onShareScore: () => void;
}

function renderContentSketchWatermark(paramId: number) {
  switch (paramId) {
    case 1: // Main Character (Regal multi-point crown with diamond facets & spotlight base)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 16 70 L 24 34 L 50 50 L 76 34 L 84 70 Z" strokeWidth="1.6" />
          <circle cx="24" cy="34" r="3.5" fill="currentColor" />
          <circle cx="50" cy="50" r="3.5" fill="currentColor" />
          <circle cx="76" cy="34" r="3.5" fill="currentColor" />
          <line x1="16" y1="74" x2="84" y2="74" strokeWidth="2" />
          <line x1="50" y1="14" x2="50" y2="30" strokeDasharray="2 2" />
        </svg>
      );
    case 2: // Visual Aura (Cinematic camera viewfinder with framing brackets & aperture iris)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 18 30 L 18 20 L 28 20" strokeWidth="2" />
          <path d="M 82 30 L 82 20 L 72 20" strokeWidth="2" />
          <path d="M 18 70 L 18 80 L 28 80" strokeWidth="2" />
          <path d="M 82 70 L 82 80 L 72 80" strokeWidth="2" />
          <circle cx="50" cy="50" r="18" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <line x1="38" y1="20" x2="38" y2="80" strokeDasharray="2 2" />
          <line x1="62" y1="20" x2="62" y2="80" strokeDasharray="2 2" />
        </svg>
      );
    case 3: // Scroll Hook (Sharp descending feed hook suddenly halting downward scroll arrow)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <line x1="30" y1="16" x2="30" y2="60" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 30 60 C 30 76, 56 82, 66 66 C 74 52, 64 36, 48 36" strokeWidth="2" />
          <polygon points="26,60 34,60 30,68" fill="currentColor" />
          <circle cx="66" cy="66" r="3" fill="currentColor" />
          <line x1="16" y1="84" x2="84" y2="84" strokeDasharray="2 2" />
        </svg>
      );
    case 4: // Caption Poetry (Fine-point fountain pen / calligraphy nib flowing into poetic rhythm wave)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 74 16 C 60 30, 48 44, 34 72 L 28 82 L 38 78 C 66 64, 80 50, 74 16 Z" strokeWidth="1.6" />
          <line x1="31" y1="80" x2="54" y2="54" strokeWidth="1.4" />
          <circle cx="74" cy="16" r="3" fill="currentColor" />
          <path d="M 22 88 Q 36 84 50 88 T 78 88" strokeDasharray="2 2" />
        </svg>
      );
    case 5: // Group-Chat Forwardability (Paper airplane rocket forwarding across message bubbles)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 18 80 L 86 48 L 18 16 L 36 48 Z" strokeWidth="1.6" />
          <line x1="36" y1="48" x2="86" y2="48" strokeDasharray="2 2" />
          <circle cx="34" cy="22" r="8" strokeDasharray="2 2" />
          <circle cx="72" cy="74" r="10" strokeDasharray="2 2" />
        </svg>
      );
    case 6: // Secret Bookmark Bait (Bookmark ribbon nestled inside saved collection folder)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="22" y="18" width="56" height="66" rx="4" strokeDasharray="2 2" />
          <path d="M 40 18 L 40 64 L 54 52 L 68 64 L 68 18 Z" strokeWidth="1.6" fill="rgba(255,255,255,0.06)" />
          <circle cx="54" cy="34" r="4" fill="currentColor" />
        </svg>
      );
    case 7: // Comment Chaos (Interlocking conversation speech bubbles with debate waveforms)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 18 24 L 64 24 C 70 24, 70 50, 64 50 L 36 50 L 22 62 L 26 50 L 18 50 Z" strokeWidth="1.5" />
          <path d="M 82 46 L 44 46 C 38 46, 38 70, 44 70 L 68 70 L 78 80 L 76 70 L 82 70 Z" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="30" y1="36" x2="52" y2="36" />
        </svg>
      );
    case 8: // Goblin Hours (Crescent night moon cradling a 2:00 AM clock face)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 64 18 C 42 24, 36 64, 64 82 C 30 80, 20 40, 52 18 Z" strokeWidth="1.8" />
          <circle cx="56" cy="50" r="16" strokeDasharray="2 2" />
          <line x1="56" y1="50" x2="56" y2="40" strokeWidth="1.5" />
          <line x1="56" y1="50" x2="66" y2="46" strokeWidth="1.5" />
          <circle cx="56" cy="50" r="2" fill="currentColor" />
        </svg>
      );
    case 9: // Original Brain (Cerebral brain hemispheres with neural synaptic pulse nodes)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 50 20 C 38 20, 26 30, 26 44 C 26 52, 32 58, 30 68 C 28 78, 40 84, 50 84 C 60 84, 72 78, 70 68 C 68 58, 74 52, 74 44 C 74 30, 62 20, 50 20 Z" strokeWidth="1.6" />
          <line x1="50" y1="20" x2="50" y2="84" strokeDasharray="2 2" />
          <circle cx="38" cy="42" r="3" fill="currentColor" />
          <circle cx="62" cy="42" r="3" fill="currentColor" />
          <circle cx="42" cy="64" r="2.5" fill="currentColor" />
          <circle cx="58" cy="64" r="2.5" fill="currentColor" />
        </svg>
      );
    case 10: // Verdict Badge (Champion laurel wreath encircling victory trophy cup)
      return (
        <svg className="card-sketch-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M 32 26 L 68 26 L 64 56 C 64 64, 58 70, 50 70 C 42 70, 36 64, 36 56 Z" strokeWidth="1.6" />
          <line x1="50" y1="70" x2="50" y2="82" strokeWidth="2" />
          <line x1="36" y1="82" x2="64" y2="82" strokeWidth="2" />
          <path d="M 22 34 C 18 52, 26 70, 42 78" strokeDasharray="2 2" strokeWidth="1.4" />
          <path d="M 78 34 C 82 52, 74 70, 58 78" strokeDasharray="2 2" strokeWidth="1.4" />
          <circle cx="50" cy="40" r="4" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export function ContentRatingScorecard({
  scoreData,
  isAnalyzing,
  shuffleScores,
  cardLockStates,
  justLockedCardId,
  displayedHeroScore,
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
            <span>10 ENTERTAINING RATING PARAMETERS</span>
          </div>
          <h3 className="scorecard-strip-title">Single-Post Personality &amp; Viral Diagnostics</h3>
          <p className="scorecard-strip-sub">
            {scoreData
              ? `Awarded "${scoreData.verdictBadge}" (${scoreData.archetypeTier}) · Overall Impact Score: ${scoreData.contentScore}/100.`
              : 'Deterministic evaluation across Main Character Energy, Visual Aura, Scroll Hook, Caption Poetry, Group-Chat Forwardability, Bookmark Bait, Comment Dynamics, Pacing, and Original Brain.'}
          </p>
        </div>

        {/* Verdict Badge & Actions */}
        <div className="scorecard-tier-pills" id="scorecard-tier-pills">
          {scoreData && (
            <div className="tier-pill-box verdict-pill-box" title="Single-Post Verdict Badge assigned by deterministic priority tree">
              <span className="tier-pill-name">Verdict Badge</span>
              <span className="tier-pill-score">
                <strong className="tier-val verdict-val">
                  {scoreData.verdictBadge}
                </strong>
              </span>
            </div>
          )}

          {scoreData && (
            <div className="tier-pill-box archetype-pill-box" title="Personality archetype based on post telemetry and visual aura">
              <span className="tier-pill-name">Archetype</span>
              <span className="tier-pill-score">
                <strong className="tier-val archetype-val">
                  {scoreData.archetypeTier}
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
              title="Generate High-Res 1080x1350 Viral Card"
              leftIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* 10 METRIC CARDS (BENTO-GRID 2 ROWS OF 5) */}
      <div className="compact-cards-grid cards-10-grid" id="compact-cards-grid">
        {CONTENT_PARAMETERS.map((param) => {
          const isCardLocked = cardLockStates ? cardLockStates[param.id - 1] : false;
          const isJustLocked = justLockedCardId === param.id;
          const evaluatedParam = scoreData?.parameters.find((p) => p.id === param.id);
          const finalScore = evaluatedParam ? evaluatedParam.score : null;
          const currentShuffleVal = (shuffleScores && shuffleScores[param.id] !== undefined)
            ? shuffleScores[param.id]
            : 74;

          const displayScore = isAnalyzing
            ? (isCardLocked && finalScore !== null ? finalScore : currentShuffleVal)
            : finalScore;

          return (
            <div
              key={param.id}
              className={`compact-metric-card content-card-${param.id} focus-ring tactile-press scroll-reveal ${
                displayScore === null && !isAnalyzing
                  ? 'compact-metric-card-unscored'
                  : 'compact-metric-card-scored'
              } ${isAnalyzing ? 'shuffling' : ''} ${isJustLocked ? 'just-locked' : ''}`}
              id={`content-card-${param.id}`}
              style={{
                background: CONTENT_CARD_BACKGROUNDS[param.id],
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                cursor: scoreData ? 'pointer' : 'default',
              }}
              title={scoreData ? `Inspect ${param.name}` : param.name}
              role="button"
              tabIndex={scoreData ? 0 : -1}
              aria-label={`Inspect ${param.name} diagnostic details`}
              onClick={() => handleCardClick(param.id)}
              onKeyDown={(e) => {
                if (scoreData && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleCardClick(param.id);
                }
              }}
            >
              {/* SVG Blueprint Sketch Watermark */}
              {renderContentSketchWatermark(param.id)}

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
                  <span style={{ marginRight: '6px' }}>{CONTENT_PARAM_ICONS[param.id]}</span>
                  {param.name}
                </span>
                {displayScore !== null && displayScore !== undefined && !isAnalyzing && (
                  <span className="card-rating-badge font-tabular-nums">
                    R: {(displayScore / 10).toFixed(1)}/10
                  </span>
                )}
              </div>

              {/* Card Middle: Big Numeric Score & Denominator */}
              <div className="card-score-value-row">
                {isAnalyzing && !isCardLocked ? (
                  <span className="shuffling-number font-tabular-nums text-primary/80 animate-pulse">
                    {currentShuffleVal}
                    <span className="score-max-denom font-tabular-nums">/100</span>
                  </span>
                ) : displayScore !== null && displayScore !== undefined ? (
                  <span className="calculated-number font-tabular-nums">
                    {displayScore}
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
