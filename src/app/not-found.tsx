import React from 'react';
import Link from 'next/link';

export default function NotFound() {
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
          maxWidth: '480px',
          width: '100%',
          padding: '36px 28px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
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
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '16px',
          }}
        >
          404 · Page Not Found
        </span>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 12px 0',
          }}
        >
          Studio Blueprint Missing
        </h1>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '0 0 28px 0',
          }}
        >
          The page or asset you are looking for has been moved or does not exist. Choose one of our visual intelligence studios below:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          <Link
            href="/"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            👔 Fit Check
          </Link>
          <Link
            href="/beauty-rating"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            ✨ Beauty Rating
          </Link>
          <Link
            href="/content-rating"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            📈 Content Rating
          </Link>
          <Link
            href="/hand-reading"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            ✋ Hand Reading
          </Link>
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            textDecoration: 'underline',
          }}
        >
          Return to Studio Home
        </Link>
      </div>
    </div>
  );
}

