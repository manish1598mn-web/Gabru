'use client';

/**
 * GABRU — REALISTIC ANALYSIS ORCHESTRATOR HOOK
 * 
 * Orchestrates a 3.0-second multi-phase biometric/telemetric analysis lifecycle:
 * - Phase 1 (0.0s – 0.8s): Sensor intake, optical calibration, reticle alignment
 * - Phase 2 (0.8s – 1.8s): High-speed dual-axis holographic laser scanning & coordinate mesh
 * - Phase 3 (1.8s – 2.6s): Exponential odometer number solving & cascading 10-parameter lock-in
 * - Phase 4 (2.6s – 3.0s): Decisive final lock-in, energy flash, and verified result reveal
 * 
 * Executes the underlying compute immediately at t=0 and safely buffers the result
 * so zero runtime computation latency occurs during the animation.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export type StudioAnalysisType = 'fit-check' | 'beauty-rating' | 'content-rating' | 'hand-reading';

export interface UseRealisticAnalysisOptions {
  studio: StudioAnalysisType;
  totalDurationMs?: number; // Default 3000ms
  onComplete?: () => void;
}

const STUDIO_STAGE_MESSAGES: Record<StudioAnalysisType, [string, string, string, string]> = {
  'fit-check': [
    'Calibrating camera lens & perspective distortion...',
    'Detecting 33 pose keypoints & shoulder-waist V-taper...',
    'Evaluating trouser break drape, silhouette balance & seam tensions...',
    'Normalizing sartorial color harmonies against menswear baseline...',
  ],
  'beauty-rating': [
    'Detecting craniofacial boundary & roll-correcting frontal plane...',
    'Extracting 468 landmark coordinates across thirds & transverse fifths...',
    'Calculating logarithmic golden ratio (φ ≈ 1.618) & bilateral symmetry...',
    'Evaluating skin luminance, canthal tilt & mandibular ramus architecture...',
  ],
  'content-rating': [
    'Resolving platform metadata, video framerate & creator baseline...',
    'Extracting 0–3 second hook cadence & visual attention heatmaps...',
    'Synthesizing audio spectrum harmonics, caption wit & comment chaos vectors...',
    'Calculating curved virality distribution & group-chat forwardability...',
  ],
  'hand-reading': [
    'Detecting palmar boundary & hand aspect ratio...',
    'Mapping 21 skeletal joints & classifying elemental archetype...',
    'Tracing Jeevan, Mastak, Hridaya & Bhagya Rekha crease depths...',
    'Calibrating mount reliefs against classical Samudrika Shastra rules...',
  ],
};

export interface UseRealisticAnalysisReturn<T> {
  isAnalyzing: boolean;
  phase: 1 | 2 | 3 | 4;
  progressRatio: number; // 0.0 to 1.0
  statusMessage: string;
  displayedScore: number | null;
  cardLockStates: boolean[]; // 10 booleans for index 0..9 (card 1..10)
  cardShuffleScores: Record<number, number>; // Card 1..10 live values
  justLockedCardId: number | null;
  startAnalysis: (computeFn: () => Promise<T>, targetScoreGetter?: (result: T) => number) => Promise<T | null>;
  reset: () => void;
}

export function useRealisticAnalysis<T>({
  studio,
  totalDurationMs = 3000,
  onComplete,
}: UseRealisticAnalysisOptions): UseRealisticAnalysisReturn<T> {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [progressRatio, setProgressRatio] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(STUDIO_STAGE_MESSAGES[studio][0]);
  const [displayedScore, setDisplayedScore] = useState<number | null>(null);
  const [cardLockStates, setCardLockStates] = useState<boolean[]>(new Array(10).fill(false));
  const [cardShuffleScores, setCardShuffleScores] = useState<Record<number, number>>({});
  const [justLockedCardId, setJustLockedCardId] = useState<number | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const flareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (flareTimeoutRef.current) clearTimeout(flareTimeoutRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    isCancelledRef.current = true;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (flareTimeoutRef.current) clearTimeout(flareTimeoutRef.current);
    setIsAnalyzing(false);
    setPhase(1);
    setProgressRatio(0);
    setStatusMessage(STUDIO_STAGE_MESSAGES[studio][0]);
    setDisplayedScore(null);
    setCardLockStates(new Array(10).fill(false));
    setCardShuffleScores({});
    setJustLockedCardId(null);
  }, [studio]);

  const startAnalysis = useCallback(
    async (
      computeFn: () => Promise<T>,
      targetScoreGetter?: (result: T) => number
    ): Promise<T | null> => {
      isCancelledRef.current = false;
      setIsAnalyzing(true);
      setPhase(1);
      setProgressRatio(0);
      setStatusMessage(STUDIO_STAGE_MESSAGES[studio][0]);
      setDisplayedScore(null);
      setCardLockStates(new Array(10).fill(false));
      setJustLockedCardId(null);

      // 1. Kick off actual background computation immediately at t=0
      let computedResult: T | null = null;
      let targetOverallScore = 82; // Default fallback score if not extractable
      let computeError: unknown = null;

      // Start the computation immediately, but keep the animation alive until it
      // settles. MediaPipe/canvas work can take longer than the visual timeline.
      try {
        Promise.resolve()
          .then(computeFn)
          .then((res) => {
            computedResult = res;
            if (targetScoreGetter) {
              try {
                const s = targetScoreGetter(res);
                if (typeof s === 'number' && !isNaN(s)) {
                  targetOverallScore = Math.max(0, Math.min(100, Math.round(s * 10) / 10));
                }
              } catch {
                // Keep default
              }
            }
          })
          .catch((err: unknown) => {
            computeError = err;
          });
      } catch (err) {
        computeError = err;
      }

      // 2. Drive the 3.0s synchronized visual animation timeline
      return new Promise<T | null>((resolve, reject) => {
        const startTime = performance.now();
        let lastShuffleTime = 0;
        let shuffleCounter = 0;
        const currentLockStates = new Array(10).fill(false);

        // Timeline milestones (in ms)
        const tPhase2 = totalDurationMs * 0.26; // ~780ms
        const tPhase3 = totalDurationMs * 0.58; // ~1740ms (start cascading card solving)
        const tPhase4 = totalDurationMs * 0.88; // ~2640ms (final lock-in)
        const tCardSolveWindow = tPhase4 - tPhase3; // ~900ms total window to solve cards 1..10

        const tick = (now: number) => {
          if (isCancelledRef.current) return;

          if (computeError) {
            setIsAnalyzing(false);
            reject(computeError);
            return;
          }

          const elapsed = now - startTime;
          const ratio = Math.min(1, Math.max(0, elapsed / totalDurationMs));
          setProgressRatio(ratio);

          // Phase & Status Message Dispatching
          if (elapsed < tPhase2) {
            setPhase(1);
            setStatusMessage(STUDIO_STAGE_MESSAGES[studio][0]);
          } else if (elapsed < tPhase3) {
            setPhase(2);
            setStatusMessage(STUDIO_STAGE_MESSAGES[studio][1]);
          } else if (elapsed < tPhase4) {
            setPhase(3);
            setStatusMessage(STUDIO_STAGE_MESSAGES[studio][2]);
          } else {
            setPhase(4);
            setStatusMessage(STUDIO_STAGE_MESSAGES[studio][3]);
          }

          // Card shuffling & cascade lock-in logic
          if (now - lastShuffleTime > 45) {
            lastShuffleTime = now;
            shuffleCounter += 1;

            const nextShuffles: Record<number, number> = {};
            for (let cardId = 1; cardId <= 10; cardId++) {
              if (currentLockStates[cardId - 1]) {
                continue; // Card already locked
              }
              // Deterministic pseudo-scramble based on tick and card ID
              const maxVal = studio === 'fit-check' ? 10 : studio === 'beauty-rating' ? 10 : 100;
              nextShuffles[cardId] = (shuffleCounter * 17 + cardId * 23) % (maxVal + 1);
            }
            setCardShuffleScores((prev) => ({ ...prev, ...nextShuffles }));
          }

          // Sequential Card Lock-in Check during Phase 3
          if (elapsed >= tPhase3 && elapsed < tPhase4) {
            const solveProgress = (elapsed - tPhase3) / tCardSolveWindow; // 0 to 1
            const cardsToLock = Math.min(10, Math.floor(solveProgress * 11)); // 0 to 10

            for (let c = 0; c < cardsToLock; c++) {
              if (!currentLockStates[c]) {
                currentLockStates[c] = true;
                setCardLockStates([...currentLockStates]);
                setJustLockedCardId(c + 1);
                if (flareTimeoutRef.current) clearTimeout(flareTimeoutRef.current);
                flareTimeoutRef.current = setTimeout(() => {
                  if (!isCancelledRef.current) setJustLockedCardId(null);
                }, 380);
              }
            }
          }

          // Odometer score rolling curve (starts around tPhase3, decelerates into targetOverallScore)
          if (elapsed >= tPhase3) {
            const scoreT = (elapsed - tPhase3) / (totalDurationMs - tPhase3); // 0 to 1
            // Exponential deceleration: 1 - 2^(-10 * scoreT)
            const ease = 1 - Math.pow(2, -10 * scoreT);
            const currentRoll = Math.min(targetOverallScore, Math.round((targetOverallScore * ease) * 10) / 10);
            setDisplayedScore(currentRoll);
          } else {
            // Rapid scramble between 35 and 90
            const interim = 40 + ((shuffleCounter * 13) % 45);
            setDisplayedScore(interim);
          }

          // Animation Completion Gate
          if (elapsed < totalDurationMs || (computedResult === null && !computeError)) {
            // Do not resolve with null when image/model computation outlives the
            // visual timeline; keep the result promise pending until it settles.
            animationFrameRef.current = requestAnimationFrame(tick);
          } else {
            setCardLockStates(new Array(10).fill(true));
            setDisplayedScore(targetOverallScore);
            setIsAnalyzing(false);

            if (computeError) {
              reject(computeError);
            } else {
              if (onComplete) onComplete();
              resolve(computedResult);
            }
          }
        };

        animationFrameRef.current = requestAnimationFrame(tick);
      });
    },
    [studio, totalDurationMs, onComplete]
  );

  return {
    isAnalyzing,
    phase,
    progressRatio,
    statusMessage,
    displayedScore,
    cardLockStates,
    cardShuffleScores,
    justLockedCardId,
    startAnalysis,
    reset,
  };
}

