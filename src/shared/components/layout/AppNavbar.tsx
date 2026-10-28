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
        {/* Left Section: Camera Icon + Brand */}
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span className="brand-name">Gabru</span>
        </div>

        {/* Right Section: Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="navbar-nav">
            <li>
              <Link
                href="/"
                className={`nav-link ${activeFeature === 'fit-check' ? 'active' : ''}`}
                id="nav-link-home"
              >
                Fit Check
              </Link>
            </li>
            <li>
              <Link
                href="/beauty-rating"
                className={`nav-link nav-feature-btn ${activeFeature === 'beauty-rating' ? 'active' : ''}`}
                id="nav-btn-beauty-rating"
              >
                Beauty rating
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link nav-feature-btn ${activeFeature === 'content-rating' ? 'active' : ''}`}
                id="nav-btn-content-rating"
                title="Content Rating coming soon"
              >
                content rating
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
