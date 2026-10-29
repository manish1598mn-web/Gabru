'use client';

/**
 * GABRU — CONTENT RATING & ADVISORY FEATURE PAGE
 * 
 * 10-Parameter Social Media Quality & Performance Intelligence Studio.
 * Evaluates short-form and long-form video, carousels, and copy across:
 * - 100-Point Quality Score (Hook, Value, Structure, Media, Copy, CTA, Platform Fit, Originality, Timing, Compliance)
 * - 100-Point Performance Score (Empirical creator-baseline z-score model)
 * - Blended Content Score (70% Quality + 30% Performance)
 * - Actionable Advice, Prioritized Fixes, and Concrete AI Rewrites
 */

import React, { useState } from 'react';
import { AppNavbar } from '@/shared/components/layout/AppNavbar';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';

export default function ContentRatingFeaturePage() {
  const [contentUrl, setContentUrl] = useState<string>('');
  const [inputMode, setInputMode] = useState<'link' | 'upload' | 'demo'>('link');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize scroll reveal hooks
  useIntersectionReveal();

  return (
    <div className="gabru-app-container content-studio-theme" id="gabru-content-studio">
      <AppNavbar activeFeature="content-rating" />

      <main className="content-page-main" id="main-content">
        {/* Hero Studio Container */}
        <section className="hero-wrapper content-hero-section" id="hero-studio-section">
          <div className="hero-container">
            <div className="hero-left-column">
              <h1 className="hero-headline scroll-reveal" id="hero-headline">
                Paste Content Link,
                <br />
                <span className="gradient-text content-gradient-text">Rate Social Reach</span>
              </h1>

              <p className="hero-description scroll-reveal" id="hero-description">
                Evidence-gated audit across 10 craft dimensions and creator-baseline metrics.
                Instant hook analysis, audio LUFS verification, retention pacing, and concrete rewrites.
              </p>

              {/* Mode Switcher Dock */}
              <div className="content-mode-dock scroll-reveal" role="tablist" aria-label="Input Mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMode === 'link'}
                  className={`content-mode-btn ${inputMode === 'link' ? 'is-active' : ''}`}
                  onClick={() => setInputMode('link')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Paste Link (Path A)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMode === 'upload'}
                  className={`content-mode-btn ${inputMode === 'upload' ? 'is-active' : ''}`}
                  onClick={() => setInputMode('upload')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload Media (Path C)</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={inputMode === 'demo'}
                  className={`content-mode-btn ${inputMode === 'demo' ? 'is-active' : ''}`}
                  onClick={() => setInputMode('demo')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Try Demo Preset</span>
                </button>
              </div>

              {/* Link Input Card */}
              <div className="content-input-card scroll-reveal">
                <div className="content-link-field-wrapper">
                  <div className="content-link-icon-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="Paste YouTube Short, Instagram Reel, TikTok, or X link..."
                    className="content-link-input"
                    id="content-url-input"
                  />
                  <button
                    type="button"
                    className="btn-analyze-content"
                    id="btn-analyze-content"
                    onClick={() => {}}
                  >
                    <span>Analyze</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>

                {/* Supported Platform Badges */}
                <div className="content-supported-pills">
                  <span className="platform-tag">YouTube Shorts &amp; Videos</span>
                  <span className="platform-tag">Instagram Reels</span>
                  <span className="platform-tag">TikTok</span>
                  <span className="platform-tag">X / Twitter</span>
                  <span className="platform-tag">LinkedIn</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Studio Media Dock */}
            <div className="hero-right-column">
              <div className="content-preview-dock scroll-reveal" id="content-media-dock">
                <div className="dock-glass-header">
                  <div className="dock-badge-pulse">
                    <span className="dock-live-dot" />
                    <span>STUDIO WORKSPACE</span>
                  </div>
                  <span className="dock-format-badge">9:16 VERTICAL</span>
                </div>

                <div className="dock-placeholder-body">
                  <div className="dock-play-bubble">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <p className="dock-prompt-text">
                    Paste a public link or load a preset demo to preview media playback, keyframe breakdown, and audio waveforms.
                  </p>
                </div>

                <div className="dock-glass-footer">
                  <div className="dock-meta-item">
                    <span className="dock-meta-label">TARGET LOUDNESS</span>
                    <span className="dock-meta-val">-14 ± 3 LUFS</span>
                  </div>
                  <div className="dock-meta-item">
                    <span className="dock-meta-label">TIME TO VALUE</span>
                    <span className="dock-meta-val">&le; 3 SECONDS</span>
                  </div>
                  <div className="dock-meta-item">
                    <span className="dock-meta-label">PRIVACY</span>
                    <span className="dock-meta-val">CLIENT MEMORY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

