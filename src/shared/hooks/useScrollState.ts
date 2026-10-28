'use client';

import { useState, useEffect } from 'react';

/**
 * Tracks whether the user has scrolled past a vertical offset threshold.
 * Used for dynamic glassmorphic navbar background transitions.
 * 
 * @param thresholdPx Scroll distance in pixels (defaults to 20px)
 */
export function useScrollState(thresholdPx: number = 20): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > thresholdPx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [thresholdPx]);

  return isScrolled;
}

