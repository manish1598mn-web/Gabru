'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWebviewSafeNavigation } from '@/shared/hooks/useWebviewSafeNavigation';
import { GabruLogoIcon } from '../ui/GabruLogoIcon';
import {
  PrivacyPolicyModal,
  TermsOfEvaluationModal,
  ScientificMethodologyModal,
} from '../modals';

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
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'methodology' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModalClick = (type: 'privacy' | 'terms' | 'methodology') => {
    if (type === 'privacy' && onOpenPrivacyModal) {
      onOpenPrivacyModal();
      return;
    }
    if (type === 'terms' && onOpenTermsModal) {
      onOpenTermsModal();
      return;
    }
    if (type === 'methodology' && onOpenMethodologyModal) {
      onOpenMethodologyModal();
      return;
    }
    setActiveModal(type);
  };

  return (
    <footer className="footer-wrapper" id="gabru-footer">
      <div className="footer-container">
        {/* Main Brand Column */}
        <div className="footer-brand-column">
          <div className="footer-brand-row">
            <div className="brand-icon-box">
              <GabruLogoIcon size={20} idPrefix="footer-logo" />
            </div>
            <span className="footer-brand-name">Gabru</span>
          </div>

          <p className="footer-bio">
            Instant, private visual intelligence with real-time biometric and aesthetic evaluation.
          </p>

          <div className="footer-status-pill">
            <span className="status-indicator-dot" />
            <span className="status-text">
              Zero Server Retention &bull; Private Execution
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
            <span>Your photos and links never leave your device</span>
          </div>
        </div>

        {/* Navigation Links Columns */}
        <div className="footer-nav-grid">
          {/* Column 1: Studio Tools */}
          <div className="footer-col">
            <span className="footer-col-title">Studio Tools</span>
            <ul className="footer-links-list">
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
                >
                  Fit Check
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
                  Beauty Rating
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
                  Content Rating
                </Link>
              </li>
              <li>
                <Link
                  href={getNavHref('/hand-reading')}
                  prefetch={false}
                  className="footer-link-btn"
                  onClick={createNavClickHandler('/hand-reading')}
                  onMouseDown={createNavMouseDownHandler('/hand-reading')}
                >
                  Hand Reading
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Governance & Trust */}
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
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Strip */}
      <div className="footer-bottom-strip">
        <div className="footer-bottom-container">
          <span className="footer-bottom-copy">
            &copy; {new Date().getFullYear()} Gabru. All rights reserved.
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

      {/* Built-in Governance Modals */}
      <PrivacyPolicyModal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      />
      <TermsOfEvaluationModal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
      />
      <ScientificMethodologyModal
        isOpen={activeModal === 'methodology'}
        onClose={() => setActiveModal(null)}
      />
    </footer>
  );
}
