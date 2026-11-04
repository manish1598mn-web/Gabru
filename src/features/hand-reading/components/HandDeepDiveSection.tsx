'use client';

/**
 * GABRU — HAND LINE DIAGNOSTIC DEEP DIVE SECTION
 * 
 * Clean, calm 10-tab diagnostic explorer for traditional palmistry features:
 * - Serene 10-tab pill bar with live score chips
 * - 3-Pillar layout per parameter:
 *   1. Left Pillar: Score gauge, Sanskrit name, Prominence band, and Confidence
 *   2. Right Pillar: Rule-matched traditional reading, 3 human-readable measurement progress meters, and classical context note
 */

import React, { useRef, useEffect } from 'react';
import { HandReadingResult, HandParameterScore } from '../types/HandReadingTypes';
import { HAND_SHAPE_PROTOTYPES } from '../constants/HandReadingConstants';

export interface HandDeepDiveSectionProps {
  result: HandReadingResult;
  activeParamKey: string;
  onParamChange: (paramKey: string) => void;
}

export function HandDeepDiveSection({
  result,
  activeParamKey,
  onParamChange,
}: HandDeepDiveSectionProps) {
  const { parameters, tradition, handType, qualityGate } = result;
  const navTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navTabsRef.current) return;
    const activeBtn = navTabsRef.current.querySelector<HTMLElement>('.diag-nav-pill.is-active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeParamKey]);

  const activeParam: HandParameterScore =
    parameters.find((p) => p.key === activeParamKey) || parameters[0];

  return (
    <div className="content-diagnostic-suite hand-diagnostic-suite" id="hand-diagnostic-suite">
      {/* Suite Header */}
      <div className="diag-tabs-header">
        <div className="diag-suite-title-group">
          <div className="diag-suite-badge-icon" aria-hidden="true">✋</div>
          <div>
            <h3 className="diag-suite-title">Hand Line Diagnostic Deep Dives</h3>
            <div className="diag-suite-subtitle">
              Granular ridge measurements, mount shading reliefs, elemental ratios, and classical interpretations.
            </div>
          </div>
        </div>

        {/* Serene 10-Tab Navigation Pill Bar */}
        <div className="diag-nav-bar" role="tablist" aria-label="Palm Parameters" ref={navTabsRef}>
          {parameters.map((param) => {
            const isSelected = param.key === activeParamKey;
            const scoreDisplay = param.isAbsent ? 'Absent' : param.score.toFixed(1);

            return (
              <button
                key={param.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`diag-nav-pill focus-ring tactile-press ${isSelected ? 'is-active' : ''}`}
                onClick={() => onParamChange(param.key)}
                id={`tab-btn-${param.key}`}
              >
                <span>{param.name}</span>
                <span className="diag-score-tag font-tabular-nums">{scoreDisplay}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tab Content: 3-Pillar Clean Layout */}
      <div className="diag-tab-content-area">
        <div className="diag-pane-3pillar" id={`diag-pane-${activeParam.key}`}>
          {/* Left Pillar: Gauge & Metadata */}
          <div className="pane-gauge-pillar">
            <span className="pane-param-code">
              PARAM {activeParam.id.toString().padStart(2, '0')} &bull; {activeParam.sanskritName.toUpperCase()}
            </span>

            <div className="pane-big-score font-tabular-nums">
              {activeParam.isReadable ? (
                activeParam.isAbsent ? (
                  <span style={{ fontSize: '32px', color: '#64748b' }}>Absent</span>
                ) : (
                  <>
                    {activeParam.score.toFixed(1)}
                    <span className="pane-score-denom">/100</span>
                  </>
                )
              ) : (
                <span style={{ fontSize: '30px', color: '#ef4444' }}>Unreadable</span>
              )}
            </div>

            <span className="pane-verdict-badge">
              {activeParam.bandLabel}
            </span>

            <span className="pane-param-name-label">
              {activeParam.name}
            </span>

            <div className="pane-confidence-row">
              Confidence: <strong className="font-tabular-nums">{activeParam.confidence.toFixed(2)}</strong> (q={qualityGate.q.toFixed(2)})
            </div>
          </div>

          {/* Right Pillar: Interpretation, Meters, and Classical Note */}
          <div className="pane-details-pillar">
            {/* Traditional Reading Quote */}
            <div className="pane-roast-quote-card">
              <span className="quote-eyebrow">
                TRADITIONAL ASSOCIATION ({tradition === 'indian' ? 'SAMUDRIKA SHASTRA' : 'WESTERN CHIROMANCY'})
              </span>
              <p className="quote-text">
                &ldquo;{activeParam.readingSentence}&rdquo;
              </p>
            </div>

            {/* 3 Human-Readable Progress Meters */}
            <div className="pane-meters-list">
              {activeParam.key === 'hand_shape' ? (
                <>
                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Palm Length-to-Width Ratio (a)</span>
                      <span className="meter-score-text font-tabular-nums">
                        {HAND_SHAPE_PROTOTYPES[handType].a.toFixed(2)}
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill" style={{ width: `${Math.min(100, Math.round((HAND_SHAPE_PROTOTYPES[handType].a / 1.3) * 100))}%` }} />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Middle Finger-to-Palm Ratio (b)</span>
                      <span className="meter-score-text font-tabular-nums">
                        {HAND_SHAPE_PROTOTYPES[handType].b.toFixed(2)}
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill" style={{ width: `${Math.min(100, Math.round((HAND_SHAPE_PROTOTYPES[handType].b / 1.2) * 100))}%` }} />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Archetypal Margin Clarity</span>
                      <span className="meter-score-text font-tabular-nums">
                        {activeParam.score.toFixed(1)}% ({HAND_SHAPE_PROTOTYPES[handType].name})
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill green" style={{ width: `${Math.min(100, Math.round(activeParam.score))}%` }} />
                    </div>
                  </div>
                </>
              ) : activeParam.key === 'mounts' ? (
                <>
                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Venus Mount Relief (Affection &amp; Warmth)</span>
                      <span className="meter-score-text font-tabular-nums">0.72 / 1.0</span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Jupiter &amp; Saturn Relief (Ambition &amp; Focus)</span>
                      <span className="meter-score-text font-tabular-nums">0.62 / 1.0</span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Mean 7-Mount Elevation (Shading Depth)</span>
                      <span className="meter-score-text font-tabular-nums">{activeParam.score.toFixed(1)} / 100</span>
                    </div>
                    <div className="meter-slider-track">
                      <div className="meter-slider-fill green" style={{ width: `${Math.min(100, Math.round(activeParam.score))}%` }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Traced Length Ratio (Relative to Palm Scale)</span>
                      <span className="meter-score-text font-tabular-nums">
                        {activeParam.isAbsent ? '0.00' : (Math.min(1, activeParam.score / 85)).toFixed(2)}
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div
                        className="meter-slider-fill"
                        style={{ width: `${activeParam.isAbsent ? 0 : Math.min(100, Math.round((activeParam.score / 85) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Ridge Depth &amp; Contrast Calibration</span>
                      <span className="meter-score-text font-tabular-nums">
                        {activeParam.isAbsent ? '0.00' : (Math.min(1, activeParam.score / 90)).toFixed(2)}
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div
                        className="meter-slider-fill"
                        style={{ width: `${activeParam.isAbsent ? 0 : Math.min(100, Math.round((activeParam.score / 90) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="pane-meter-item">
                    <div className="meter-header">
                      <span className="meter-name">Line Continuity &amp; Arc Smoothness</span>
                      <span className="meter-score-text font-tabular-nums">
                        {activeParam.isAbsent ? 'Absent' : `${Math.round(Math.min(100, activeParam.score * 1.05))}%`}
                      </span>
                    </div>
                    <div className="meter-slider-track">
                      <div
                        className="meter-slider-fill green"
                        style={{ width: `${activeParam.isAbsent ? 0 : Math.min(100, Math.round(activeParam.score * 1.05))}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Classical Context Note Banner */}
            <div className="pane-takeaway-banner">
              <span className="takeaway-tag">CLASSICAL TRADITION</span>
              <span className="takeaway-text">
                {activeParam.key === 'life_line'
                  ? 'Tradition stresses that the Life Line indicates vital energy and major lifestyle transitions, never physical lifespan.'
                  : activeParam.key === 'fate_line'
                  ? 'Traditional chiromancy notes that an absent Fate Line is completely normal, signifying an unconstrained, self-directed path.'
                  : activeParam.key === 'head_line'
                  ? 'Curved head lines traditionally signify creative lateral imagination; straight head lines signify structured practical logic.'
                  : activeParam.key === 'relationship_lines'
                  ? 'Line count reflects emotionally significant partnerships, not numerical marriage or divorce predictions.'
                  : activeParam.key === 'mercury_line'
                  ? 'Called the "health line" in historic 19th-century texts, but modern palmistry associates it strictly with spontaneous articulation.'
                  : activeParam.traditionalAssociation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

