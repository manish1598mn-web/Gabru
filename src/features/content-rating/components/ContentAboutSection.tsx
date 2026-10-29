'use client';

import React from 'react';

export function ContentAboutSection() {
  return (
    <section className="content-about-section" id="content-about-section">
      <div className="section-header-compact">
        <div className="section-header-eyebrow">
          <span className="badge-pulse-dot content-pulse-dot" />
          <span>PLATFORM GUIDE &amp; ARCHITECTURE</span>
          <span className="strip-eyebrow-sep">•</span>
          <span>CREATOR RETENTION PHYSICS</span>
        </div>
        <h3 className="section-title-gradient">About Gabru Content Intelligence</h3>
        <p className="section-sub-clean">
          A deterministic link-to-report analysis engine designed to evaluate short-form and long-form videos
          against empirical algorithmic retention physics and objective craft benchmarks.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="about-pillars-grid">
        <div className="about-pillar-card">
          <div className="pillar-icon-box p-icon-violet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h4 className="pillar-title">Deterministic Craft Rubric</h4>
          <p className="pillar-desc">
            Evaluates 10 core dimensions and 35 granular subfactors with explicit mathematical weights.
            Results are reproducible and auditable&mdash;the AI judge extracts observations while a calibrated engine computes ratings.
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="pillar-icon-box p-icon-cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h4 className="pillar-title">Retention Curve Physics</h4>
          <p className="pillar-desc">
            Focuses heavily on the golden first 3 seconds (00:00–00:03), cut velocity, speech cadence (140–180 WPM),
            and silence gap detection to eliminate mid-video audience drop-off before algorithms downrank distribution.
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="pillar-icon-box p-icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <h4 className="pillar-title">Creator Baseline Benchmarking</h4>
          <p className="pillar-desc">
            Avoids penalizing small channels with raw view bias. When public history is observable, content performance
            is evaluated using creator-specific z-score distributions relative to their 30-day baseline median.
          </p>
        </div>

        <div className="about-pillar-card">
          <div className="pillar-icon-box p-icon-rose">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h4 className="pillar-title">Actionable AI Rewrite Studio</h4>
          <p className="pillar-desc">
            Never leaves creators with just a number. Generates concrete viral hook angles, SEO-targeted caption copy,
            safe-zone validation, and comment-generating debate CTAs modeled on marginal score gain (&Delta;Gain).
          </p>
        </div>
      </div>

      {/* How to Use It: 3 Steps */}
      <div className="about-workflow-container" id="about-workflow-container">
        <h4 className="workflow-heading">How to Use the Content Rating Studio</h4>
        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number-badge">01</div>
            <h5 className="step-card-title">Input Link or Drop Media</h5>
            <p className="step-card-text">
              Paste any public YouTube Short, Instagram Reel, TikTok link, or drag &amp; drop an MP4/MOV file.
              The resolver immediately identifies platform, aspect ratio, and metadata.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number-badge">02</div>
            <h5 className="step-card-title">Instant Multi-Modal Audit</h5>
            <p className="step-card-text">
              Our in-browser client engine measures vocal loudness (-14 LUFS target), speech pacing, golden 3-second hook presence,
              UI safe-zone clearance, and caption density in seconds.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number-badge">03</div>
            <h5 className="step-card-title">Apply Rewrites &amp; Export</h5>
            <p className="step-card-text">
              Review your 10 diagnostic deep-dive tabs, apply highest &Delta;Gain fixes from the AI studio,
              and export a verified 1080&times;1350 audit card for your team or sponsor portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Concrete Real-World Example */}
      <div className="about-example-card" id="about-example-card">
        <div className="example-header">
          <div className="example-tag-wrap">
            <span className="badge-pulse-dot content-pulse-dot" />
            <span className="example-badge">REAL-WORLD CASE STUDY</span>
          </div>
          <h4 className="example-title">From 58/100 to 84/100: Transforming a Tech Short</h4>
        </div>

        <div className="example-comparison-grid">
          <div className="example-column before-col">
            <div className="col-header before-header">
              <span className="col-status">Original Upload</span>
              <span className="col-score score-poor">58.2 / 100</span>
            </div>
            <ul className="example-bullet-list">
              <li>
                <span className="bullet-bad">&times;</span>
                <div>
                  <strong>Delayed Hook (00:07):</strong> Creator spent 7 seconds welcoming viewers before stating the topic.
                </div>
              </li>
              <li>
                <span className="bullet-bad">&times;</span>
                <div>
                  <strong>Low Vocal Loudness (-24 LUFS):</strong> Dialogue was quiet and washed out by background music.
                </div>
              </li>
              <li>
                <span className="bullet-bad">&times;</span>
                <div>
                  <strong>Passive Closing CTA:</strong> &ldquo;Follow for more tips!&rdquo; converted at only 0.3% comment rate.
                </div>
              </li>
            </ul>
          </div>

          <div className="example-arrow-col">
            <div className="arrow-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span className="arrow-gain-text">+25.8 pts &Delta;Gain</span>
          </div>

          <div className="example-column after-col">
            <div className="col-header after-header">
              <span className="col-status">Optimized with Gabru Engine</span>
              <span className="col-score score-excellent">84.0 / 100</span>
            </div>
            <ul className="example-bullet-list">
              <li>
                <span className="bullet-good">&#10003;</span>
                <div>
                  <strong>Golden 3s Value Payoff:</strong> Opened with: &ldquo;Here is the exact VS Code shortcut that saves 30 minutes every day.&rdquo;
                </div>
              </li>
              <li>
                <span className="bullet-good">&#10003;</span>
                <div>
                  <strong>Targeted Loudness (-14 LUFS):</strong> Normalized audio with clear voice isolation and dynamic captions.
                </div>
              </li>
              <li>
                <span className="bullet-good">&#10003;</span>
                <div>
                  <strong>Debate Engagement CTA:</strong> &ldquo;Which shortcut can you not code without? Tell me below.&rdquo; boosted comments 4.8x.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 100% Privacy & Security Guarantee */}
      <div className="about-privacy-strip" id="about-privacy-strip">
        <div className="privacy-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="privacy-text-content">
          <h5>100% Client-Side Privacy Guarantee</h5>
          <p>
            Gabru Content Intelligence executes media inspections, waveform generation, and heuristic scoring
            directly within your browser session. We never request private account passwords, and your uploaded video files
            are never transmitted to or stored on external servers.
          </p>
        </div>
      </div>
    </section>
  );
}

