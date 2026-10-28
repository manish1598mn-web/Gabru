'use client';

import React from 'react';

/**
 * FacialBeautyAboutSection
 *
 * Manifesto and 3 core scientific pillars:
 * - Pillar 1: Skin & Vitality (21 Pts)
 * - Pillar 2: Geometry & Symmetry (42 Pts)
 * - Pillar 3: Dynamic & Styling (37 Pts)
 *
 * Grounded in empirical biometrics, local in-browser vision, and zero-retention privacy.
 */
export const FacialBeautyAboutSection: React.FC = () => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper"
      id="about-section"
      aria-label="About Gabru & Facial Attractiveness Framework"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span className="badge-pulse-dot" />
            <span>ABOUT GABRU &amp; FACIAL ATTRACTIVENESS ARCHITECTURE</span>
          </div>
          <h2 className="about-section-title">
            Evidence-Based Facial Aesthetics, Built for Objective Harmony
          </h2>
          <p className="about-section-subtitle">
            How Gabru evaluates skin vitality, proportion harmony, bilateral symmetry, and grooming cues with the rigor
            of peer-reviewed facial research.
          </p>
        </div>

        {/* About Platform Manifesto Card */}
        <div className="about-manifesto-card scroll-reveal">
          <div className="about-manifesto-left">
            <h3 className="manifesto-card-title">Empirical Biometrics Meets Local In-Browser Vision</h3>
            <p className="manifesto-card-text">
              <strong style={{ color: '#ffffff' }}>Gabru Beauty Rating</strong> translates published human perception
              science and craniofacial proportion research into a calibrated 100-point framework.
            </p>
            <p className="manifesto-card-text">
              From periorbital brightness and golden ratio adherence (φ ≈ 1.618) to bilateral horizontal symmetry and
              grooming precision, every measurement runs client-side in memory. Your facial portraits never touch a server.
            </p>
            <div className="manifesto-tags-row">
              <span className="manifesto-tag">✓ 100% Client-Side Private</span>
              <span className="manifesto-tag">✓ Zero Server Data Storage</span>
              <span className="manifesto-tag">✓ 8-Parameter Biometric Rubric</span>
            </div>
          </div>

          <div className="about-manifesto-specs">
            <div className="spec-metric-item">
              <span className="spec-label">Evaluation Engine</span>
              <span className="spec-value">Local Vision Canvas</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Analysis Latency</span>
              <span className="spec-value">&lt; 1.0 Seconds</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Rating Framework</span>
              <span className="spec-value">8 Research Parameters</span>
            </div>
            <div className="spec-metric-item">
              <span className="spec-label">Server Data Storage</span>
              <span className="spec-value">0 Bytes Stored</span>
            </div>
          </div>
        </div>

        {/* 3 Core Rating Pillars / Feature Cards */}
        <div className="about-pillars-grid">
          <div className="feature-block scroll-reveal" id="feature-1">
            <div className="feature-icon-circle icon-circle-blue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="feature-title">Pillar 1: Skin &amp; Vitality (21 Pts)</h3>
            <p className="feature-description">
              Skin Quality &amp; Health Cues represents the largest single factor (21 pts). Evaluates tone evenness,
              micro-texture clarity, healthy vascular flush, and sclera/eye brightness.
            </p>
            <span className="feature-tier-badge">Strong Evidence</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-2">
            <div className="feature-icon-circle icon-circle-green">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="feature-title">Pillar 2: Geometry &amp; Symmetry (42 Pts)</h3>
            <p className="feature-description">
              Analyzes Proportions &amp; Harmony (19 pts with facial thirds, fifths, and golden ratio φ), Bilateral
              Symmetry (11 pts), and Population Averageness (12 pts).
            </p>
            <span className="feature-tier-badge">Harmony Foundation</span>
          </div>

          <div className="feature-block scroll-reveal" id="feature-3">
            <div className="feature-icon-circle icon-circle-violet">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Pillar 3: Dynamic &amp; Styling (37 Pts)</h3>
            <p className="feature-description">
              Evaluates Expression &amp; Warmth (13 pts), Grooming &amp; Styling (10 pts), Sexual Dimorphism (7 pts),
              and Individual Feature Definition (7 pts).
            </p>
            <span className="feature-tier-badge">Expressive Finish</span>
          </div>
        </div>
      </div>
    </section>
  );
};

