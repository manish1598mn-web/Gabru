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

import React, { useState, useCallback } from 'react';
import { AppNavbar } from '@/shared/components/layout/AppNavbar';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';

import {
  ContentScoreData,
  InputMode,
  UnifiedContentItem,
  DeepDiveContentTabKey,
} from '../types/ContentRatingTypes';
import {
  SAMPLE_DEMO_CONTENTS,
  DEMO_VIRAL_SHORT,
} from '../constants/ContentRatingConstants';
import { evaluateUnifiedContent } from '../services/ContentScoringEngine';
import {
  ContentRatingHeroStudio,
  ContentRatingScorecard,
  ContentDeepDiveSection,
  ContentEvidenceSection,
  ContentRewritesSection,
  ContentShareModal,
  ContentAboutSection,
  detectPlatformFromUrl,
} from '../components';

export default function ContentRatingFeaturePage() {
  const [contentUrl, setContentUrl] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('link');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
  }, [errorMessage]);

  const handleModeChange = useCallback((mode: InputMode) => {
    setInputMode(mode);
    setErrorMessage(null);
  }, []);

  const handleAnalyzeUrl = useCallback(() => {
    if (!contentUrl.trim()) {
      setErrorMessage('Please enter a valid social media URL (e.g., YouTube Short, Instagram Reel, TikTok).');
      return;
    }

    const platform = detectPlatformFromUrl(contentUrl);
    if (!platform) {
      setErrorMessage('Unsupported platform. Please provide a link from YouTube, Instagram, TikTok, X, or LinkedIn.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Simulate multi-model ingestion pipeline latency (650ms)
    setTimeout(() => {
      // Synthesize resolved content item based on the link
      const resolvedItem: UnifiedContentItem = {
        ...DEMO_VIRAL_SHORT,
        id: `url:${Date.now()}`,
        url: contentUrl,
        platform,
        inputMode: 'link',
        title: `Public ${platform.toUpperCase()} Post Analysis`,
        postedAt: new Date().toISOString(),
      };

      try {
        const evaluated = evaluateUnifiedContent(resolvedItem);
        setCurrentItem(resolvedItem);
        setScoreData(evaluated);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Analysis failed. Please check the link and try again.';
        setErrorMessage(msg);
      } finally {
        setIsAnalyzing(false);
      }
    }, 650);
  }, [contentUrl]);

  const handleSelectDemo = useCallback((demoKey: 'short_video' | 'carousel' | 'long_video') => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    const demoItem = SAMPLE_DEMO_CONTENTS[demoKey] || DEMO_VIRAL_SHORT;
    setContentUrl(demoItem.url || '');

    setTimeout(() => {
      try {
        const evaluated = evaluateUnifiedContent(demoItem);
        setCurrentItem(demoItem);
        setScoreData(evaluated);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load demo preset.';
        setErrorMessage(msg);
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    // Create object URL for local media preview
    const mediaUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    setTimeout(() => {
      const uploadItem: UnifiedContentItem = {
        ...DEMO_VIRAL_SHORT,
        id: `upload:${file.name}`,
        inputMode: 'upload',
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: `Uploaded file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        media: {
          ...DEMO_VIRAL_SHORT.media,
          durationSec: isVideo ? 28 : 0,
          thumbnailUrl: mediaUrl,
          mediaUrl,
        },
      };

      try {
        const evaluated = evaluateUnifiedContent(uploadItem);
        setCurrentItem(uploadItem);
        setScoreData(evaluated);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to analyze uploaded file.';
        setErrorMessage(msg);
      } finally {
        setIsAnalyzing(false);
      }
    }, 550);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleReset = useCallback(() => {
    setScoreData(null);
    setCurrentItem(null);
    setContentUrl('');
    setErrorMessage(null);
  }, []);

  const handleOpenShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  return (
    <div className="gabru-app-container content-studio-theme" id="gabru-content-studio">
      <AppNavbar activeFeature="content-rating" />

      <main className="content-page-main" id="main-content">
        {/* Top Hero Section: Link Input, File Dropzone & Media Dock */}
        <section className="hero-wrapper content-hero-section" id="hero-studio-section">
          <ContentRatingHeroStudio
            scoreData={scoreData}
            currentItem={currentItem}
            inputMode={inputMode}
            contentUrl={contentUrl}
            isAnalyzing={isAnalyzing}
            isDragging={isDragging}
            errorMessage={errorMessage}
            onUrlChange={handleUrlChange}
            onModeChange={handleModeChange}
            onAnalyzeUrl={handleAnalyzeUrl}
            onSelectDemo={handleSelectDemo}
            onFileUpload={handleFileUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onReset={handleReset}
            onShareClick={handleOpenShareModal}
          />
        </section>

        {scoreData && (
          <>
            {/* 10-Parameter Craft & Reach Scorecard */}
            <section className="content-scorecard-container" id="scorecard-wrapper-section">
              <ContentRatingScorecard
                scoreData={scoreData}
                isAnalyzing={isAnalyzing}
                onSelectTab={setActiveTab}
                onShareScore={handleOpenShareModal}
              />
            </section>

            {/* 10 Biometric & Craft Diagnostic Deep Dives */}
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

            {/* AI Optimization Studio: Ranked Fixes & Interactive Rewrites */}
            <section className="content-rewrites-container" id="rewrites-wrapper-section">
              <ContentRewritesSection
                scoreData={scoreData}
                onSelectTab={setActiveTab}
              />
            </section>
          </>
        )}

        {/* Clean Educational Guide: Core Pillars, How to Use It, Real Example & Privacy Guarantee */}
        <section className="content-about-wrapper" id="about-wrapper-section">
          <ContentAboutSection />
        </section>
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
