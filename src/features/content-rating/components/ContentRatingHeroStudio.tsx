'use client';

/**
 * GABRU — CONTENT RATING HERO STUDIO
 * 
 * Interactive studio workspace supporting:
 * - Path A: URL Link Input with auto platform detection (YouTube, Instagram, TikTok, X, etc.)
 * - Path C: Direct Media File & Analytics CSV Drag & Drop
 * - Instant Demo Presets (Worked Example Short, Carousel, Long Video)
 * - Interactive Right Media Dock with Waveforms, Technical LUFS, and Playback
 */

import React, { useState, useId } from 'react';
import {
  ContentScoreData,
  InputMode,
  ContentPlatform,
  UnifiedContentItem,
} from '../types/ContentRatingTypes';
import { SAMPLE_DEMO_CONTENTS } from '../constants/ContentRatingConstants';
import { Button } from '@/shared/components/ui/Button';

export interface ContentRatingHeroStudioProps {
  scoreData: ContentScoreData | null;
  currentItem: UnifiedContentItem | null;
  inputMode: InputMode;
  contentUrl: string;
  isAnalyzing: boolean;
  isDragging: boolean;
  errorMessage: string | null;
  onUrlChange: (url: string) => void;
  onModeChange: (mode: InputMode) => void;
  onAnalyzeUrl: () => void;
  onSelectDemo: (demoKey: 'short_video' | 'carousel' | 'long_video') => void;
  onFileUpload: (file: File) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onReset: () => void;
  onShareClick: () => void;
}

/**
 * Detects social platform from URL string
 */
export function detectPlatformFromUrl(url: string): ContentPlatform | null {
  const clean = url.trim().toLowerCase();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('instagram.com')) return 'instagram';
  if (clean.includes('tiktok.com')) return 'tiktok';
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'x';
  if (clean.includes('linkedin.com')) return 'linkedin';
  if (clean.includes('threads.net')) return 'threads';
  if (clean.includes('facebook.com')) return 'facebook';
  return null;
}

export function ContentRatingHeroStudio({
  scoreData,
  currentItem,
  inputMode,
  contentUrl,
  isAnalyzing,
  isDragging,
  errorMessage,
  onUrlChange,
  onModeChange,
  onAnalyzeUrl,
  onSelectDemo,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onReset,
  onShareClick,
}: ContentRatingHeroStudioProps) {
  const [selectedDemoKey, setSelectedDemoKey] = useState<'short_video' | 'carousel' | 'long_video'>('short_video');
  const detectedPlatform = detectPlatformFromUrl(contentUrl);
  const fileInputId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnalyzing && contentUrl.trim().length > 0) {
      onAnalyzeUrl();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="hero-container content-studio-hero">
      {/* Left Column: Command & Input Studio */}
      <div className="hero-left-column">
        <h1 className="hero-headline scroll-reveal" id="hero-headline">
          Paste Content Link,
          <br />
          <span className="gradient-text content-gradient-text">Rate Social Reach</span>
        </h1>

        <p className="hero-description scroll-reveal" id="hero-description">
          Evidence-gated audit across 10 craft dimensions and creator-baseline metrics.
          Instant hook analysis, audio LUFS verification, retention pacing, and concrete rewrites.
        </p>

        {scoreData ? (
          /* Evaluated State: Clean Executive Content Score Hub */
          <div className="upload-card is-evaluated content-evaluated-hub scroll-reveal">
            <div className="score-summary-header">
              <div className="score-metric-display">
                <span className="score-big-number content-score-number font-tabular-nums">
                  {Number.isInteger(scoreData.contentScore)
                    ? String(scoreData.contentScore)
                    : scoreData.contentScore.toFixed(1)}
                </span>
                <span className="score-scale-denom font-tabular-nums">/100</span>
                <span className="score-verdict-tag content-verdict-tag">
                  {scoreData.verdict}
                </span>
              </div>

              <div className="evaluated-header-actions">
                <Button
                  variant="primary"
                  size="md"
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

                <Button
                  variant="secondary"
                  size="md"
                  onClick={onReset}
                  id="btn-analyze-new"
                  title="Analyze another link or media"
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

            {/* Split Pillars & Confidence Badges */}
            <div className="content-score-pillars-row">
              <div className="pillar-chip quality-pillar">
                <span className="pillar-label">QUALITY (70%)</span>
                <span className="pillar-value font-tabular-nums">{scoreData.qualityScore.toFixed(1)}/100</span>
              </div>

              <div className="pillar-chip performance-pillar">
                <span className="pillar-label">PERFORMANCE (30%)</span>
                <span className="pillar-value font-tabular-nums">
                  {scoreData.performanceScore !== null ? `${scoreData.performanceScore.toFixed(1)}/100` : 'N/A (Too Fresh)'}
                </span>
              </div>

              <div className="pillar-chip confidence-pillar">
                <span className="pillar-label">CONFIDENCE</span>
                <span className="pillar-value">{scoreData.confidence.toUpperCase()}</span>
              </div>
            </div>

            {/* Top Quick Fix Callout */}
            {scoreData.suggestions.length > 0 && (
              <div className="content-hero-top-fix">
                <div className="top-fix-eyebrow">
                  <span className="fix-icon" aria-hidden="true">⚡</span>
                  <span className="fix-tag">TOP PRIORITY FIX</span>
                  <span className="fix-gain font-tabular-nums">+{scoreData.suggestions[0].estimatedGain.toFixed(1)} PTS</span>
                </div>
                <div className="top-fix-title">{scoreData.suggestions[0].title}</div>
                <div className="top-fix-desc">{scoreData.suggestions[0].description}</div>
              </div>
            )}
          </div>
        ) : (
          /* Pre-Evaluated State: Input Mode Selection & Forms */
          <>
            {/* Mode Switcher Dock */}
            <div className="content-mode-dock scroll-reveal" role="tablist" aria-label="Input Mode">
              <button
                type="button"
                role="tab"
                aria-selected={inputMode === 'link'}
                className={`content-mode-btn focus-ring tactile-press ${inputMode === 'link' ? 'is-active' : ''}`}
                onClick={() => onModeChange('link')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Paste Social Link</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={inputMode === 'upload'}
                className={`content-mode-btn focus-ring tactile-press ${inputMode === 'upload' ? 'is-active' : ''}`}
                onClick={() => onModeChange('upload')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload Media</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={inputMode === 'demo'}
                className={`content-mode-btn focus-ring tactile-press ${inputMode === 'demo' ? 'is-active' : ''}`}
                onClick={() => onModeChange('demo')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Try Demo Presets</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="content-error-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MODE 1: PASTE LINK */}
            {inputMode === 'link' && (
              <div className="content-input-card scroll-reveal">
                <div className="content-link-field-wrapper">
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
                      <span className="platform-active-pill x">X / Twitter</span>
                    )}
                    {detectedPlatform === 'linkedin' && (
                      <span className="platform-active-pill in">LinkedIn</span>
                    )}
                    {!detectedPlatform && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    )}
                  </div>

                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => onUrlChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste YouTube Short, Instagram Reel, TikTok, or X link..."
                    className="content-link-input"
                    id="content-url-input"
                    disabled={isAnalyzing}
                  />

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

                  <Button
                    variant="primary"
                    size="md"
                    id="btn-analyze-content"
                    onClick={onAnalyzeUrl}
                    disabled={contentUrl.trim().length === 0}
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
                  <span className="platform-tag">YouTube Shorts &amp; Videos</span>
                  <span className="platform-tag">Instagram Reels</span>
                  <span className="platform-tag">TikTok</span>
                  <span className="platform-tag">X / Twitter</span>
                  <span className="platform-tag">LinkedIn</span>
                </div>
              </div>
            )}

            {/* MODE 2: UPLOAD MEDIA */}
            {inputMode === 'upload' && (
              <div
                className={`content-upload-dropzone scroll-reveal ${isDragging ? 'is-dragging' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file"
                  id={fileInputId}
                  className="visually-hidden"
                  accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,text/csv"
                  onChange={handleFileInputChange}
                />

                <div className="upload-dropzone-inner">
                  <div className="upload-icon-circle">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                      <line x1="7" y1="2" x2="7" y2="22" />
                      <line x1="17" y1="2" x2="17" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="2" y1="7" x2="7" y2="7" />
                      <line x1="2" y1="17" x2="7" y2="17" />
                      <line x1="17" y1="17" x2="22" y2="17" />
                      <line x1="17" y1="7" x2="22" y2="7" />
                    </svg>
                  </div>
                  <h3 className="upload-title">Drop your video, image, or analytics CSV</h3>
                  <p className="upload-subtitle">
                    Direct local analysis of video bitrate, LUFS loudness, keyframes, and engagement logs.
                  </p>
                  <label htmlFor={fileInputId} className="btn-browse-file focus-ring touch-target tactile-press">
                    Browse File
                  </label>
                </div>
              </div>
            )}

            {/* MODE 3: DEMO PRESETS */}
            {inputMode === 'demo' && (
              <div className="content-presets-grid scroll-reveal">
                {/* Preset 1: Viral Short (Section 6 Worked Example) */}
                <div
                  className={`preset-card focus-ring tactile-press ${selectedDemoKey === 'short_video' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelectedDemoKey('short_video');
                    onSelectDemo('short_video');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDemoKey('short_video');
                      onSelectDemo('short_video');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Load preset audit: How I doubled my coding speed with 1 shortcut"
                >
                  <div className="preset-card-top">
                    <span className="preset-type-pill short">9:16 VERTICAL SHORT</span>
                    <span className="preset-expected-score font-tabular-nums">70.8 / 100</span>
                  </div>
                  <h4 className="preset-card-title">How I doubled my coding speed with 1 shortcut</h4>
                  <p className="preset-card-desc">
                    Canonical 34s YouTube Short from Section 6. High platform fit, clear value, but weak CTA and delayed hook.
                  </p>
                  <div className="btn-load-preset" aria-hidden="true">
                    <span>Load &amp; Inspect Audit</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>

                {/* Preset 2: Design Token Carousel */}
                <div
                  className={`preset-card focus-ring tactile-press ${selectedDemoKey === 'carousel' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelectedDemoKey('carousel');
                    onSelectDemo('carousel');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDemoKey('carousel');
                      onSelectDemo('carousel');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Load preset audit: 8 Design Token Rules That Save 100 Hours"
                >
                  <div className="preset-card-top">
                    <span className="preset-type-pill carousel">4:5 CAROUSEL</span>
                    <span className="preset-expected-score font-tabular-nums">83.5 / 100</span>
                  </div>
                  <h4 className="preset-card-title">8 Design Token Rules That Save 100 Hours</h4>
                  <p className="preset-card-desc">
                    Educational Instagram carousel with 3-layer architecture, 88% retention, and high saves ratio.
                  </p>
                  <div className="btn-load-preset" aria-hidden="true">
                    <span>Load &amp; Inspect Audit</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>

                {/* Preset 3: YouTube Long Explainer */}
                <div
                  className={`preset-card focus-ring tactile-press ${selectedDemoKey === 'long_video' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelectedDemoKey('long_video');
                    onSelectDemo('long_video');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDemoKey('long_video');
                      onSelectDemo('long_video');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Load preset audit: Building Autonomous AI Multi-Agent Systems"
                >
                  <div className="preset-card-top">
                    <span className="preset-type-pill long">16:9 DEEP-DIVE</span>
                    <span className="preset-expected-score font-tabular-nums">87.1 / 100</span>
                  </div>
                  <h4 className="preset-card-title">Building Autonomous AI Multi-Agent Systems</h4>
                  <p className="preset-card-desc">
                    12-minute technical masterclass with timestamp chapters, verified LUFS clarity, and high watch time.
                  </p>
                  <div className="btn-load-preset" aria-hidden="true">
                    <span>Load &amp; Inspect Audit</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Column: Interactive Studio Media Dock */}
      <div className="hero-right-column">
        <div className="content-preview-dock scroll-reveal" id="content-media-dock">
          {/* Dock Top Header */}
          <div className="dock-glass-header">
            <span className="dock-title-label">STUDIO WORKSPACE</span>
            <span className="dock-format-badge">
              {currentItem
                ? currentItem.format.toUpperCase().replace('_', ' ')
                : '9:16 VERTICAL'}
            </span>
          </div>

          {/* Dock Body: Active Preview or Placeholder */}
          {isAnalyzing ? (
            /* Analysis Pipeline Stepper Animation */
            <div className="dock-analyzing-stepper">
              <div className="stepper-spinner-bubble">
                <span className="stepper-spinner" />
              </div>
              <h4 className="stepper-title">Executing Multi-Model Audit</h4>
              <div className="stepper-list">
                <div className="step-item is-done">
                  <span className="step-check">✓</span>
                  <span>Resolving link &amp; public telemetry</span>
                </div>
                <div className="step-item is-active">
                  <span className="step-pulse" />
                  <span>Sampling keyframes &amp; OCR text</span>
                </div>
                <div className="step-item">
                  <span className="step-dot" />
                  <span>Measuring vocal LUFS &amp; silence gaps</span>
                </div>
                <div className="step-item">
                  <span className="step-dot" />
                  <span>Evaluating 10 parameters &amp; flaw caps</span>
                </div>
                <div className="step-item">
                  <span className="step-dot" />
                  <span>Synthesizing delta-gain rewrites</span>
                </div>
              </div>
            </div>
          ) : currentItem ? (
            /* Media Loaded View */
            <div className="dock-media-active-view">
              <div className="active-media-backdrop">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentItem.media.thumbnailUrl || '/face_beauty_hero_bg.jpg'}
                  alt={currentItem.title}
                  className="active-media-img"
                  onError={(e) => {
                    e.currentTarget.src = '/face_beauty_hero_bg.jpg';
                  }}
                />
                <div className="active-media-overlay" />
                <div className="active-media-center-badge">
                  <div className="dock-play-bubble-small">▶</div>
                  <span className="media-duration-chip font-tabular-nums">
                    {currentItem.media.durationSec > 0
                      ? `${currentItem.media.durationSec}s`
                      : 'CAROUSEL'}
                  </span>
                </div>
              </div>

              {/* Creator Metadata Bar */}
              <div className="active-creator-bar">
                <div className="creator-info">
                  <span className="creator-handle text-truncate">{currentItem.creator.handle}</span>
                  <span className="creator-niche text-truncate">{currentItem.creator.niche}</span>
                </div>
                <div className="creator-reach-chip font-tabular-nums">
                  {currentItem.metrics.views.toLocaleString()} views
                </div>
              </div>

              {/* Live Audio Waveform Simulation Bar */}
              {currentItem.audioMetrics && (
                <div className="dock-audio-waveform-bar">
                  <div className="waveform-label">
                    <span>AUDIO SPECTRUM</span>
                    <span className="font-tabular-nums">{currentItem.audioMetrics.integratedLufs.toFixed(1)} LUFS</span>
                  </div>
                  <div className="waveform-bars">
                    {[40, 65, 85, 30, 95, 70, 50, 90, 60, 45, 80, 55, 75, 90, 65, 40, 85, 70, 50, 30, 95, 60].map((h, i) => (
                      <span
                        key={i}
                        className="waveform-bar"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty Placeholder State */
            <div className="dock-placeholder-body">
              <div className="dock-play-bubble">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <p className="dock-prompt-text">
                Paste a public link or load a preset demo to preview media playback, keyframe breakdown, and audio waveforms.
              </p>
            </div>
          )}

          {/* Dock Technical Metadata Footer */}
          <div className="dock-glass-footer">
            <div className="dock-meta-item">
              <span className="dock-meta-label">TARGET LOUDNESS</span>
              <span className="dock-meta-val font-tabular-nums">
                {currentItem?.audioMetrics
                  ? `${currentItem.audioMetrics.integratedLufs.toFixed(1)} LUFS`
                  : '-14 ± 3 LUFS'}
              </span>
            </div>
            <div className="dock-meta-item">
              <span className="dock-meta-label">TIME TO VALUE</span>
              <span className="dock-meta-val font-tabular-nums">
                {currentItem?.transcriptSegments?.[0]
                  ? `~${currentItem.transcriptSegments[0].startSec}s`
                  : '≤ 3 SECONDS'}
              </span>
            </div>
            <div className="dock-meta-item">
              <span className="dock-meta-label">RESOLUTION</span>
              <span className="dock-meta-val font-tabular-nums">
                {currentItem ? `${currentItem.media.width}x${currentItem.media.height}` : '1080x1920 (9:16)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

