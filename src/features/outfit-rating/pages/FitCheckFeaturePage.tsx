'use client';

/**
 * GABRU — FIT CHECK FEATURE PAGE
 * 
 * 10-Parameter sartorial intelligence & wardrobe audit studio.
 * Evaluates fit, proportion, harmony, and grooming on a 100-point scale.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

import { OUTFIT_PARAMETERS } from '../constants/OutfitRatingConstants';
import { OutfitScoreData, ParameterDef } from '../types/OutfitRatingTypes';
import { calculatePhotoScore } from '../services/OutfitScoringEngine';
import { drawOutfitSocialCard } from '../utils/OutfitShareCardUtil';
import { formatFileSize } from '@/shared/utils/FormatUtil';

export default function FitCheckFeaturePage() {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string>('');
  const [selectedPhotoSize, setSelectedPhotoSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<'home' | 'score' | 'about'>('home');
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // Photo Score Engine states
  const [photoScore, setPhotoScore] = useState<OutfitScoreData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedCardBlob, setGeneratedCardBlob] = useState<Blob | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [shuffleScores, setShuffleScores] = useState<Record<number, number>>({});

  // Fast number shuffling effect during score analysis & calculation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAnalyzing) {
      interval = setInterval(() => {
        const nextShuffle: Record<number, number> = {};
        OUTFIT_PARAMETERS.forEach((p) => {
          nextShuffle[p.id] = Math.floor(Math.random() * (p.maxPts + 1));
        });
        setShuffleScores(nextShuffle);
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  // Clean up object URL on unmount or before generating new card to avoid leaks
  useEffect(() => {
    return () => {
      if (generatedCardUrl && generatedCardUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedCardUrl);
      }
    };
  }, [generatedCardUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic glass navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Performance-optimized scroll reveal observer
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photoScore]);

  useEffect(() => {
    return () => {
      if (selectedPhotoUrl && selectedPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(selectedPhotoUrl);
      }
    };
  }, [selectedPhotoUrl]);

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
      setErrorMessage('Please select a valid image format (JPG, PNG, or WEBP).');
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('File size exceeds the 10MB limit. Please choose a smaller photo.');
      return;
    }

    setIsLoading(true);

    if (selectedPhotoUrl && selectedPhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedPhotoUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedPhotoUrl(objectUrl);
    setSelectedPhotoName(file.name);
    setSelectedPhotoSize(formatFileSize(file.size));
    setIsLoading(false);

    // Compute comprehensive score across Set 1, Set 2, and Set 3
    setIsAnalyzing(true);
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = async () => {
      try {
        const calculatedResult = await calculatePhotoScore(tempImg);
        setTimeout(() => {
          setPhotoScore(calculatedResult);
          setIsAnalyzing(false);
        }, 650);
      } catch (err) {
        console.error('Photo scoring calculation failed:', err);
        setIsAnalyzing(false);
      }
    };
    tempImg.onerror = () => {
      setIsAnalyzing(false);
    };
    tempImg.src = objectUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
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

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const loadSamplePhoto = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch('/fit_check_split.jpg');
      const blob = await resp.blob();
      const file = new File([blob], 'gabru-sample-portrait.jpg', { type: 'image/jpeg' });
      processFile(file);
    } catch {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string, navKey: 'home' | 'score' | 'about') => {
    setActiveNav(navKey);
    const targetId = navKey === 'about' ? 'about-section' : id;
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else if (navKey === 'about') {
      setShowAboutModal(true);
    }
  };

  const fallbackCopy = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const generateSocialCard = useCallback(() => {
    if (!photoScore) return;
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
        drawOutfitSocialCard(ctx, img, photoScore, OUTFIT_PARAMETERS);
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
        console.error('Canvas drawSocialCard error:', err);
        setIsGeneratingCard(false);
      }
    };

    img.onload = finishRender;
    img.onerror = () => {
      console.warn('Could not load outfit photo for social card, continuing with fallback');
      finishRender();
    };

    img.src = selectedPhotoUrl || '/fit_check_split.jpg';
  }, [photoScore, selectedPhotoUrl, generatedCardUrl]);

  const handleShareScore = () => {
    if (!photoScore) return;
    setShowShareModal(true);
    setTimeout(() => {
      generateSocialCard();
    }, 40);
  };

  const handleDownloadCard = () => {
    if (!generatedCardUrl && !generatedCardBlob) return;
    const link = document.createElement('a');
    link.href = generatedCardUrl || (generatedCardBlob ? URL.createObjectURL(generatedCardBlob) : '');
    const scoreNum = photoScore ? photoScore.overallScore : 0;
    link.download = `gabru-style-card-${scoreNum}pts.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareCardWithFriends = async () => {
    if (!photoScore) return;

    handleDownloadCard();
    setShareCardCopied(true);
    setTimeout(() => setShareCardCopied(false), 3500);

    if (!generatedCardBlob) {
      return;
    }

    const fileName = `gabru-style-card-${photoScore.overallScore}pts.png`;
    const file = new File([generatedCardBlob], fileName, { type: 'image/png' });
    const shareTitle = `Gabru Sartorial Scorecard • ${photoScore.overallScore}/100`;
    const shareText = `My outfit scored ${photoScore.overallScore}/100 (${photoScore.verdict}) on Gabru. Rate your style: https://www.gabru.ai`;

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
        console.warn('Native file share failed/cancelled, trying clipboard copy:', err);
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
        fallbackCopy(shareText);
      }
    }
  };

  return (
    <div id="gabru-app-root">
      {/* Ambient Atmospheric Lighting Mesh */}
      <div className="ambient-background-canvas" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-lines" />
      </div>

      {/* NAVIGATION BAR */}
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
        <div className="navbar-container">
          <div
            className="navbar-brand"
            id="nav-brand-logo"
            onClick={() => scrollToSection('hero-section', 'home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollToSection('hero-section', 'home')}
          >
            <div className="brand-icon-box" id="brand-camera-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="brand-name">Gabru</span>
          </div>

          <nav aria-label="Main Navigation">
            <ul className="navbar-nav">
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeNav === 'home' ? 'active' : ''}`}
                  onClick={() => scrollToSection('hero-section', 'home')}
                  id="nav-link-home"
                >
                  Fit Check
                </button>
              </li>
              <li>
                <Link
                  href="/beauty-rating"
                  className="nav-link nav-feature-btn"
                  id="nav-btn-beauty-rating"
                >
                  Beauty rating
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link nav-feature-btn"
                  id="nav-btn-content-rating"
                >
                  content rating
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO & STYLE INTELLIGENCE STUDIO */}
      <section className="hero-wrapper unified-studio-section" id="hero-section">
        <div className="unified-studio-container">
          <div className="hero-container">
            <div className="hero-left-column">
              <div className="hero-studio-badge scroll-reveal">
                <span className="badge-pulse-dot" />
                <span>10-Parameter Fashion Intelligence</span>
                <span className="badge-dot-sep">•</span>
                <span>100-Point Scale</span>
              </div>

              <h1 className="hero-headline scroll-reveal" id="hero-headline">
                Upload Photo,
                <br />
                <span className="gradient-text">Get a style Score</span>
              </h1>

              <p className="hero-description scroll-reveal" id="hero-description">
                Instant multi-dimensional evaluation across fit, proportions, harmony, and grooming. High-fashion intelligence that runs 100% privately in your browser.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                id="file-input"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {photoScore ? (
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
                        <span className="score-big-number">{photoScore.overallScore}</span>
                        <span className="score-scale-denom">/100</span>
                        <span className="score-verdict-tag">{photoScore.verdict}</span>
                      </div>

                      <button
                        type="button"
                        className="btn-change-photo"
                        onClick={triggerUpload}
                        id="btn-upload-direct"
                        title="Upload another outfit photo"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Change Photo
                      </button>
                    </div>

                    {photoScore.topQuickFix && (
                      <div className="score-clean-insight">
                        <span className="insight-badge">⚡ Quick Fix</span>
                        <span className="insight-text">
                          {photoScore.topQuickFix.action}{' '}
                          <span className="insight-gain">
                            (+{photoScore.topQuickFix.gainPts.toFixed(1)} pts)
                          </span>
                        </span>
                      </div>
                    )}

                    {photoScore.capsTriggered && photoScore.capsTriggered.length > 0 && !photoScore.topQuickFix && (
                      <div className="score-clean-cap">
                        <span>⚠ {photoScore.capsTriggered[0]}</span>
                      </div>
                    )}

                    <div className="score-summary-actions">
                      <button
                        type="button"
                        className="btn-score-action btn-share-score"
                        onClick={handleShareScore}
                        id="btn-share-score"
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
                                const calculatedResult = await calculatePhotoScore(temp);
                                setTimeout(() => {
                                  setPhotoScore(calculatedResult);
                                  setIsAnalyzing(false);
                                }, 400);
                              } catch (err) {
                                console.error('Re-calculate error:', err);
                                setIsAnalyzing(false);
                              }
                            };
                            temp.onerror = () => {
                              setIsAnalyzing(false);
                            };
                            temp.src = selectedPhotoUrl;
                          }
                        }}
                        id="btn-reanalyze"
                        title="Re-calculate parameter scores"
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
                      id="btn-try-demo"
                      onClick={loadSamplePhoto}
                    >
                      <span>✨</span> Try Sample Photo
                    </button>
                    <span className="privacy-pill">🔒 Zero Data Retention · 100% Private</span>
                  </div>
                </>
              ) : (
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
                    aria-label="Upload outfit photo"
                  >
                    <div className="upload-card-content">
                      <div className="upload-icon-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>

                      <div className="upload-text-block">
                        <p className="upload-title">
                          {isDragging ? 'Drop outfit photo to analyze' : 'Drop your outfit photo here, or browse'}
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
                        id="btn-upload-direct"
                      >
                        Choose Photo
                      </button>
                    </div>
                  </div>

                  <div className="hero-sub-actions">
                    <button
                      type="button"
                      className="btn-sample-link"
                      id="btn-try-demo"
                      onClick={loadSamplePhoto}
                    >
                      <span>✨</span> Try Sample Photo
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

            {/* Right Column — Photo Preview Card */}
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
                      src={selectedPhotoUrl || '/fit_check_split.jpg'}
                      alt={selectedPhotoName || 'Fit-check outfit inspiration — split man and woman pose'}
                      className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                      id="preview-rendered-image"
                    />

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
                          <span className="reticle-target-tag">FOCUS: HUMAN SUBJECT</span>
                        </div>
                        <div className="scanner-status-chip">
                          <span className="scanner-spin-icon" />
                          <span>Scanning & Isolating Focused Human...</span>
                        </div>
                      </div>
                    )}

                    {!isAnalyzing && photoScore && (
                      <div className={`subject-status-pill ${photoScore.humanDetected ? 'pill-human-detected' : 'pill-no-human'}`} id="subject-scan-status">
                        <span className="status-dot-indicator" />
                        <span>
                          {photoScore.humanDetected ? '✓ Outfit Scanned' : '⚠ Visual Estimate'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated 10-Parameter Outfit Rating Scorecard */}
          <div className="integrated-photo-score-area" id="photo-score-section">
            <div className={`scorecard-wrapper ${isAnalyzing ? 'analyzing' : ''}`} id="photo-score-dashboard">
              <div className="scorecard-clean-strip" id="scorecard-clean-strip">
                <div className="scorecard-strip-info">
                  <div className="strip-eyebrow">
                    <span className="badge-pulse-dot" />
                    <span>SARTORIAL MATRIX</span>
                    <span className="strip-eyebrow-sep">•</span>
                    <span>100-POINT SYSTEM</span>
                  </div>
                  <h3 className="scorecard-strip-title">10-Parameter Outfit Breakdown</h3>
                  <p className="scorecard-strip-sub">Standardized multi-dimensional evaluation across fit, harmony, details, and personal polish.</p>
                </div>

                <div className="scorecard-tier-pills" id="scorecard-tier-pills">
                  <div className="tier-pill-box">
                    <span className="tier-pill-name">Foundations</span>
                    <span className="tier-pill-score">
                      {photoScore ? (
                        <>
                          <strong className="tier-val">{photoScore.tier1Score}</strong>
                          <span className="tier-max">/71</span>
                        </>
                      ) : (
                        <span className="tier-unscored">71 Pts</span>
                      )}
                    </span>
                  </div>

                  <div className="tier-pill-box">
                    <span className="tier-pill-name">Details</span>
                    <span className="tier-pill-score">
                      {photoScore ? (
                        <>
                          <strong className="tier-val">{photoScore.tier2Score}</strong>
                          <span className="tier-max">/20</span>
                        </>
                      ) : (
                        <span className="tier-unscored">20 Pts</span>
                      )}
                    </span>
                  </div>

                  <div className="tier-pill-box">
                    <span className="tier-pill-name">Polish</span>
                    <span className="tier-pill-score">
                      {photoScore ? (
                        <>
                          <strong className="tier-val">{photoScore.tier3Score}</strong>
                          <span className="tier-max">/9</span>
                        </>
                      ) : (
                        <span className="tier-unscored">9 Pts</span>
                      )}
                    </span>
                  </div>

                  {photoScore && (
                    <button
                      type="button"
                      className="btn-strip-share-card"
                      onClick={handleShareScore}
                      id="btn-strip-share-card"
                      title="Generate Social Media Scorecard"
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

              {/* 10 Outfit Parameter Cards */}
              <div className="compact-cards-grid" id="compact-cards-grid">
                {OUTFIT_PARAMETERS.map((param) => {
                  const score = photoScore ? photoScore.parameterScores[param.id] : null;
                  const ratingDetail = photoScore ? photoScore.parameterRatings[param.id] : null;

                  return (
                    <div
                      key={param.id}
                      className={`compact-metric-card scroll-reveal ${score === null && !isAnalyzing ? 'compact-metric-card-unscored' : 'compact-metric-card-scored'}`}
                      id={`card-${param.id}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                        <span className="card-param-name">{param.name}</span>
                        {ratingDetail && !isAnalyzing && (
                          <span className="card-rating-badge">R: {ratingDetail.ratingR}/10</span>
                        )}
                      </div>

                      <div className="card-score-value-row">
                        {isAnalyzing ? (
                          <span className="shuffling-number">
                            {shuffleScores[param.id] ?? Math.floor(Math.random() * (param.maxPts + 1))}
                            <span className="score-max-denom">/{param.maxPts}</span>
                          </span>
                        ) : score !== null ? (
                          <span className="calculated-number">
                            {score}
                            <span className="score-max-denom">/{param.maxPts}</span>
                          </span>
                        ) : (
                          <span className="unscored-number">
                            --<span className="score-max-denom">/{param.maxPts}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP & ABOUT SECTION */}
      <section className="feature-strip-wrapper about-strip-wrapper" id="about-section" aria-label="About Gabru & Platform Intelligence">
        <div className="feature-strip-container">
          <div className="about-section-header scroll-reveal">
            <div className="about-section-eyebrow">
              <span className="badge-pulse-dot" />
              <span>ABOUT GABRU &amp; PLATFORM ARCHITECTURE</span>
            </div>
            <h2 className="about-section-title">
              Precision Aesthetic Scoring, Built for Sartorial Excellence
            </h2>
            <p className="about-section-subtitle">
              How Gabru evaluates tailoring, proportion, color harmony, and visual hierarchy with the discernment of an editorial fashion stylist.
            </p>
          </div>

          <div className="about-manifesto-card scroll-reveal">
            <div className="about-manifesto-left">
              <h3 className="manifesto-card-title">Editorial Discernment Meets Local Vision Computing</h3>
              <p className="manifesto-card-text">
                <strong style={{ color: '#ffffff' }}>Gabru</strong> was designed to demystify personal style. Rather than relying on subjective guesswork or opaque cloud servers, Gabru translates classical sartorial proportions and color theory into a structured 100-point evaluation framework.
              </p>
              <p className="manifesto-card-text">
                From shoulder seam alignment and trouser break to color temperature and hero piece placement, every garment dimension is calculated in-memory directly in your browser session. Your photos never leave your device.
              </p>
              <div className="manifesto-tags-row">
                <span className="manifesto-tag">✓ 100% Client-Side Private</span>
                <span className="manifesto-tag">✓ Zero Server Data Storage</span>
                <span className="manifesto-tag">✓ Full-Fidelity RAW/Hi-Res Display</span>
              </div>
            </div>

            <div className="about-manifesto-specs">
              <div className="spec-metric-item">
                <span className="spec-label">Evaluation Engine</span>
                <span className="spec-value">Local Vision Canvas</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Analysis Latency</span>
                <span className="spec-value">&lt; 1.2 Seconds</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Rating Framework</span>
                <span className="spec-value">10 Discrete Parameters</span>
              </div>
              <div className="spec-metric-item">
                <span className="spec-label">Server Data Storage</span>
                <span className="spec-value">0 Bytes Stored</span>
              </div>
            </div>
          </div>

          <div className="about-pillars-grid">
            <div className="feature-block scroll-reveal" id="feature-1">
              <div className="feature-icon-circle icon-circle-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3v18" />
                  <path d="M18 3v18" />
                  <path d="M6 8h12" />
                  <path d="M6 16h12" />
                </svg>
              </div>
              <h3 className="feature-title">Tier 1: Foundations (71 Pts)</h3>
              <p className="feature-description">
                Evaluates the core architecture: Fit &amp; Tailoring (25), Proportion (16), Occasion Appropriateness (12), Color Harmony (10), and Style Cohesion (8).
              </p>
              <span className="feature-tier-badge">Bedrock Architecture</span>
            </div>

            <div className="feature-block scroll-reveal" id="feature-2">
              <div className="feature-icon-circle icon-circle-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="feature-title">Tier 2: Details &amp; Craft (20 Pts)</h3>
              <p className="feature-description">
                Inspects material quality &amp; texture condition (8), footwear &amp; accessory coordination (7), and hair/grooming execution (5).
              </p>
              <span className="feature-tier-badge">The Refinements</span>
            </div>

            <div className="feature-block scroll-reveal" id="feature-3">
              <div className="feature-icon-circle icon-circle-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="feature-title">Tier 3: Expert Polish (9 Pts)</h3>
              <p className="feature-description">
                Identifies focal point attention control (5) and unique personal expression/originality (4) that distinguishes an outfit from the ordinary.
              </p>
              <span className="feature-tier-badge">Sartorial Signature</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-wrapper" id="gabru-footer">
        <div className="footer-container">
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
              The premier AI fashion intelligence platform. Evaluating wardrobe harmony, silhouette balance, color resonance, and styling craft through an objective 10-parameter vision architecture.
            </p>

            <div className="footer-status-pill">
              <span className="status-indicator-dot" />
              <span className="status-text">Vision Engine v3.8 Active &bull; Instant Client-Side Processing</span>
            </div>

            <div className="footer-security-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Zero data retention &bull; Privacy protected local evaluation</span>
            </div>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-col">
              <span className="footer-col-title">Evaluation Engines</span>
              <ul className="footer-links-list">
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('hero-section', 'home')}>
                    Outfit Score Matrix (100 Pts)
                  </button>
                </li>
                <li>
                  <Link href="/beauty-rating" className="footer-link-btn">
                    Beauty Rating Matrix (8 Params)
                  </Link>
                </li>
                <li>
                  <span className="footer-link-btn is-upcoming">
                    Content Rating <span className="footer-upcoming-badge">Coming Soon</span>
                  </span>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('hero-section', 'home')}>
                    Color Harmony Engine
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('hero-section', 'home')}>
                    Silhouette &amp; Proportions
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Scoring Architecture</span>
              <ul className="footer-links-list">
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'home')}>
                    Tier 1: Foundations (71 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'home')}>
                    Tier 2: Details &amp; Craft (20 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'home')}>
                    Tier 3: Expert Polish (9 Pts)
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('about-section', 'home')}>
                    10-Parameter Visual Rubric
                  </button>
                </li>
              </ul>
            </div>

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
                    Editorial Standards
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

        <div className="footer-bottom-strip">
          <div className="footer-bottom-container">
            <span className="footer-bottom-copy">
              &copy; {new Date().getFullYear()} Gabru Technologies Inc. All rights reserved. Designed for sartorial perfection.
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

      {/* FULL RESOLUTION PREVIEW MODAL */}
      {showFullPreview && selectedPhotoUrl && (
        <div
          className="modal-overlay"
          onClick={() => setShowFullPreview(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedPhotoName || 'Full Photo Preview'}</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowFullPreview(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <img
                src={selectedPhotoUrl}
                alt={selectedPhotoName || 'Full preview'}
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* ABOUT / MODAL INFO DIALOG */}
      {showAboutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAboutModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="brand-icon-box" style={{ width: '28px', height: '28px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <h3 className="modal-title">About Gabru</h3>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowAboutModal(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '24px', lineHeight: 1.6, fontSize: '14px', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '14px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Gabru</strong> is an instant photo preview and multi-model fashion aesthetic intelligence platform.
              </p>
              <p style={{ marginBottom: '14px' }}>
                Upload any JPG, PNG, or WEBP photo to view it in full quality and receive comprehensive evaluations across <strong>Tier 1 (Foundations — 71 pts)</strong>, <strong>Tier 2 (Details — 20 pts)</strong>, and <strong>Tier 3 (Expert Polish — 9 pts)</strong> across all 10 rating parameters (100 points scale).
              </p>
              <div style={{ padding: '12px 16px', background: 'var(--glass)', borderRadius: '8px', color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
                ✓ Zero signup &bull; Fast local preview &bull; 100% Client-side privacy
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA SCORECARD GENERATOR MODAL */}
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
            <button
              type="button"
              className="share-card-floating-close"
              onClick={() => setShowShareModal(false)}
              aria-label="Close"
              id="btn-close-share-modal"
            >
              &times;
            </button>

            <div className="share-card-modal-body">
              {isGeneratingCard || !generatedCardUrl ? (
                <div className="share-card-generating-box">
                  <div className="share-card-spinner-ring" />
                  <h4 className="generating-title">Generating Style Card...</h4>
                  <p className="generating-sub">
                    Composing your outfit photo and 10-parameter audit breakdown...
                  </p>
                </div>
              ) : (
                <div className="share-card-preview-wrapper">
                  <img
                    src={generatedCardUrl}
                    alt="Gabru Social Media Outfit Scorecard"
                    className="share-card-preview-img"
                    id="share-card-preview-img"
                  />
                </div>
              )}
            </div>

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
