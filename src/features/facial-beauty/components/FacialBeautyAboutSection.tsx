'use client';

import React from 'react';

/**
 * FacialBeautyAboutSection
 *
 * User-facing guide and feature showcase:
 * - Clear purpose and importance of objective facial harmony evaluation
 * - 4 core features and how they work (10-parameter audit, changeable vs fixed split, actionable levers, 100% private in-browser analysis)
 * - Step-by-step "How to Use" guide with realistic examples and photo best practices
 * - Zero exposure of private project architecture or internal engineering telemetry
 */
export const FacialBeautyAboutSection: React.FC = () => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper"
      id="about-section"
      aria-label="How Facial Attractiveness Evaluation Works"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>USER GUIDE &amp; METHODOLOGY</span>
          </div>
          <h2 className="about-section-title">
            Understanding Your Facial Harmony Audit
          </h2>
          <p className="about-section-subtitle">
            An objective, research-grounded aesthetic analysis designed to help you discover your natural facial proportions, skin vitality, and grooming potential—free from beauty filter distortion.
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
              <h3 className="guide-feature-title">10 Balanced Dimensions</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Evaluates 29 anatomical points across 10 balanced parameters—including skin tone uniformity, eye aperture geometry, facial thirds and fifths, smile dynamics, bilateral symmetry, and jaw contour.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Prevents over-fixating on any single trait by assessing complete craniofacial harmony in equilibrium.</span>
              </div>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">Changeable vs. Fixed Split</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Automatically distinguishes controllable presentational cues (Skin, Expression, Grooming, Under-eye clarity, Posture — ~43 pts) from natural bone architecture (~57 pts).
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Eliminates anxiety over unalterable genetics and directs your focus strictly toward realistic grooming habits.</span>
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
              <h3 className="guide-feature-title">Actionable Improvement Levers</h3>
              <p className="guide-feature-desc">
                <strong>How it works:</strong> Identifies your top 3 highest-impact opportunities with calculated score gains (e.g. +0.6 pts for Duchenne eye-crinkle warmth, +0.4 pts for eyebrow arch definition).
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Turns an abstract rating into a personalized, practical styling and skincare roadmap you can implement immediately.</span>
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
                <strong>How it works:</strong> Facial landmark detection and colorimetric calculations execute completely inside your local browser memory. Your photo is never sent to or stored on any server.
              </p>
              <div className="guide-feature-why">
                <span className="why-label">Why it matters:</span>
                <span>Ensures absolute data privacy with zero cloud retention, while letting you export a clean 1080×1350 style card anytime.</span>
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
              <h4 className="step-title">Take the Right Photo</h4>
              <p className="step-desc">
                Face the camera directly at eye level in even, natural daylight. Maintain a neutral expression with relaxed lips and forehead. Keep hair lightly pulled back so your hairline, jaw, and ears are visible.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>A well-lit passport-style portrait taken 1.5 m away without heavy filters or extreme angles.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Upload &amp; Analyze</h4>
              <p className="step-desc">
                Drop your photo into the studio or click <em>Browse Face Photo</em>. In seconds, 29 biometric landmark points are mapped to compute your facial thirds, aperture ratios, and skin tone.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>You can also click <em>Sample Portrait</em> or <em>Try Beauty Sketch</em> to instantly explore the dashboard.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Inspect Your Deep Dives</h4>
              <p className="step-desc">
                Check your overall Face Score (/100) and Changeable vs. Fixed breakdown. Click on any of the 10 parameter cards to view clinical ratios, such as vertical thirds deviation or canthal tilt.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Inspect your sampled skin pigment swatches in CIELAB color space and copy their HEX codes directly.</span>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4 className="step-title">Apply Actionable Levers</h4>
              <p className="step-desc">
                Review your personalized top 3 controllable levers. Focus your daily routine on these high-ROI styling adjustments to elevate your presentation score and overall aesthetic harmony.
              </p>
              <div className="step-example-pill">
                <span className="example-tag">Example:</span>
                <span>Target under-eye hydration with a peptide serum and maintain clean eyebrow perimeter edges for an instant gain.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Walkthrough Example Scenario Banner */}
        <div className="guide-example-banner scroll-reveal">
          <div className="banner-badge">PRACTICAL SCENARIO</div>
          <h4 className="banner-title">Real-World Application Example</h4>
          <p className="banner-text">
            Consider a user whose structural bone harmony scores <strong>93.5%</strong> (well-balanced thirds, symmetrical features), but whose changeable score is <strong>82%</strong> due to periorbital fatigue shadows and slightly unkempt brow edges. Rather than worrying about fixed features, the system highlights two simple levers: hydrating under-eye care and lower brow arch cleanup. Executing these two controllable styling tweaks yields a projected gain of <strong>+1.2 points</strong>, lifting the total Face Score into the top tier.
          </p>
        </div>
      </div>
    </section>
  );
};
