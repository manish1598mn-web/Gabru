'use client';

/**
 * GABRU — HAND TRADITION & PALMISTRY GUIDE SECTION
 * 
 * Educational guide covering:
 * - Western Chiromancy vs. Indian Samudrika Shastra
 * - 4 Elemental Hand Shape Archetypes (Earth, Air, Fire, Water)
 * - Photographic Quality Gate & Confidence Filtering (< 0.40 = Unreadable)
 * - Strict Entertainment Notice & Biometric Privacy Standard
 */

import React from 'react';

export const HandTraditionGuideSection: React.FC = () => {
  return (
    <section
      className="feature-strip-wrapper about-strip-wrapper hand-guide-strip"
      id="hand-about-section"
      aria-label="How Hand Reading Works"
    >
      <div className="feature-strip-container">
        {/* Section Header */}
        <div className="about-section-header scroll-reveal">
          <div className="about-section-eyebrow">
            <span>TRADITIONS &amp; METHODOLOGY</span>
          </div>
          <h2 className="about-section-title">
            Understanding Palm Line Prominence &amp; Archetypes
          </h2>
          <p className="about-section-subtitle">
            Photographic evaluation of hand line clarity comparing Western Chiromancy and Indian Samudrika Shastra traditions.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="features-showcase-grid">
          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">10 Traditional Dimensions</h3>
              <p className="guide-feature-desc">
                Traces ridge continuity across Life, Head, Heart, Fate, Sun, Mercury, and Relationship lines, plus mount shading relief, finger proportions, and special markings.
              </p>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">4 Elemental Hand Shapes</h3>
              <p className="guide-feature-desc">
                Classifies hands into classical archetypes: Earth (square palm, short fingers), Air (square palm, long fingers), Fire (rectangular palm, short fingers), and Water (rectangular palm, long fingers).
              </p>
            </div>
          </div>

          <div className="guide-feature-card scroll-reveal">
            <div className="guide-feature-icon icon-violet">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="guide-feature-content">
              <h3 className="guide-feature-title">Quality Gate &amp; Confidence</h3>
              <p className="guide-feature-desc">
                Checks sharpness, palm width, glare, and hand tilt. Faint or low-contrast captures are marked Unreadable rather than penalized as zero.
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
              <h3 className="guide-feature-title">Biometric Privacy Protection</h3>
              <p className="guide-feature-desc">
                Palm image processing executes entirely in temporary memory on your device. You can click &ldquo;Delete Image&rdquo; at any time to immediately purge all visual data.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="how-to-use-section scroll-reveal">
          <div className="how-to-use-header">
            <h3 className="how-to-title">How to Capture Your Palm for Best Accuracy</h3>
            <p className="how-to-subtitle">
              Follow these simple steps to maximize line contrast and achieve high detection confidence.
            </p>
          </div>

          <div className="how-to-steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4 className="step-title">Diffuse Front Lighting</h4>
              <p className="step-desc">
                Place hand near an indirect window or soft lamp. Avoid harsh top flash that creates misleading shadows across the palm hollow.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4 className="step-title">Parallel Palm &amp; Relaxed Fingers</h4>
              <p className="step-desc">
                Hold palm completely flat and parallel to camera lens. Spread fingers slightly so the mounts and borders are clearly visible.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4 className="step-title">Toggle Traditions &amp; Absent Policy</h4>
              <p className="step-desc">
                Switch between Western Chiromancy and Indian Samudrika Shastra to compare cultural interpretations, and choose how absent lines factor into your score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

