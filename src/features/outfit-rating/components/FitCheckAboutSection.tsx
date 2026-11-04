'use client';

import React from 'react';

export function FitCheckAboutSection() {
  return (
    <section className="feature-strip-wrapper about-strip-wrapper" id="about-section" aria-label="How Fit Check Works">
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>OUTFIT EVALUATION GUIDE</span>
          </div>
          <h2 className="about-section-title">
            Understanding Your Fit &amp; Style Audit
          </h2>
          <p className="about-section-subtitle">
            Playful, objective analysis of garment tailoring, body proportions, color balance, and styling polish.
          </p>

          <div className="about-vibe-banner">
            <span className="vibe-emoji" aria-hidden="true">🎉</span>

          </div>
        </div>

        {/* 3 Core Rating Pillars */}
        <div className="about-pillars-grid">
          <div className="feature-block scroll-reveal" id="feature-1">
            <div className="feature-icon-circle icon-circle-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3v18" />
                <path d="M18 3v18" />
                <path d="M6 8h12" />
                <path d="M6 16h12" />
              </svg>
            </div>
            <h3 className="feature-title">Foundations &amp; Silhouette (71 Pts)</h3>
            <p className="feature-description">
              Evaluates the core architecture of your outfit: shoulder seam fit, torso-to-leg proportions, color harmony, and occasion appropriateness.
            </p>
            <span className="feature-tier-badge">Foundations (71 Pts)</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-2">
            <div className="feature-icon-circle icon-circle-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-title">Details &amp; Craft (20 Pts)</h3>
            <p className="feature-description">
              Inspects fabric texture interaction, footwear coordination, accessory placement, and overall grooming execution.
            </p>
            <span className="feature-tier-badge">Details (20 Pts)</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-3">
            <div className="feature-icon-circle icon-circle-violet">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Styling Polish (9 Pts)</h3>
            <p className="feature-description">
              Assesses focal point attention control and unique personal signature that elevates an ensemble from standard to memorable.
            </p>
            <span className="feature-tier-badge">Styling (9 Pts)</span>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="how-to-use-section scroll-reveal">
          <div className="how-to-use-header">
            <h3 className="how-to-title">How to Get an Accurate Fit Check</h3>
            <p className="how-to-subtitle">
              Follow these simple steps for precise silhouette and tailoring assessment.
            </p>
          </div>

          <div className="how-to-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4 className="step-title">Full-Length Photo</h4>
              <p className="step-desc">
                Take a straight-on, full-body portrait showing head-to-toe clothing and footwear in good ambient light. Standing relaxed 2–3 meters away works best.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Upload &amp; Analyze</h4>
              <p className="step-desc">
                Drop your image or browse your device. Landmark vision maps garment boundaries and proportion lines in seconds.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Review Recommendations</h4>
              <p className="step-desc">
                Check your score breakdown and inspect specific suggestions—such as adjusting trouser break or balancing color contrast.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
