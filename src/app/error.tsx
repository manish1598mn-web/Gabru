'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitised error message without leaking sensitive internal paths
    console.error('Gabru Runtime Boundary Encountered Error:', error.message);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--bg-main, #09090b)',
        color: 'var(--text-main, #fafafa)',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 28px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.12)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '16px',
          }}
        >
          Studio Boundary Alert
        </span>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 12px 0',
          }}
        >
          Unexpected Computation Error
        </h1>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.65)',
            margin: '0 0 24px 0',
          }}
        >
          An unexpected error occurred while rendering this studio view. Your local device photo and privacy remain 100% secure.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#09090b',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry Computation
          </button>

          <Link
            href="/"
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

