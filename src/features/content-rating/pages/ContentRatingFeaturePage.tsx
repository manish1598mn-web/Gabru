'use client';

/**
 * GABRU — CONTENT RATING & ADVISORY FEATURE PAGE
 * 
 * 10-Parameter Social Media Quality & Performance Intelligence Studio.
 * Evaluates short-form and long-form video, carousels, and copy across:
 * - 100-Point Quality Score (Hook, Value, Structure, Media, Copy, CTA, Platform Fit, Originality, Timing, Compliance)
 * - 100-Point Performance Score (Empirical creator-baseline z-score model)
 * - Blended Content Score (70% Quality + 30% Performance)
 * - Actionable Advice, Prioritized Fixes, and Concrete AI Rewrites
 * - High-Res 1080x1350 Verified Share Card Canvas
 */

import React, { useState, useCallback, useEffect } from 'react';
import { AppNavbar } from '@/shared/components/layout/AppNavbar';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { StudioHeroBackdrop } from '@/shared/components/layout/StudioHeroBackdrop';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';
import { useRealisticAnalysis } from '@/shared/hooks/useRealisticAnalysis';

import {
  ContentScoreData,
  UnifiedContentItem,
  DeepDiveContentTabKey,
} from '../types/ContentRatingTypes';

import { evaluateUnifiedContent } from '../services/ContentScoringEngine';
import { detectPlatformFromUrl } from '../utils/ContentPlatformUtil';
import {
  fetchUrlPreview,
  getFastClientPreview,
} from '../utils/ContentUrlPreviewUtil';
import {
  ContentRatingHeroStudio,
  ContentRatingScorecard,
  ContentDeepDiveSection,
  ContentEvidenceSection,
  ContentShareModal,
  ContentAboutSection,
} from '../components';

export default function ContentRatingFeaturePage() {
  const [contentUrl, setContentUrl] = useState<string>('');
  const analysis = useRealisticAnalysis<ContentScoreData>({
    studio: 'content-rating',
    totalDurationMs: 3000,
    onComplete: () => {
      const el = document.getElementById('scorecard-wrapper-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  });
  const isAnalyzing = analysis.isAnalyzing;
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentItem, setCurrentItem] = useState<UnifiedContentItem | null>(null);
  const [scoreData, setScoreData] = useState<ContentScoreData | null>(null);
  const [activeTab, setActiveTab] = useState<DeepDiveContentTabKey>('hook');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Initialize scroll reveal hooks
  useIntersectionReveal();

  const handleUrlChange = useCallback((url: string) => {
    setContentUrl(url);
    if (errorMessage) setErrorMessage(null);

    const clean = url.trim();
    if (!clean) {
      if (!scoreData) setCurrentItem(null);
      return;
    }

    const platform = detectPlatformFromUrl(clean);
    if (!platform) return;

    // 0ms instant client-side heuristic extraction (e.g. YouTube video ID thumbnail)
    const fast = getFastClientPreview(clean);
    if (fast) {
      setCurrentItem({
        id: `preview:${clean}`,
        url: clean,
        platform: fast.platform,
        format: fast.format,
        inputMode: 'link',
        dataTier: 'A',
        ownerAnalytics: null,
        title: fast.title,
        caption: fast.caption || fast.title,
        creator: {
          id: fast.authorHandle,
          handle: fast.authorHandle,
          name: fast.authorName,
          niche: `${fast.platform.toUpperCase()} Creator`,
          followerCount: 0,
        },
        media: {
          thumbnailUrl: fast.thumbnailUrl,
          mediaUrl: fast.thumbnailUrl,
          durationSec: fast.durationSec ?? 15,
          width: fast.width || 1080,
          height: fast.height || 1920,
          aspectRatio: Number(((fast.width || 1080) / Math.max(1, fast.height || 1920)).toFixed(3)),
        },
        metrics: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: null,
          saves: null,
          reposts: null,
        },
        hashtags: [],
        mentions: [],
        transcriptSegments: [],
        keyframes: [],
        dataCompleteness: {
          publicMetrics: false,
          ownerAnalytics: false,
          mediaFile: !!fast.thumbnailUrl,
          transcript: false,
          keyframes: false,
        },
        postedAt: new Date().toISOString(),
      });
    }
  }, [errorMessage, scoreData]);

  // Debounced live preview fetch as the user pastes or finishes typing a URL
  useEffect(() => {
    const clean = contentUrl.trim();
    if (!clean || !detectPlatformFromUrl(clean)) return;

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const preview = await fetchUrlPreview(clean);
        if (isCancelled) return;

        setCurrentItem({
          id: `preview:${clean}`,
          url: clean,
          platform: preview.platform,
          format: preview.format,
          inputMode: 'link',
          dataTier: 'A',
          ownerAnalytics: null,
          title: preview.title,
          caption: preview.caption || preview.title,
          creator: {
            id: preview.authorHandle,
            handle: preview.authorHandle,
            name: preview.authorName,
            niche: `${preview.platform.toUpperCase()} Creator`,
            followerCount: 0,
          },
          media: {
            thumbnailUrl: preview.thumbnailUrl,
            mediaUrl: preview.thumbnailUrl,
            durationSec: preview.durationSec ?? (preview.format === 'short_video' ? 18 : 60),
            width: preview.width || 1080,
            height: preview.height || 1920,
            aspectRatio: Number(((preview.width || 1080) / Math.max(1, preview.height || 1920)).toFixed(3)),
          },
          metrics: {
            views: 0,
            likes: 0,
            comments: 0,
            shares: null,
            saves: null,
            reposts: null,
          },
          hashtags: [],
          mentions: [],
          transcriptSegments: [],
          keyframes: [],
          dataCompleteness: {
            publicMetrics: false,
            ownerAnalytics: false,
            mediaFile: !!preview.thumbnailUrl,
            transcript: false,
            keyframes: false,
          },
          postedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to live-preview content link:', err);
      } finally {
        if (!isCancelled) {
          setIsPreviewLoading(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [contentUrl]);

  const handleAnalyzeUrl = useCallback(async () => {
    const cleanUrl = contentUrl.trim();
    if (!cleanUrl) {
      setErrorMessage('Please enter a valid social media URL (e.g., YouTube Short, Instagram Reel, TikTok).');
      return;
    }

    const platform = detectPlatformFromUrl(cleanUrl);
    if (!platform) {
      setErrorMessage('Unsupported platform. Please provide a link from YouTube, Instagram, TikTok, X, or LinkedIn.');
      return;
    }

    setErrorMessage(null);
    setScoreData(null);

    try {
      // 1. Fetch live preview image & metadata from backend resolver
      const preview = await fetchUrlPreview(cleanUrl);

      // 2. Synthesize resolved content item based on the link (Tier A: Link Only)
      const resolvedItem: UnifiedContentItem = {
        id: `url:${cleanUrl}`,
        url: cleanUrl,
        platform: preview.platform,
        format: preview.format,
        inputMode: 'link',
        dataTier: 'A',
        ownerAnalytics: null,
        title: preview.title,
        caption: preview.caption || preview.title,
        creator: {
          id: preview.authorHandle,
          handle: preview.authorHandle,
          name: preview.authorName,
          niche: `${preview.platform.toUpperCase()} Creator`,
          followerCount: 0,
        },
        media: {
          thumbnailUrl: preview.thumbnailUrl,
          mediaUrl: preview.thumbnailUrl,
          durationSec: preview.durationSec ?? (preview.format === 'short_video' ? 18 : 60),
          width: preview.width || 1080,
          height: preview.height || 1920,
          aspectRatio: Number(((preview.width || 1080) / Math.max(1, preview.height || 1920)).toFixed(3)),
        },
        metrics: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: null,
          saves: null,
          reposts: null,
        },
        hashtags: [],
        mentions: [],
        transcriptSegments: [],
        keyframes: [],
        dataCompleteness: {
          publicMetrics: false,
          ownerAnalytics: false,
          mediaFile: true,
          transcript: false,
          keyframes: false,
        },
        postedAt: new Date().toISOString(),
      };

      setCurrentItem(resolvedItem);

      // 3. Run realistic 3.0-second analysis orchestration
      const evaluated = await analysis.startAnalysis(
        async () => evaluateUnifiedContent(resolvedItem),
        (res) => res.contentScore
      );
      if (evaluated) {
        setScoreData(evaluated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please check the link and try again.';
      setErrorMessage(msg);
      analysis.reset();
    } finally {
      setIsPreviewLoading(false);
    }
  }, [contentUrl, analysis]);

  const handleRecalculate = useCallback(async () => {
    if (!currentItem) return;
    setErrorMessage(null);
    setScoreData(null);
    try {
      const evaluated = await analysis.startAnalysis(
        async () => evaluateUnifiedContent(currentItem),
        (res) => res.contentScore
      );
      if (evaluated) {
        setScoreData(evaluated);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Re-calculation failed. Please try again.';
      setErrorMessage(msg);
      analysis.reset();
    }
  }, [currentItem, analysis]);

  const handleReset = useCallback(() => {
    analysis.reset();
    setScoreData(null);
    setCurrentItem(null);
    setContentUrl('');
    setErrorMessage(null);
    setScoreData(null);
  }, [analysis]);

  const handleOpenShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  return (
    <div className="home-container" id="content-rating-root">
      {/* Background Ambience & Atmospheric Mesh */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-lines" />
      </div>

      <AppNavbar activeFeature="content-rating" />

      <main className="main-content">
        {/* Top Hero Section: Link Input, File Dropzone & Media Dock */}
        <section className="hero-wrapper unified-studio-section content-hero-section" id="hero-section">
          {/* Mode-Reactive Viral Architecture & Cinematography Skeleton Backdrop */}
          <StudioHeroBackdrop studio="content-rating" />

          <div className="unified-studio-container">
            <ContentRatingHeroStudio
              scoreData={scoreData}
              currentItem={currentItem}
              contentUrl={contentUrl}
              isAnalyzing={isAnalyzing}
              scanPhase={analysis.phase}
              scanProgress={analysis.progressRatio}
              scanStatusMessage={analysis.statusMessage}
              isPreviewLoading={isPreviewLoading}
              errorMessage={errorMessage}
              onUrlChange={handleUrlChange}
              onAnalyzeUrl={handleAnalyzeUrl}
              onReset={handleReset}
              onShareClick={handleOpenShareModal}
              onRecalculate={handleRecalculate}
            />
          </div>
        </section>

        {/* 10-Parameter Craft & Reach Scorecard (Always Visible) */}
        <section className="content-scorecard-container" id="scorecard-wrapper-section">
          <ContentRatingScorecard
            scoreData={scoreData}
            isAnalyzing={isAnalyzing}
            shuffleScores={analysis.cardShuffleScores}
            cardLockStates={analysis.cardLockStates}
            justLockedCardId={analysis.justLockedCardId}
            displayedHeroScore={analysis.displayedScore}
            onSelectTab={setActiveTab}
            onShareScore={handleOpenShareModal}
          />
        </section>

        {scoreData && (
          <>
            {/* 10 Single-Post Diagnostic Deep Dives */}
            <section className="content-diagnostics-container" id="diagnostics-wrapper-section">
              <ContentDeepDiveSection
                scoreData={scoreData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </section>

            {/* Evidence Matrix: Ground-Truth Strengths & Priority Flaws */}
            <section className="content-evidence-container" id="evidence-wrapper-section">
              <ContentEvidenceSection
                scoreData={scoreData}
                onSelectTab={setActiveTab}
              />
            </section>
          </>
        )}

        {/* About Content Rating & Storyboard Methodology Section */}
        <ContentAboutSection />
      </main>

      {/* 1080x1350 High-Resolution Social Share Card Modal */}
      <ContentShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        scoreData={scoreData}
      />

      <AppFooter />
    </div>
  );
}
