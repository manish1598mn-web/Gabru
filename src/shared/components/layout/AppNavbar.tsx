'use client';

import React from 'react';
import Link from 'next/link';
import { useScrollState } from '@/shared/hooks/useScrollState';

export interface AppNavbarProps {
  activeFeature: 'fit-check' | 'beauty-rating' | 'content-rating';
  onBrandClick?: () => void;
}

export function AppNavbar({ activeFeature, onBrandClick }: AppNavbarProps) {
  const isScrolled = useScrollState(20);

  const handleBrandClick = () => {
    if (onBrandClick) {
      onBrandClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
      <div className="navbar-container">
        {/* Left Section: Premium Brand Logo */}
        <div
          className="navbar-brand"
          id="nav-brand-logo"
          onClick={handleBrandClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBrandClick()}
        >
          <div className="brand-icon-box" id="brand-camera-icon">
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
          <div className="brand-text-group">
            <span className="brand-name">GABRU</span>
            <span className="brand-tag">STUDIO</span>
          </div>
        </div>

        {/* Center/Right Section: Frosted Segmented Navigation Dock */}
        <nav aria-label="Main Navigation" className="navbar-nav-wrapper">
          <ul className="navbar-nav">
            <li>
              <Link
                href="/"
                className={`nav-link ${activeFeature === 'fit-check' ? 'active' : ''}`}
                id="nav-link-home"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
                <span>Fit Check</span>
              </Link>
            </li>
            <li>
              <Link
                href="/beauty-rating"
                className={`nav-link ${activeFeature === 'beauty-rating' ? 'active' : ''}`}
                id="nav-btn-beauty-rating"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <span>Beauty Rating</span>
              </Link>
            </li>
            <li>
              <Link
                href="/content-rating"
                className={`nav-link nav-link-content ${activeFeature === 'content-rating' ? 'active' : ''}`}
                id="nav-btn-content-rating"
                title="Social Media Content Rating & Advisory"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>Content Rating</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Far Right: Trust Chip */}
        <div className="navbar-trust-chip" title="All processing executes privately in your browser memory">
          <span className="trust-pulse-dot" />
          <span>100% In-Browser</span>
        </div>
      </div>
    </header>
  );
}
