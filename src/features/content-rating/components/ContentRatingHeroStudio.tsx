'use client';

/**
 * GABRU — CONTENT RATING HERO STUDIO
 * 
 * Interactive studio workspace supporting:
 * - Single-Post Link Input with auto platform detection (Instagram, TikTok, YouTube Shorts, X, etc.)
 * - 3 Entertaining Demo Presets (Group-Chat Hall of Famer, Aesthetic Flex, 3 AM Goblin Hours)
 * - Entertaining cycling loading state animations while analyzing
 * - Right Single-Post Preview Dock with verified verdict stamp overlay
 */

import React, { useState, useEffect } from 'react';
import {
  ContentScoreData,
  InputMode,
  UnifiedContentItem,
} from '../types/ContentRatingTypes';
import {
  ENTERTAINING_LOADING_STEPS,
} from '../constants/ContentRatingConstants';
import { Button } from '@/shared/components/ui/Button';
import { ScanningReticleOverlay } from '@/shared';
import { detectPlatformFromUrl } from '../utils/ContentPlatformUtil';

export interface ContentRatingHeroStudioProps {
  scoreData: ContentScoreData | null;
  currentItem: UnifiedContentItem | null;
  inputMode?: InputMode;
  contentUrl: string;
  isAnalyzing: boolean;
  scanPhase?: 1 | 2 | 3 | 4;
  scanProgress?: number;
  scanStatusMessage?: string;
  isPreviewLoading?: boolean;
  isDragging?: boolean;
  errorMessage: string | null;
  onUrlChange: (url: string) => void;
  onModeChange?: (mode: InputMode) => void;
  onAnalyzeUrl: () => void;
  onSelectDemo?: (demoKey: 'short_video' | 'carousel' | 'long_video') => void;
  onFileUpload?: (file: File) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onReset: () => void;
  onShareClick: () => void;
  onRecalculate?: () => void;
}

export function ContentRatingHeroStudio({
  scoreData,
  currentItem,
  contentUrl,
  isAnalyzing,
  scanPhase = 1,
  scanProgress = 0,
  scanStatusMessage,
  isPreviewLoading = false,
  errorMessage,
  onUrlChange,
  onAnalyzeUrl,
  onReset,
  onShareClick,
  onRecalculate,
}: ContentRatingHeroStudioProps) {
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loadedAspect, setLoadedAspect] = useState<number | null>(null);
  const detectedPlatform = detectPlatformFromUrl(contentUrl);

  useEffect(() => {
    setLoadedAspect(null);
  }, [currentItem?.media?.thumbnailUrl]);

  const rawAspect =
    currentItem?.media?.aspectRatio ||
    (currentItem?.media?.width && currentItem?.media?.height
      ? currentItem.media.width / currentItem.media.height
      : null);

  const effectiveAspect =
    loadedAspect ||
    rawAspect ||
    (currentItem?.format === 'short_video'
      ? 9 / 16
      : currentItem?.format === 'long_video'
      ? 16 / 9
      : 4 / 5);

  const formatLabel = (() => {
    if (effectiveAspect < 0.7) return '9:16 REEL / SHORT';
    if (effectiveAspect >= 0.7 && effectiveAspect < 0.9) return '4:5 PORTRAIT POST';
    if (effectiveAspect >= 0.9 && effectiveAspect <= 1.15) return '1:1 SQUARE POST';
    if (effectiveAspect > 1.15) return '16:9 WIDESCREEN';
    return currentItem ? currentItem.format.toUpperCase().replace('_', ' ') : 'SINGLE POST';
  })();

  const containerAspectStyle: React.CSSProperties = currentItem?.media?.thumbnailUrl
    ? {
        aspectRatio: `${Number(effectiveAspect.toFixed(3))}`,
        maxHeight: effectiveAspect < 0.7 ? '520px' : effectiveAspect > 1.3 ? '320px' : '440px',
        width: '100%',
        margin: '0 auto',
      }
    : {
        aspectRatio: '4 / 5',
        maxHeight: '440px',
        width: '100%',
      };

  // Cycling entertaining loading steps while analyzing
  useEffect(() => {
    if (!isAnalyzing) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % ENTERTAINING_LOADING_STEPS.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnalyzing && contentUrl.trim().length > 0) {
      onAnalyzeUrl();
    }
  };

  return (
    <div className="hero-container content-studio-hero">
      {/* Left Column: Command & Input Studio */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          Post Anatomy,
          <br />
          <span className="gradient-text content-gradient-text">Audited for Virality</span>
        </h1>

        <p className="hero-description scroll-reveal" id="hero-description">
          10-dimension hook, retention, and engagement audit for creators. Instant feedback.
        </p>

        {/* Entertaining Cycling Loading Banner While Analyzing */}
        {isAnalyzing && (
          <div className="content-analyzing-card scroll-reveal" role="status" aria-live="polite" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="analyzing-spinner-box">
                <span className="analyzing-spinner" aria-hidden="true" />
              </div>
              <div className="analyzing-text-content">
                <span className="analyzing-eyebrow" style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#c084fc', textTransform: 'uppercase', fontWeight: 600 }}>
                  MULTIMODAL AI &amp; TELEMETRY AUDIT
                </span>
                <h4 className="analyzing-title" style={{ margin: '2px 0 0', fontSize: '16px', color: '#fff', fontWeight: 600 }}>
                  {ENTERTAINING_LOADING_STEPS[loadingStepIndex]}
                </h4>
                <p className="analyzing-sub" style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Scraping post counters, running vision LLM rubrics, and calculating viral forward velocity...
                </p>
              </div>
            </div>
          </div>
        )}

        {scoreData ? (
          /* Evaluated State: Clean Executive Content Score Hub */
          <div className="upload-card is-evaluated content-evaluated-hub scroll-reveal">
            <div className="score-summary-header">
              <div className="score-metric-display">
                <span className="score-big-number content-score-number font-tabular-nums">
                  {scoreData.contentScore}
                </span>
                <span className="score-scale-denom font-tabular-nums">/100</span>
              </div>

              <div className="evaluated-header-actions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onShareClick}
                  id="btn-content-share"
                  title="Export 1080x1350 High-Res Share Card"
                  leftIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  }
                >
                  Share Card
                </Button>

                {onRecalculate && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onRecalculate}
                    id="btn-recalculate-content"
                    title="Re-calculate content parameter scores"
                    leftIcon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                    }
                  >
                    Re-calculate
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReset}
                  id="btn-analyze-new"
                  title="Analyze another link"
                  leftIcon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  }
                >
                  New Audit
                </Button>
              </div>
            </div>

            {/* 3 Symmetrical Pillars in 3-Column Grid */}
            <div className="content-score-pillars-row">
              <div
                className="pillar-chip verdict-pillar"
                style={{ background: 'rgba(217, 70, 239, 0.12)', borderColor: 'rgba(217, 70, 239, 0.28)' }}
                title="Single-Post Verdict Badge assigned by deterministic priority tree"
              >
                <span className="pillar-label">VERDICT BADGE</span>
                <span className="pillar-value" style={{ color: '#f0abfc' }}>
                  {scoreData.verdictBadge}
                </span>
              </div>

              <div
                className="pillar-chip archetype-pillar"
                style={{ background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.28)' }}
                title="Personality archetype derived from visual aesthetic and creative dynamics"
              >
                <span className="pillar-label">ARCHETYPE</span>
                <span className="pillar-value" style={{ color: '#7dd3fc' }}>
                  {scoreData.archetypeTier}
                </span>
              </div>

              <div className="pillar-chip quality-pillar" title="Calibrated overall tier on 100-point scale">
                <span className="pillar-label">AUDIT VERDICT</span>
                <span className="pillar-value" style={{ color: '#34d399' }}>{scoreData.verdict}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Pre-Evaluated State: Clean Single-Post Link Input */
          <div className="content-input-card scroll-reveal">
            <div className="content-link-header">
              <div className="link-header-left">
                <span className="link-header-spark" aria-hidden="true">🔗</span>
                <h3 className="link-header-title">Paste Single Post Link</h3>
              </div>
              <span className="link-header-badge">Instant Visual &amp; Craft Audit</span>
            </div>
            <p className="link-header-subtitle">
              Inspect retention triggers, 1.2s hook threshold, visual framing, caption wit, and viral pacing across public posts.
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="content-error-banner" role="alert" style={{ marginBottom: '14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="content-link-field-wrapper">
              <div className="content-link-input-row">
                <div className="content-link-icon-box">
                  {detectedPlatform === 'youtube' && (
                    <span className="platform-active-pill yt">YouTube</span>
                  )}
                  {detectedPlatform === 'instagram' && (
                    <span className="platform-active-pill ig">Instagram</span>
                  )}
                  {detectedPlatform === 'tiktok' && (
                    <span className="platform-active-pill tt">TikTok</span>
                  )}
                  {detectedPlatform === 'x' && (
                    <span className="platform-active-pill x">X</span>
                  )}
                  {detectedPlatform === 'linkedin' && (
                    <span className="platform-active-pill in">LinkedIn</span>
                  )}
                  {!detectedPlatform && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                </div>

                <input
                  type="url"
                  className="content-link-input focus-ring font-sans"
                  placeholder="Paste single post link (e.g., instagram.com/reel/..., tiktok.com/@user/video/..., x.com/...)"
                  value={contentUrl}
                  onChange={(e) => onUrlChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAnalyzing}
                  id="input-content-url"
                  aria-label="Social media post URL input"
                />

                {!contentUrl && (
                  <button
                    type="button"
                    className="btn-paste-clipboard focus-ring tactile-press"
                    onClick={async () => {
                      try {
                        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
                          const text = await navigator.clipboard.readText();
                          if (text && text.trim().length > 0) {
                            onUrlChange(text.trim());
                          }
                        }
                      } catch {
                        // clipboard access denied
                      }
                    }}
                    title="Paste URL from clipboard"
                  >
                    <span>📋 Paste</span>
                  </button>
                )}

                {contentUrl && (
                  <button
                    type="button"
                    className="btn-clear-url focus-ring"
                    onClick={() => onUrlChange('')}
                    title="Clear URL"
                    aria-label="Clear URL"
                  >
                    ✕
                  </button>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                id="btn-analyze-content"
                onClick={onAnalyzeUrl}
                disabled={contentUrl.trim().length === 0 || isAnalyzing}
                isLoading={isAnalyzing}
                rightIcon={
                  !isAnalyzing ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  ) : undefined
                }
              >
                {isAnalyzing ? 'Auditing...' : 'Analyze'}
              </Button>
            </div>

            {/* Supported Platform Badges */}
            <div className="content-supported-pills">
              <span className="platform-tag">Instagram Reels &amp; Posts</span>
              <span className="platform-tag">TikTok Videos</span>
              <span className="platform-tag">YouTube Shorts</span>
              <span className="platform-tag">X / Twitter</span>
              <span className="platform-tag">LinkedIn</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Interactive Studio Media Dock */}
      <div className="hero-right-column">
        <div className="content-preview-dock scroll-reveal" id="content-media-dock">
          {/* Dock Top Header */}
          <div className="dock-glass-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: currentItem?.media.thumbnailUrl && !isPreviewLoading ? '#10b981' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: currentItem?.media.thumbnailUrl && !isPreviewLoading ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                }}
              />
              <span className="dock-title-label">
                {isPreviewLoading
                  ? 'FETCHING PREVIEW...'
                  : currentItem?.media.thumbnailUrl
                  ? 'LIVE PREVIEW LOADED'
                  : 'CONTENT MONITOR'}
              </span>
            </div>
            <span className="dock-format-badge">
              {formatLabel}
            </span>
          </div>

          {/* Visual Container (Dynamically responsive according to content dimensions) */}
          <div className="dock-visual-container" style={containerAspectStyle}>
            {isPreviewLoading ? (
              <div className="dock-placeholder-box dock-fetching-box">
                <div className="analyzing-spinner-ring" style={{ width: 38, height: 38, borderWidth: 3, marginBottom: 8 }} />
                <span className="placeholder-text" style={{ color: '#e4e4e7', fontWeight: 600 }}>
                  Fetching post preview image...
                </span>
              </div>
            ) : currentItem?.media.thumbnailUrl ? (
              <>
                <img
                  src={currentItem.media.thumbnailUrl}
                  alt={currentItem.title || 'Post preview'}
                  className={`dock-media-thumbnail ${isAnalyzing ? 'is-analyzing-blur' : ''}`}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setLoadedAspect(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/content_rating_sketch.jpg';
                  }}
                />

                {/* Holographic Laser Sweep & Reticle Overlay During Live Analysis */}
                <ScanningReticleOverlay
                  studio="content-rating"
                  isAnalyzing={isAnalyzing}
                  phase={scanPhase}
                  progressRatio={scanProgress}
                  statusMessage={scanStatusMessage}
                />
              </>
            ) : (
              <div className="dock-placeholder-box dock-blueprint-stage">
                <img
                  src="/content_rating_sketch.jpg"
                  alt="Viral Architecture & Storyboard Blueprint"
                  className="dock-media-thumbnail"
                />
                <div className="dock-blueprint-chip">
                  <span aria-hidden="true">🏛</span>
                  <span>VIRAL ARCHITECTURE BLUEPRINT</span>
                </div>
              </div>
            )}

            {/* Verdict Badge Stamp Overlay (Floating Corner Badge) */}
            {scoreData && !isPreviewLoading && (
              <div className="dock-evaluated-badge" id="content-evaluated-badge">
                <span className="dock-badge-title">POST IMPACT</span>
                <span className="dock-badge-score font-tabular-nums">
                  {scoreData.contentScore}
                  <span className="denom">/100</span>
                </span>
                <span className="dock-badge-band">{scoreData.verdictBadge}</span>
              </div>
            )}
          </div>

          {/* Scraped Post Meta Strip */}
          {currentItem && (
            <div className="dock-meta-strip">
              <div className="dock-creator-meta">
                <span className="creator-handle">{currentItem.creator.handle}</span>
                <span className="creator-niche" title={currentItem.title}>
                  {currentItem.title && currentItem.title.length > 35
                    ? `${currentItem.title.substring(0, 32)}...`
                    : currentItem.title || currentItem.creator.niche || 'Creator'}
                </span>
              </div>
              <div className="dock-post-hour">
                <span>Upload: {currentItem.uploadHourLocal !== undefined ? `${currentItem.uploadHourLocal}:00` : 'Peak Time'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
