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
import { StudioHeroBackdrop } from '@/shared/components/layout/StudioHeroBackdrop';
import { BaseModal } from '@/shared/components/ui/BaseModal';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { useRealisticAnalysis } from '@/shared/hooks/useRealisticAnalysis';
import { formatFileSize } from '@/shared/utils/FormatUtil';
import { buildViralSharePayload, executeViralShare } from '@/shared';

import { OUTFIT_PARAMETERS } from '../constants/OutfitRatingConstants';
import { OutfitScoreData } from '../types/OutfitRatingTypes';
import { calculatePhotoScore } from '../services/OutfitScoringEngine';
import { drawOutfitSocialCard } from '../utils/OutfitShareCardUtil';

import { FitCheckHeroStudio } from '../components/FitCheckHeroStudio';
import { FitCheckParametersGrid } from '../components/FitCheckParametersGrid';
import { FitCheckShareModal } from '../components/FitCheckShareModal';
import { FitCheckAboutSection } from '../components/FitCheckAboutSection';

export default function FitCheckFeaturePage() {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);


  // Photo Score Engine states & Realistic 3.0s Analysis Orchestrator
  const [photoScore, setPhotoScore] = useState<OutfitScoreData | null>(null);
  const analysis = useRealisticAnalysis<OutfitScoreData>({
    studio: 'fit-check',
    totalDurationMs: 3000,
    onComplete: () => {
      const scoreElem = document.getElementById('photo-score-section');
      if (scoreElem) scoreElem.scrollIntoView({ behavior: 'smooth' });
    },
  });
  const isAnalyzing = analysis.isAnalyzing;

  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [generatedCardBlob, setGeneratedCardBlob] = useState<Blob | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy: copyToClipboard } = useClipboard();

  // Scroll reveal observer
  useIntersectionReveal(photoScore);

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

  const processFile = (file: File, options?: { isSampleSketch?: boolean }) => {
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

    setPhotoScore(null);
    setIsLoading(true);

    if (selectedPhotoUrl && selectedPhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedPhotoUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedPhotoUrl(objectUrl);
    setSelectedPhotoName(file.name);
    setIsLoading(false);

    // Compute comprehensive score across Set 1, Set 2, and Set 3 with realistic 3.0s analysis
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
        const calculatedResult = await analysis.startAnalysis(
          async () => calculatePhotoScore(tempImg, options),
          (res) => res.overallScore
        );
        if (calculatedResult) {
          setPhotoScore(calculatedResult);
          setErrorMessage(null);
        }
      } catch (err: any) {
        console.warn('Photo scoring calculation failed:', err);
        setPhotoScore(null);
        analysis.reset();
        setErrorMessage(err?.message || 'No person or outfit detected. Please upload a clear photo of your outfit.');
      }
    };
    tempImg.onerror = () => {
      setPhotoScore(null);
      analysis.reset();
      setErrorMessage('Failed to load image file. Please choose a different photo.');
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

  const generateSocialCard = useCallback(() => {
    if (!photoScore) return;
    setIsGeneratingCard(true);
    setShareCardCopied(false);

    const width = 1080;
    const height = 1350;
    const scale = 2; // Ultra-HD 2x (2160 x 2700)
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setIsGeneratingCard(false);
      return;
    }
    ctx.scale(scale, scale);
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
    generateSocialCard();
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

    const payload = buildViralSharePayload({
      featureName: 'Sartorial Scorecard',
      path: '/',
      scoreText: `My outfit scored ${photoScore.overallScore}/100`,
      verdictText: photoScore.verdict,
      ctaText: 'Rate your style & tailoring free',
    });

    const fileName = `gabru-style-card-${photoScore.overallScore}pts.png`;
    const result = await executeViralShare(payload, generatedCardBlob, fileName);

    if (result.copiedToClipboard || result.sharedViaNative) {
      setShareCardCopied(true);
      setTimeout(() => setShareCardCopied(false), 3500);
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

      {/* Universal Navigation Header */}
      <AppNavbar activeFeature="fit-check" />

      {/* Hero & Style Intelligence Studio */}
      <section className="hero-wrapper unified-studio-section fit-hero-section" id="hero-section">
        {/* Mode-Reactive Sartorial Architecture Skeleton Backdrop */}
        <StudioHeroBackdrop studio="fit-check" />

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
            scanPhase={analysis.phase}
            scanProgress={analysis.progressRatio}
            scanStatusMessage={analysis.statusMessage}
            errorMessage={errorMessage}
            onTriggerUpload={triggerUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onShareClick={handleShareScore}
            onRecalculate={() => {
              if (selectedPhotoUrl) {
                const temp = new Image();
                temp.crossOrigin = 'anonymous';
                temp.onload = async () => {
                  try {
                    const calculatedResult = await analysis.startAnalysis(
                      async () => calculatePhotoScore(temp),
                      (res) => res.overallScore
                    );
                    if (calculatedResult) {
                      setPhotoScore(calculatedResult);
                      setErrorMessage(null);
                    }
                  } catch (err: any) {
                    console.warn('Re-calculate error:', err);
                    setPhotoScore(null);
                    analysis.reset();
                    setErrorMessage(err?.message || 'No person or outfit detected. Please upload a clear photo of your outfit.');
                  }
                };
                temp.onerror = () => {
                  setPhotoScore(null);
                  analysis.reset();
                  setErrorMessage('Failed to load image.');
                };
                temp.src = selectedPhotoUrl;
              }
            }}
          />

          {/* 10-Parameter Matrix is Always Visible */}
          <FitCheckParametersGrid
            photoScore={photoScore}
            isAnalyzing={isAnalyzing}
            shuffleScores={analysis.cardShuffleScores}
            cardLockStates={analysis.cardLockStates}
            justLockedCardId={analysis.justLockedCardId}
            displayedHeroScore={analysis.displayedScore}
            onShareClick={handleShareScore}
          />
        </div>
      </section>

      {/* About Fit Check & Sartorial Framework Section */}
      <FitCheckAboutSection />

      {/* Universal Luxury Footer */}
      <AppFooter />

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

      {/* 1080x1350 Share Card Modal */}
      <FitCheckShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        isGeneratingCard={isGeneratingCard}
        generatedCardUrl={generatedCardUrl}
        shareCardCopied={shareCardCopied}
        onShare={handleShareCardWithFriends}
        onDownload={handleDownloadCard}
      />
    </div>
  );
}
