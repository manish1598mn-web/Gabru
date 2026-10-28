'use client';

/**
 * GABRU — FIT CHECK FEATURE PAGE
 * 
 * 10-Parameter sartorial intelligence & wardrobe audit studio.
 * Evaluates fit, proportion, harmony, and grooming on a 100-point scale.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppNavbar } from '@/shared/components/layout/AppNavbar';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { BaseModal } from '@/shared/components/ui/BaseModal';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';
import { useNumberShuffle } from '@/shared/hooks/useNumberShuffle';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { formatFileSize } from '@/shared/utils/FormatUtil';

import { OUTFIT_PARAMETERS } from '../constants/OutfitRatingConstants';
import { OutfitScoreData } from '../types/OutfitRatingTypes';
import { calculatePhotoScore } from '../services/OutfitScoringEngine';
import { drawOutfitSocialCard } from '../utils/OutfitShareCardUtil';

import { FitCheckHeroStudio } from '../components/FitCheckHeroStudio';
import { FitCheckParametersGrid } from '../components/FitCheckParametersGrid';
import { FitCheckAboutSection } from '../components/FitCheckAboutSection';
import { FitCheckShareModal } from '../components/FitCheckShareModal';

export default function FitCheckFeaturePage() {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // Photo Score Engine states
  const [photoScore, setPhotoScore] = useState<OutfitScoreData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedCardBlob, setGeneratedCardBlob] = useState<Blob | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy: copyToClipboard } = useClipboard();

  // Scroll reveal observer
  useIntersectionReveal(photoScore);

  // Fast number shuffling animation during evaluation
  const shuffleItems = OUTFIT_PARAMETERS.map((p) => ({ id: p.id, max: p.maxPts }));
  const shuffleScores = useNumberShuffle(isAnalyzing, shuffleItems, 50);

  // Clean up object URLs on unmount or before generating new card to avoid leaks
  useEffect(() => {
    return () => {
      if (generatedCardUrl && generatedCardUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedCardUrl);
      }
    };
  }, [generatedCardUrl]);

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

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('File size exceeds the 15MB limit. Please choose a smaller photo.');
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

    if (!generatedCardBlob) return;

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
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return;
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

    copyToClipboard(shareText);
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

      {/* Universal Navigation Header */}
      <AppNavbar activeFeature="fit-check" />

      {/* Hero & Style Intelligence Studio */}
      <section className="hero-wrapper unified-studio-section" id="hero-section">
        <div className="unified-studio-container">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <FitCheckHeroStudio
            photoScore={photoScore}
            selectedPhotoUrl={selectedPhotoUrl}
            selectedPhotoName={selectedPhotoName}
            isDragging={isDragging}
            isAnalyzing={isAnalyzing}
            errorMessage={errorMessage}
            onTriggerUpload={triggerUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSamplePhoto={loadSamplePhoto}
            onShareClick={handleShareScore}
            onRecalculate={() => {
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
                temp.onerror = () => setIsAnalyzing(false);
                temp.src = selectedPhotoUrl;
              }
            }}
          />

          <FitCheckParametersGrid
            photoScore={photoScore}
            isAnalyzing={isAnalyzing}
            shuffleScores={shuffleScores}
            onShareClick={handleShareScore}
          />
        </div>
      </section>

      {/* Architecture & Feature Strip */}
      <FitCheckAboutSection />

      {/* Universal Luxury Footer */}
      <AppFooter
        onOpenPrivacyModal={() => setShowAboutModal(true)}
        onOpenTermsModal={() => setShowAboutModal(true)}
        onOpenMethodologyModal={() => setShowAboutModal(true)}
      />

      {/* Full Photo Preview Modal */}
      <BaseModal
        isOpen={showFullPreview && !!selectedPhotoUrl}
        onClose={() => setShowFullPreview(false)}
        title={selectedPhotoName || 'Full Photo Preview'}
        maxWidth="800px"
      >
        {selectedPhotoUrl && (
          <img
            src={selectedPhotoUrl}
            alt={selectedPhotoName || 'Full preview'}
            className="modal-image"
          />
        )}
      </BaseModal>

      {/* About & Trust Dialog */}
      <BaseModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About Gabru"
        maxWidth="520px"
      >
        <div style={{ padding: '24px', lineHeight: 1.6, fontSize: '14px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '14px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Gabru</strong> is an instant photo preview and multi-model fashion aesthetic intelligence platform.
          </p>
          <p style={{ marginBottom: '14px' }}>
            Upload any JPG, PNG, or WEBP photo to view it in full quality and receive comprehensive evaluations across{' '}
            <strong>Tier 1 (Foundations — 71 pts)</strong>, <strong>Tier 2 (Details — 20 pts)</strong>, and{' '}
            <strong>Tier 3 (Expert Polish — 9 pts)</strong> across all 10 rating parameters (100 points scale).
          </p>
          <div style={{ padding: '12px 16px', background: 'var(--glass)', borderRadius: '8px', color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
            ✓ Zero signup &bull; Fast local preview &bull; 100% Client-side privacy
          </div>
        </div>
      </BaseModal>

      {/* 1080x1350 Share Card Modal */}
      <FitCheckShareModal
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
