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

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onBrandClick) {
      e.preventDefault();
      onBrandClick();
    } else if (activeFeature === 'fit-check') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
      <div className="navbar-container">
        {/* Left Section: Premium Brand Logo */}
        <Link
          href="/"
          className="navbar-brand focus-ring"
          id="nav-brand-logo"
          onClick={handleBrandClick}
          aria-label="Gabru Studio Home"
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
        </Link>

        {/* Center/Right Section: Frosted Segmented Navigation Dock */}
        <nav aria-label="Main Navigation" className="navbar-nav-wrapper">
          <ul className="navbar-nav">
            <li>
              <Link
                href="/"
                className={`nav-link focus-ring ${activeFeature === 'fit-check' ? 'active' : ''}`}
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
                <span className="nav-label-full">Fit Check</span>
                <span className="nav-label-compact" aria-hidden="true">Outfit</span>
              </Link>
            </li>
            <li>
              <Link
                href="/beauty-rating"
                className={`nav-link focus-ring ${activeFeature === 'beauty-rating' ? 'active' : ''}`}
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
                <span className="nav-label-full">Beauty Rating</span>
                <span className="nav-label-compact" aria-hidden="true">Face</span>
              </Link>
            </li>
            <li>
              <Link
                href="/content-rating"
                className={`nav-link nav-link-content focus-ring ${activeFeature === 'content-rating' ? 'active' : ''}`}
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
                <span className="nav-label-full">Content Rating</span>
                <span className="nav-label-compact" aria-hidden="true">Content</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Far Right: Trust Chip */}
        <div className="navbar-trust-chip" title="All processing executes privately in your browser memory">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>100% In-Browser</span>
        </div>
      </div>
    </header>
  );
}
