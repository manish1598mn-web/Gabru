'use client';

import React from 'react';

export function FitCheckAboutSection() {
  return (
    <section className="feature-strip-wrapper about-strip-wrapper" id="about-section" aria-label="About Gabru & Platform Intelligence">
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span className="badge-pulse-dot" />
            <span>ABOUT GABRU &amp; PLATFORM ARCHITECTURE</span>
          </div>
          <h2 className="about-section-title">
            Precision Aesthetic Scoring, Built for Sartorial Excellence
          </h2>
          <p className="about-section-subtitle">
            How Gabru evaluates tailoring, proportion, color harmony, and visual hierarchy with the discernment of an editorial fashion stylist.
          </p>
        </div>

        {/* About Platform Manifesto Card */}
        <div className="about-manifesto-card scroll-reveal">
          <div className="about-manifesto-left">
            <h3 className="manifesto-card-title">Editorial Discernment Meets Local Vision Computing</h3>
            <p className="manifesto-card-text">
              <strong style={{ color: '#ffffff' }}>Gabru</strong> was designed to demystify personal style. Rather than relying on subjective guesswork or opaque cloud servers, Gabru translates classical sartorial proportions and color theory into a structured 100-point evaluation framework.
            </p>
            <p className="manifesto-card-text">
              From shoulder seam alignment and trouser break to color temperature and hero piece placement, every garment dimension is calculated in-memory directly in your browser session. Your photos never leave your device.
            </p>
            <div className="manifesto-tags-row">
              <span className="manifesto-tag">✓ 100% Client-Side Private</span>
              <span className="manifesto-tag">✓ Zero Server Data Storage</span>
              <span className="manifesto-tag">✓ Full-Fidelity RAW/Hi-Res Display</span>
            </div>
          </div>

          <div className="about-manifesto-specs">
            <div className="spec-metric-item">
              <span className="spec-label">Evaluation Engine</span>
              <span className="spec-value">Local Vision Canvas</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Analysis Latency</span>
              <span className="spec-value">&lt; 1.2 Seconds</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Rating Framework</span>
              <span className="spec-value">10 Discrete Parameters</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Server Data Storage</span>
              <span className="spec-value">0 Bytes Stored</span>
            </div>
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
            <h3 className="feature-title">Tier 1: Foundations (71 Pts)</h3>
            <p className="feature-description">
              Evaluates the core architecture: Fit &amp; Tailoring (25), Proportion (16), Occasion Appropriateness (12), Color Harmony (10), and Style Cohesion (8).
            </p>
            <span className="feature-tier-badge">Bedrock Architecture</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-2">
            <div className="feature-icon-circle icon-circle-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-title">Tier 2: Details &amp; Craft (20 Pts)</h3>
            <p className="feature-description">
              Inspects material quality &amp; texture condition (8), footwear &amp; accessory coordination (7), and hair/grooming execution (5).
            </p>
            <span className="feature-tier-badge">The Refinements</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-3">
            <div className="feature-icon-circle icon-circle-violet">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Tier 3: Expert Polish (9 Pts)</h3>
            <p className="feature-description">
              Identifies focal point attention control (5) and unique personal expression/originality (4) that distinguishes an outfit from the ordinary.
            </p>
            <span className="feature-tier-badge">Sartorial Signature</span>
          </div>
        </div>
      </div>
    </section>
  );
}

