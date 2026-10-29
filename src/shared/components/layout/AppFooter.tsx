'use client';

import React from 'react';
import Link from 'next/link';
import { useWebviewSafeNavigation } from '@/shared/hooks/useWebviewSafeNavigation';

export interface AppFooterProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
  onOpenMethodologyModal?: () => void;
  onAboutClick?: () => void;
}

export function AppFooter({
  onOpenPrivacyModal,
  onOpenTermsModal,
  onOpenMethodologyModal,
  onAboutClick,
}: AppFooterProps) {
  const { getNavHref, createNavClickHandler, createNavMouseDownHandler } = useWebviewSafeNavigation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModalClick = (type: 'privacy' | 'terms' | 'methodology') => {
    if (onAboutClick) {
      onAboutClick();
      return;
    }
    if (type === 'privacy' && onOpenPrivacyModal) onOpenPrivacyModal();
    else if (type === 'terms' && onOpenTermsModal) onOpenTermsModal();
    else if (type === 'methodology' && onOpenMethodologyModal) onOpenMethodologyModal();
    else if (onOpenMethodologyModal) onOpenMethodologyModal();
    else if (onOpenPrivacyModal) onOpenPrivacyModal();
  };

  return (
    <footer className="footer-wrapper" id="gabru-footer">
      <div className="footer-container">
        {/* Main Brand Column */}
        <div className="footer-brand-column">
          <div className="footer-brand-row">
            <div className="brand-icon-box">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="footer-brand-name">Gabru</span>
          </div>

          <p className="footer-bio">
            The premier aesthetic & sartorial intelligence platform. Evaluating wardrobe harmony,
            facial proportions, color resonance, and grooming craft through objective computer vision architectures.
          </p>

          <div className="footer-status-pill">
            <span className="status-indicator-dot" />
            <span className="status-text">
              Vision Engine v3.8 Active &bull; Instant Client-Side Processing
            </span>
          </div>

          <div className="footer-security-note">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Zero data retention &bull; Privacy protected local evaluation</span>
          </div>
        </div>

        {/* Navigation Links Columns */}
        <div className="footer-nav-grid">
          {/* Column 1: Evaluation Engines */}
          <div className="footer-col">
            <span className="footer-col-title">Evaluation Engines</span>
            <ul className="footer-links-list">
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Outfit Score Matrix (100 Pts)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/beauty-rating')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/beauty-rating')}
                  onMouseDown={createNavMouseDownHandler('/beauty-rating')}
                >
                  Beauty Rating Matrix (8 Params)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/content-rating')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/content-rating')}
                  onMouseDown={createNavMouseDownHandler('/content-rating')}
                >
                  Content Rating Suite (100 Pts)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Color Harmony Engine
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/beauty-rating')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/beauty-rating')}
                  onMouseDown={createNavMouseDownHandler('/beauty-rating')}
                >
                  Facial Thirds &amp; Fifths (φ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Architectural Frameworks */}
          <div className="footer-col">
            <span className="footer-col-title">Scoring Architecture</span>
            <ul className="footer-links-list">
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Tier 1: Foundations (71 Pts)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Tier 2: Details &amp; Craft (20 Pts)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Tier 3: Expert Polish (9 Pts)
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/beauty-rating')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/beauty-rating')}
                  onMouseDown={createNavMouseDownHandler('/beauty-rating')}
                >
                  10-Parameter Biometric Rubric
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Governance & Trust */}
          <div className="footer-col">
            <span className="footer-col-title">Governance &amp; Trust</span>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => handleModalClick('privacy')}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => handleModalClick('terms')}
                >
                  Terms of Evaluation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => handleModalClick('methodology')}
                >
                  Scientific Methodology
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => handleModalClick('methodology')}
                >
                  Platform Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="footer-bottom-strip">
        <div className="footer-bottom-container">
          <span className="footer-bottom-copy">
            &copy; {new Date().getFullYear()} Gabru Technologies Inc. All rights reserved. Designed for sartorial and aesthetic perfection.
          </span>
          <button
            type="button"
            className="btn-back-to-top"
            onClick={scrollToTop}
            id="footer-back-to-top"
          >
            <span>Back to Top</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
