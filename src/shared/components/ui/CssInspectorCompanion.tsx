'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * CssInspectorCompanion
 * 
 * Provides an intelligent HUD companion when the application is running inside
 * the CSS Inspector Mini proxy (or Antigravity IDE element picker).
 * 
 * Problems Solved:
 * 1. Visual Status: Clearly indicates whether the inspector is in "Pick Element Mode"
 *    (capturing all clicks for chat) or "Live Interactive Mode" (all platform features enabled).
 * 2. One-Click Mode Switching: Lets users toggle between inspecting elements and testing
 *    app features (file uploads, webcam, scorecard tabs, modals) with 1 click or 'Escape'.
 * 3. Zero footprint when not running under the CSS Inspector proxy.
 */
export function CssInspectorCompanion() {
  const [isInspectorActive, setIsInspectorActive] = useState<boolean>(false);
  const [isArmed, setIsArmed] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Helper to find the floating "Pick" pill injected by CSS Inspector overlay.js
  const findInspectorPill = useCallback((): HTMLButtonElement | null => {
    if (typeof document === 'undefined') return null;
    const buttons = Array.from(document.querySelectorAll('button'));
    return (
      buttons.find(
        (b) =>
          b.textContent?.includes('Picking') ||
          b.textContent === 'Pick' ||
          (b.style.position === 'fixed' && b.style.zIndex === '2147483647')
      ) || null
    );
  }, []);

  // Periodic and reactive detection of inspector presence and armed state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncInspectorState = () => {
      const hasMeta = document.querySelector('meta[name="cim-token"]') !== null;
      const isProxyPath = window.location.pathname === '/proxy' && window.location.search.includes('url=');
      const port = parseInt(window.location.port, 10);
      const isProxyPort = port >= 53110 && port <= 53199;
      const pillBtn = findInspectorPill();

      const active = hasMeta || isProxyPath || isProxyPort || !!pillBtn;
      setIsInspectorActive(active);

      if (active) {
        const armMeta = document.querySelector('meta[name="cim-arm"]') !== null;
        const pillArmed = pillBtn ? pillBtn.textContent?.includes('Picking') : false;
        setIsArmed(armMeta || !!pillArmed);
      }
    };

    // Run immediately
    syncInspectorState();

    // Listen to keydown Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsArmed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    // Observe DOM mutations to catch overlay.js injection or pill text changes
    const observer = new MutationObserver(() => {
      syncInspectorState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const intervalId = setInterval(syncInspectorState, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [findInspectorPill]);

  // Disarms the inspector so the user can interact freely with all platform features
  const switchToLiveMode = useCallback(() => {
    // 1. Dispatch Escape key event (overlay.js listens to Escape)
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
      })
    );

    // 2. Click the pill if currently armed
    const pill = findInspectorPill();
    if (pill && pill.textContent?.includes('Picking')) {
      pill.click();
    }

    setIsArmed(false);
  }, [findInspectorPill]);

  // Arms the inspector so the user can pick elements
  const switchToPickMode = useCallback(() => {
    const pill = findInspectorPill();
    if (pill && !pill.textContent?.includes('Picking')) {
      pill.click();
    }
    setIsArmed(true);
  }, [findInspectorPill]);

  if (!isInspectorActive || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="CSS Inspector Companion"
      className="css-inspector-hud"
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2147483640,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 14px',
        background: 'rgba(15, 17, 23, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isArmed
          ? '1px solid rgba(10, 132, 255, 0.45)'
          : '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '9999px',
        boxShadow: isArmed
          ? '0 8px 30px rgba(10, 132, 255, 0.25), 0 2px 8px rgba(0, 0, 0, 0.6)'
          : '0 8px 30px rgba(0, 0, 0, 0.5)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        lineHeight: 1,
        pointerEvents: 'auto',
        userSelect: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Mode Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isArmed ? '#0a84ff' : '#10b981',
            boxShadow: isArmed
              ? '0 0 8px #0a84ff'
              : '0 0 8px #10b981',
            display: 'inline-block',
          }}
        />
        <span style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
          {isArmed ? 'CSS Inspector: Picking Elements' : 'Live Mode: All Features Active'}
        </span>
      </div>

      <div
        style={{
          width: '1px',
          height: '14px',
          background: 'rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Action Toggle Button */}
      {isArmed ? (
        <button
          type="button"
          onClick={switchToLiveMode}
          title="Click to enable buttons, photo uploads, and scorecard features (or press Esc)"
          style={{
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
          <span>Use Platform (Live Mode)</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={switchToPickMode}
          title="Click to select elements on this page for chat"
          style={{
            background: '#0a84ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(10, 132, 255, 0.35)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
          <span>Pick Element</span>
        </button>
      )}

      {/* Quick Keycap Hint */}
      <span
        style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.55)',
          paddingLeft: '2px',
        }}
      >
        {isArmed ? 'Tip: press Esc to use page' : 'Tip: click elements anytime'}
      </span>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss inspector companion"
        title="Hide this toolbar"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          padding: '2px 4px',
          marginLeft: '2px',
          fontSize: '13px',
          lineHeight: 1,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        &times;
      </button>
    </aside>
  );
}
