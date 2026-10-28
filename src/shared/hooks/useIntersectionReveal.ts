'use client';

import { useEffect } from 'react';

/**
 * Initializes a performant IntersectionObserver on elements matching `.scroll-reveal`.
 * Adds `.revealed` when the element scrolls into viewport and disconnects on unmount.
 * 
 * @param dependency Optional reactive dependency to re-query elements after dynamic rendering
 */
export function useIntersectionReveal(dependency?: unknown): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [dependency]);
}
