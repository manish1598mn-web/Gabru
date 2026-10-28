'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppNavbar, AppFooter, useScrollState, useIntersectionReveal, useNumberShuffle } from '@/shared';

import type {
  BeautyParameterDef,
  BeautySubfactor,
  BeautyScoreData,
  DeepDiveTabKey,
  FaceDetectionResult,
  FacialEvaluationOptions,
} from '../types/FacialBeautyTypes';

import {
  BEAUTY_PARAMETERS,
  FRAMEWORK_LIMITS,
  PARAM_TO_TAB,
} from '../constants/FacialBeautyConstants';

import { detectFaceAndLandmarks } from '../services/FaceLandmarksService';
import { evaluateFacialBiometrics } from '../services/FacialScoringEngine';
import { drawBeautySocialCard } from '../utils/BeautyShareCardUtil';

import { FacialBeautyHeroStudio } from '../components/FacialBeautyHeroStudio';
import { FacialBeautyScorecard } from '../components/FacialBeautyScorecard';
import { FacialDeepDiveSection } from '../components/FacialDeepDiveSection';
import { FacialBeautyAboutSection } from '../components/FacialBeautyAboutSection';
import { FacialMethodologyModal } from '../components/FacialMethodologyModal';
import { FacialShareModal } from '../components/FacialShareModal';

export type { BeautyParameterDef, BeautySubfactor, BeautyScoreData, DeepDiveTabKey };
export { BEAUTY_PARAMETERS, FRAMEWORK_LIMITS, PARAM_TO_TAB };

/**
 * Deterministic Computer Vision & Biometric Analysis Orchestrator
 */
async function analyzeFacialBeauty(
  img: HTMLImageElement,
  options?: FacialEvaluationOptions
): Promise<BeautyScoreData> {
  const naturalWidth = img.naturalWidth > 0 ? img.naturalWidth : 1080;
  const naturalHeight = img.naturalHeight > 0 ? img.naturalHeight : 1350;
  const aspect = naturalHeight > 0 ? naturalWidth / naturalHeight : 0.8;

  // Step 0: MediaPipe Face Detection & Intake Gate
  const detection = await detectFaceAndLandmarks(img);
  if (detection.hardStop.triggered) {
    throw new Error(detection.hardStop.message || 'No human face detected. Please upload a clear photo of your face.');
  }

  const canvas = detection.rollCorrectedCanvas || document.createElement('canvas');
  if (!detection.rollCorrectedCanvas) {
    const sampleW = 320;
    const sampleH = Math.max(1, Math.round(sampleW / Math.max(0.1, aspect)));
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.warn('Canvas pixel draw warning:', e);
      }
    }
  }

  // Phase 3 & 4: Comprehensive Biometric Evaluation via Universal Engine
  const evalResult = evaluateFacialBiometrics(detection, canvas, options);

  return {
    ...evalResult,
    colorPalette: evalResult.colorPalette,
    metrics: evalResult.metrics,
    intakeReport: evalResult.intakeReport,
    rawDetection: detection,
  };
}

/**
 * BeautyRatingFeaturePage
 *
 * Senior Architectural Container for Gabru Facial Attractiveness & Harmony Suite:
 * - 100% In-Browser MediaPipe 468-point 3D Mesh Landmark Detection
 * - 8 Scientific Parameters on a 100-Point Calibrated Scale
 * - Research-Grade Diagnostic Deep Dives
 * - Instant Social Media 1080x1350 Sharecard Generation
 * - High-Performance Clean Architecture & Feature-Sliced Design
 */
export default function BeautyRatingFeaturePage() {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [scoreData, setScoreData] = useState<BeautyScoreData | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedCardBlob, setGeneratedCardBlob] = useState<Blob | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [dimorphismRef, setDimorphismRef] = useState<'skip' | 'M-typical' | 'F-typical'>('skip');
  const [activeDeepDiveTab, setActiveDeepDiveTab] = useState<DeepDiveTabKey>('skin');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastDetectionRef = useRef<FaceDetectionResult | null>(null);
  const lastImgRef = useRef<HTMLImageElement | null>(null);

  // Shared Hooks
  const isScrolled = useScrollState(20);
  useIntersectionReveal([scoreData, isAnalyzing]);
  const shuffleScores = useNumberShuffle(isAnalyzing, BEAUTY_PARAMETERS);

  // Memory Leak Prevention: Revoke ObjectURLs on unmount or replace
  useEffect(() => {
    return () => {
      if (selectedPhotoUrl && selectedPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(selectedPhotoUrl);
      }
      if (generatedCardUrl && generatedCardUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedCardUrl);
      }
    };
  }, [selectedPhotoUrl, generatedCardUrl]);

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['image/jpeg', 'image/png', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const hasValidExt =
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.webp');

    if (!validExtensions.includes(file.type) && !hasValidExt) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please choose a smaller portrait photo.');
      return;
    }

    setIsLoading(true);
    if (selectedPhotoUrl && selectedPhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedPhotoUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedPhotoUrl(objectUrl);
    setSelectedPhotoName(file.name);
    setIsLoading(false);

    setIsAnalyzing(true);
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = async () => {
      try {
        if ('decode' in tempImg) {
          try {
            await tempImg.decode();
          } catch {
            // Decoded asynchronously or fallback
          }
        }
        const result = await analyzeFacialBeauty(tempImg, {
          dimorphismRef,
          hasSideProfilePhoto: false,
          smilePhotoProvided: false,
        });
        lastDetectionRef.current = result.rawDetection ?? null;
        lastImgRef.current = tempImg;
        setTimeout(() => {
          setScoreData(result);
          setIsAnalyzing(false);
          setErrorMessage(null);
          const scoreElem = document.getElementById('photo-score-section');
          if (scoreElem) scoreElem.scrollIntoView({ behavior: 'smooth' });
        }, 600);
      } catch (err: any) {
        console.warn('Facial analysis error:', err);
        setIsAnalyzing(false);
        setScoreData(null);
        setErrorMessage(err?.message || 'Face detection check failed. Please upload a clear photo of your face.');
      }
    };
    tempImg.onerror = () => {
      setIsAnalyzing(false);
      setErrorMessage('Failed to load image for face detection.');
    };
    tempImg.src = objectUrl;
  };

  const handleSelectDimorphism = (refChoice: 'skip' | 'M-typical' | 'F-typical') => {
    setDimorphismRef(refChoice);
    if (lastDetectionRef.current && lastImgRef.current) {
      const canvas = lastDetectionRef.current.rollCorrectedCanvas || document.createElement('canvas');
      const updated = evaluateFacialBiometrics(lastDetectionRef.current, canvas, {
        dimorphismRef: refChoice,
        hasSideProfilePhoto: false,
        smilePhotoProvided: false,
      });
      setScoreData({
        ...updated,
        colorPalette: updated.colorPalette,
        metrics: updated.metrics,
        intakeReport: updated.intakeReport,
        rawDetection: lastDetectionRef.current,
      });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleFace = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch('/face_beauty_sketch.jpg');
      const blob = await resp.blob();
      const file = new File([blob], 'divine-proportions-sketch.jpg', { type: 'image/jpeg' });
      processFile(file);
    } catch {
      setIsLoading(false);
    }
  };

  const loadSamplePortrait = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch('/sample_face.png');
      const blob = await resp.blob();
      const file = new File([blob], 'gabru-sample-face.png', { type: 'image/png' });
      processFile(file);
    } catch {
      setIsLoading(false);
    }
  };

  const generateSocialCard = useCallback(() => {
    if (!scoreData) return;
    setIsGeneratingCard(true);
    setShareCardCopied(false);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setIsGeneratingCard(false);
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const finishRender = () => {
      try {
        drawBeautySocialCard(ctx, img, scoreData, BEAUTY_PARAMETERS);
        canvas.toBlob((blob) => {
          if (blob) {
            if (generatedCardUrl && generatedCardUrl.startsWith('blob:')) {
              URL.revokeObjectURL(generatedCardUrl);
            }
            const url = URL.createObjectURL(blob);
            setGeneratedCardBlob(blob);
            setGeneratedCardUrl(url);
          }
          setIsGeneratingCard(false);
        }, 'image/png');
      } catch (err) {
        console.warn('Canvas drawBeautySocialCard error:', err);
        setIsGeneratingCard(false);
      }
    };

    img.onload = finishRender;
    img.onerror = () => finishRender();
    img.src = selectedPhotoUrl || '/sample_face.png';
  }, [scoreData, selectedPhotoUrl, generatedCardUrl]);

  const handleShareScore = () => {
    if (!scoreData) return;
    setShowShareModal(true);
    setTimeout(() => {
      generateSocialCard();
    }, 40);
  };

  const handleDownloadCard = () => {
    if (!generatedCardUrl && !generatedCardBlob) return;
    const link = document.createElement('a');
    link.href = generatedCardUrl || (generatedCardBlob ? URL.createObjectURL(generatedCardBlob) : '');
    const scoreNum = scoreData ? scoreData.faceScore : 0;
    link.download = `gabru-beauty-card-${scoreNum}pts.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareCardWithFriends = async () => {
    if (!scoreData) return;

    handleDownloadCard();
    setShareCardCopied(true);
    setTimeout(() => setShareCardCopied(false), 3500);

    if (!generatedCardBlob) return;

    const fileName = `gabru-beauty-card-${scoreData.faceScore}pts.png`;
    const file = new File([generatedCardBlob], fileName, { type: 'image/png' });
    const shareTitle = `Gabru Facial Attractiveness Scorecard • ${scoreData.faceScore}/100`;
    const shareText = `My facial beauty score is ${scoreData.faceScore}/100 (${scoreData.verdict}) on Gabru. Rate yours: https://www.gabru.ai/beauty-rating`;

    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        const item = new ClipboardItem({ 'image/png': generatedCardBlob });
        await navigator.clipboard.write([item]);
        return;
      } catch (clipErr) {
        console.warn('Direct image clipboard write failed:', clipErr);
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // Fallback
      }
    }
  };

  const copyHex = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    }
  };

  return (
    <div className="home-container" id="beauty-rating-root">
      {/* Background Ambience & Grid Lines */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-lines" />
      </div>

      {/* Universal Shared Navigation Bar */}
      <AppNavbar
        activeFeature="beauty-rating"
      />

      <main className="main-content">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          id="file-input-beauty"
        />

        {/* ==========================================================
            2. HERO & BIOMETRIC BEAUTY STUDIO (2-COLUMN UNIFIED SECTION)
            ========================================================== */}
        <section className="hero-wrapper unified-studio-section beauty-hero-section" id="hero-section">
          {/* Luxury Facial Beauty Studio Hero Backdrop */}
          <div className="hero-beauty-backdrop" aria-hidden="true">
            <img
              src="/face_beauty_hero_bg.jpg"
              alt=""
              className="hero-beauty-bg-img"
            />
            <div className="hero-beauty-gradient-overlay" />
            <div className="hero-beauty-ambient-glow" />
          </div>

          <div className="unified-studio-container">
            <FacialBeautyHeroStudio
              scoreData={scoreData}
              selectedPhotoUrl={selectedPhotoUrl}
              selectedPhotoName={selectedPhotoName}
              isDragging={isDragging}
              isAnalyzing={isAnalyzing}
              errorMessage={errorMessage}
              onTriggerUpload={triggerUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onSampleSketch={loadSampleFace}
              onSamplePortrait={loadSamplePortrait}
              onShareClick={handleShareScore}
              onReevaluate={triggerUpload}
            />

            {/* Integrated 10-Parameter Beauty Rating Scorecard Area */}
            <div className="integrated-photo-score-area" id="photo-score-section">
              <div className={`scorecard-wrapper ${isAnalyzing ? 'analyzing' : ''}`} id="photo-score-dashboard">
                <FacialBeautyScorecard
                  scoreData={scoreData}
                  isAnalyzing={isAnalyzing}
                  shuffleScores={shuffleScores}
                  dimorphismRef={dimorphismRef}
                  onSelectDimorphism={handleSelectDimorphism}
                  onSelectTab={setActiveDeepDiveTab}
                  onShareScore={handleShareScore}
                />

                {/* Research-Grade Biometric Diagnostic Deep-Dive Suite */}
                {scoreData && !isAnalyzing && (
                  <FacialDeepDiveSection
                    scoreData={scoreData}
                    activeTab={activeDeepDiveTab}
                    onTabChange={setActiveDeepDiveTab}
                    copiedColor={copiedColor}
                    onCopyColor={copyHex}
                    dimorphismRef={dimorphismRef}
                    onSelectDimorphism={handleSelectDimorphism}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Feature Strip & Scientific Platform Manifesto */}
      <FacialBeautyAboutSection />

      {/* Universal Luxury Editorial Footer */}
      <AppFooter onAboutClick={() => setShowAboutModal(true)} />

      {/* Scientific Governance & Methodology Modal */}
      <FacialMethodologyModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Social Media Scorecard Preview & Share Modal */}
      <FacialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        isGeneratingCard={isGeneratingCard}
        generatedCardUrl={generatedCardUrl}
        shareCardCopied={shareCardCopied}
        onShare={handleShareCardWithFriends}
      />
    </div>
  );
}
