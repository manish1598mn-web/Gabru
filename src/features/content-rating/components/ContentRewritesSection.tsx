'use client';

import React, { useState } from 'react';
import {
  ContentScoreData,
  DeepDiveContentTabKey,
  EffortTier,
} from '../types/ContentRatingTypes';
import { PARAM_TO_TAB } from '../constants/ContentRatingConstants';
import { Button } from '@/shared/components/ui/Button';

interface ContentRewritesSectionProps {
  scoreData: ContentScoreData | null;
  onSelectTab: (tab: DeepDiveContentTabKey) => void;
}

export function ContentRewritesSection({
  scoreData,
  onSelectTab,
}: ContentRewritesSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<'hooks' | 'caption' | 'cta'>('hooks');

  if (!scoreData) {
    return null;
  }

  const { suggestions } = scoreData;

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getEffortLabel = (effort: EffortTier) => {
    switch (effort) {
      case 'quick':
        return { label: 'Quick Fix (<5m)', className: 'effort-quick' };
      case 'medium':
        return { label: 'Medium Effort (15m)', className: 'effort-medium' };
      case 'heavy':
        return { label: 'Deep Rework (30m+)', className: 'effort-hard' };
      default:
        return { label: 'Tweak', className: 'effort-quick' };
    }
  };

  // Find concrete rewrites from suggestions
  const hookSuggestions = suggestions.find((s) => s.concreteRewrite?.type === 'hooks');
  const captionSuggestions = suggestions.find((s) => s.concreteRewrite?.type === 'caption');
  const ctaSuggestions = suggestions.find((s) => s.concreteRewrite?.type === 'cta');

  // Fallback demo rewrites if specific suggestion does not exist
  const hookVariants = hookSuggestions?.concreteRewrite?.variants || [
    'Direct Value: "Here is the exact shortcut that saves 30 minutes every single day."',
    'Curiosity Gap: "Most creators still waste 500 clicks a day doing this wrong..."',
    'Contrarian: "Never touch your default settings again. Do this one tweak instead."',
  ];

  const captionText =
    captionSuggestions?.concreteRewrite?.fullText ||
    `Stop wasting hours on manual editing.\n\nHere is the exact retention formula used by top 1% accounts to hold viewers past the critical 3-second drop-off.\n\nSave this checklist for your next upload!`;

  const hashtagList = captionSuggestions?.concreteRewrite?.tags || [
    '#contentcreator',
    '#videotips',
    '#growthhacking',
    '#socialmediamarketing',
  ];

  const ctaText =
    ctaSuggestions?.concreteRewrite?.fullText ||
    'Closing line: "Which part of your creation workflow slows you down the most? Let me know in the comments below."';

  return (
    <section className="content-rewrites-section" id="content-rewrites-section">
      <div className="section-header-compact">
        <div className="about-section-eyebrow">
          <span>RANKED FIXES &amp; OPTIMIZATION</span>
        </div>
        <h3 className="section-title-gradient">Ranked Suggestions &amp; AI Studio Sandbox</h3>
        <p className="section-sub-clean">
          Mathematical optimization modeled on marginal score gain (&Delta;Gain).
          Prioritize highest gain fixes first to elevate your content into the top creator percentile.
        </p>
      </div>

      {/* Part 1: Top Ranked Fixes */}
      <div className="ranked-suggestions-grid">
        {suggestions.slice(0, 3).map((sug, idx) => {
          const effortInfo = getEffortLabel(sug.effort);
          const tab = PARAM_TO_TAB[sug.parameterId];

          return (
            <div key={sug.id} className="ranked-sug-card" id={`ranked-sug-${idx}`}>
              <div className="sug-card-top">
                <div className="sug-rank-badge">
                  <span className="sug-rank-num font-tabular-nums">#{idx + 1}</span>
                  <span className="sug-rank-text">{idx === 0 ? 'Highest Leverage' : 'High Impact'}</span>
                </div>
                <div className="sug-meta-badges">
                  <span className={`sug-effort-badge ${effortInfo.className}`}>{effortInfo.label}</span>
                  <span className="sug-gain-badge font-tabular-nums">+{sug.estimatedGain.toFixed(1)} pts &Delta;Gain</span>
                </div>
              </div>

              <h4 className="sug-card-title">{sug.title}</h4>
              <p className="sug-card-desc">{sug.description}</p>

              <div className="sug-card-bottom">
                <span className="sug-subfactor-tag">Factor: {sug.subfactorCode}</span>
                {tab && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSelectTab(tab);
                      const el = document.getElementById('content-diagnostic-suite');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    rightIcon={
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    }
                  >
                    Inspect Diagnostic
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: Interactive AI Optimization Studio */}
      <div className="studio-sandbox-container" id="studio-sandbox-container">
        <div className="sandbox-header">
          <div className="sandbox-header-left">
            <div className="sandbox-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span>AI REWRITE ENGINE</span>
            </div>
            <h4 className="sandbox-title">Creator Rewrite Studio</h4>
          </div>

          <div className="sandbox-tab-switch">
            <button
              type="button"
              className={`sandbox-tab-btn focus-ring tactile-press ${activeStudioTab === 'hooks' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('hooks')}
            >
              Viral Hooks (3 Angles)
            </button>
            <button
              type="button"
              className={`sandbox-tab-btn focus-ring tactile-press ${activeStudioTab === 'caption' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('caption')}
            >
              SEO Caption &amp; Tags
            </button>
            <button
              type="button"
              className={`sandbox-tab-btn focus-ring tactile-press ${activeStudioTab === 'cta' ? 'active' : ''}`}
              onClick={() => setActiveStudioTab('cta')}
            >
              Debate CTA
            </button>
          </div>
        </div>

        <div className="sandbox-body">
          {/* Studio Tab 1: Hooks */}
          {activeStudioTab === 'hooks' && (
            <div className="sandbox-panel-pane" id="sandbox-panel-hooks">
              <div className="sandbox-pane-intro">
                <h5>3 High-Retention Opening Angles (00:00–00:03)</h5>
                <p>
                  Eliminate introductory delay. Pick one of these tested angles to compress the payoff into the golden 3-second window:
                </p>
              </div>

              <div className="hook-variants-list">
                {hookVariants.map((variant, vIdx) => {
                  const [category, text] = variant.includes(':') ? variant.split(/:(.+)/) : ['Angle', variant];
                  const key = `hook_${vIdx}`;
                  const isCopied = copiedKey === key;

                  return (
                    <div key={vIdx} className="hook-variant-card">
                      <div className="hook-variant-top">
                        <span className="hook-category-tag">{category.trim()}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopy(text.trim().replace(/^["']|["']$/g, ''), key)}
                          leftIcon={
                            isCopied ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )
                          }
                        >
                          {isCopied ? 'Copied!' : 'Copy Line'}
                        </Button>
                      </div>
                      <p className="hook-quote-text">{text.trim()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Studio Tab 2: Caption & Hashtags */}
          {activeStudioTab === 'caption' && (
            <div className="sandbox-panel-pane" id="sandbox-panel-caption">
              <div className="sandbox-pane-intro">
                <h5>Optimized 3-Line Caption &amp; 3–5 Hashtag Cluster</h5>
                <p>
                  Engineered for algorithmic keyword search and maximum click-through on &ldquo;...more&rdquo; unfold:
                </p>
              </div>

              <div className="caption-editor-box">
                <div className="caption-text-preview">
                  <pre className="caption-raw-pre">{captionText}</pre>
                </div>

                <div className="caption-hashtags-preview">
                  <span className="tags-label">Targeted Cluster ({hashtagList.length}/5 optimal band):</span>
                  <div className="tags-flex">
                    {hashtagList.map((tag, tIdx) => (
                      <span key={tIdx} className="tag-pill-item">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="caption-actions-bar">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() =>
                      handleCopy(`${captionText}\n\n${hashtagList.join(' ')}`, 'caption_full')
                    }
                    leftIcon={
                      copiedKey === 'caption_full' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )
                    }
                  >
                    {copiedKey === 'caption_full' ? 'Copied Caption & Hashtags!' : 'Copy Complete Caption & Tags'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Studio Tab 3: Debate CTA */}
          {activeStudioTab === 'cta' && (
            <div className="sandbox-panel-pane" id="sandbox-panel-cta">
              <div className="sandbox-pane-intro">
                <h5>Algorithmic Comment Trigger (Debate Velocity)</h5>
                <p>
                  Social algorithms weigh comment threads 4x higher than standard likes.
                  Replace passive directives with specific, low-friction opinion triggers:
                </p>
              </div>

              <div className="cta-comparison-grid">
                <div className="cta-compare-card weak-cta">
                  <div className="cta-compare-header">
                    <span className="cta-status-badge weak">❌ Weak Directive (0.4% Comment Rate)</span>
                  </div>
                  <p className="cta-quote-line">&ldquo;Follow for more tips and like this video if you learned something!&rdquo;</p>
                  <p className="cta-critique">Passive command triggers immediate swipe-away. Offers zero conversational hook.</p>
                </div>

                <div className="cta-compare-card strong-cta">
                  <div className="cta-compare-header">
                    <span className="cta-status-badge strong">✅ Optimized Debate Trigger (2.8% Comment Rate)</span>
                  </div>
                  <p className="cta-quote-line">{ctaText}</p>
                  <p className="cta-critique">Specific, identity-affirming question prompts viewers to pause and type immediately.</p>
                </div>
              </div>

              <div className="cta-action-wrap">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleCopy(ctaText.replace(/^Closing line:\s*/, ''), 'cta_line')}
                  leftIcon={
                    copiedKey === 'cta_line' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )
                  }
                >
                  {copiedKey === 'cta_line' ? 'Copied Closing CTA!' : 'Copy Closing Line'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

