'use client';

import React from 'react';

export interface FacialBeautyAboutSectionProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
  onOpenMethodologyModal?: () => void;
}

/**
 * FacialBeautyAboutSection
 *
 * User-facing guide and feature showcase:
 * - Clear purpose: Entertainment, self-love, and constructive aesthetic sandbox
 * - 4 core features (10-parameter audit, changeable vs fixed split, actionable levers, 100% private in-browser analysis)
 * - Quick-access governance suite (Privacy Policy, Terms of Evaluation, Scientific Methodology)
 * - Step-by-step "How to Use" guide with realistic examples
 */
export const FacialBeautyAboutSection: React.FC<FacialBeautyAboutSectionProps> = ({
  onOpenPrivacyModal,
  onOpenTermsModal,
  onOpenMethodologyModal,
}) => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper"
      id="about-section"
      aria-label="About Gabru Facial Attractiveness Framework"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>RENAISSANCE CANONS &bull; 100% RECREATIONAL SANDBOX</span>
          </div>
          <h2 className="about-section-title">
            About Gabru Facial Attractiveness Framework
          </h2>
          <p className="about-section-subtitle">
            An aesthetic digital sandbox translating classical Renaissance proportions and computer vision into an engaging experience.
          </p>

          <div className="about-vibe-banner vibe-banner-beauty">
            <span className="vibe-emoji" aria-hidden="true">🎉</span>
            <div className="vibe-text">
              <strong>Built for Entertainment &amp; Fun — Never to Hurt Feelings:</strong> Our platform is built for entertainment and fun, not to hurt anyone&apos;s feelings. This is the core vibe of Gabru! Human beauty is infinite, diverse, and impossible to reduce to a single number. This audit translates historical art canons into an uplifting sandbox to celebrate your features and boost your confidence!
            </div>
          </div>

          {/* Quick-Access Governance Pills Row */}
          <div className="about-gov-pills-row" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
            <button
              type="button"
              className="about-gov-btn focus-ring tactile-press"
              onClick={onOpenPrivacyModal}
            >
              <span aria-hidden="true">🔒</span>
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              className="about-gov-btn focus-ring tactile-press"
              onClick={onOpenTermsModal}
            >
              <span aria-hidden="true">🎉</span>
              <span>Terms of Evaluation</span>
            </button>
            <button
              type="button"
              className="about-gov-btn focus-ring tactile-press"
              onClick={onOpenMethodologyModal}
            >
              <span aria-hidden="true">📐</span>
              <span>Scientific Methodology</span>
            </button>
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
              <h3 className="guide-feature-title">10 Balanced Dimensions</h3>
              <p className="guide-feature-desc">
                Evaluates skin tone uniformity, eye geometry, facial thirds and fifths, smile dynamics, bilateral symmetry, and jaw contour for comprehensive proportion analysis.
              </p>
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
                Distinguishes controllable presentation cues (Skin, Expression, Grooming, Under-eye, Posture) from natural bone architecture so advice stays constructive.
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
              <h3 className="guide-feature-title">Actionable Improvement Levers</h3>
              <p className="guide-feature-desc">
                Highlights your top 3 highest-impact opportunities with calculated score gains so you can focus on practical styling and lighting adjustments.
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
              <h3 className="guide-feature-title">Local Biometric Privacy</h3>
              <p className="guide-feature-desc">
                Facial landmark detection and calculations run entirely on your local device. Your photo is never transmitted to any external server or stored.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step "How to Use" */}
        <div className="how-to-use-section scroll-reveal">
          <div className="how-to-use-header">
            <h3 className="how-to-title">How to Use This Tool for Best Results</h3>
            <p className="how-to-subtitle">
              Follow these simple steps for measurement accuracy and constructive feedback.
            </p>
          </div>

          <div className="how-to-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4 className="step-title">Take the Right Photo</h4>
              <p className="step-desc">
                Face the camera directly at eye level in even, natural daylight with a neutral expression. Keep hair lightly pulled back so your jawline and forehead are visible.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Upload &amp; Analyze</h4>
              <p className="step-desc">
                Drop your photo or click Browse. Biometric landmark tracking maps your facial thirds, eye aperture, and skin tone in seconds.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Inspect Your Deep Dives</h4>
              <p className="step-desc">
                Check your overall Face Score and review individual parameter cards to view proportions, symmetry, and skin tone analysis.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4 className="step-title">Apply Actionable Levers</h4>
              <p className="step-desc">
                Review your top controllable levers for practical styling and skincare adjustments with estimated score gains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
