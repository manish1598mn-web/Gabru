'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseWebviewSafeNavigationOptions {
  activeFeature?: 'fit-check' | 'beauty-rating' | 'content-rating';
  onCurrentPageClick?: () => void;
}

/**
 * useWebviewSafeNavigation
 * 
 * Provides resilient navigation for embedded webviews, iframes, and IDE preview browsers
 * (such as Google Antigravity IDE and VS Code Simple Browser).
 * 
 * Key Responsibilities:
 * 1. Preserves query parameters (e.g. ?id=...&vscodeBrowserReqId=...) required by IDE proxy tunnels.
 * 2. Bypasses client-side pushState locks in embedded webviews via reliable location.assign.
 * 3. Prevents React hydration mismatch warnings by deferring dynamic search params injection until mounted.
 * 4. Gracefully supports Cmd/Ctrl/Shift/middle-click for opening links in new tabs.
 * 5. Handles smooth scroll-to-top when clicking the currently active page.
 */
export function useWebviewSafeNavigation(options?: UseWebviewSafeNavigationOptions) {
  const { activeFeature, onCurrentPageClick } = options || {};
  const [searchParams, setSearchParams] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setSearchParams(window.location.search || '');
    }
  }, []);

  /**
   * Computes destination URL preserving active proxy/session search parameters.
   * During SSR / initial hydration, returns static path to prevent attribute mismatches.
   */
  const getNavHref = useCallback(
    (targetPath: string): string => {
      if (targetPath.includes('?')) return targetPath;
      if (!isMounted || !searchParams) return targetPath;
      return `${targetPath}${searchParams}`;
    },
    [isMounted, searchParams]
  );

  /**
   * Creates an onClick handler that guarantees navigation in Antigravity / webviews
   */
  const createNavClickHandler = useCallback(
    (targetPath: string, customOnCurrent?: () => void) => {
      return (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Respect standard browser behavior for new tabs / auxiliary clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }

        // Determine if target is currently active page
        const isCurrent =
          (targetPath === '/' && activeFeature === 'fit-check') ||
          (targetPath === '/beauty-rating' && activeFeature === 'beauty-rating') ||
          (targetPath === '/content-rating' && activeFeature === 'content-rating');

        if (isCurrent) {
          e.preventDefault();
          if (customOnCurrent) {
            customOnCurrent();
          } else if (onCurrentPageClick) {
            onCurrentPageClick();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        // Always perform full reliable navigation to target route with preserved query parameters
        e.preventDefault();
        const currentSearch = typeof window !== 'undefined' ? window.location.search : searchParams;
        const fullTarget = currentSearch && !targetPath.includes('?')
          ? `${targetPath}${currentSearch}`
          : targetPath;

        window.location.assign(fullTarget);
      };
    },
    [activeFeature, onCurrentPageClick, searchParams]
  );

  return {
    isMounted,
    searchParams,
    getNavHref,
    createNavClickHandler,
  };
}
