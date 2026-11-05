'use client';

/**
 * GABRU — THEME MANAGEMENT HOOK
 * 
 * Provides reactive, zero-FOUC theme switching between Light, Dark, and System modes.
 * Synchronizes across components and window tabs with localStorage persistence.
 */

import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'gabru-theme';
const THEME_CHANGE_EVENT = 'gabru-theme-change';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDocument(resolved: ResolvedTheme, theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.setAttribute('data-theme', resolved);
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);

  // Update meta theme-color for mobile browser chrome
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', resolved === 'light' ? '#f8fafc' : '#09090b');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedThemeState] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Read initial state from DOM or localStorage; default to system preference
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const hasUserPref = stored === 'light' || stored === 'dark';
    const activeTheme: Theme = hasUserPref ? stored : 'system';
    const initialResolved: ResolvedTheme = hasUserPref ? stored : getSystemTheme();

    setThemeState(activeTheme);
    setResolvedThemeState(initialResolved);
    applyThemeToDocument(initialResolved, activeTheme);
    setMounted(true);

    // 2. Listen to system preference changes when in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentStored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (!currentStored || currentStored === 'system') {
        const nextResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedThemeState(nextResolved);
        applyThemeToDocument(nextResolved, 'system');
      }
    };

    // 3. Listen to cross-component / cross-tab theme changes
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme; resolvedTheme: ResolvedTheme }>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail.theme);
        setResolvedThemeState(customEvent.detail.resolvedTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.addEventListener(THEME_CHANGE_EVENT, handleCustomChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener(THEME_CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage unavailable / private mode
    }

    const nextResolved: ResolvedTheme =
      newTheme === 'system'
        ? getSystemTheme()
        : newTheme === 'light'
        ? 'light'
        : 'dark';

    setThemeState(newTheme);
    setResolvedThemeState(nextResolved);
    applyThemeToDocument(nextResolved, newTheme);

    window.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, {
        detail: { theme: newTheme, resolvedTheme: nextResolved },
      })
    );
  }, []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isLight: resolvedTheme === 'light',
    isDark: resolvedTheme === 'dark',
    mounted,
  };
}

