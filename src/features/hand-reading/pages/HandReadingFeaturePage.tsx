'use client';

/**
 * GABRU — HAND READING & PALM PROMINENCE FEATURE PAGE
 * 
 * Traditional palmistry (Western Chiromancy & Indian Samudrika Shastra):
 * - 10 Parameter Line Prominence & Mount Shading Matrix
 * - Constitutional Elemental Hand Types (Earth, Air, Fire, Water)
 * - Quality Factor Gate (q) & Confidence Thresholds
 * - Zero vs Exclude Absent Line Policy
 * - 100% In-Browser Biometric Privacy with 1-Click Image Deletion
 * - High-Res 1080x1350 Verified Share Card Export
 */

import React, { useState, useCallback, useEffect } from 'react';
import { AppNavbar } from '@/shared/components/layout/AppNavbar';
import { AppFooter } from '@/shared/components/layout/AppFooter';
import { StudioHeroBackdrop } from '@/shared/components/layout/StudioHeroBackdrop';
import { useIntersectionReveal } from '@/shared/hooks/useIntersectionReveal';
import { useRealisticAnalysis } from '@/shared/hooks/useRealisticAnalysis';

import {
  HandReadingResult,
  PalmTradition,
  AbsentFeaturePolicy,
  PhotoQualityGate,
} from '../types/HandReadingTypes';
import {
  DEMO_PALM_PRESETS,
  DemoPalmPreset,
} from '../constants/HandReadingConstants';
import { evaluateHandReading } from '../services/HandScoringEngine';
import {
  analyzePalmImageFile,
  getDefaultLinePaths,
  getDefaultMountRegions,
  PalmLinePath,
  PalmMountRegion,
} from '../utils/HandImageAnalysisUtil';
import {
  HandReadingHeroStudio,
  HandReadingScorecard,
  HandDeepDiveSection,
  HandShareModal,
} from '../components';

export default function HandReadingFeaturePage() {
  const [tradition, setTradition] = useState<PalmTradition>('western');
  const [absentPolicy, setAbsentPolicy] = useState<AbsentFeaturePolicy>('zero');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [userImageUri, setUserImageUri] = useState<string | null>(null);
  const [qualityGate, setQualityGate] = useState<PhotoQualityGate | null>(null);
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({});
  const [currentConfidences, setCurrentConfidences] = useState<Record<string, number>>({});
  const [currentHandShape, setCurrentHandShape] = useState<{ a: number; b: number }>({ a: 1.2, b: 0.8 });
  const [currentLinePaths, setCurrentLinePaths] = useState<PalmLinePath[]>([]);
  const [currentMountRegions, setCurrentMountRegions] = useState<PalmMountRegion[]>([]);

  const [activeParamKey, setActiveParamKey] = useState<string>('life_line');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Initialize scroll reveal animations
  useIntersectionReveal();

  const [result, setResult] = useState<HandReadingResult | null>(null);

  // Realistic 3.0s analysis coordinator
  const analysis = useRealisticAnalysis<HandReadingResult>({
    studio: 'hand-reading',
    totalDurationMs: 3000,
  });

  const isAnalyzing = analysis.isAnalyzing;

  const recompute = useCallback(
    (
      qG: PhotoQualityGate,
      scores: Record<string, number>,
      confs: Record<string, number>,
      hsData: { a: number; b: number },
      trad: PalmTradition,
      policy: AbsentFeaturePolicy,
      imgUri?: string
    ) => {
      const res = evaluateHandReading({
        qualityGate: qG,
        tradition: trad,
        absentPolicy: policy,
        paramScores: scores,
        detectionConfidences: confs,
        handShapeData: hsData,
        imageDataUri: imgUri,
      });
      setResult(res);
    },
    []
  );

  const handleTraditionChange = useCallback(
    (newTradition: PalmTradition) => {
      setTradition(newTradition);
      if (qualityGate) {
        recompute(
          qualityGate,
          currentScores,
          currentConfidences,
          currentHandShape,
          newTradition,
          absentPolicy,
          userImageUri || undefined
        );
      }
    },
    [qualityGate, currentScores, currentConfidences, currentHandShape, absentPolicy, userImageUri, recompute]
  );

  const handleAbsentPolicyChange = useCallback(
    (newPolicy: AbsentFeaturePolicy) => {
      setAbsentPolicy(newPolicy);
      if (qualityGate) {
        recompute(
          qualityGate,
          currentScores,
          currentConfidences,
          currentHandShape,
          tradition,
          newPolicy,
          userImageUri || undefined
        );
      }
    },
    [qualityGate, currentScores, currentConfidences, currentHandShape, tradition, userImageUri, recompute]
  );

  const handleSelectPreset = useCallback(
    async (preset: DemoPalmPreset) => {
      setErrorMessage(null);
      setSelectedPresetId(preset.id);
      setUserImageUri(preset.sampleImageUrl);
      setQualityGate(preset.qualityGate as PhotoQualityGate);
      setCurrentScores(preset.scores);
      setCurrentConfidences(preset.detectionConfidences);
      setCurrentHandShape(preset.handShapeMetrics);

      const absentLines = preset.scores.fate_line === 0 ? ['fate_line'] : [];
      setCurrentLinePaths(getDefaultLinePaths(absentLines));
      setCurrentMountRegions(getDefaultMountRegions());

      try {
        const res = await analysis.startAnalysis(
          async () => {
            return evaluateHandReading({
              qualityGate: preset.qualityGate as PhotoQualityGate,
              tradition,
              absentPolicy,
              paramScores: preset.scores,
              detectionConfidences: preset.detectionConfidences,
              handShapeData: preset.handShapeMetrics,
              imageDataUri: preset.sampleImageUrl,
            });
          },
          (r) => r.overallProminenceIndex
        );
        if (res) {
          setResult(res);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Analysis failed';
        setErrorMessage(msg);
      }
    },
    [tradition, absentPolicy, analysis]
  );

  const handleSamplePalm = useCallback(() => {
    handleSelectPreset(DEMO_PALM_PRESETS[0]);
  }, [handleSelectPreset]);

  const handleRecalculate = useCallback(async () => {
    if (!currentScores || !userImageUri || !qualityGate) {
      setErrorMessage('Please upload a clear palm photo to evaluate.');
      return;
    }
    setErrorMessage(null);
    try {
      const res = await analysis.startAnalysis(
        async () => {
          return evaluateHandReading({
            qualityGate,
            tradition,
            absentPolicy,
            paramScores: currentScores,
            detectionConfidences: currentConfidences || {},
            handShapeData: currentHandShape || undefined,
            imageDataUri: userImageUri,
          });
        },
        (r) => r.overallProminenceIndex
      );
      if (res) {
        setResult(res);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Re-calculation failed.';
      setErrorMessage(msg);
    }
  }, [currentScores, qualityGate, tradition, absentPolicy, currentConfidences, currentHandShape, userImageUri, analysis]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setResult(null);
      setSelectedPresetId(null);

      try {
        const res = await analysis.startAnalysis(
          async () => {
            const analyzed = await analyzePalmImageFile(file);
            setUserImageUri(analyzed.imageDataUri);
            setQualityGate(analyzed.qualityGate);
            setCurrentScores(analyzed.scores);
            setCurrentConfidences(analyzed.detectionConfidences);
            setCurrentHandShape(analyzed.handShapeData);
            setCurrentLinePaths(analyzed.linePaths);
            setCurrentMountRegions(analyzed.mountRegions);

            return evaluateHandReading({
              qualityGate: analyzed.qualityGate,
              tradition,
              absentPolicy,
              paramScores: analyzed.scores,
              detectionConfidences: analyzed.detectionConfidences,
              handShapeData: analyzed.handShapeData,
              imageDataUri: analyzed.imageDataUri,
            });
          },
          (r) => r.overallProminenceIndex
        );
        if (res) {
          setResult(res);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to analyze palm photo. Please upload a clear photo.';
        setErrorMessage(msg);
        console.warn('Palm image analysis error:', err);
      }
    },
    [tradition, absentPolicy, analysis]
  );

  const handleDeleteImage = useCallback(() => {
    analysis.reset();
    setUserImageUri(null);
    setSelectedPresetId(null);
    setResult(null);
    setQualityGate(null);
    setErrorMessage(null);
  }, [analysis]);

  return (
    <div className="home-container" id="hand-reading-root">
      {/* Background Ambience */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-lines" />
      </div>

      <AppNavbar activeFeature="hand-reading" />

      <main className="main-content">
        {/* Top Hero Studio */}
        <section className="hero-wrapper unified-studio-section hand-hero-section">
          {/* Mode-Reactive Vedic Samudrika Shastra & Chiromancy Skeleton Backdrop */}
          <StudioHeroBackdrop studio="hand-reading" />

          <div className="unified-studio-container">
            <HandReadingHeroStudio
              result={result}
              isAnalyzing={isAnalyzing}
              scanPhase={analysis.phase}
              scanProgress={analysis.progressRatio}
              scanStatusMessage={analysis.statusMessage}
              tradition={tradition}
              absentPolicy={absentPolicy}
              userImageUri={userImageUri}
              errorMessage={errorMessage}
              linePaths={currentLinePaths}
              mountRegions={currentMountRegions}
              activeParamKey={activeParamKey}
              onSelectParam={setActiveParamKey}
              onTraditionChange={handleTraditionChange}
              onAbsentPolicyChange={handleAbsentPolicyChange}
              onFileUpload={handleFileUpload}
              onDeleteImage={handleDeleteImage}
              onShareClick={() => setIsShareModalOpen(true)}
              onRecalculate={handleRecalculate}
            />
          </div>
        </section>

        {/* 10-Parameter Bento Scorecard (Always Visible) */}
        <section className="content-scorecard-container hand-scorecard-container" id="scorecard-section">
          <HandReadingScorecard
            result={result}
            isAnalyzing={isAnalyzing}
            shuffleScores={analysis.cardShuffleScores}
            cardLockStates={analysis.cardLockStates}
            justLockedCardId={analysis.justLockedCardId}
            displayedHeroScore={analysis.displayedScore}
            onSelectParam={setActiveParamKey}
            onShareClick={() => setIsShareModalOpen(true)}
          />
        </section>

        {result && (
          /* 10 Hand Line Diagnostic Deep Dives */
          <section className="content-diagnostics-container hand-diagnostics-container" id="diagnostics-section">
            <HandDeepDiveSection
              result={result}
              activeParamKey={activeParamKey}
              onParamChange={setActiveParamKey}
            />
          </section>
        )}
      </main>

      {/* High-Resolution Share Card Modal */}
      <HandShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
        userImageUri={userImageUri || undefined}
      />

      <AppFooter />
    </div>
  );
}

