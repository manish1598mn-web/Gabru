'use client';

import React from 'react';

/**
 * ContentAboutSection
 *
 * User-facing guide and architecture showcase:
 * - Clear purpose and importance of single-post social media personality & viral diagnostics
 * - 4 core features: 10 Entertaining Dimensions, Scraped Telemetry & Hidden Ratios, Multimodal Vision & NLP, and Transparent 100-Point Impact Scale
 * - Step-by-step "How to Use" guide with realistic single-post workflow
 * - Clean, calm Apple-grade aesthetic
 */
export const ContentAboutSection: React.FC = () => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper"
      id="about-section"
      aria-label="How Single-Post Content Evaluation Works"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>CONTENT RATING METHODOLOGY</span>
          </div>
          <h2 className="about-section-title">
            Understanding Single-Post Diagnostic Intelligence
          </h2>
          <p className="about-section-subtitle">
            Multimodal single-post evaluation combining public engagement counters, visual framing, and viral momentum.
          </p>

          <div className="about-vibe-banner vibe-banner-content">
            <span className="vibe-emoji" aria-hidden="true">🚀</span>
            <div className="vibe-text">
              <strong>Creative Energy &amp; Fun:</strong> Content Rating is an entertaining creator lab designed to spark viral video ideas, test hook lines, and have fun analyzing social dynamics—never to discourage your creative voice!
            </div>
          </div>
        </div>

        {/* 4 Core Features */}
        <div className="features-showcase-grid">
          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">10 Distinct Dimensions</h3>
              <p className="guide-feature-desc">
                Evaluates Main Character Energy, Visual Aura, Scroll Hook, Caption Polish, Group-Chat Forwardability, and Bookmark Bait.
              </p>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">Objective Craft &amp; Pacing</h3>
              <p className="guide-feature-desc">
                Evaluates opening hook punch, pacing cadence, visual composition, and narrative clarity.
              </p>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-violet">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">Visual &amp; Formatting Rubrics</h3>
              <p className="guide-feature-desc">
                Evaluates lighting balance, composition, caption readability, and platform UI safe zones.
              </p>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">Calibrated 100-Point Impact Scale</h3>
              <p className="guide-feature-desc">
                Scores content across 10 balanced dimensions on a 100-point scale, awarding certified Archetype Badges and practical optimization takeaways.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step "How to Use" */}
        <div className="how-to-use-section scroll-reveal">
          <div className="how-to-use-header">
            <h3 className="how-to-title">How to Evaluate Any Single Post in Seconds</h3>
            <p className="how-to-subtitle">
              Follow these simple steps to benchmark any public post and get your personalized scorecard.
            </p>
          </div>

          <div className="how-to-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4 className="step-title">Paste Any Single Post URL</h4>
              <p className="step-desc">
                Paste any public Instagram, TikTok, YouTube Short, X, or LinkedIn post link.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Instant Vision &amp; Craft Audit</h4>
              <p className="step-desc">
                Opening visual hook, framing, aspect ratio, caption wit, and safe zones are evaluated in seconds.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Inspect 10 Diagnostic Deep Dives</h4>
              <p className="step-desc">
                Navigate the 10 diagnostic tabs to inspect your score breakdown, vibe roasts, and actionable takeaways.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4 className="step-title">Export Verified 1080&times;1350 Share Card</h4>
              <p className="step-desc">
                Generate an ultra-crisp social share card stamped with your Archetype Badge, score, and key metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
