'use client';

import React from 'react';

/**
 * ContentAboutSection
 *
 * User-facing guide and feature showcase:
 * - Clear purpose and importance of objective social media content evaluation
 * - 4 core features and how they work (10-parameter rubric, creator baseline benchmarking, delta-gain studio, 100% in-browser privacy)
 * - Step-by-step "How to Use" guide with realistic examples
 * - Zero exposure of private project architecture or internal engineering telemetry
 */
export const ContentAboutSection: React.FC = () => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper"
      id="about-section"
      aria-label="How Social Media Content Evaluation Works"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>CREATOR GUIDE &amp; METHODOLOGY</span>
          </div>
          <h2 className="about-section-title">
            Understanding Your Content &amp; Reach Audit
          </h2>
          <p className="about-section-subtitle">
            An objective, retention-grounded media evaluation designed to help creators engineer viral pacing, vocal clarity, and algorithmic engagement&mdash;free from subjective bias.
          </p>
        </div>

        {/* 4 Core Features & How They Work */}
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
              <h3 className="guide-feature-title">10 Balanced Craft Dimensions</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Evaluates 35 objective subfactors across Hook &amp; Opening, Value &amp; Relevance, Storytelling, Visual/Audio Quality, Copy, CTA, Platform Fit, Originality, Timing, and Trust &amp; Compliance.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Eliminates guesswork by diagnosing exact drop-off moments, audio flaws, and algorithmic safe-zone penalties with mathematical consistency.</span>
              </div>
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
              <h3 className="guide-feature-title">Empirical Creator Baseline</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Computes z-score performance distributions relative to your 30-day median views and engagement rates.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Avoids penalizing smaller channels with raw view bias; benchmarks how well a piece performed relative to your typical audience reach.</span>
              </div>
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
              <h3 className="guide-feature-title">Actionable &Delta;Gain Studio</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Models marginal score gain (+1.4 pts for golden 3s payoff, +1.1 pts for debate CTA) and generates alternative viral hooks, SEO captions, and debate questions.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Turns abstract critique into production-ready creative assets you can copy and deploy directly to your next upload.</span>
              </div>
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
              <h3 className="guide-feature-title">100% In-Browser Privacy</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Video parsing, waveform generation, loudness measurement, and rubric calculations execute entirely inside your local browser session.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Your unreleased drafts, private videos, and account analytics are never uploaded to or stored on any external server.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step "How to Use" with Proper Example */}
        <div className="how-to-use-section scroll-reveal">
          <div className="how-to-use-header">
            <h3 className="how-to-title">How to Use This Tool for Best Results</h3>
            <p className="how-to-subtitle">
              Follow these simple steps to ensure the highest measurement accuracy and get the most value from your evaluation.
            </p>
          </div>

          <div className="how-to-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4 className="step-title">Paste Link or Upload Video</h4>
              <p className="step-desc">
                Paste any public YouTube Short, Instagram Reel, or TikTok link, or drop an MP4/MOV file directly into the studio dropzone.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Paste a link like https://youtube.com/shorts/sample or click Try Demo Presets to explore instantly.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Instant Multi-Modal Audit</h4>
              <p className="step-desc">
                In seconds, the engine inspects vocal loudness (-14 LUFS target), speech pacing (140&ndash;180 WPM), 0&ndash;3s golden hook payoff, and UI safe-zone margins.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Review your audio spectrum meter to confirm dialogue is audible across muted mobile feeds.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Inspect 10 Diagnostic Tabs</h4>
              <p className="step-desc">
                Check your overall Content Score (/100) and Quality vs. Performance split. Click on any of the 10 parameter cards to view concrete timestamps, quotes, and metrics.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Jump to the Pacing Matrix to pinpoint exact dead-air silence gaps longer than 1.5 seconds.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4 className="step-title">Apply Rewrites &amp; Export</h4>
              <p className="step-desc">
                Review your personalized top suggestions ranked by &Delta;Gain. Copy optimized viral hooks, SEO captions, and debate CTAs, or export a high-res 1080&times;1350 style card.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Swap a generic &ldquo;Follow for more&rdquo; with a debate question to lift comment velocity by 4.8x.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Walkthrough Example Scenario Banner */}
        <div className="guide-example-banner scroll-reveal">
          <div className="banner-badge">PRACTICAL SCENARIO</div>
          <h4 className="banner-title">Real-World Content Optimization Example</h4>
          <p className="banner-text">
            Consider a creator whose technical explainer Short scores <strong>58.2/100</strong> due to a 7-second delayed hook, quiet vocal audio (-24 LUFS), and a passive closing CTA (&ldquo;Follow for more&rdquo;). Rather than reshooting the entire video, the creator implements three high-leverage fixes: trims the 4-second intro so the visual payoff occurs at 00:02 (<strong>+1.4 pts</strong>), normalizes audio loudness to -14 LUFS (<strong>+1.2 pts</strong>), and replaces the CTA with an opinion trigger (&ldquo;Which VS Code shortcut saves you the most time? Drop it below&rdquo; &mdash; <strong>+1.1 pts</strong>). These targeted tweaks lift the total Content Score to <strong>84.0/100</strong> (&ldquo;Strong&rdquo;), dramatically boosting predicted retention and algorithmic reach.
          </p>
        </div>
      </div>
    </section>
  );
};
