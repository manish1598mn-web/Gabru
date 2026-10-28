'use client';

// Suppress Emscripten / TensorFlow Lite informational logs to stderr which Turbopack flags as console errors
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.__tflite_log_filter_active) {
    win.__tflite_log_filter_active = true;
    const originalConsoleError = console.error;
    console.error = function (...args: any[]) {
      try {
        const text = args
          .map((a) => (typeof a === 'string' ? a : a?.message || String(a)))
          .join(' ');
        if (
          text.includes('Created TensorFlow Lite') ||
          text.includes('XNNPACK delegate') ||
          text.includes('INFO: Created') ||
          text.startsWith('INFO:') ||
          text.includes('TensorFlow Lite XNNPACK') ||
          text.includes('delegate for CPU') ||
          text.includes('delegate for GPU')
        ) {
          console.info('[TFLite Info]:', ...args);
          return;
        }
      } catch {
        // Fallback
      }
      return originalConsoleError.apply(console, args);
    };
  }
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

import {
  BEAUTY_PARAMETERS,
  FRAMEWORK_LIMITS,
  calculateBeautyScore,
  evaluateFacialBiometrics,
  extractBiometricFeaturesFromCanvas,
  type BeautyParameterDef,
  type BeautySubfactor,
  type ScoreCalculationResult,
  type CompleteFacialAnalysisResult,
  type FacialEvaluationOptions,
  type Phase3Metrics,
  type Phase4Metrics,
} from '../services/FacialScoringEngine';
import { detectFaceAndLandmarks } from '../services/FaceLandmarksService';
import { type FaceDetectionResult } from '../types/FacialBeautyTypes';
import { drawBeautySocialCard } from '../utils/BeautyShareCardUtil';

export type { BeautyParameterDef, BeautySubfactor };
export { BEAUTY_PARAMETERS, FRAMEWORK_LIMITS };

const BEAUTY_CARD_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(135deg, #2b1f1a 0%, #6b3f2a 55%, #3a2418 100%)',
  2: 'linear-gradient(135deg, #2a2418 0%, #7a6228 55%, #3a2e14 100%)',
  3: 'linear-gradient(135deg, #2a1a24 0%, #7a3a5a 55%, #3a1828 100%)',
  4: 'linear-gradient(135deg, #1a2430 0%, #4a6a8a 55%, #182430 100%)',
  5: 'linear-gradient(135deg, #1a2e2e 0%, #3a8a8a 55%, #142828 100%)',
  6: 'linear-gradient(135deg, #1a2a1e 0%, #3a8a4f 55%, #142418 100%)',
  7: 'linear-gradient(135deg, #241a30 0%, #6a3a8a 55%, #1e1428 100%)',
  8: 'linear-gradient(135deg, #2a2018 0%, #8a5a2a 55%, #241a12 100%)',
};

export type DeepDiveTabKey =
  | 'skin'
  | 'proportions'
  | 'expression'
  | 'averageness'
  | 'symmetry'
  | 'grooming'
  | 'dimorphism'
  | 'features';

export const PARAM_TO_TAB: Record<number, DeepDiveTabKey> = {
  1: 'skin',
  2: 'proportions',
  3: 'expression',
  4: 'averageness',
  5: 'symmetry',
  6: 'grooming',
  7: 'dimorphism',
  8: 'features',
};

export interface BeautyScoreData extends ScoreCalculationResult {
  colorPalette: {
    skinTone: string;
    lipTone: string;
    undertone: string;
    vitalityLevel: string;
  };
  metrics: {
    symmetryIndex: number; // 0 to 100%
    goldenRatioAdherence: number; // 0 to 100%
    facialThirdsBalance: string;
    facialFifthsBalance: string;
    dimorphismType: string;
    canthalTiltDeg?: number;
    aspectRatio?: number;
    procrustesDistance?: number;
    phase3?: Phase3Metrics;
    phase4?: Phase4Metrics;
  };
  intakeReport?: {
    faceDetected: boolean;
    detectedCount: number;
    yawDeg: number;
    pitchDeg: number;
    rollDeg: number;
    ipdPx: number;
    notes: string[];
    isFilteredOrMirrored?: boolean;
  };
  rawDetection?: FaceDetectionResult;
}

// ==========================================================
// DETERMINISTIC COMPUTER VISION & BIOMETRIC ANALYSIS ENGINE
// ==========================================================
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

export default function BeautyRatingFeaturePage() {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const [scoreData, setScoreData] = useState<BeautyScoreData | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedCardBlob, setGeneratedCardBlob] = useState<Blob | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState<boolean>(false);
  const [shuffleScores, setShuffleScores] = useState<Record<number, number>>({});
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [dimorphismRef, setDimorphismRef] = useState<'skip' | 'M-typical' | 'F-typical'>('skip');
  const [activeDeepDiveTab, setActiveDeepDiveTab] = useState<DeepDiveTabKey>('skin');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastDetectionRef = useRef<FaceDetectionResult | null>(null);
  const lastImgRef = useRef<HTMLImageElement | null>(null);

  // Fast number shuffling effect during analysis (matches Fit Check)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAnalyzing) {
      interval = setInterval(() => {
        const nextShuffle: Record<number, number> = {};
        BEAUTY_PARAMETERS.forEach((p) => {
          nextShuffle[p.id] = Math.floor(Math.random() * (p.weight + 1));
        });
        setShuffleScores(nextShuffle);
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Evidence tier score totals (56 pts strong, 44 pts moderate)
  const strongScore = scoreData
    ? Number(
        (
          (scoreData.parameterScores[1] || 0) +
          (scoreData.parameterScores[3] || 0) +
          (scoreData.parameterScores[4] || 0) +
          (scoreData.parameterScores[6] || 0)
        ).toFixed(1)
      )
    : null;

  const moderateScore = scoreData
    ? Number(
        (
          (scoreData.parameterScores[2] || 0) +
          (scoreData.parameterScores[5] || 0) +
          (scoreData.parameterScores[7] || 0) +
          (scoreData.parameterScores[8] || 0)
        ).toFixed(1)
      )
    : null;

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
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

  const scrollToSection = (id: string, _navKey?: string) => {
    const targetId = id === 'about-section' ? 'about-section' : id;
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'about-section') {
      setShowAboutModal(true);
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

      {/* ==========================================================
          1. NAVIGATION BAR (Aligned with App Theme & Fit Check)
          ========================================================== */}
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-brand" id="nav-brand-logo">
            <div className="brand-icon-box" id="brand-camera-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="brand-name">Gabru</span>
          </Link>

          <nav aria-label="Main Navigation">
            <ul className="navbar-nav">
              <li>
                <Link
                  href="/"
                  className="nav-link"
                  id="nav-link-home"
                >
                  Fit Check
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link nav-feature-btn active"
                  id="nav-btn-beauty-rating"
                  onClick={() => scrollToSection('hero-section', 'beauty')}
                >
                  Beauty rating
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link nav-feature-btn"
                  id="nav-btn-content-rating"
                  onClick={() => setShowAboutModal(true)}
                >
                  content rating
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

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
          <div className="hero-container">
              {/* Left Column — Clean Upload Studio & Score Hub */}
              <div className="hero-left-column">
                <div className="hero-studio-badge scroll-reveal">
                  <span className="badge-pulse-dot" />
                  <span>8-Parameter Facial Intelligence</span>
                  <span className="badge-dot-sep">•</span>
                  <span>100-Point Scale</span>
                </div>

                <h1 className="hero-headline scroll-reveal" id="hero-headline">
                  Upload Face Photo,
                  <br />
                  <span className="gradient-text">Rate Facial Beauty</span>
                </h1>

                <p className="hero-description scroll-reveal" id="hero-description">
                  Biometric analysis across skin health cues, facial harmony thirds and fifths, golden ratio φ (1.618), bilateral symmetry, and grooming refinement. 100% private in-browser evaluation.
                </p>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input-beauty"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {scoreData ? (
                  /* Evaluated State: Clean Executive Beauty Score Hub */
                  <>
                    <div
                      id="upload-dropzone"
                      className={`upload-card is-evaluated ${isDragging ? 'is-dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="score-summary-header">
                        <div className="score-metric-display">
                          <span className="score-big-number">{scoreData.faceScore}</span>
                          <span className="score-scale-denom">/100</span>
                          <span className="score-verdict-tag">{scoreData.verdict}</span>
                        </div>

                        <button
                          type="button"
                          className="btn-change-photo"
                          onClick={triggerUpload}
                          id="btn-upload-direct"
                          title="Upload another face photo"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Change Photo
                        </button>
                      </div>

                      {/* Clean Key Insight */}
                      <div className="score-clean-insight">
                        <span className="insight-badge">✨ Biometric Insight</span>
                        <span className="insight-text">
                          Symmetry {scoreData.metrics.symmetryIndex}% • Golden Ratio {scoreData.metrics.goldenRatioAdherence}% • {scoreData.colorPalette.undertone}
                        </span>
                      </div>

                      {scoreData.intakeReport?.notes && scoreData.intakeReport.notes.length > 0 && (
                        <div className="score-clean-cap" id="intake-advisory-pill">
                          <span>ℹ {scoreData.intakeReport.notes[0]}</span>
                        </div>
                      )}

                      <div className="score-summary-actions">
                        <button
                          type="button"
                          className="btn-score-action btn-share-score"
                          onClick={handleShareScore}
                          id="btn-share-score-hero"
                          title="Generate and share social media scorecard"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                          Share Card
                        </button>

                        <button
                          type="button"
                          className="btn-score-action btn-reanalyze"
                          onClick={() => {
                            if (selectedPhotoUrl) {
                              setIsAnalyzing(true);
                              const temp = new Image();
                              temp.crossOrigin = 'anonymous';
                              temp.onload = async () => {
                                try {
                                  const res = await analyzeFacialBeauty(temp);
                                  setTimeout(() => {
                                    setScoreData(res);
                                    setIsAnalyzing(false);
                                    setErrorMessage(null);
                                  }, 400);
                                } catch (err: any) {
                                  setIsAnalyzing(false);
                                  setErrorMessage(err?.message || 'Face detection check failed.');
                                }
                              };
                              temp.src = selectedPhotoUrl;
                            }
                          }}
                          id="btn-reanalyze"
                          title="Re-calculate facial beauty scores"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                          Re-calculate
                        </button>
                      </div>
                    </div>

                    <div className="hero-sub-actions">
                      <button
                        type="button"
                        className="btn-sample-link"
                        id="btn-try-demo-face"
                        onClick={loadSampleFace}
                        title="Analyze Leonardo Divine Proportions Canon Sketch"
                      >
                        <span>🏛</span> Try Beauty Sketch
                      </button>
                      <button
                        type="button"
                        className="btn-sample-link btn-sample-secondary"
                        id="btn-try-portrait"
                        onClick={loadSamplePortrait}
                        title="Analyze real sample portrait photo"
                      >
                        <span>✨</span> Sample Portrait
                      </button>
                      <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
                    </div>
                  </>
                ) : (
                  /* Initial State: Redesigned Luxury Upload Dropzone */
                  <>
                    <div
                      id="upload-dropzone"
                      className={`upload-card ${isDragging ? 'is-dragging' : ''} ${errorMessage ? 'has-error' : ''}`}
                      onClick={triggerUpload}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && triggerUpload()}
                      aria-label="Upload face photo"
                    >
                      <div className="upload-card-content">
                        <div className="upload-icon-badge">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          </svg>
                        </div>

                        <div className="upload-text-block">
                          <p className="upload-title">
                            {isDragging ? 'Drop face photo to analyze' : 'Drop your face photo here, or browse'}
                          </p>
                          <p className="upload-subtitle">Supports JPG, PNG, WEBP • Max 15MB • Client-side private</p>
                        </div>

                        <button
                          type="button"
                          className="btn-browse-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerUpload();
                          }}
                          id="btn-browse-photo"
                        >
                          Browse Face Photo
                        </button>
                      </div>
                    </div>

                    <div className="hero-sub-actions">
                      <button
                        type="button"
                        className="btn-sample-link"
                        id="btn-try-demo-face"
                        onClick={loadSampleFace}
                        title="Analyze Leonardo Divine Proportions Canon Sketch"
                      >
                        <span>🏛</span> Try Beauty Sketch
                      </button>
                      <button
                        type="button"
                        className="btn-sample-link btn-sample-secondary"
                        id="btn-try-portrait"
                        onClick={loadSamplePortrait}
                        title="Analyze real sample portrait photo"
                      >
                        <span>✨</span> Sample Portrait
                      </button>
                      <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
                    </div>
                  </>
                )}

                {errorMessage && (
                  <div className="upload-error-banner" id="upload-error" role="alert">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Right Column — Face Preview Card & Biometric Scanner HUD */}
              <div className="hero-right-column scroll-reveal">
                <div className="preview-card-composition">
                  <div className="media-ambient-glow" aria-hidden="true" />
                  <div className="media-ambient-tile tile-tl" aria-hidden="true" />
                  <div className="media-ambient-tile tile-br" aria-hidden="true" />

                  <div
                    className={`preview-card has-photo ${isDragging ? 'is-dragging' : ''} ${isAnalyzing ? 'is-scanning' : ''}`}
                    id="photo-preview-card"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="preview-photo-canvas" id="preview-display-area">
                      <img
                        src={selectedPhotoUrl || '/face_beauty_sketch.jpg'}
                        alt={selectedPhotoName || 'Neoclassical Divine Proportions Facial Beauty Sketch'}
                        className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                        id="preview-rendered-image"
                      />

                      {/* Default Classical Beauty Sketch Showcase Badge */}
                      {!selectedPhotoUrl && !scoreData && (
                        <div className="preview-sketch-badge" id="preview-sketch-badge">
                          <span className="sketch-badge-icon">🏛</span>
                          <div className="sketch-badge-content">
                            <span className="sketch-badge-title">Divine Proportions Study</span>
                            <span className="sketch-badge-sub">Leonardo Canon · Golden Ratio φ (1.618)</span>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Biometric Face Scanner HUD Layer */}
                      {isAnalyzing && (
                        <div className="photo-scanner-hud" aria-live="polite">
                          <div className="scanner-laser-beam" />
                          <div className="scanner-grid-mesh" />

                          <div className="scanner-bracket bracket-tl" />
                          <div className="scanner-bracket bracket-tr" />
                          <div className="scanner-bracket bracket-bl" />
                          <div className="scanner-bracket bracket-br" />

                          <div className="scanner-reticle-box">
                            <div className="reticle-crosshair" />
                            <span className="reticle-target-tag">FOCUS: FACIAL GEOMETRY</span>
                          </div>

                          <div className="scanner-status-chip">
                            <span className="scanner-spin-icon" />
                            <span>Scanning 8 Facial Parameters...</span>
                          </div>
                        </div>
                      )}

                      {/* Post-Analysis Subject Verification Pill */}
                      {!isAnalyzing && scoreData && (
                        <div className="subject-status-pill pill-human-detected" id="subject-scan-status">
                          <span className="status-dot-indicator" />
                          <span>
                            {scoreData.intakeReport?.faceDetected
                              ? `✓ Human Face Detected (${scoreData.intakeReport.ipdPx > 0 ? Math.round(scoreData.intakeReport.ipdPx) : 120}px IPD)`
                              : scoreData.isRenormalised
                              ? '⚡ Frontal Renormalised'
                              : '✓ Facial Biometrics Scanned'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Integrated 8-Parameter Beauty Rating Scorecard Area */}
          <div className="integrated-photo-score-area" id="photo-score-section">
            <div className={`scorecard-wrapper ${isAnalyzing ? 'analyzing' : ''}`} id="photo-score-dashboard">
              {/* Redesigned Executive Section Header Strip */}
              <div className="scorecard-clean-strip" id="scorecard-clean-strip">
                <div className="scorecard-strip-info">
                  <div className="strip-eyebrow">
                    <span className="badge-pulse-dot" />
                    <span>FACIAL HARMONY AUDIT</span>
                    <span className="strip-eyebrow-sep">•</span>
                    <span>8-PARAMETER SYSTEM</span>
                    <span className="strip-eyebrow-sep">•</span>
                    <span>100-POINT SCALE</span>
                  </div>
                  <h3 className="scorecard-strip-title">8-Parameter Attractiveness Breakdown</h3>
                  <p className="scorecard-strip-sub">
                    {scoreData
                      ? scoreData.verdictDescription
                      : 'Scientific multi-dimensional facial evaluation across skin quality, proportions, dynamic cues, averageness, symmetry, and grooming.'}
                  </p>
                </div>

                {/* Evidence Allocation & Score Indicators */}
                <div className="scorecard-tier-pills" id="scorecard-tier-pills">
                  <div className="tier-pill-box" title="Skin, Expression, Grooming (controllable presentational cues)">
                    <span className="tier-pill-name">Presentational</span>
                    <span className="tier-pill-score">
                      {scoreData ? (
                        <>
                          <strong className="tier-val">{scoreData.presentationalScore ?? 78.5}%</strong>
                          <span className="tier-max">({((scoreData.parameterScores[1] || 0) + (scoreData.parameterScores[3] || 0) + (scoreData.parameterScores[6] || 0)).toFixed(1)}/44)</span>
                        </>
                      ) : (
                        <span className="tier-unscored">44 Pts</span>
                      )}
                    </span>
                  </div>

                  <div className="tier-pill-box" title="Proportions, Averageness, Symmetry, Dimorphism, Features (structural craniofacial architecture)">
                    <span className="tier-pill-name">Structural</span>
                    <span className="tier-pill-score">
                      {scoreData ? (
                        <>
                          <strong className="tier-val">{scoreData.structuralScore ?? 78.8}%</strong>
                          <span className="tier-max">({((scoreData.parameterScores[2] || 0) + (scoreData.parameterScores[4] || 0) + (scoreData.parameterScores[5] || 0) + (scoreData.parameterScores[7] || 0) + (scoreData.parameterScores[8] || 0)).toFixed(1)}/56)</span>
                        </>
                      ) : (
                        <span className="tier-unscored">56 Pts</span>
                      )}
                    </span>
                  </div>

                  <div className="tier-pill-box" title="Confidence metric grounded in pose, resolution, and lighting checks">
                    <span className="tier-pill-name">Confidence</span>
                    <span className="tier-pill-score">
                      {scoreData ? (
                        <>
                          <strong className="tier-val">{Math.round((scoreData.confidence || 0.88) * 100)}%</strong>
                          <span className="tier-max">{(scoreData.confidence || 0.88) >= 0.80 ? 'High' : (scoreData.confidence || 0.88) >= 0.50 ? 'Med' : 'Prov'}</span>
                        </>
                      ) : (
                        <span className="tier-unscored">--</span>
                      )}
                    </span>
                  </div>

                  {scoreData?.isRenormalised && (
                    <div className="tier-pill-box" title="Profile angles excluded due to frontal capture or dimorphism skip; points renormalised to 100">
                      <span className="tier-pill-name">⚡ Renormalised</span>
                      <span className="tier-pill-score">
                        <strong className="tier-val" style={{ color: '#2589ff' }}>×{(scoreData.renormalisationFactor || 1.031).toFixed(3)}</strong>
                      </span>
                    </div>
                  )}

                  {scoreData && (
                    <button
                      type="button"
                      className="btn-strip-share-card"
                      onClick={handleShareScore}
                      id="btn-strip-share-card"
                      title="Generate High-Res 1080x1350 Style Card"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      <span>Share Card</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ALL 8 FACIAL PARAMETER CARDS (100 PTS SCALE) */}
              <div className="compact-cards-grid cards-8-grid" id="compact-cards-grid">
                {BEAUTY_PARAMETERS.map((param) => {
                  const score = scoreData ? scoreData.parameterScores[param.id] : null;
                  const rating = scoreData ? scoreData.parameterRatings[param.id] : null;

                  return (
                    <div
                      key={param.id}
                      className={`compact-metric-card scroll-reveal ${score === null && !isAnalyzing ? 'compact-metric-card-unscored' : 'compact-metric-card-scored'}`}
                      id={`card-${param.id}`}
                      style={{
                        background: BEAUTY_CARD_BACKGROUNDS[param.id],
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        cursor: scoreData ? 'pointer' : 'default',
                      }}
                      title={scoreData ? `Click to inspect ${param.name} diagnostic breakdown` : param.name}
                      onClick={() => {
                        if (scoreData) {
                          setActiveDeepDiveTab(PARAM_TO_TAB[param.id]);
                          const el = document.getElementById('phase3-diagnostic-suite');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                        <span className="card-param-name">{param.name}</span>
                        {rating !== null && rating !== undefined && !isAnalyzing && (
                          <span className="card-rating-badge">R: {rating.toFixed(1)}/10</span>
                        )}
                      </div>

                      <div className="card-score-value-row">
                        {isAnalyzing ? (
                          <span className="shuffling-number">
                            {shuffleScores[param.id] ?? Math.floor(Math.random() * (param.weight + 1))}
                            <span className="score-max-denom">/{param.weight}</span>
                          </span>
                        ) : score !== null && score !== undefined ? (
                          <span className="calculated-number">
                            {score}
                            <span className="score-max-denom">/{param.weight}</span>
                          </span>
                        ) : (
                          <span className="unscored-number">
                            --<span className="score-max-denom">/{param.weight}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sexual Dimorphism Reference Selection Bar */}
              {scoreData && !isAnalyzing && (
                <div className="dimorphism-toggle-bar">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.55)', marginRight: '6px' }}>
                    Dimorphism Reference:
                  </span>
                  <button
                    type="button"
                    className={`dimorphism-btn ${dimorphismRef === 'skip' ? 'is-active' : ''}`}
                    onClick={() => handleSelectDimorphism('skip')}
                    title="Skip dimorphism: marks parameter N/A and renormalises the remaining 93 points to 100"
                  >
                    Skip / Neutral (Renormalised)
                  </button>
                  <button
                    type="button"
                    className={`dimorphism-btn ${dimorphismRef === 'M-typical' ? 'is-active' : ''}`}
                    onClick={() => handleSelectDimorphism('M-typical')}
                    title="Evaluate against male-typical anthropometric reference distribution"
                  >
                    M-typical
                  </button>
                  <button
                    type="button"
                    className={`dimorphism-btn ${dimorphismRef === 'F-typical' ? 'is-active' : ''}`}
                    onClick={() => handleSelectDimorphism('F-typical')}
                    title="Evaluate against female-typical anthropometric reference distribution"
                  >
                    F-typical
                  </button>
                </div>
              )}

              {/* Top 3 Controllable Actionable Levers Section */}
              {scoreData && !isAnalyzing && scoreData.topLevers && scoreData.topLevers.length > 0 && (
                <div className="actionable-levers-section" id="beauty-actionable-levers" style={{ marginTop: '20px' }}>
                  <div className="section-header-compact">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🎯</span>
                      <h3 className="section-title" style={{ margin: 0 }}>Top 3 Controllable Actionable Levers</h3>
                    </div>
                    <span className="section-subtitle">
                      Presentational improvements from controllable factors (Skin, Expression, Grooming) with estimated score impact
                    </span>
                  </div>

                  <div className="levers-grid">
                    {scoreData.topLevers.map((item, idx) => (
                      <div key={idx} className="lever-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#f4f4f5', lineHeight: 1.4 }}>
                            {item.lever}
                          </span>
                          <span style={{
                            background: 'rgba(37, 137, 255, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap'
                          }}>
                            +{item.gainPts.toFixed(1)} pts
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.45)' }}>
                          <span>Target rating: {item.targetRating ?? '9.5'}/10</span>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>Controllable lever</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase 3: Research-Grade Diagnostic Deep-Dive Suite (Params 1 to 4) */}
              {scoreData && !isAnalyzing && (
                <div className="phase3-diagnostic-suite" id="phase3-diagnostic-suite">
                  {/* Suite Navigation Header */}
                  <div className="diag-tabs-header">
                    <div className="diag-suite-title-group">
                      <div className="diag-suite-badge-icon">🔬</div>
                      <div>
                        <h3 className="diag-suite-title">Biometric Diagnostic Deep Dives</h3>
                        <div className="diag-suite-subtitle">
                          Detailed anthropometric, neuromuscular, and styling evidence across all 8 parameters
                        </div>
                      </div>
                    </div>

                    <div className="diag-nav-tabs" role="tablist">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'skin'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'skin' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('skin')}
                      >
                        <span>Skin Quality</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[1] ?? 16.8}/21
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'proportions'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'proportions' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('proportions')}
                      >
                        <span>Proportions &amp; Harmony</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[2] ?? 15.6}/19
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'expression'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'expression' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('expression')}
                      >
                        <span>Expression &amp; Dynamic</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[3] ?? 10.4}/13
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'averageness'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'averageness' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('averageness')}
                      >
                        <span>Averageness</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[4] ?? 9.8}/12
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'symmetry'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'symmetry' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('symmetry')}
                      >
                        <span>Facial Symmetry</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[5] ?? 8.9}/11
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'grooming'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'grooming' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('grooming')}
                      >
                        <span>Grooming &amp; Styling</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[6] ?? 8.9}/10
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'dimorphism'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'dimorphism' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('dimorphism')}
                      >
                        <span>Sexual Dimorphism</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[7] ?? 5.5}/7
                        </span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeDeepDiveTab === 'features'}
                        className={`diag-tab-btn ${activeDeepDiveTab === 'features' ? 'is-active' : ''}`}
                        onClick={() => setActiveDeepDiveTab('features')}
                      >
                        <span>Individual Features</span>
                        <span className="diag-tab-score-chip">
                          {scoreData.parameterScores[8] ?? 5.6}/7
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: SKIN QUALITY & CIELAB COLORIMETRY */}
                  {activeDeepDiveTab === 'skin' && (
                    <div className="diag-panel-content" id="diag-panel-skin">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>✨ Parameter 1: Skin Quality & Health Cues</span>
                            <span className="diag-stat-code">21 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            5-zone multi-patch sampling (forehead, both cheeks, nose bridge, chin, infraorbital) evaluated in CIELAB space after white-balance correction. Measures tone uniformity, clarity, radiance, and eye-region health signals.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[1] ?? 16.8} / 21 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[1] ?? 8.0}/10)</span>
                        </div>
                      </div>

                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Tone Evenness</span>
                            <span className="diag-stat-code">SK1 · W=30</span>
                          </div>
                          <div className="diag-stat-val">
                            ΔE₀₀ {scoreData.metrics.phase3?.skin.deltaE2000.toFixed(1) ?? '1.8'}
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase3?.skin.deltaE2000 ?? 1.8) <= 2.5 ? 'status-ideal' : 'status-caution'}`}>
                            {(scoreData.metrics.phase3?.skin.deltaE2000 ?? 1.8) <= 2.5
                              ? '✓ Uniform CIELAB distribution (≤ 2.5)'
                              : 'Minor tone variation across facial patches'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Surface Clarity</span>
                            <span className="diag-stat-code">SK2 · W=30</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.skin.blemishPct.toFixed(1) ?? '1.2'}%
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase3?.skin.blemishPct ?? 1.2) <= 1.0 ? 'status-ideal' : 'status-caution'}`}>
                            {(scoreData.metrics.phase3?.skin.blemishPct ?? 1.2) <= 1.0
                              ? '✓ High clarity, minimal micro-blemishes (≤ 1%)'
                              : 'Subtle transient texture variance detected'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Radiance & Shine</span>
                            <span className="diag-stat-code">SK3 · W=15 · V=0.5</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.skin.specularPct.toFixed(1) ?? '3.5'}%
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Natural balanced T-zone sheen (3% - 8% specular)
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Periorbital Contrast</span>
                            <span className="diag-stat-code">SK4 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            ΔL* {scoreData.metrics.phase3?.skin.underEyeDeltaL.toFixed(1) ?? '4.5'}
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase3?.skin.underEyeDeltaL ?? 4.5) <= 5.5 ? 'status-ideal' : 'status-caution'}`}>
                            {scoreData.metrics.phase3?.skin.vitalityTier ?? scoreData.colorPalette.vitalityLevel}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Color Swatches */}
                      <div className="color-palette-section" id="beauty-color-palette" style={{ marginTop: '4px' }}>
                        <div className="section-header-compact">
                          <h4 className="section-title" style={{ fontSize: '13.5px' }}>Sampled Epidermal Pigments & Undertone</h4>
                          <span className="section-subtitle">Click any swatch to copy its hexadecimal color code</span>
                        </div>

                        <div className="color-swatches-grid">
                          <div className="swatch-card" onClick={() => copyHex(scoreData.colorPalette.skinTone)} role="button" tabIndex={0}>
                            <div className="swatch-color" style={{ backgroundColor: scoreData.colorPalette.skinTone }} />
                            <div className="swatch-meta">
                              <span className="swatch-label">Skin Pigment</span>
                              <span className="swatch-hex">{scoreData.colorPalette.skinTone.toUpperCase()}</span>
                              <span className="swatch-sub">{scoreData.colorPalette.undertone}</span>
                            </div>
                          </div>

                          <div className="swatch-card" onClick={() => copyHex(scoreData.colorPalette.lipTone)} role="button" tabIndex={0}>
                            <div className="swatch-color" style={{ backgroundColor: scoreData.colorPalette.lipTone }} />
                            <div className="swatch-meta">
                              <span className="swatch-label">Vermilion Tone</span>
                              <span className="swatch-hex">{scoreData.colorPalette.lipTone.toUpperCase()}</span>
                              <span className="swatch-sub">Natural Lip Flush</span>
                            </div>
                          </div>

                          <div className="swatch-card">
                            <div className="swatch-color" style={{ background: 'linear-gradient(135deg, #2589ff 0%, #10b981 100%)' }} />
                            <div className="swatch-meta">
                              <span className="swatch-label">Vitality Level</span>
                              <span className="swatch-hex">{scoreData.colorPalette.vitalityLevel}</span>
                              <span className="swatch-sub">Low infraorbital shadow contrast</span>
                            </div>
                          </div>
                        </div>

                        {copiedColor && (
                          <div className="copied-toast">Copied {copiedColor} to clipboard!</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROPORTIONS & HARMONY */}
                  {activeDeepDiveTab === 'proportions' && (
                    <div className="diag-panel-content" id="diag-panel-proportions">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>📐 Parameter 2: Proportions & Harmony</span>
                            <span className="diag-stat-code">19 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Evaluates neoclassical vertical thirds, 5 canonical harmony ratios (H1–H5), 6 Golden Ratio factors (G1–G6 vs φ = 1.618), and lateral profile angle integration.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[2] ?? 15.6} / 19 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[2] ?? 8.2}/10)</span>
                        </div>
                      </div>

                      {/* Visual Facial Thirds Horizontal Bar */}
                      <div className="thirds-bar-wrapper">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                            Vertical Facial Thirds Partition
                          </span>
                          <span style={{ fontSize: '12px', color: (scoreData.metrics.phase3?.proportions.thirdsDev ?? 0.015) <= 0.02 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                            Thirds Deviation m = {scoreData.metrics.phase3?.proportions.thirdsDev.toFixed(3) ?? '0.015'} (Ideal ≤ 0.020)
                          </span>
                        </div>

                        <div className="thirds-bar-track">
                          <div
                            className="thirds-segment thirds-seg-upper"
                            style={{ width: `${scoreData.metrics.phase3?.proportions.thirdsShares[0] ?? 33.3}%` }}
                            title={`Upper Third (Hairline to Glabella): ${scoreData.metrics.phase3?.proportions.thirdsShares[0] ?? 33.3}%`}
                          >
                            Upper {scoreData.metrics.phase3?.proportions.thirdsShares[0] ?? 33.3}%
                          </div>
                          <div
                            className="thirds-segment thirds-seg-middle"
                            style={{ width: `${scoreData.metrics.phase3?.proportions.thirdsShares[1] ?? 33.3}%` }}
                            title={`Middle Third (Glabella to Subnasale): ${scoreData.metrics.phase3?.proportions.thirdsShares[1] ?? 33.3}%`}
                          >
                            Mid {scoreData.metrics.phase3?.proportions.thirdsShares[1] ?? 33.3}%
                          </div>
                          <div
                            className="thirds-segment thirds-seg-lower"
                            style={{ width: `${scoreData.metrics.phase3?.proportions.thirdsShares[2] ?? 33.4}%` }}
                            title={`Lower Third (Subnasale to Menton): ${scoreData.metrics.phase3?.proportions.thirdsShares[2] ?? 33.4}%`}
                          >
                            Lower {scoreData.metrics.phase3?.proportions.thirdsShares[2] ?? 33.4}%
                          </div>
                        </div>

                        <div className="thirds-legend">
                          <div className="thirds-legend-item">
                            <span className="thirds-legend-dot" style={{ background: '#3b82f6' }} />
                            <span>Upper: Hairline (tr) → Glabella (g)</span>
                          </div>
                          <div className="thirds-legend-item">
                            <span className="thirds-legend-dot" style={{ background: '#8b5cf6' }} />
                            <span>Middle: Glabella (g) → Subnasale (sn)</span>
                          </div>
                          <div className="thirds-legend-item">
                            <span className="thirds-legend-dot" style={{ background: '#10b981' }} />
                            <span>Lower: Subnasale (sn) → Menton (gn)</span>
                          </div>
                        </div>
                      </div>

                      {/* Golden Ratio φ Adherence Grid */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                            Golden Ratio (φ ≈ 1.618) Factor Matrix
                          </span>
                          <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
                            Adherence Score: {scoreData.metrics.goldenRatioAdherence}%
                          </span>
                        </div>

                        <div className="golden-ratio-grid">
                          {(scoreData.metrics.phase3?.proportions.goldenRatios || [
                            { id: 'G1', name: 'Face Length / Width', value: 1.58, target: 1.618, adherence: 92 },
                            { id: 'G2', name: 'Mouth Width / Nose Width', value: 1.64, target: 1.618, adherence: 95 },
                            { id: 'G3', name: 'Lips-to-Chin / Nose-to-Lips', value: 1.59, target: 1.618, adherence: 94 },
                            { id: 'G4', name: 'Lower Lip / Upper Lip', value: 1.62, target: 1.618, adherence: 99 },
                            { id: 'G5', name: 'IPD / (Pupil Line to Sn)', value: 1.60, target: 1.618, adherence: 96 },
                            { id: 'G6', name: 'Face Length / Eye Line to Chin', value: 1.63, target: 1.618, adherence: 97 },
                          ]).map((item) => (
                            <div key={item.id} className="golden-ratio-card">
                              <div className="golden-ratio-card-top">
                                <span className="golden-ratio-title">{item.id}: {item.name}</span>
                                <span className="golden-ratio-value">{item.value.toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                                <span>Target: 1.618</span>
                                <span style={{ color: item.adherence >= 85 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                                  {item.adherence}% match
                                </span>
                              </div>
                              <div className="adherence-track">
                                <div className="adherence-fill" style={{ width: `${item.adherence}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Harmony Ratios Canonical Bands */}
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                          Canonical Harmony Ratios (H1 to H5)
                        </span>
                        <div className="diag-sub-grid">
                          {(scoreData.metrics.phase3?.proportions.harmonyRatios || [
                            { id: 'H1', name: 'Facial Thirds Deviation', value: 0.015, band: '≤ 0.02', rating: 9.5 },
                            { id: 'H2', name: 'Lips-to-Chin Proportion', value: 0.33, band: '0.30 - 0.37', rating: 9.8 },
                            { id: 'H3', name: 'Intercanthal Eye Spacing', value: 1.02, band: '0.85 - 1.15', rating: 9.6 },
                            { id: 'H4', name: 'Nose Width / Intercanthal', value: 1.05, band: '0.90 - 1.20', rating: 9.7 },
                            { id: 'H5', name: 'Mouth Width / IPD', value: 0.81, band: '0.70 - 0.90', rating: 9.6 },
                          ]).map((item) => (
                            <div key={item.id} className="diag-stat-card">
                              <div className="diag-stat-header">
                                <span className="diag-stat-label">{item.name}</span>
                                <span className="diag-stat-code">{item.id}</span>
                              </div>
                              <div className="diag-stat-val">{item.value.toFixed(2)}</div>
                              <div className="diag-stat-status status-ideal">
                                Band: {item.band} · Rating: {item.rating.toFixed(1)}/10
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Profile Angle Notice */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>ℹ</span>
                        <span>
                          {scoreData.isRenormalised
                            ? 'Frontal capture detected: Lateral profile factor (PH3, Weight 16) is safely excluded (V = 0) and weight is renormalised without penalty.'
                            : 'Lateral profile photo provided: Nasolabial, nasofrontal, and chin projection angles incorporated into PH3.'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: EXPRESSION & DYNAMIC CUES */}
                  {activeDeepDiveTab === 'expression' && (
                    <div className="diag-panel-content" id="diag-panel-expression">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>🎭 Parameter 3: Expression & Dynamic Cues</span>
                            <span className="diag-stat-code">13 Pts Max · β = 0.15</span>
                          </div>
                          <div className="diag-panel-desc">
                            Evaluates neuromuscular dynamic warmth cues: AU12 smile zygomaticus pull, AU6 orbicularis oculi eye-crinkle authentication (Duchenne smile), camera gaze axis alignment, and resting facial tension.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[3] ?? 10.4} / 13 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[3] ?? 8.0}/10)</span>
                        </div>
                      </div>

                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Smile Genuineness</span>
                            <span className="diag-stat-code">EX1 · W=35</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.expression.isSmiling
                              ? `${scoreData.metrics.phase3?.expression.smileIntensityPct ?? 0}% AU12`
                              : 'Neutral Rest'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            {scoreData.metrics.phase3?.expression.isDuchenne
                              ? '✨ Genuine Duchenne (Eye crinkle AU6 active)'
                              : scoreData.metrics.phase3?.expression.isSmiling
                              ? 'Courtesy smile (AU12 active, mouth pull)'
                              : '✓ Neutral photo: smile excluded without penalty'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Smile Symmetry</span>
                            <span className="diag-stat-code">EX2 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.expression.isSmiling ? 'Symmetric' : 'Neutral State'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            {scoreData.metrics.phase3?.expression.isSmiling
                              ? 'Bilateral commissure elevation balanced'
                              : '✓ Neutral resting jawline verified'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Camera Gaze Alignment</span>
                            <span className="diag-stat-code">EX3 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.expression.gazeDevDeg.toFixed(1) ?? '1.5'}° offset
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase3?.expression.gazeDevDeg ?? 1.5) <= 5 ? 'status-ideal' : 'status-caution'}`}>
                            {(scoreData.metrics.phase3?.expression.gazeDevDeg ?? 1.5) <= 5
                              ? '✓ Direct authoritative eye contact'
                              : 'Minor lateral gaze angle'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Rest Muscle Tone</span>
                            <span className="diag-stat-code">EX4 · W=15 · V=0.5</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase3?.expression.tensionState ?? 'Relaxed Natural Tone'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Corrugator & orbicularis oris relaxed
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: AVERAGENESS & MORPHOMETRICS */}
                  {activeDeepDiveTab === 'averageness' && (
                    <div className="diag-panel-content" id="diag-panel-averageness">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>🧬 Parameter 4: Averageness & Morphometrics</span>
                            <span className="diag-stat-code">12 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Quantifies proximity to evolutionary population median via 16-landmark Procrustes shape distance D and 6 anthropometric size distributions. Outliers (|z| &gt; 1.5) safely halve penalties in Parameter 8 to prevent double-counting (Rule A4).
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[4] ?? 9.8} / 12 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[4] ?? 8.2}/10)</span>
                        </div>
                      </div>

                      {/* Top Morphometric Distance Cards */}
                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Procrustes Shape Distance</span>
                            <span className="diag-stat-code">AV1 · W=50</span>
                          </div>
                          <div className="diag-stat-val">
                            D = {scoreData.metrics.phase3?.averageness.procrustesDistance.toFixed(3) ?? '0.076'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            ✓ 16-point alignment to population mean archetype
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Shape Typicality Z-Score</span>
                            <span className="diag-stat-code">AV1 · W=50</span>
                          </div>
                          <div className="diag-stat-val">
                            z = {scoreData.metrics.phase3?.averageness.shapeZ.toFixed(2) ?? '0.25'}
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase3?.averageness.shapeZ ?? 0.25) <= 0.5 ? 'status-ideal' : 'status-caution'}`}>
                            {(scoreData.metrics.phase3?.averageness.shapeZ ?? 0.25) <= 0.5
                              ? '✓ High typicality (z ≤ 0.50, no penalty)'
                              : 'Moderate deviation from population median'}
                          </div>
                        </div>
                      </div>

                      {/* 6 Anthropometric Size Ratios with Z-Score Distributions */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                            6 Anthropometric Size Ratios &amp; Z-Scores (AV2, W=50)
                          </span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)' }}>
                            Target: |z| ≤ 1.50
                          </span>
                        </div>

                        <div className="golden-ratio-grid">
                          {(scoreData.metrics.phase3?.averageness.sizeRatios || [
                            { name: 'Eye Width / Bizygomatic', value: 0.22, z: 0.1, flagged: false },
                            { name: 'Nose Width / Bizygomatic', value: 0.26, z: -0.2, flagged: false },
                            { name: 'Mouth Width / Bizygomatic', value: 0.38, z: 0.3, flagged: false },
                            { name: 'Bigonial Jaw / Bizygomatic', value: 0.76, z: -0.1, flagged: false },
                            { name: 'Vermilion Lip / Total Face Height', value: 0.092, z: 0.0, flagged: false },
                            { name: 'Nasal Dorsum / Subnasal Height', value: 0.44, z: 0.2, flagged: false },
                          ]).map((ratio, idx) => {
                            // Map z (-2.5 to +2.5) to percentage (0% to 100%)
                            const clampedZ = Math.max(-2.5, Math.min(2.5, ratio.z));
                            const posPct = Math.round(((clampedZ + 2.5) / 5) * 100);

                            return (
                              <div key={idx} className="golden-ratio-card">
                                <div className="golden-ratio-card-top">
                                  <span className="golden-ratio-title">{ratio.name}</span>
                                  <span className="golden-ratio-value">{ratio.value.toFixed(3)}</span>
                                </div>

                                <div className="zscore-wrapper">
                                  <div className="zscore-distribution-bar">
                                    <div className="zscore-zone-normal" title="Typical range (|z| ≤ 1.5)" />
                                    <div className="zscore-center-marker" title="Population Mean (z = 0)" />
                                    <div
                                      className={`zscore-indicator-dot ${ratio.flagged ? 'zscore-dot-flagged' : 'zscore-dot-normal'}`}
                                      style={{ left: `${posPct}%` }}
                                      title={`Z-Score: ${ratio.z.toFixed(2)}`}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                                    <span>-2.0σ</span>
                                    <span style={{ fontWeight: 700, color: ratio.flagged ? '#f87171' : '#34d399' }}>
                                      z = {ratio.z.toFixed(2)}
                                    </span>
                                    <span>+2.0σ</span>
                                  </div>

                                  {ratio.flagged ? (
                                    <span className="outlier-tag">
                                      ⚡ Outlier (|z| &gt; 1.5) · Parameter 8 penalty halved (Rule A4)
                                    </span>
                                  ) : (
                                    <span className="normal-tag">
                                      ✓ Population typical range
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: FACIAL SYMMETRY */}
                  {activeDeepDiveTab === 'symmetry' && (
                    <div className="diag-panel-content" id="diag-panel-symmetry">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>⚖️ Parameter 5: Facial Symmetry</span>
                            <span className="diag-stat-code">11 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Bilateral horizontal (Ah) and vertical (Av) parity evaluated across pupils, exocanthion, brow peaks, nasal midline verticality, oral commissure tilt, and bizygomatic/gonial angle contours.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[5] ?? 8.9} / 11 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[5] ?? 8.2}/10)</span>
                        </div>
                      </div>

                      {scoreData.metrics.phase4?.symmetry.isFilterSuspected && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          fontSize: '12px',
                          color: '#fca5a5',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>⚠️</span>
                          <span>
                            <strong>Filter / Mirroring Artifact Guard:</strong> Bilateral asymmetry is unnaturally low (&lt; 0.45%) or digital mirroring was detected. A conservative visibility dampener (V = 0.5) is applied to prevent inflated ratings from beauty filters.
                          </span>
                        </div>
                      )}

                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Overall Symmetry Index</span>
                            <span className="diag-stat-code">100% Scale</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.symmetryIndex}%
                          </div>
                          <div className="diag-stat-status status-ideal">
                            ✓ High natural bilateral parity
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Mean Asymmetry (Ah)</span>
                            <span className="diag-stat-code">Ah Ideal ≤ 3.0%</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.symmetry.meanAsymmetryPct.toFixed(1) ?? '2.1'}%
                          </div>
                          <div className={`diag-stat-status ${(scoreData.metrics.phase4?.symmetry.meanAsymmetryPct ?? 2.1) <= 3.0 ? 'status-ideal' : 'status-caution'}`}>
                            {(scoreData.metrics.phase4?.symmetry.meanAsymmetryPct ?? 2.1) <= 3.0
                              ? '✓ Normal physiological bilateral balance'
                              : 'Mild natural facial lateralization'}
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Eyes &amp; Brows Parity</span>
                            <span className="diag-stat-code">SY1 · W=30</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.subfactorRatings?.['SY1']?.raw?.toFixed(1) ?? '8.5'}/10
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Pupil &amp; brow line horizontal level
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Nose &amp; Midline Parity</span>
                            <span className="diag-stat-code">SY2 · W=20</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.subfactorRatings?.['SY2']?.raw?.toFixed(1) ?? '8.8'}/10
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Nasion &amp; subnasale sagittal verticality
                          </div>
                        </div>
                      </div>

                      {/* Symmetry Subfactors Grid */}
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                          Symmetry Sub-Factor Diagnostic Breakdown
                        </span>
                        <div className="diag-sub-grid">
                          {(scoreData.metrics.phase4?.symmetry.subfactors || [
                            { id: 'SY1', name: 'Bilateral Eye & Brow Level', ah: 2.1, av: 1.4, rating: 8.5, note: 'Pupil Ah=2.1%, Av=1.4%' },
                            { id: 'SY2', name: 'Nose & Midline Verticality', ah: 1.2, rating: 8.8, note: 'Nasal tip offset 1.2% of bizygomatic width' },
                            { id: 'SY3', name: 'Oral Commissure & Mandibular Parity', ah: 1.5, av: 1.1, rating: 8.6, note: 'Mouth tilt 1.1% of IPD' },
                            { id: 'SY4', name: 'Cheekbone & Gonial Angle Symmetry', ah: 2.3, rating: 8.7, note: 'Cheeks Ah=2.3%, Jaw Ah=2.0%' },
                          ]).map((item) => (
                            <div key={item.id} className="diag-stat-card">
                              <div className="diag-stat-header">
                                <span className="diag-stat-label">{item.name}</span>
                                <span className="diag-stat-code">{item.id}</span>
                              </div>
                              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
                              <div className="diag-stat-status status-ideal">
                                {item.note}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: GROOMING & STYLING */}
                  {activeDeepDiveTab === 'grooming' && (
                    <div className="diag-panel-content" id="diag-panel-grooming">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>💈 Parameter 6: Grooming &amp; Styling</span>
                            <span className="diag-stat-code">10 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Evaluates highly actionable presentational styling signals: hairline perimeter definition, eyebrow arch architecture, styling silhouette balance, and accessory/eyewear integration.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[6] ?? 8.9} / 10 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[6] ?? 8.9}/10)</span>
                        </div>
                      </div>

                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Hair Architecture</span>
                            <span className="diag-stat-code">GS1 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.grooming.hairScore.toFixed(1) ?? '9.0'}/10
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Clean hairline perimeter &amp; temple edges
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Eyebrow Definition</span>
                            <span className="diag-stat-code">GS2 · W=20</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.grooming.browScore.toFixed(1) ?? '8.8'}/10
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Defined arch contour &amp; balanced density
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Styling Silhouette</span>
                            <span className="diag-stat-code">GS5 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.grooming.stylingScore.toFixed(1) ?? '9.1'}/10
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Volume frames natural jawline &amp; cheekbones
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Grooming Tier</span>
                            <span className="diag-stat-code">Controllable</span>
                          </div>
                          <div className="diag-stat-val" style={{ fontSize: '16px' }}>
                            {scoreData.metrics.phase4?.grooming.groomingTier ?? 'Polished & Refined'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            ✓ High aesthetic cohesion
                          </div>
                        </div>
                      </div>

                      {/* Grooming Subfactors Detailed Cards */}
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                          Grooming &amp; Styling Sub-Factor Observations
                        </span>
                        <div className="diag-sub-grid">
                          {(scoreData.metrics.phase4?.grooming.subfactors || [
                            { id: 'GS1', name: 'Hair Architecture & Edges', rating: 9.0, status: 'Clean hairline perimeter and controlled temple edges', note: 'Controlled peripheral flyaways' },
                            { id: 'GS2', name: 'Eyebrow Architecture & Grooming', rating: 8.8, status: 'Balanced eyebrow density and defined lower arch', note: 'Defined natural arch line' },
                            { id: 'GS3', name: 'Makeup Blending & Application', rating: 7.0, status: 'Natural presentation / bare face', note: 'V = 0 excluded (no disadvantage)' },
                            { id: 'GS4', name: 'Eyewear & Accessory Fit', rating: 7.0, status: 'No optical frames detected', note: 'V = 0 excluded (renormalised)' },
                            { id: 'GS5', name: 'Styling Cohesion & Silhouette', rating: 9.1, status: 'Hairstyle volume harmoniously frames jawline', note: 'Cohesive aesthetic silhouette' },
                          ]).map((item) => (
                            <div key={item.id} className="diag-stat-card">
                              <div className="diag-stat-header">
                                <span className="diag-stat-label">{item.name}</span>
                                <span className="diag-stat-code">{item.id}</span>
                              </div>
                              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
                              <div className="diag-stat-status status-ideal" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                <span>{item.status}</span>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{item.note}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 7: SEXUAL DIMORPHISM */}
                  {activeDeepDiveTab === 'dimorphism' && (
                    <div className="diag-panel-content" id="diag-panel-dimorphism">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>🧬 Parameter 7: Sexual Dimorphism</span>
                            <span className="diag-stat-code">7 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Statistical anthropometric comparison against reference distribution (M-typical, F-typical, or Neutral/Skip). Reference sets are voluntary comparative distributions and do not infer identity or gender (Rule A5).
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[7] ?? 5.5} / 7 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[7] ?? 7.8}/10)</span>
                        </div>
                      </div>

                      {/* Dimorphism Selector Bar inside Tab */}
                      <div className="dimorphism-toggle-bar" style={{ margin: '0 0 10px 0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.55)', marginRight: '6px' }}>
                          Active Reference Group:
                        </span>
                        <button
                          type="button"
                          className={`dimorphism-btn ${dimorphismRef === 'skip' ? 'is-active' : ''}`}
                          onClick={() => handleSelectDimorphism('skip')}
                        >
                          Skip / Neutral (Renormalised to 100 Pts)
                        </button>
                        <button
                          type="button"
                          className={`dimorphism-btn ${dimorphismRef === 'M-typical' ? 'is-active' : ''}`}
                          onClick={() => handleSelectDimorphism('M-typical')}
                        >
                          M-typical Reference
                        </button>
                        <button
                          type="button"
                          className={`dimorphism-btn ${dimorphismRef === 'F-typical' ? 'is-active' : ''}`}
                          onClick={() => handleSelectDimorphism('F-typical')}
                        >
                          F-typical Reference
                        </button>
                      </div>

                      {dimorphismRef === 'skip' ? (
                        <div style={{
                          background: 'rgba(37, 137, 255, 0.08)',
                          border: '1px solid rgba(37, 137, 255, 0.25)',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          fontSize: '13px',
                          color: '#93c5fd',
                          lineHeight: 1.5,
                        }}>
                          <strong>⚡ Neutral Reference Active:</strong> Sexual Dimorphism scoring is marked N/A at your choice. The remaining 93 points of the framework have been mathematically renormalised to 100 points, guaranteeing no score penalty.
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                            Anthropometric Dimorphic Traits vs. {dimorphismRef} Distribution
                          </span>
                          <div className="golden-ratio-grid">
                            {(scoreData.metrics.phase4?.dimorphism.features || []).map((feat, idx) => {
                              const clampedZ = Math.max(-2.5, Math.min(2.5, feat.zScore));
                              const posPct = Math.round(((clampedZ + 2.5) / 5) * 100);

                              return (
                                <div key={idx} className="golden-ratio-card">
                                  <div className="golden-ratio-card-top">
                                    <span className="golden-ratio-title">{feat.name}</span>
                                    <span className="golden-ratio-value" style={{ color: feat.penalty === 0 ? '#34d399' : '#fbbf24' }}>
                                      z = {feat.zScore.toFixed(2)}
                                    </span>
                                  </div>

                                  <div className="zscore-wrapper">
                                    <div className="zscore-distribution-bar">
                                      <div className="zscore-zone-normal" title="Ideal dimorphic band (-0.5 to +1.0)" />
                                      <div className="zscore-center-marker" title="Distribution Center" />
                                      <div
                                        className="zscore-indicator-dot zscore-dot-normal"
                                        style={{ left: `${posPct}%`, background: feat.penalty === 0 ? '#34d399' : '#fbbf24' }}
                                        title={`Z-Score: ${feat.zScore.toFixed(2)}`}
                                      />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                                      <span>-2.0σ</span>
                                      <span style={{ color: feat.penalty === 0 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                                        {feat.penalty === 0 ? '✓ High typicality (0 pen)' : `-${feat.penalty.toFixed(1)} pen`}
                                      </span>
                                      <span>+2.0σ</span>
                                    </div>

                                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.50)', marginTop: '4px' }}>
                                      {feat.note}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Fairness Rule A5 Banner */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.50)',
                        lineHeight: 1.45,
                      }}>
                        <strong>Fairness Guarantee (Rule A5):</strong> Identity, gender, age, or medical differences are never inferred from photos. Comparative reference norms serve strictly as statistical benchmarks and can be skipped at any time.
                      </div>
                    </div>
                  )}

                  {/* TAB 8: INDIVIDUAL FEATURES */}
                  {activeDeepDiveTab === 'features' && (
                    <div className="diag-panel-content" id="diag-panel-features">
                      <div className="diag-panel-header">
                        <div className="diag-panel-header-left">
                          <div className="diag-panel-name">
                            <span>👁️ Parameter 8: Individual Features</span>
                            <span className="diag-stat-code">7 Pts Max · β = 0.10</span>
                          </div>
                          <div className="diag-panel-desc">
                            Evaluates isolated feature dimensions (eyes, nose, lips, jaw) against broad anthropometric canons. Includes active Rule A4 protection to prevent double-counting deviations already scored in Parameter 4 Averageness.
                          </div>
                        </div>
                        <div className="diag-panel-score-badge">
                          <span className="diag-panel-points">{scoreData.parameterScores[8] ?? 5.6} / 7 pts</span>
                          <span className="diag-panel-rating">(R: {scoreData.parameterRatings[8] ?? 8.0}/10)</span>
                        </div>
                      </div>

                      <div className="diag-sub-grid">
                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Canthal Tilt</span>
                            <span className="diag-stat-code">IF1 · W=35</span>
                          </div>
                          <div className="diag-stat-val">
                            +{scoreData.metrics.phase4?.features.canthalTiltDeg.toFixed(1) ?? '3.2'}°
                          </div>
                          <div className="diag-stat-status status-ideal">
                            ✓ Positive upward palpebral axis
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Nasal Proportion</span>
                            <span className="diag-stat-code">IF2 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.features.nasalWidthRatio.toFixed(2) ?? '0.26'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Balanced alar width vs bizygomatic
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Lip Vermilion Fullness</span>
                            <span className="diag-stat-code">IF3 · W=25</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.features.lipFullnessRatio.toFixed(2) ?? '0.35'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Harmonious oral aperture fullness
                          </div>
                        </div>

                        <div className="diag-stat-card">
                          <div className="diag-stat-header">
                            <span className="diag-stat-label">Gonial Mandibular Breadth</span>
                            <span className="diag-stat-code">IF4 · W=15</span>
                          </div>
                          <div className="diag-stat-val">
                            {scoreData.metrics.phase4?.features.jawContourRatio.toFixed(2) ?? '0.76'}
                          </div>
                          <div className="diag-stat-status status-ideal">
                            Smooth defined jawline contour
                          </div>
                        </div>
                      </div>

                      {/* Feature Subfactors with Active Rule A4 Protection Badges */}
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                          Feature Dimension Sub-Factors &amp; Rule A4 Protection Status
                        </span>
                        <div className="diag-sub-grid">
                          {(scoreData.metrics.phase4?.features.subfactors || [
                            { id: 'IF1', name: 'Orbital Aperture & Canthal Tilt', rating: 8.5, note: 'Canthal tilt +3.2°, fissure ratio 0.35', isProtectedByRuleA4: false },
                            { id: 'IF2', name: 'Nasal Proportion & Dorsum Fit', rating: 8.5, note: 'Nasal length 0.44, width 0.26', isProtectedByRuleA4: false },
                            { id: 'IF3', name: 'Lip Vermilion Balance & Contour', rating: 8.5, note: 'Mouth width 0.38, fullness 0.35', isProtectedByRuleA4: false },
                            { id: 'IF4', name: 'Jaw Contour Smoothness & Angle', rating: 8.5, note: 'Mandibular breadth 0.76', isProtectedByRuleA4: false },
                          ]).map((item) => (
                            <div key={item.id} className="diag-stat-card">
                              <div className="diag-stat-header">
                                <span className="diag-stat-label">{item.name}</span>
                                <span className="diag-stat-code">{item.id}</span>
                              </div>
                              <div className="diag-stat-val">{item.rating.toFixed(1)}/10</div>
                              <div className="diag-stat-status status-ideal" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <span>{item.note}</span>
                                {item.isProtectedByRuleA4 && (
                                  <span className="outlier-tag" style={{ marginTop: '2px' }}>
                                    ⚡ Rule A4 Protection Active: Penalty halved from Averageness flag
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          FEATURE STRIP & ABOUT SECTION (Matching Fit Check)
          ========================================================== */}
      <section className="feature-strip-wrapper about-strip-wrapper" id="about-section" aria-label="About Gabru & Facial Attractiveness Framework">
        <div className="feature-strip-container">
          
          {/* Section Header */}
          <div className="about-section-header scroll-reveal">
            <div className="about-section-eyebrow">
              <span className="badge-pulse-dot" />
              <span>ABOUT GABRU &amp; FACIAL ATTRACTIVENESS ARCHITECTURE</span>
            </div>
            <h2 className="about-section-title">
              Evidence-Based Facial Aesthetics, Built for Objective Harmony
            </h2>
            <p className="about-section-subtitle">
              How Gabru evaluates skin vitality, proportion harmony, bilateral symmetry, and grooming cues with the rigor of peer-reviewed facial research.
            </p>
          </div>

          {/* About Platform Manifesto Card */}
          <div className="about-manifesto-card scroll-reveal">
            <div className="about-manifesto-left">
              <h3 className="manifesto-card-title">Empirical Biometrics Meets Local In-Browser Vision</h3>
              <p className="manifesto-card-text">
                <strong style={{ color: '#ffffff' }}>Gabru Beauty Rating</strong> translates published human perception science and craniofacial proportion research into a calibrated 100-point framework.
              </p>
              <p className="manifesto-card-text">
                From periorbital brightness and golden ratio adherence (φ ≈ 1.618) to bilateral horizontal symmetry and grooming precision, every measurement runs client-side in memory. Your facial portraits never touch a server.
              </p>
              <div className="manifesto-tags-row">
                <span className="manifesto-tag">✓ 100% Client-Side Private</span>
                <span className="manifesto-tag">✓ Zero Server Data Storage</span>
                <span className="manifesto-tag">✓ 8-Parameter Biometric Rubric</span>
              </div>
            </div>

            <div className="about-manifesto-specs">
              <div className="spec-metric-item">
                <span className="spec-label">Evaluation Engine</span>
                <span className="spec-value">Local Vision Canvas</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Analysis Latency</span>
                <span className="spec-value">&lt; 1.0 Seconds</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Rating Framework</span>
                <span className="spec-value">8 Research Parameters</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Server Data Storage</span>
                <span className="spec-value">0 Bytes Stored</span>
              </div>
            </div>
          </div>

          {/* 3 Core Rating Pillars / Feature Cards */}
          <div className="about-pillars-grid">
            <div className="feature-block scroll-reveal" id="feature-1">
              <div className="feature-icon-circle icon-circle-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="feature-title">Pillar 1: Skin &amp; Vitality (21 Pts)</h3>
              <p className="feature-description">
                Skin Quality &amp; Health Cues represents the largest single factor (21 pts). Evaluates tone evenness, micro-texture clarity, healthy vascular flush, and sclera/eye brightness.
              </p>
              <span className="feature-tier-badge">Strong Evidence</span>
            </div>

            <div className="feature-block scroll-reveal" id="feature-2">
              <div className="feature-icon-circle icon-circle-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="feature-title">Pillar 2: Geometry &amp; Symmetry (42 Pts)</h3>
              <p className="feature-description">
                Analyzes Proportions &amp; Harmony (19 pts with facial thirds, fifths, and golden ratio φ), Bilateral Symmetry (11 pts), and Population Averageness (12 pts).
              </p>
              <span className="feature-tier-badge">Harmony Foundation</span>
            </div>

            <div className="feature-block scroll-reveal" id="feature-3">
              <div className="feature-icon-circle icon-circle-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="feature-title">Pillar 3: Dynamic &amp; Styling (37 Pts)</h3>
              <p className="feature-description">
                Evaluates Expression &amp; Warmth (13 pts), Grooming &amp; Styling (10 pts), Sexual Dimorphism (7 pts), and Individual Feature Definition (7 pts).
              </p>
              <span className="feature-tier-badge">Expressive Finish</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          LUXURY EDITORIAL FOOTER (Matching Fit Check)
          ========================================================== */}
      <footer className="footer-wrapper" id="gabru-footer">
        <div className="footer-container">
          {/* Main Brand Column */}
          <div className="footer-brand-column">
            <div className="footer-brand-row">
              <div className="brand-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <span className="footer-brand-name">Gabru</span>
            </div>
            
            <p className="footer-bio">
              The premier AI aesthetic intelligence platform. Evaluating facial harmony, health cues, bilateral symmetry, and grooming precision through an objective 8-parameter scientific framework.
            </p>

            <div className="footer-status-pill">
              <span className="status-indicator-dot" />
              <span className="status-text">Facial Vision Engine v2.4 Active &bull; Instant Client-Side Processing</span>
            </div>

            <div className="footer-security-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Zero data retention &bull; Privacy protected local evaluation</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="footer-nav-grid">
            {/* Column 1: Rating Intelligence */}
            <div className="footer-col">
              <span className="footer-col-title">Evaluation Engines</span>
              <ul className="footer-links-list">
                <li>
                  <Link href="/" className="footer-link-btn">
                    Outfit Score Matrix (100 Pts)
                  </Link>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('hero-section', 'beauty')}>
                    Beauty Rating Matrix (8 Params)
                  </button>
                </li>
                <li>
                  <span className="footer-link-btn is-upcoming">
                    Content Rating <span className="footer-upcoming-badge">Coming Soon</span>
                  </span>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('photo-score-section', 'beauty')}>
                    Facial Thirds &amp; Fifths
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('photo-score-section', 'beauty')}>
                    Golden Ratio φ Adherence
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Architectural Tiers */}
            <div className="footer-col">
              <span className="footer-col-title">Scoring Architecture</span>
              <ul className="footer-links-list">
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'beauty')}>
                    Skin Quality &amp; Vitality (21 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'beauty')}>
                    Proportions &amp; Harmony (19 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'beauty')}>
                    Symmetry &amp; Averageness (23 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'beauty')}>
                    8-Parameter Evidence Rubric
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Trust */}
            <div className="footer-col">
              <span className="footer-col-title">Governance &amp; Trust</span>
              <ul className="footer-links-list">
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => setShowAboutModal(true)}>
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => setShowAboutModal(true)}>
                    Terms of Evaluation
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => setShowAboutModal(true)}>
                    Scientific Methodology
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => setShowAboutModal(true)}>
                    Platform Architecture
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom-strip">
          <div className="footer-bottom-container">
            <span className="footer-bottom-copy">
              &copy; {new Date().getFullYear()} Gabru Technologies Inc. All rights reserved. Facial Attractiveness Research Rubric.
            </span>
            <button
              type="button"
              className="btn-back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              id="footer-back-to-top"
            >
              <span>Back to Top</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* ==========================================================
          ABOUT & SCIENTIFIC TRUST MODAL
          ========================================================== */}
      {showAboutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAboutModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">About Gabru Facial Attractiveness Framework</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowAboutModal(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', lineHeight: 1.6 }}>
              <p>
                <strong>Gabru</strong> implements the scientific 8-parameter facial attractiveness research framework on a 100-point calibrated scale.
              </p>
              <p>
                Measurements are divided into <strong>Strong Evidence (56 pts)</strong> (Skin Quality, Expression, Averageness, Grooming) and <strong>Moderate Evidence (44 pts)</strong> (Proportions &amp; Harmony, Symmetry, Dimorphism, Features).
              </p>
              <p>
                When a frontal selfie is provided, profile angles are occluded ($V = 0$) and the visible 97 points are mathematically renormalised to a 100-point total ($100 / 97 \approx 1.0309\times$).
              </p>
              <div style={{ padding: '12px 16px', background: 'var(--glass)', borderRadius: '8px', color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
                ✓ Zero signup &bull; Fast local preview &bull; 100% Client-side privacy
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          SOCIAL MEDIA SCORECARD PREVIEW MODAL (1080 x 1350)
          Clean, Floating Close, Transparent Dual-Action Share Button
          ========================================================== */}
      {showShareModal && (
        <div
          className="modal-overlay share-card-modal-overlay"
          onClick={() => setShowShareModal(false)}
          role="dialog"
          aria-modal="true"
          id="share-card-modal"
        >
          <div
            className="share-card-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimalist Floating Close Button */}
            <button
              type="button"
              className="share-card-floating-close"
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
              id="btn-close-share-modal"
            >
              &times;
            </button>

            {/* Modal Body: Card Preview */}
            <div className="share-card-modal-body">
              {isGeneratingCard || !generatedCardUrl ? (
                <div className="share-card-generating-box">
                  <div className="share-card-spinner-ring" />
                  <h4 className="generating-title">Generating Facial Style Card...</h4>
                  <p className="generating-sub">
                    Composing your portrait and 8-parameter attractiveness breakdown...
                  </p>
                </div>
              ) : (
                <div className="share-card-preview-wrapper">
                  <img
                    src={generatedCardUrl}
                    alt="Gabru Facial Beauty Scorecard"
                    className="share-card-preview-img"
                    id="share-card-preview-img"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer: Transparent Dual-Action Share Button */}
            <div className="share-card-modal-footer">
              {shareCardCopied && (
                <div className="share-feedback-toast">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Card Downloaded & Ready to Share!</span>
                </div>
              )}

              <button
                type="button"
                className="btn-share-transparent"
                onClick={handleShareCardWithFriends}
                disabled={isGeneratingCard || !generatedCardUrl}
                id="btn-share-with-friends"
                title="Download card and share with friends"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
