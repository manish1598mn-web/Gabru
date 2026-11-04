'use client';

/**
 * GABRU — RESPONSIVE APP NAVBAR & MOBILE BOTTOM NAVIGATION
 * 
 * Adaptive navigation architecture:
 * - Desktop (>= 769px): Sleek top header with centered frosted segmented dock.
 * - Mobile / Smartphone (<= 768px): Minimal top brand header (Logo + Theme Toggle)
 *   and native-feeling fixed bottom navigation bar optimized for thumb-reach.
 */

import React from 'react';
import Link from 'next/link';
import { useScrollState } from '@/shared/hooks/useScrollState';
import { useWebviewSafeNavigation } from '@/shared/hooks/useWebviewSafeNavigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { GabruLogoIcon } from '../ui/GabruLogoIcon';

export interface AppNavbarProps {
  activeFeature: 'fit-check' | 'beauty-rating' | 'content-rating' | 'hand-reading';
  onBrandClick?: () => void;
}

export function AppNavbar({ activeFeature, onBrandClick }: AppNavbarProps) {
  const isScrolled = useScrollState(20);
  const { getNavHref, createNavClickHandler, createNavMouseDownHandler } = useWebviewSafeNavigation({
    activeFeature,
    onCurrentPageClick: onBrandClick,
  });

  return (
    <>
      {/* Top Header Navbar */}
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
        <div className="navbar-container">
          {/* Left Section: Brand Logo */}
          <Link
            href={getNavHref('/')}
            prefetch={false}
            className="navbar-brand focus-ring"
            id="nav-brand-logo"
            onClick={createNavClickHandler('/', onBrandClick)}
            onMouseDown={createNavMouseDownHandler('/')}
            aria-label="Gabru Studio Home"
          >
            <div className="brand-icon-box" id="brand-camera-icon">
              <GabruLogoIcon size={20} idPrefix="nav-logo" />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">GABRU</span>
              <span className="brand-tag">STUDIO</span>
            </div>
          </Link>

          {/* Center Section: Desktop Frosted Segmented Navigation Dock (Hidden on mobile) */}
          <nav aria-label="Main Navigation" className="navbar-nav-wrapper">
            <ul className="navbar-nav">
              <li>
                <Link
                  href={getNavHref('/')}
                  prefetch={false}
                  className={`nav-link focus-ring ${activeFeature === 'fit-check' ? 'active' : ''}`}
                  id="nav-link-home"
                  onClick={createNavClickHandler('/')}
                  onMouseDown={createNavMouseDownHandler('/')}
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
                  href={getNavHref('/beauty-rating')}
                  prefetch={false}
                  className={`nav-link focus-ring ${activeFeature === 'beauty-rating' ? 'active' : ''}`}
                  id="nav-btn-beauty-rating"
                  onClick={createNavClickHandler('/beauty-rating')}
                  onMouseDown={createNavMouseDownHandler('/beauty-rating')}
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
                  href={getNavHref('/content-rating')}
                  prefetch={false}
                  className={`nav-link nav-link-content focus-ring ${activeFeature === 'content-rating' ? 'active' : ''}`}
                  id="nav-btn-content-rating"
                  onClick={createNavClickHandler('/content-rating')}
                  onMouseDown={createNavMouseDownHandler('/content-rating')}
                  title="Social Media Content Rating & Virality Engine"
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
              <li>
                <Link
                  href={getNavHref('/hand-reading')}
                  prefetch={false}
                  className={`nav-link nav-link-hand focus-ring ${activeFeature === 'hand-reading' ? 'active' : ''}`}
                  id="nav-btn-hand-reading"
                  onClick={createNavClickHandler('/hand-reading')}
                  onMouseDown={createNavMouseDownHandler('/hand-reading')}
                  title="Traditional Palmistry & Samudrika Shastra"
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
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                  <span className="nav-label-full">Hand Reading</span>
                  <span className="nav-label-compact" aria-hidden="true">Hand</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Far Right: Theme Toggle */}
          <div className="navbar-actions-right">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Active on smartphone / small screens <= 768px) */}
      <nav aria-label="Mobile Navigation" className="mobile-bottom-nav" id="mobile-bottom-dock">
        <div className="mobile-bottom-nav-container">
          {/* Tab 1: Outfit / Fit Check */}
          <Link
            href={getNavHref('/')}
            prefetch={false}
            className={`mobile-nav-item focus-ring ${activeFeature === 'fit-check' ? 'active active-fit' : ''}`}
            id="mobile-nav-fit"
            onClick={createNavClickHandler('/')}
            onMouseDown={createNavMouseDownHandler('/')}
            aria-label="Fit Check Studio"
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <span className="mobile-nav-label">Fit Check</span>
            <span className="mobile-nav-indicator" />
          </Link>

          {/* Tab 2: Beauty / Face Rating */}
          <Link
            href={getNavHref('/beauty-rating')}
            prefetch={false}
            className={`mobile-nav-item focus-ring ${activeFeature === 'beauty-rating' ? 'active active-beauty' : ''}`}
            id="mobile-nav-beauty"
            onClick={createNavClickHandler('/beauty-rating')}
            onMouseDown={createNavMouseDownHandler('/beauty-rating')}
            aria-label="Facial Beauty Rating Studio"
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="mobile-nav-label">Beauty</span>
            <span className="mobile-nav-indicator" />
          </Link>

          {/* Tab 3: Content Virality Rating */}
          <Link
            href={getNavHref('/content-rating')}
            prefetch={false}
            className={`mobile-nav-item focus-ring ${activeFeature === 'content-rating' ? 'active active-content' : ''}`}
            id="mobile-nav-content"
            onClick={createNavClickHandler('/content-rating')}
            onMouseDown={createNavMouseDownHandler('/content-rating')}
            aria-label="Content Rating Studio"
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="mobile-nav-label">Content</span>
            <span className="mobile-nav-indicator" />
          </Link>

          {/* Tab 4: Hand Reading / Palmistry */}
          <Link
            href={getNavHref('/hand-reading')}
            prefetch={false}
            className={`mobile-nav-item focus-ring ${activeFeature === 'hand-reading' ? 'active active-hand' : ''}`}
            id="mobile-nav-hand"
            onClick={createNavClickHandler('/hand-reading')}
            onMouseDown={createNavMouseDownHandler('/hand-reading')}
            aria-label="Hand Reading Studio"
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </div>
            <span className="mobile-nav-label">Hand</span>
            <span className="mobile-nav-indicator" />
          </Link>
        </div>
      </nav>
    </>
  );
}
