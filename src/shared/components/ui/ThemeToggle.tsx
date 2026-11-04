'use client';

/**
 * GABRU — THEME TOGGLE BUTTON COMPONENT
 * 
 * Elegant, tactile Sun/Moon switcher with zero layout shift and fluid rotational transitions.
 */

import React from 'react';
import { useTheme } from '@/shared/hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { isLight, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`theme-toggle-btn theme-toggle-skeleton ${className}`}
        aria-hidden="true"
        style={{
          width: size === 'sm' ? '32px' : '36px',
          height: size === 'sm' ? '32px' : '36px',
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle-btn focus-ring tactile-press ${isLight ? 'is-light' : 'is-dark'} ${className}`}
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="theme-toggle-icon-wrap" aria-hidden="true">
        {isLight ? (
          /* Moon Icon (switch to dark) */
          <svg
            className="theme-icon theme-icon-moon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          /* Sun Icon (switch to light) */
          <svg
            className="theme-icon theme-icon-sun"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </div>
    </button>
  );
}

