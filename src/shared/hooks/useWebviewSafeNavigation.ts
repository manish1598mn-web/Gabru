'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseWebviewSafeNavigationOptions {
  activeFeature?: 'fit-check' | 'beauty-rating' | 'content-rating';
  onCurrentPageClick?: () => void;
}

/**
 * Resolves destination URL across:
 * 1. CSS Inspector Mini proxy (e.g. http://localhost:53110/proxy?url=...)
 * 2. Antigravity IDE preview browser (preserving ?id=...&vscodeBrowserReqId=...)
 * 3. Standard localhost / external browser
 */
export function resolveNavDestination(targetPath: string, searchParams = ''): string {
  if (typeof window === 'undefined') return targetPath;

  const currentHref = window.location.href;
  const currentSearch = window.location.search || searchParams;

  // Detect whether running under CSS Inspector Mini proxy
  const isInspectorProxy =
    (window.location.pathname === '/proxy' && currentSearch.includes('url=')) ||
    document.querySelector('meta[name="cim-token"]') !== null ||
    (parseInt(window.location.port, 10) >= 53110 && parseInt(window.location.port, 10) <= 53199);

  if (isInspectorProxy) {
    let upstreamBase = `${window.location.protocol}//${window.location.hostname}:3000`;
    let upstreamQuery = '';

    const urlParam = new URLSearchParams(currentSearch).get('url');
    if (urlParam) {
      try {
        const parsedUpstream = new URL(urlParam);
        upstreamBase = `${parsedUpstream.protocol}//${parsedUpstream.host}`;
        upstreamQuery = parsedUpstream.search;
      } catch {
        // fallback to default upstreamBase
      }
    }

    // Build the upstream destination URL with original query parameters
    const targetUpstream = `${upstreamBase}${targetPath}${upstreamQuery}`;

    // Construct the proxied destination so CSS Inspector continues injecting overlay.js on the new page
    const proxyUrl = new URL(`${window.location.origin}/proxy`);
    proxyUrl.searchParams.set('url', targetUpstream);

    // Retain multi-select flag if active
    const searchObj = new URLSearchParams(currentSearch);
    if (searchObj.get('multi') === '1') {
      proxyUrl.searchParams.set('multi', '1');
    }

    return proxyUrl.toString();
  }

  // Standard or Antigravity browser mode:
  if (!targetPath.includes('?') && currentSearch) {
    return `${targetPath}${currentSearch}`;
  }

  return targetPath;
}

/**
 * useWebviewSafeNavigation
 * 
 * Provides resilient navigation for:
 * - CSS Inspector Mini (keeps overlay.js and "Pick element" active across all pages)
 * - Antigravity IDE and VS Code Simple Browser (preserves session query params)
 * - Standard web browsers
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
      if (!isMounted) return targetPath;
      return resolveNavDestination(targetPath, searchParams);
    },
    [isMounted, searchParams]
  );

  /**
   * Core navigation executor
   */
  const executeNavigation = useCallback(
    (targetPath: string, customOnCurrent?: () => void) => {
      // Determine if target is currently active page
      const isCurrent =
        (targetPath === '/' && activeFeature === 'fit-check') ||
        (targetPath === '/beauty-rating' && activeFeature === 'beauty-rating') ||
        (targetPath === '/content-rating' && activeFeature === 'content-rating');

      if (isCurrent) {
        if (customOnCurrent) {
          customOnCurrent();
        } else if (onCurrentPageClick) {
          onCurrentPageClick();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const destination = resolveNavDestination(targetPath, searchParams);
      window.location.assign(destination);
    },
    [activeFeature, onCurrentPageClick, searchParams]
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

        e.preventDefault();
        executeNavigation(targetPath, customOnCurrent);
      };
    },
    [executeNavigation]
  );

  /**
   * Creates an onMouseDown handler that fires before overlay.js click interception
   * so that switching pages works even when the CSS Inspector is actively armed!
   */
  const createNavMouseDownHandler = useCallback(
    (targetPath: string) => {
      return (e: React.MouseEvent<HTMLAnchorElement>) => {
        // If holding Alt, allow inspector to inspect the link instead of navigating
        if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
          return;
        }

        const isCurrent =
          (targetPath === '/' && activeFeature === 'fit-check') ||
          (targetPath === '/beauty-rating' && activeFeature === 'beauty-rating') ||
          (targetPath === '/content-rating' && activeFeature === 'content-rating');

        // Only preemptively navigate for changing pages when under an inspector proxy
        if (!isCurrent && typeof window !== 'undefined') {
          const isInspectorProxy =
            document.querySelector('meta[name="cim-token"]') !== null ||
            (window.location.pathname === '/proxy' && window.location.search.includes('url='));

          if (isInspectorProxy) {
            e.stopPropagation();
            executeNavigation(targetPath);
          }
        }
      };
    },
    [activeFeature, executeNavigation]
  );

  return {
    isMounted,
    searchParams,
    getNavHref,
    createNavClickHandler,
    createNavMouseDownHandler,
  };
}
