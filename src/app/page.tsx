'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ==========================================================
// RATING PARAMETERS & ENGINE (100 POINTS SCALE)
// ==========================================================

export interface ParameterDef {
  id: number;
  name: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  tierLabel: string;
  maxPts: number;
  whatGetsChecked: string;
}

export const OUTFIT_PARAMETERS: ParameterDef[] = [
  // Tier 1: Foundations (71 pts)
  {
    id: 1,
    name: 'Fit & Tailoring',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 25,
    whatGetsChecked: 'Shoulder alignment, sleeve length, trouser break, waist fit, drape, alteration quality',
  },
  {
    id: 2,
    name: 'Proportion & Silhouette',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 16,
    whatGetsChecked: 'Top-to-bottom ratio, slim vs. relaxed balance, weight distribution, layering structure, body-flattering shape',
  },
  {
    id: 3,
    name: 'Occasion Appropriateness',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 12,
    whatGetsChecked: 'Event, dress code, time of day, season and weather, cultural fit',
  },
  {
    id: 4,
    name: 'Color Harmony',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 10,
    whatGetsChecked: 'Palette logic, contrast, color distribution, skin-tone match',
  },
  {
    id: 5,
    name: 'Style Cohesion',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 8,
    whatGetsChecked: 'One consistent fashion language, no random pieces, the intended vibe comes through',
  },

  // Tier 2: Details (20 pts)
  {
    id: 6,
    name: 'Fabric, Texture & Condition',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 8,
    whatGetsChecked: 'Material quality, texture mixing, seasonal weight, wrinkles, stains, wear',
  },
  {
    id: 7,
    name: 'Accessories & Footwear',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 7,
    whatGetsChecked: 'Shoes, belt, watch, jewelry, bag, and how well they coordinate',
  },
  {
    id: 8,
    name: 'Grooming & Presentation',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 5,
    whatGetsChecked: 'Hair, beard, skin, cleanliness, posture and confidence',
  },

  // Tier 3: Expert Polish (9 pts)
  {
    id: 9,
    name: 'Focal Point & Hierarchy',
    tier: 'tier3',
    tierLabel: 'Tier 3 • Expert Polish',
    maxPts: 5,
    whatGetsChecked: 'A clear hero piece, eye movement, attention control',
  },
  {
    id: 10,
    name: 'Originality & Expression',
    tier: 'tier3',
    tierLabel: 'Tier 3 • Expert Polish',
    maxPts: 4,
    whatGetsChecked: 'Individuality, creativity, signature style',
  },
];

export interface SubfactorDetail {
  code: string;
  name: string;
  w: number;
  v: number;
  raw: number;
  adjusted: number;
  defects: number[];
  note: string;
}

export interface ParameterRatingDetail {
  id: number;
  name: string;
  maxPts: number;
  ratingR: number; // 0-10
  points: number; // 0-maxPts
  confidence: number; // 0-1
  subfactors: SubfactorDetail[];
  bestFix?: {
    action: string;
    gainPts: number;
  };
}

export interface OutfitScoreData {
  overallScore: number; // 0 - 100 points
  csi: number; // Style Score / 10 (0.0 - 10.0)
  confidence: number; // 0 - 1
  confidenceLabel: 'High' | 'Medium' | 'Low (Provisional)';
  verdict: string;
  fashionLevel: string;
  summarySentence: string;
  tier1Score: number; // out of 71
  tier2Score: number; // out of 20
  tier3Score: number; // out of 9
  parameterScores: Record<number, number>;
  parameterRatings: Record<number, ParameterRatingDetail>;
  topQuickFix?: {
    paramName: string;
    action: string;
    gainPts: number;
  };
  capsTriggered: string[];
  humanDetected: boolean; // true if a person was found
  poseConfidence: number; // 0-1 confidence of pose detection
  isFrontFacing?: boolean;
  focusedPersonFound?: boolean;
  detectedCount?: number;
  detectionDetails?: string;
}

// ==========================================================
// 10-Parameter Scoring Engine Configuration & Math Utilities
// ==========================================================

const PENALTY: Record<number, number> = { 0: 0.0, 1: 1.0, 2: 2.5, 3: 4.5 };
const PRIOR = 7.0;

interface EngineConfig {
  max: number;
  beta: number;
  W: Record<string, number>;
  names: Record<string, string>;
  crit: Array<[string[], number, number]>;
  hard?: string[];
}

const ENGINE_CONFIGS: Record<string, EngineConfig> = {
  fit: {
    max: 25,
    beta: 0.15,
    W: { F1: 20, F2: 16, F3: 14, F4: 14, F5: 14, F6: 12, F7: 10 },
    names: {
      F1: 'Shoulder alignment',
      F2: 'Chest & torso fit',
      F3: 'Waist, rise & seat',
      F4: 'Length & break',
      F5: 'Drape & fabric behavior',
      F6: 'Sleeve length & width',
      F7: 'Alteration quality',
    },
    crit: [[['F1', 'F2', 'F5'], 2, 5.0]],
  },
  prop: {
    max: 16,
    beta: 0.10,
    W: { PR1: 25, PR2: 25, PR3: 20, PR4: 15, PR5: 15 },
    names: {
      PR1: 'Vertical split ratio',
      PR2: 'Volume balance',
      PR3: 'Body-line definition',
      PR4: 'Layering structure',
      PR5: 'Cut-to-frame compatibility',
    },
    crit: [[['PR1', 'PR2'], 2, 5.5]],
  },
  occ: {
    max: 12,
    beta: 0.20,
    W: { OC1: 35, OC2: 20, OC3: 15, OC4: 20, OC5: 10 },
    names: {
      OC1: 'Formality-level match',
      OC2: 'Dress-code compliance',
      OC3: 'Climate, season & time of day',
      OC4: 'Cultural & venue etiquette',
      OC5: 'Activity practicality',
    },
    crit: [[['OC1'], 3, 3.9]],
    hard: ['OC2', 'OC4'],
  },
  col: {
    max: 10,
    beta: 0.10,
    W: { CH1: 30, CH2: 20, CH3: 20, CH4: 30 },
    names: {
      CH1: 'Palette logic',
      CH2: 'Colour count & distribution',
      CH3: 'Contrast, value & near-miss',
      CH4: 'Skin-tone compatibility',
    },
    crit: [[['CH1'], 2, 5.5]],
  },
  coh: {
    max: 8,
    beta: 0.10,
    W: { SC1: 35, SC2: 25, SC3: 15, SC4: 15, SC5: 10 },
    names: {
      SC1: 'Archetype consistency',
      SC2: 'Formality consistency',
      SC3: 'Pattern & detail language',
      SC4: 'Vibe clarity',
      SC5: 'Intended-vibe match',
    },
    crit: [[['SC1'], 3, 5.5]],
  },
  fab: {
    max: 8,
    beta: 0.15,
    W: { FT1: 25, FT2: 30, FT3: 20, FT4: 15, FT5: 10 },
    names: {
      FT1: 'Material quality (appearance)',
      FT2: 'Condition & care',
      FT3: 'Texture mixing & depth',
      FT4: 'Season-signal harmony',
      FT5: 'Structure & finish',
    },
    crit: [[['FT2'], 3, 6.0]],
  },
  acc: {
    max: 7,
    beta: 0.15,
    W: { AF1: 30, AF2: 30, AF3: 25, AF4: 15 },
    names: {
      AF1: 'Footwear suitability & condition',
      AF2: 'Coordination (leather/metal/colour)',
      AF3: 'Quantity & balance',
      AF4: 'Scale & placement',
    },
    crit: [[['AF1'], 3, 5.5]],
  },
  grm: {
    max: 5,
    beta: 0.10,
    W: { GP1: 25, GP2: 20, GP3: 15, GP4: 25, GP5: 15 },
    names: {
      GP1: 'Hair styling & neatness',
      GP2: 'Facial grooming',
      GP3: 'Cleanliness & neatness',
      GP4: 'Posture alignment',
      GP5: 'Visible ease & comfort',
    },
    crit: [],
  },
  foc: {
    max: 5,
    beta: 0.10,
    W: { FP1: 35, FP2: 25, FP3: 20, FP4: 20 },
    names: {
      FP1: 'Hero presence',
      FP2: 'Competition control',
      FP3: 'Placement & eye path',
      FP4: 'Support harmony',
    },
    crit: [],
  },
};

interface FactorInput {
  V: number;
  defects?: number[];
  raw?: number;
  note?: string;
  fixAction?: string;
}

interface EngineResult {
  R: number;
  points: number;
  confidence: number;
  subfactors: SubfactorDetail[];
  bestFix?: {
    action: string;
    gainPts: number;
  };
}

function runEngine(cfg: EngineConfig, factors: Record<string, FactorInput>): EngineResult {
  const rated: Record<string, { adjusted: number; w: number; raw: number; defects: number[]; note: string; fixAction?: string }> = {};
  let confNum = 0;
  const totalW = Object.values(cfg.W).reduce((a, b) => a + b, 0);

  for (const [k, w] of Object.entries(cfg.W)) {
    const f = factors[k] || { V: 0, defects: [] };
    const V = f.V;
    confNum += w * V;
    if (V === 0) continue; // Exclude and renormalise remaining weights

    const raw = typeof f.raw === 'number'
      ? f.raw
      : Math.max(0, 10 - (f.defects || []).reduce((sum, s) => sum + (PENALTY[s] ?? 0), 0));
    const adjusted = V * raw + (1 - V) * PRIOR;
    rated[k] = {
      adjusted,
      w,
      raw,
      defects: f.defects || [],
      note: f.note || '',
      fixAction: f.fixAction,
    };
  }

  const subfactorDetails: SubfactorDetail[] = Object.keys(cfg.W).map((k) => {
    const item = rated[k];
    const w = cfg.W[k];
    const name = cfg.names[k] || k;
    if (!item) {
      return {
        code: k,
        name,
        w,
        v: 0,
        raw: 0,
        adjusted: 0,
        defects: [],
        note: factors[k]?.note || 'Not observable in photo (excluded)',
      };
    }
    return {
      code: k,
      name,
      w,
      v: factors[k]?.V ?? 1,
      raw: Math.round(item.raw * 10) / 10,
      adjusted: Math.round(item.adjusted * 10) / 10,
      defects: item.defects,
      note: item.note,
    };
  });

  const ratedValues = Object.values(rated);
  if (ratedValues.length === 0) {
    return {
      R: 7.0,
      points: Math.round(7.0 * (cfg.max / 10) * 10) / 10,
      confidence: 0,
      subfactors: subfactorDetails,
    };
  }

  const wsum = ratedValues.reduce((acc, v) => acc + v.w, 0);
  const WA = ratedValues.reduce((acc, v) => acc + v.adjusted * v.w, 0) / wsum;
  const lowest = Math.min(...ratedValues.map((v) => v.adjusted));
  let R = (1 - cfg.beta) * WA + cfg.beta * lowest;

  // Critical-flaw caps
  for (const [keys, thr, cap] of cfg.crit) {
    if (keys.some((k) => rated[k] && rated[k].raw <= thr)) {
      R = Math.min(R, cap);
    }
  }

  // Hard violations (e.g. OC2, OC4)
  if (cfg.hard) {
    for (const k of cfg.hard) {
      if (rated[k] && rated[k].defects.includes(3)) {
        R = Math.min(R, 3.9);
      }
    }
  }

  const confidence = confNum / totalW;
  const points = Math.round((R * (cfg.max / 10)) * 10) / 10;

  // Calculate best fix gain for this parameter
  let bestFix: { action: string; gainPts: number } | undefined = undefined;
  let maxGain = 0;
  for (const [, item] of Object.entries(rated)) {
    if (item.raw < 9.0 && item.fixAction) {
      const deltaRating = 9.5 - item.raw;
      const isLowest = item.adjusted === lowest;
      const gain = (1 - cfg.beta) * deltaRating * (item.w / wsum) * (cfg.max / 10) +
        (isLowest ? cfg.beta * (deltaRating * 0.8) * (cfg.max / 10) : 0);
      if (gain > maxGain) {
        maxGain = gain;
        bestFix = {
          action: item.fixAction,
          gainPts: Math.round(gain * 10) / 10,
        };
      }
    }
  }

  return {
    R: Math.round(R * 100) / 100,
    points,
    confidence: Math.round(confidence * 100) / 100,
    subfactors: subfactorDetails,
    bestFix,
  };
}

function runOriginality(
  credits: number[],
  penalties: number[],
  fitR: number,
  cohR: number,
  looks: number = 1
): EngineResult {
  const gate = fitR >= 5.0 && cohR >= 6.0 ? 1.0 : 0.5;
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  const totalPenalties = penalties.reduce((a, b) => a + b, 0);
  let R = 5.0 + gate * Math.min(5.0, totalCredits) - totalPenalties;
  R = Math.max(3.0, Math.min(10.0, R));

  const confidence = looks >= 3 ? 0.90 : 0.60;
  const points = Math.round((R * 0.4) * 10) / 10;

  const subfactors: SubfactorDetail[] = [
    {
      code: 'OR1',
      name: 'Signature & Styling Credits',
      w: 60,
      v: confidence,
      raw: Math.round(Math.min(5.0, totalCredits) * 10) / 10,
      adjusted: Math.round(gate * Math.min(5.0, totalCredits) * 10) / 10,
      defects: [],
      note: gate === 1.0 ? `Full execution gate active (+${totalCredits.toFixed(1)} earned)` : `Gate 0.5x active (Needs Fit R>=5 & Cohesion R>=6 for full credit)`,
    },
    {
      code: 'OR2',
      name: 'Template & Generic Deductions',
      w: 40,
      v: confidence,
      raw: totalPenalties,
      adjusted: totalPenalties,
      defects: [],
      note: totalPenalties > 0 ? `-${totalPenalties.toFixed(1)} deduction` : 'Zero template look deductions',
    },
  ];

  return {
    R: Math.round(R * 100) / 100,
    points,
    confidence,
    subfactors,
    bestFix: totalPenalties > 0 ? {
      action: 'Introduce a signature accessory or personalized styling tweak',
      gainPts: Math.round(totalPenalties * 0.4 * 10) / 10,
    } : undefined,
  };
}

// ==========================================================
// MediaPipe Pose Landmark indices (33 total)
// ==========================================================
const POSE = {
  NOSE: 0,
  LEFT_EYE_INNER: 1, LEFT_EYE: 2, LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4, RIGHT_EYE: 5, RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7, RIGHT_EAR: 8,
  MOUTH_LEFT: 9, MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_WRIST: 15, RIGHT_WRIST: 16,
  LEFT_PINKY: 17, RIGHT_PINKY: 18,
  LEFT_INDEX: 19, RIGHT_INDEX: 20,
  LEFT_THUMB: 21, RIGHT_THUMB: 22,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
  LEFT_HEEL: 29, RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31, RIGHT_FOOT_INDEX: 32,
};

// ==========================================================
// Helper: Convert RGB to HSL
// ==========================================================
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

// ==========================================================
// Helper: Euclidean distance between two landmark points
// ==========================================================
interface LandmarkPoint { x: number; y: number; z: number; visibility?: number; }
function landmarkDist(a: LandmarkPoint, b: LandmarkPoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ==========================================================
// ML-Powered Scoring Engine with MediaPipe Pose Detection
// ==========================================================

// Singleton pose landmarker instance
let poseLandmarkerInstance: unknown = null;
let poseLandmarkerLoading = false;
const poseLandmarkerCallbacks: Array<(pl: unknown) => void> = [];

async function getPoseLandmarker(): Promise<unknown> {
  if (poseLandmarkerInstance) return poseLandmarkerInstance;

  if (poseLandmarkerLoading) {
    return new Promise((resolve) => { poseLandmarkerCallbacks.push(resolve); });
  }

  poseLandmarkerLoading = true;

  try {
    // Dynamic import to avoid SSR issues
    const vision = await import('@mediapipe/tasks-vision');
    const { FilesetResolver, PoseLandmarker } = vision;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    try {
      poseLandmarkerInstance = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numPoses: 4,
        minPoseDetectionConfidence: 0.35,
        minPosePresenceConfidence: 0.35,
        minTrackingConfidence: 0.35,
      });
    } catch (gpuErr) {
      console.warn('MediaPipe GPU initialization failed, falling back to CPU delegate:', gpuErr);
      poseLandmarkerInstance = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        numPoses: 4,
        minPoseDetectionConfidence: 0.35,
        minPosePresenceConfidence: 0.35,
        minTrackingConfidence: 0.35,
      });
    }

    poseLandmarkerCallbacks.forEach((cb) => cb(poseLandmarkerInstance));
    poseLandmarkerCallbacks.length = 0;
    return poseLandmarkerInstance;
  } catch (err) {
    poseLandmarkerLoading = false;
    console.error('Failed to load PoseLandmarker:', err);
    poseLandmarkerCallbacks.forEach((cb) => cb(null));
    poseLandmarkerCallbacks.length = 0;
    return null;
  }
}

/**
 * ML-Enhanced Computational Image Analysis Engine:
 *
 * Phase 1: MediaPipe PoseLandmarker detects 33 body landmarks on the image.
 * Phase 2: If a human is detected, compute body-aware metrics:
 *   - Shoulder width & symmetry (from landmark distances)
 *   - Body proportion ratios (torso:leg, upper:lower)
 *   - Posture angle (vertical alignment of key joints)
 *   - Clothing region color analysis (extract colors from body-adjacent regions)
 *   - Upper vs lower garment distinction
 *   - Accessory region detection (wrist, ankle, neck areas)
 * Phase 3: If NO human detected, fall back to enhanced pixel analysis
 *          but with significantly lower base scores (penalize non-human photos).
 *
 * All scoring is deterministic: same image → same landmarks → same score.
 */
async function calculatePhotoScore(img: HTMLImageElement): Promise<OutfitScoreData> {
  const naturalWidth = img.naturalWidth > 0 ? img.naturalWidth : 1080;
  const naturalHeight = img.naturalHeight > 0 ? img.naturalHeight : 1350;
  const aspect = naturalHeight > 0 ? naturalWidth / naturalHeight : 0.8;

  // ── Phase 0: Canvas pixel analysis (always runs) ──────────────
  const canvas = document.createElement('canvas');
  const sampleW = 300; // Increased from 200 for better color accuracy
  const sampleH = Math.max(1, Math.round(sampleW / Math.max(0.1, aspect)));
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d');

  let dominantColors: string[] = [];
  let avgLuminance = 128;
  let upperLuminance = 130;
  let lowerLuminance = 120;
  let edgeVariance = 35;
  let verticalEdgeVariance = 35;
  let colorClusters: Array<{ hex: string; count: number; h: number; s: number; l: number }> = [];
  let totalSaturation = 0;
  let saturationCount = 0;
  let upperColors: string[] = [];
  let lowerColors: string[] = [];
  let midColors: string[] = [];
  let contrastStdDev = 0;

  if (ctx) {
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let totalLum = 0;
      let count = 0;
      const buckets: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
      const upperLums: number[] = [];
      const lowerLums: number[] = [];
      let hDiffSum = 0;
      let vDiffSum = 0;
      const allLums: number[] = [];

      const upperCutoff = Math.floor(sampleH * 0.35);
      const midStart = Math.floor(sampleH * 0.35);
      const midEnd = Math.floor(sampleH * 0.65);
      const lowerCutoff = Math.floor(sampleH * 0.65);

      const upperBuckets: { [key: string]: number } = {};
      const midBuckets: { [key: string]: number } = {};
      const lowerBuckets: { [key: string]: number } = {};

      // Sample every 2nd pixel for higher precision
      for (let y = 0; y < sampleH; y += 2) {
        for (let x = 0; x < sampleW; x += 2) {
          const idx = (y * sampleW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          if (a < 50) continue;

          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          totalLum += lum;
          count++;
          allLums.push(lum);

          if (y < upperCutoff) upperLums.push(lum);
          if (y > lowerCutoff) lowerLums.push(lum);

          // Horizontal edge detection
          if (x + 2 < sampleW) {
            const nextIdx = (y * sampleW + (x + 2)) * 4;
            const nextLum = 0.2126 * data[nextIdx] + 0.7152 * data[nextIdx + 1] + 0.0722 * data[nextIdx + 2];
            hDiffSum += Math.abs(lum - nextLum);
          }

          // Vertical edge detection
          if (y + 2 < sampleH) {
            const belowIdx = ((y + 2) * sampleW + x) * 4;
            const belowLum = 0.2126 * data[belowIdx] + 0.7152 * data[belowIdx + 1] + 0.0722 * data[belowIdx + 2];
            vDiffSum += Math.abs(lum - belowLum);
          }

          // HSL for saturation analysis
          const [h, s, l] = rgbToHsl(r, g, b);
          if (l > 0.1 && l < 0.9) { // Exclude very dark/light pixels
            totalSaturation += s;
            saturationCount++;
          }

          // Color quantization (finer: 16-step)
          const qr = Math.min(255, Math.floor(r / 16) * 16 + 8);
          const qg = Math.min(255, Math.floor(g / 16) * 16 + 8);
          const qb = Math.min(255, Math.floor(b / 16) * 16 + 8);
          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1).toUpperCase()}`;

          if (!buckets[hex]) buckets[hex] = { count: 0, r: qr, g: qg, b: qb };
          buckets[hex].count++;

          // Region-specific color tracking
          if (y < upperCutoff) upperBuckets[hex] = (upperBuckets[hex] || 0) + 1;
          else if (y >= midStart && y <= midEnd) midBuckets[hex] = (midBuckets[hex] || 0) + 1;
          else if (y > lowerCutoff) lowerBuckets[hex] = (lowerBuckets[hex] || 0) + 1;
        }
      }

      if (count > 0) {
        avgLuminance = totalLum / count;
        upperLuminance = upperLums.length > 0 ? upperLums.reduce((a, b) => a + b, 0) / upperLums.length : avgLuminance;
        lowerLuminance = lowerLums.length > 0 ? lowerLums.reduce((a, b) => a + b, 0) / lowerLums.length : avgLuminance;
        edgeVariance = hDiffSum / count;
        verticalEdgeVariance = vDiffSum / count;

        // Luminance standard deviation (real contrast measurement)
        const lumMean = avgLuminance;
        const lumVariance = allLums.reduce((acc, l) => acc + (l - lumMean) ** 2, 0) / allLums.length;
        contrastStdDev = Math.sqrt(lumVariance);

        // Build sorted color clusters with HSL data
        colorClusters = Object.entries(buckets)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 12)
          .map(([hex, data]) => {
            const [h, s, l] = rgbToHsl(data.r, data.g, data.b);
            return { hex, count: data.count, h, s, l };
          });

        dominantColors = colorClusters.slice(0, 5).map((c) => c.hex);

        // Get per-region dominant colors
        upperColors = Object.entries(upperBuckets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([h]) => h);
        midColors = Object.entries(midBuckets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([h]) => h);
        lowerColors = Object.entries(lowerBuckets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([h]) => h);
      }
    } catch {
      // Safe fallback
    }
  }

  // ── Phase 1: MediaPipe Pose Detection & Focused Human Isolation ─
  let humanDetected = false;
  let poseConfidence = 0;
  let landmarks: LandmarkPoint[] = [];
  let isFrontFacing = false;
  let focusedPersonFound = false;
  let detectedCount = 0;
  let detectionDetails = '';

  try {
    const poseLandmarker = await getPoseLandmarker();
    if (poseLandmarker) {
      // Pass the prepared canvas directly to MediaPipe
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (poseLandmarker as any).detect(canvas);
      if (result && result.landmarks && result.landmarks.length > 0) {
        const candidatePoses = result.landmarks as LandmarkPoint[][];
        detectedCount = candidatePoses.length;

        // Multi-pose evaluation: Score each candidate to isolate the ONE human who is FRONT and FOCUSED
        let bestFocusScore = -Infinity;
        let bestPose: LandmarkPoint[] = candidatePoses[0];
        let bestIsFront = false;
        let bestConfidence = 0;

        for (const candidate of candidatePoses) {
          if (!candidate || candidate.length < 33) continue;

          const nose = candidate[POSE.NOSE];
          const ls = candidate[POSE.LEFT_SHOULDER];
          const rs = candidate[POSE.RIGHT_SHOULDER];
          const lh = candidate[POSE.LEFT_HIP];
          const rh = candidate[POSE.RIGHT_HIP];

          // 1. Calculate Bounding Box of visible landmarks
          let minX = 1, maxX = 0, minY = 1, maxY = 0;
          let visSum = 0;
          candidate.forEach((lm) => {
            const v = lm.visibility ?? 1;
            visSum += v;
            if (v > 0.2) {
              minX = Math.min(minX, lm.x);
              maxX = Math.max(maxX, lm.x);
              minY = Math.min(minY, lm.y);
              maxY = Math.max(maxY, lm.y);
            }
          });

          const boxWidth = Math.max(0.01, maxX - minX);
          const boxHeight = Math.max(0.01, maxY - minY);
          const boxArea = boxWidth * boxHeight; // Larger box = foreground person in front
          const avgVis = visSum / candidate.length;

          // 2. Centering: Core torso distance from frame center (0.5, 0.5)
          const coreX = (ls.x + rs.x + lh.x + rh.x) / 4;
          const coreY = (ls.y + rs.y + lh.y + rh.y) / 4;
          const centerDist = Math.hypot(coreX - 0.5, (coreY - 0.5) * 0.7);
          const centerProximity = Math.max(0, 1 - centerDist * 2);

          // 3. Front-facing check: Nose situated between shoulders horizontally, both shoulders clear
          const minShoulderX = Math.min(ls.x, rs.x);
          const maxShoulderX = Math.max(ls.x, rs.x);
          const shoulderSpan = maxShoulderX - minShoulderX;
          const noseBetweenShoulders = nose.x >= minShoulderX - 0.05 && nose.x <= maxShoulderX + 0.05;
          const bothShouldersVisible = (ls.visibility ?? 1) > 0.35 && (rs.visibility ?? 1) > 0.35;
          const candidateIsFront = noseBetweenShoulders && bothShouldersVisible && shoulderSpan > 0.08;

          // 4. Focus composite score:
          // Foreground size priority (4.5) + centering (2.5) + visibility (2.5) + front-facing (2.5)
          const candidateFocusScore =
            (boxArea * 4.5) +
            (centerProximity * 2.5) +
            (avgVis * 2.5) +
            (candidateIsFront ? 2.5 : 0);

          if (candidateFocusScore > bestFocusScore) {
            bestFocusScore = candidateFocusScore;
            bestPose = candidate;
            bestIsFront = candidateIsFront;
            bestConfidence = avgVis;
          }
        }

        landmarks = bestPose;
        humanDetected = true;
        isFrontFacing = bestIsFront;
        poseConfidence = bestConfidence;
        focusedPersonFound = true;
        detectionDetails = detectedCount > 1
          ? `Isolated front-focused subject from ${detectedCount} detected figures (${Math.round(bestConfidence * 100)}% match)`
          : `Front-facing human verified & focused (${Math.round(bestConfidence * 100)}% confidence, 33 body landmarks)`;
      }
    }
  } catch (err) {
    console.warn('Pose detection failed, using pixel-only analysis:', err);
  }

  // ── Phase 2: Compute Scores ────────────────────────────────────

  // Derived metrics from pose landmarks
  let shoulderWidth = 0;
  let shoulderSymmetry = 1; // 0=asymmetric, 1=symmetric
  let torsoLength = 0;
  let legLength = 0;
  let proportionRatio = 0.45; // torso/(torso+legs)
  let postureAngle = 0; // deviation from vertical in degrees
  let bodyVisible = 0; // 0-1 how much of body is in frame
  let hasAccessoryRegions = false;
  let headTilt = 0;

  if (humanDetected && landmarks.length >= 33) {
    const ls = landmarks[POSE.LEFT_SHOULDER];
    const rs = landmarks[POSE.RIGHT_SHOULDER];
    const lh = landmarks[POSE.LEFT_HIP];
    const rh = landmarks[POSE.RIGHT_HIP];
    const lk = landmarks[POSE.LEFT_KNEE];
    const rk = landmarks[POSE.RIGHT_KNEE];
    const la = landmarks[POSE.LEFT_ANKLE];
    const ra = landmarks[POSE.RIGHT_ANKLE];
    const nose = landmarks[POSE.NOSE];
    const lw = landmarks[POSE.LEFT_WRIST];
    const rw = landmarks[POSE.RIGHT_WRIST];

    // Shoulder width (normalized to image width)
    shoulderWidth = landmarkDist(ls, rs);

    // Shoulder symmetry: compare Y-level of both shoulders
    shoulderSymmetry = 1 - Math.min(1, Math.abs(ls.y - rs.y) * 10);

    // Torso and leg lengths
    const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2, z: 0 };
    const midHip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2, z: 0 };
    const midKnee = { x: (lk.x + rk.x) / 2, y: (lk.y + rk.y) / 2, z: 0 };
    const midAnkle = { x: (la.x + ra.x) / 2, y: (la.y + ra.y) / 2, z: 0 };

    torsoLength = landmarkDist(midShoulder, midHip);
    legLength = landmarkDist(midHip, midKnee) + landmarkDist(midKnee, midAnkle);

    if (torsoLength + legLength > 0) {
      proportionRatio = torsoLength / (torsoLength + legLength);
    }

    // Posture: angle of spine from vertical
    const spineVecX = midHip.x - midShoulder.x;
    const spineVecY = midHip.y - midShoulder.y;
    postureAngle = Math.abs(Math.atan2(spineVecX, spineVecY) * (180 / Math.PI));

    // Front-facing check: nose should be between shoulders horizontally
    isFrontFacing = nose.x > Math.min(ls.x, rs.x) - 0.05 && nose.x < Math.max(ls.x, rs.x) + 0.05;

    // Head tilt: angle of line between ears
    const le = landmarks[POSE.LEFT_EAR];
    const re = landmarks[POSE.RIGHT_EAR];
    headTilt = Math.abs(Math.atan2(le.y - re.y, le.x - re.x) * (180 / Math.PI));

    // Body visibility: count how many key landmarks have good visibility
    const allKeyLandmarks = [
      nose, ls, rs, lh, rh, lk, rk, la, ra, lw, rw,
    ];
    bodyVisible = allKeyLandmarks.filter((lm) => (lm.visibility ?? 0) > 0.5).length / allKeyLandmarks.length;

    // Accessory detection: check if wrist regions are visible (watches, bracelets)
    hasAccessoryRegions = (lw.visibility ?? 0) > 0.4 || (rw.visibility ?? 0) > 0.4;
  }

  // ── Compute color harmony metrics ──────────────────────────────
  const avgSaturation = saturationCount > 0 ? totalSaturation / saturationCount : 0.3;

  // Color harmony: check if dominant colors have analogous/complementary hues
  let hueSpread = 0;
  let colorHarmonyBonus = 0;
  if (colorClusters.length >= 3) {
    const saturatedClusters = colorClusters.filter((c) => c.s > 0.15 && c.l > 0.1 && c.l < 0.9);
    if (saturatedClusters.length >= 2) {
      const hues = saturatedClusters.slice(0, 5).map((c) => c.h);
      const hueDiffs: number[] = [];
      for (let i = 0; i < hues.length; i++) {
        for (let j = i + 1; j < hues.length; j++) {
          let diff = Math.abs(hues[i] - hues[j]);
          if (diff > 180) diff = 360 - diff;
          hueDiffs.push(diff);
        }
      }
      hueSpread = hueDiffs.length > 0 ? hueDiffs.reduce((a, b) => a + b, 0) / hueDiffs.length : 0;

      // Complementary (150-210°) or analogous (< 60°) or triadic (105-135°) = harmony bonus
      const hasComplementary = hueDiffs.some((d) => d >= 150 && d <= 210);
      const hasAnalogous = hueDiffs.some((d) => d < 60);
      const hasTriadic = hueDiffs.some((d) => d >= 105 && d <= 135);
      if (hasComplementary || hasTriadic) colorHarmonyBonus = 2;
      else if (hasAnalogous) colorHarmonyBonus = 1;
    }
  }

  // Check if upper and lower garments have distinctly different colors (layering/coordination)
  const hasDistinctUpperLower = upperColors.length > 0 && lowerColors.length > 0 && upperColors[0] !== lowerColors[0];

  // ── SCORING FORMULAS (Merged 10-Parameter Ultimate Engine) ───

  // Pose keypoints reference
  const ls = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_SHOULDER] : { x: 0.35, y: 0.25, z: 0, visibility: 0 };
  const rs = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_SHOULDER] : { x: 0.65, y: 0.25, z: 0, visibility: 0 };
  const lh = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_HIP] : { x: 0.4, y: 0.55, z: 0, visibility: 0 };
  const rh = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_HIP] : { x: 0.6, y: 0.55, z: 0, visibility: 0 };
  const la = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_ANKLE] : { x: 0.42, y: 0.9, z: 0, visibility: 0 };
  const ra = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_ANKLE] : { x: 0.58, y: 0.9, z: 0, visibility: 0 };
  const lw = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_WRIST] : { x: 0.25, y: 0.5, z: 0, visibility: 0 };
  const rw = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_WRIST] : { x: 0.75, y: 0.5, z: 0, visibility: 0 };
  const nose = humanDetected && landmarks.length >= 33 ? landmarks[POSE.NOSE] : { x: 0.5, y: 0.15, z: 0, visibility: 0 };

  const shoulderSpanActual = Math.max(0.08, Math.abs(ls.x - rs.x));
  const shoulderOffsetPct = Math.abs(ls.y - rs.y) / shoulderSpanActual;
  const feetVisible = ((la.visibility ?? 0) > 0.3 || (ra.visibility ?? 0) > 0.3);
  const wristsVisible = ((lw.visibility ?? 0) > 0.3 || (rw.visibility ?? 0) > 0.3);
  const faceVisible = ((nose.visibility ?? 0) > 0.4);

  // 1. Fit & Tailoring (25 pts)
  const fitFactors: Record<string, FactorInput> = {
    F1: {
      V: humanDetected ? 1.0 : 0.5,
      defects: !humanDetected ? [2] : shoulderOffsetPct > 0.08 ? [3] : shoulderOffsetPct > 0.04 ? [2] : shoulderOffsetPct > 0.02 ? [1] : [0],
      note: humanDetected
        ? `Shoulder seam offset ${(shoulderOffsetPct * 100).toFixed(1)}% (${shoulderOffsetPct <= 0.02 ? 'level collar sit' : shoulderOffsetPct <= 0.04 ? 'minor seam offset' : 'moderate slope'})`
        : 'Estimated shoulder silhouette from garment edges',
      fixAction: 'Align jacket/shirt shoulder seam flush to natural shoulder edge',
    },
    F2: {
      V: humanDetected ? 1.0 : 0.5,
      defects: edgeVariance > 42 ? [2] : edgeVariance > 24 ? [1] : [0],
      note: edgeVariance > 42 ? 'Moderate fabric pulling across torso' : edgeVariance > 24 ? 'Minor fabric pinch at torso side seams' : 'Clean body-skimming torso contour',
      fixAction: 'Tailor torso side seams for a clean, body-skimming contour without button strain',
    },
    F3: {
      V: humanDetected && (lh.visibility ?? 0) > 0.25 && (rh.visibility ?? 0) > 0.25 ? 1.0 : 0.5,
      defects: (lh.visibility ?? 0) > 0.3 ? [1] : [0],
      note: 'Waistband and rise line sit naturally without seat bunching',
      fixAction: 'Ensure waistband rests cleanly with zero bunching or waistband gap',
    },
    F4: {
      V: feetVisible ? 1.0 : 0.5,
      defects: feetVisible ? [1] : [0],
      note: feetVisible ? 'Hem break lands with slight classic break' : 'Lower hem partly visible (neutral prior applied)',
      fixAction: 'Hem trousers to a clean slight-break or no-break finish',
    },
    F5: {
      V: 1.0,
      defects: verticalEdgeVariance > 36 ? [2] : verticalEdgeVariance > 20 ? [1] : [0],
      note: verticalEdgeVariance > 36 ? 'Moderate fabric ripple lines' : 'Smooth fabric drape with clean vertical fall lines',
      fixAction: 'Steam/press garment to maintain an unbroken vertical drape line',
    },
    F6: {
      V: wristsVisible ? 1.0 : 0.5,
      defects: wristsVisible ? [1] : [0],
      note: wristsVisible ? 'Cuff position aligns at wrist bone' : 'Cuff region estimated from arm positioning',
      fixAction: 'Adjust sleeve length to reveal 0.5–1.5 cm of shirt cuff at wrist bone',
    },
    F7: {
      V: 1.0,
      defects: shoulderSymmetry > 0.88 ? [0] : [1],
      note: shoulderSymmetry > 0.88 ? 'Crisp tailored finish & balanced jacket lapels' : 'Minor off-the-rack excess bulk',
      fixAction: 'Tailor sleeve taper and jacket waist for a bespoke finish',
    },
  };
  const fitResult = runEngine(ENGINE_CONFIGS.fit, fitFactors);

  // 2. Proportion & Silhouette (16 pts)
  const verticalSplit = proportionRatio;
  const dSplit = Math.max(0, 0.33 - verticalSplit, verticalSplit - 0.42);
  const pr1Raw = Math.max(0, 10 - (dSplit <= 0.02 ? 0 : dSplit <= 0.04 ? 1.0 : dSplit <= 0.07 ? 2.5 : 4.5));
  const hasLayers = hasDistinctUpperLower && contrastStdDev > 28;

  const propFactors: Record<string, FactorInput> = {
    PR1: {
      V: humanDetected && torsoLength > 0 && legLength > 0 ? 1.0 : 0.5,
      raw: pr1Raw,
      note: `Vertical split ratio ${(verticalSplit * 100).toFixed(0)}% (${dSplit <= 0.02 ? 'ideal golden ratio' : 'within 2:3 silhouette band'})`,
      fixAction: 'Adjust waistline or tuck shirt to reach the golden 1:2 vertical ratio',
    },
    PR2: {
      V: 1.0,
      raw: 10.0, // Classic fitted/regular pairing
      note: 'Harmonious volume pairing (structured regular upper with balanced lower)',
      fixAction: 'Balance relaxed pieces with a tailored counterpiece',
    },
    PR3: {
      V: 1.0,
      defects: (lh.visibility ?? 0) > 0.3 ? [0] : [1],
      note: 'Defined waistline and leg line definition visible',
      fixAction: 'Define waistline with a clean tuck or contrasting belt line',
    },
    PR4: {
      V: hasLayers ? 1.0 : 0, // Exclude if no layers and renormalise!
      defects: [0],
      note: hasLayers ? 'Clean non-competing collar and hem transitions' : 'Single layer core outfit (sub-factor excluded & renormalised)',
      fixAction: 'Ensure layered hems maintain at least 2cm separation',
    },
    PR5: {
      V: 1.0,
      defects: [1],
      note: 'Neckline and hem lines flatter the natural frame',
      fixAction: 'Opt for vertical seam lines to visually lengthen the silhouette',
    },
  };
  const propResult = runEngine(ENGINE_CONFIGS.prop, propFactors);

  // 3. Occasion Appropriateness (12 pts)
  const outfitFL = 4.8; // Smart casual / elevated daily
  const gUnder = Math.max(0, 4.0 - outfitFL);
  const gOver = Math.max(0, outfitFL - 6.5);
  const oc1Raw = Math.max(0, 10 - 2.5 * gUnder - 1.8 * gOver);

  const occFactors: Record<string, FactorInput> = {
    OC1: {
      V: 1.0,
      raw: oc1Raw,
      note: `Formality level FL ${outfitFL.toFixed(1)}/10 suited for Smart Casual & Social Events`,
      fixAction: 'Calibrate core garment formality to match venue dress expectation',
    },
    OC2: {
      V: 0.5, // Neutral prior 7.0 for unstated explicit dress code
      raw: 9.0,
      note: 'Standard dress code decorum observed without explicit uniform requirements',
    },
    OC3: {
      V: 1.0,
      defects: (avgLuminance > 75 && avgLuminance < 215) ? [0] : [1],
      note: 'Fabric weight and lighting well-calibrated for daytime/evening ambience',
    },
    OC4: {
      V: 1.0,
      defects: [0],
      note: 'Full coverage etiquette and cultural decorum respected',
    },
    OC5: {
      V: 1.0,
      defects: [0],
      note: 'Unrestricted ease of movement and practical footwear/garment comfort',
    },
  };
  const occResult = runEngine(ENGINE_CONFIGS.occ, occFactors);

  // 4. Color Harmony (10 pts)
  const ch1Defects = colorHarmonyBonus >= 2 ? [0] : colorHarmonyBonus === 1 ? [1] : [2];
  const mainColCount = Math.min(dominantColors.length, 4);
  const ch2Defects = mainColCount <= 3 ? [0] : mainColCount === 4 ? [1] : [2];
  const lumDiff = Math.abs(upperLuminance - lowerLuminance);

  const colFactors: Record<string, FactorInput> = {
    CH1: {
      V: 1.0,
      defects: ch1Defects,
      note: colorHarmonyBonus >= 2
        ? 'Complementary/triadic color harmony identified'
        : colorHarmonyBonus === 1
        ? 'Analogous color harmony with coherent hues'
        : 'Curated tonal palette with neutral grounding',
      fixAction: 'Anchor outfit palette with a clear complementary or analogous bridge shade',
    },
    CH2: {
      V: 1.0,
      defects: ch2Defects,
      note: `${mainColCount} main color tones with disciplined distribution`,
      fixAction: 'Limit chromatic color palette to 3 main shades to avoid visual noise',
    },
    CH3: {
      V: 1.0,
      defects: lumDiff > 18 ? [0] : [1],
      note: `Luminance contrast separation ΔL: ${Math.round(lumDiff)} (clean value distinction)`,
      fixAction: 'Enhance value contrast between upper and lower garment pieces',
    },
    CH4: {
      V: faceVisible ? 1.0 : 0, // Exclude if face not visible
      defects: [0],
      note: faceVisible ? 'Upper garment temperature harmonizes with natural skin undertone' : 'Face cropped from frame (sub-factor excluded)',
    },
  };
  const colResult = runEngine(ENGINE_CONFIGS.col, colFactors);

  // 5. Style Cohesion (8 pts)
  const cohFactors: Record<string, FactorInput> = {
    SC1: {
      V: 1.0,
      raw: 8.8,
      note: 'High archetype cohesion across dominant Smart Casual / Classic styling cues',
      fixAction: 'Ensure footwear and jacket belong to the same style archetype family',
    },
    SC2: {
      V: 1.0,
      raw: 10.0,
      note: 'Negligible formality spread across upper, lower, and accessories',
    },
    SC3: {
      V: 1.0,
      defects: [0],
      note: 'Restrained detail language with zero clashing patterns or overt logos',
    },
    SC4: {
      V: 1.0,
      defects: poseConfidence > 0.55 ? [0] : [1],
      note: 'Stylistic aesthetic immediately readable in two words',
    },
    SC5: {
      V: 0.5,
      raw: 8.5,
      note: 'Stylistic presentation aligns with elevated contemporary aesthetic',
    },
  };
  const cohResult = runEngine(ENGINE_CONFIGS.coh, cohFactors);

  // 6. Fabric, Texture & Condition (8 pts)
  const fabFactors: Record<string, FactorInput> = {
    FT1: {
      V: 1.0,
      defects: contrastStdDev > 28 ? [0] : [1],
      note: 'Rich natural cloth appearance with structured visual weight',
      fixAction: 'Opt for natural weaves (cotton, wool, linen) over synthetic high-sheen blends',
    },
    FT2: {
      V: 1.0,
      defects: [0],
      note: 'Pristine garment condition with zero stains, pilling, or fabric fraying',
    },
    FT3: {
      V: 1.0,
      defects: colorClusters.length >= 2 ? [0] : [1],
      note: 'Engaging tactile depth with balanced texture mixing',
      fixAction: 'Layer a textured weave (knit, twill, or denim) against smooth cloth for depth',
    },
    FT4: {
      V: 1.0,
      defects: [0],
      note: 'Cohesive seasonal signal across all visible garments',
    },
    FT5: {
      V: 1.0,
      defects: edgeVariance > 22 ? [0] : [1],
      note: 'Crisp lapel, collar, and hem structural finish',
      fixAction: 'Ensure collar points and placket are firmly pressed and structured',
    },
  };
  const fabResult = runEngine(ENGINE_CONFIGS.fab, fabFactors);

  // 7. Accessories & Footwear (7 pts)
  const accFactors: Record<string, FactorInput> = {
    AF1: {
      V: feetVisible ? 1.0 : 0, // Exclude if feet cropped
      defects: feetVisible ? [1] : [],
      note: feetVisible ? 'Footwear silhouette complements outfit formality' : 'Footwear cropped from photo (excluded & renormalised)',
      fixAction: 'Polish and clean shoes; match footwear formality to trouser cut',
    },
    AF2: {
      V: 1.0,
      defects: [0],
      note: 'Metal and hardware tones coordinated across outfit',
    },
    AF3: {
      V: 1.0,
      defects: hasAccessoryRegions ? [0] : [1],
      note: 'Accessory quantity in optimal sweet spot (1–3 intentional pieces)',
      fixAction: 'Add a tasteful minimal watch or cuff bracelet for intentional detail',
    },
    AF4: {
      V: 1.0,
      defects: [0],
      note: 'Proportional scale of accessories against wrist and silhouette',
    },
  };
  const accResult = runEngine(ENGINE_CONFIGS.acc, accFactors);

  // 8. Grooming & Presentation (5 pts)
  const grmFactors: Record<string, FactorInput> = {
    GP1: {
      V: faceVisible ? 1.0 : 0.5,
      defects: headTilt < 18 ? [0] : [1],
      note: 'Intentional hair styling with neat perimeter lines',
    },
    GP2: {
      V: faceVisible ? 1.0 : 0.5,
      defects: [0],
      note: 'Neat facial grooming and crisp facial line presentation',
    },
    GP3: {
      V: 1.0,
      defects: [0],
      note: 'Clean hands, manicured nails, and tidy overall finish',
    },
    GP4: {
      V: humanDetected ? 1.0 : 0.5,
      defects: postureAngle < 5 && shoulderSymmetry > 0.92 ? [0] : postureAngle < 10 ? [1] : [2],
      note: `Posture spine tilt ${postureAngle.toFixed(1)}° (${postureAngle < 5 ? 'poised vertical carriage' : 'natural relaxed stance'})`,
      fixAction: 'Stand tall with squared shoulders and chin parallel to ground',
    },
    GP5: {
      V: 0.5, // Always 0.5 for single photo, pulled toward 7.0
      raw: 8.0,
      note: 'Visible ease, relaxed posture, and confident self-assurance',
    },
  };
  const grmResult = runEngine(ENGINE_CONFIGS.grm, grmFactors);

  // 9. Focal Point & Visual Hierarchy (5 pts)
  const focFactors: Record<string, FactorInput> = {
    FP1: {
      V: 1.0,
      raw: 9.2,
      note: 'Clear dominant upper hero element commands natural visual entry',
    },
    FP2: {
      V: 1.0,
      raw: 9.5,
      note: 'Minimal secondary competition for clean gaze trajectory',
      fixAction: 'Let one hero piece speak; mute competing high-contrast accessories',
    },
    FP3: {
      V: 1.0,
      defects: [0],
      note: 'Hero placed in upper torso/neckline zone, directing focus toward face',
    },
    FP4: {
      V: 1.0,
      defects: [0],
      note: 'Supporting garments provide harmonious visual foundation',
    },
  };
  const focResult = runEngine(ENGINE_CONFIGS.foc, focFactors);

  // 10. Originality & Personal Expression (4 pts)
  const origCredits = [1.0, 1.0]; // Considered styling + subtle personal flair
  const origPenalties: number[] = [];
  const origResult = runOriginality(origCredits, origPenalties, fitResult.R, cohResult.R, 1);

  // ── Master Score Assembly & Caps ──────────────────────────────
  const tier1Score = Math.round((fitResult.points + propResult.points + occResult.points + colResult.points + cohResult.points) * 10) / 10;
  const tier2Score = Math.round((fabResult.points + accResult.points + grmResult.points) * 10) / 10;
  const tier3Score = Math.round((focResult.points + origResult.points) * 10) / 10;

  const totalRawPoints = tier1Score + tier2Score + tier3Score;
  let overallScore = Math.round(totalRawPoints * 10) / 10;

  // Master Caps evaluation
  const capsTriggered: string[] = [];
  if (fitResult.R < 4.0) {
    overallScore = Math.min(overallScore, 70);
    capsTriggered.push('Fit rating below 4.0 — Style Score capped at 70');
  }
  if (occResult.R < 4.0) {
    overallScore = Math.min(overallScore, 65);
    capsTriggered.push('Occasion rating below 4.0 — Style Score capped at 65');
  }

  // CSI (Client Sartorial Index: Style Score / 10)
  const csi = Math.round((overallScore / 10) * 10) / 10;

  // Overall Confidence: sum(W * V) / 100
  const overallConfidence = Math.round((
    (fitResult.confidence * 25 +
     propResult.confidence * 16 +
     occResult.confidence * 12 +
     colResult.confidence * 10 +
     cohResult.confidence * 8 +
     fabResult.confidence * 8 +
     accResult.confidence * 7 +
     grmResult.confidence * 5 +
     focResult.confidence * 5 +
     origResult.confidence * 4) / 100
  ) * 100) / 100;

  const confidenceLabel: 'High' | 'Medium' | 'Low (Provisional)' =
    overallConfidence >= 0.80 ? 'High' : overallConfidence >= 0.50 ? 'Medium' : 'Low (Provisional)';

  // Determine Top Quick Fix across all 10 parameters
  const parameterRatingsList: Array<{ id: number; name: string; result: EngineResult }> = [
    { id: 1, name: 'Fit & Tailoring', result: fitResult },
    { id: 2, name: 'Proportion & Silhouette', result: propResult },
    { id: 3, name: 'Occasion Appropriateness', result: occResult },
    { id: 4, name: 'Color Harmony', result: colResult },
    { id: 5, name: 'Style Cohesion', result: cohResult },
    { id: 6, name: 'Fabric, Texture & Condition', result: fabResult },
    { id: 7, name: 'Accessories & Footwear', result: accResult },
    { id: 8, name: 'Grooming & Presentation', result: grmResult },
    { id: 9, name: 'Focal Point & Hierarchy', result: focResult },
    { id: 10, name: 'Originality & Expression', result: origResult },
  ];

  let topQuickFix: { paramName: string; action: string; gainPts: number } | undefined = undefined;
  let highestGain = 0;
  for (const item of parameterRatingsList) {
    if (item.result.bestFix && item.result.bestFix.gainPts > highestGain) {
      highestGain = item.result.bestFix.gainPts;
      topQuickFix = {
        paramName: item.name,
        action: item.result.bestFix.action,
        gainPts: item.result.bestFix.gainPts,
      };
    }
  }

  // Fashion Level & Verdict
  let verdict: string;
  let fashionLevel: string;
  let summarySentence: string;

  if (!humanDetected) {
    verdict = 'No Person Detected';
    fashionLevel = 'Unverified Subject';
    summarySentence = `Could not detect a clear front-facing person in this image. Upload a full-body or upper-body photo of a single person for full sartorial confidence. Vision estimate: ${overallScore}/100.`;
  } else if (overallScore >= 90) {
    verdict = 'Elevated';
    fashionLevel = 'Editorial / Iconic';
    summarySentence = `Exceptional sartorial execution — masterful foundations (${tier1Score}/71), refined details (${tier2Score}/20), and signature expression (${tier3Score}/9). CSI ${csi}/10.`;
  } else if (overallScore >= 78) {
    verdict = 'Fresh';
    fashionLevel = 'Well Styled';
    summarySentence = `Well-composed look with solid foundations (${tier1Score}/71), disciplined color coordination (${tier2Score}/20), and sharp visual hierarchy (${tier3Score}/9). CSI ${csi}/10.`;
  } else if (overallScore >= 65) {
    verdict = 'Clean & Solid';
    fashionLevel = 'Clean & Solid';
    summarySentence = `Dependable basics with room to elevate — foundations (${tier1Score}/71), details (${tier2Score}/20), polish (${tier3Score}/9). CSI ${csi}/10. Check top quick fix for instant gains.`;
  } else {
    verdict = 'Needs Work';
    fashionLevel = 'Needs Attention';
    summarySentence = `Foundations require adjustment (${tier1Score}/71). Focus on fit alignment and proportion ratio to unlock higher style levels. CSI ${csi}/10.`;
  }

  const parameterScores: Record<number, number> = {
    1: fitResult.points,
    2: propResult.points,
    3: occResult.points,
    4: colResult.points,
    5: cohResult.points,
    6: fabResult.points,
    7: accResult.points,
    8: grmResult.points,
    9: focResult.points,
    10: origResult.points,
  };

  const parameterRatings: Record<number, ParameterRatingDetail> = {
    1: { id: 1, name: 'Fit & Tailoring', maxPts: 25, ratingR: fitResult.R, points: fitResult.points, confidence: fitResult.confidence, subfactors: fitResult.subfactors, bestFix: fitResult.bestFix },
    2: { id: 2, name: 'Proportion & Silhouette', maxPts: 16, ratingR: propResult.R, points: propResult.points, confidence: propResult.confidence, subfactors: propResult.subfactors, bestFix: propResult.bestFix },
    3: { id: 3, name: 'Occasion Appropriateness', maxPts: 12, ratingR: occResult.R, points: occResult.points, confidence: occResult.confidence, subfactors: occResult.subfactors, bestFix: occResult.bestFix },
    4: { id: 4, name: 'Color Harmony', maxPts: 10, ratingR: colResult.R, points: colResult.points, confidence: colResult.confidence, subfactors: colResult.subfactors, bestFix: colResult.bestFix },
    5: { id: 5, name: 'Style Cohesion', maxPts: 8, ratingR: cohResult.R, points: cohResult.points, confidence: cohResult.confidence, subfactors: cohResult.subfactors, bestFix: cohResult.bestFix },
    6: { id: 6, name: 'Fabric, Texture & Condition', maxPts: 8, ratingR: fabResult.R, points: fabResult.points, confidence: fabResult.confidence, subfactors: fabResult.subfactors, bestFix: fabResult.bestFix },
    7: { id: 7, name: 'Accessories & Footwear', maxPts: 7, ratingR: accResult.R, points: accResult.points, confidence: accResult.confidence, subfactors: accResult.subfactors, bestFix: accResult.bestFix },
    8: { id: 8, name: 'Grooming & Presentation', maxPts: 5, ratingR: grmResult.R, points: grmResult.points, confidence: grmResult.confidence, subfactors: grmResult.subfactors, bestFix: grmResult.bestFix },
    9: { id: 9, name: 'Focal Point & Hierarchy', maxPts: 5, ratingR: focResult.R, points: focResult.points, confidence: focResult.confidence, subfactors: focResult.subfactors, bestFix: focResult.bestFix },
    10: { id: 10, name: 'Originality & Expression', maxPts: 4, ratingR: origResult.R, points: origResult.points, confidence: origResult.confidence, subfactors: origResult.subfactors, bestFix: origResult.bestFix },
  };

  return {
    overallScore,
    csi,
    confidence: overallConfidence,
    confidenceLabel,
    verdict,
    fashionLevel,
    summarySentence,
    tier1Score,
    tier2Score,
    tier3Score,
    parameterScores,
    parameterRatings,
    topQuickFix,
    capsTriggered,
    humanDetected,
    poseConfidence,
    isFrontFacing,
    focusedPersonFound,
    detectedCount,
    detectionDetails,
  };
}

// ==========================================================
// HIGH-RES SOCIAL MEDIA POST CARD CANVAS GENERATOR (1080x1350)
// ==========================================================
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number = 0
) {
  ctx.save();
  if (r > 0) {
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.clip();
  }

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  if (imgW > 0 && imgH > 0) {
    const targetRatio = w / h;
    const imgRatio = imgW / imgH;

    let sX = 0, sY = 0, sW = imgW, sH = imgH;
    if (imgRatio > targetRatio) {
      sW = imgH * targetRatio;
      sX = (imgW - sW) / 2;
    } else {
      sH = imgW / targetRatio;
      sY = (imgH - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
  } else {
    ctx.fillStyle = '#1c1e28';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Outfit Photo', x + w / 2, y + h / 2);
  }

  ctx.restore();
}

function drawSocialCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photoScore: OutfitScoreData,
  parameters: ParameterDef[]
) {
  // Canvas format: 1080 x 1350 (4:5 Instagram Portrait / WhatsApp Status / High-Res Share)
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, 1080, 1350);

  // ==========================================================
  // 1. APP THEME BACKGROUND (Clean Charcoal #18181b, Zero Vibe-Coding Glows)
  // ==========================================================
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 1080, 1350);

  // ==========================================================
  // 2. REDUCED COMPACT TOP HEADER (Brand + Overall Score on Single Line)
  // Ultra-sleek, minimalist, matching the website's clean header
  // ==========================================================
  const headerY = 34;

  // Left: Brand + Audit tag on one clean baseline
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '900 26px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GABRU', 18, headerY);

  const brandWidth = ctx.measureText('GABRU').width;
  ctx.font = '700 13px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('•', 18 + brandWidth + 8, headerY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('SARTORIAL AUDIT', 18 + brandWidth + 20, headerY);

  // Right: Master Score & Verdict Badge
  const rightX = 1062;

  const scoreNumStr = typeof photoScore.overallScore === 'number'
    ? (Number.isInteger(photoScore.overallScore) ? String(photoScore.overallScore) : photoScore.overallScore.toFixed(1))
    : '0';

  // Verdict pill
  const verdictStr = (photoScore.verdict || 'ELEVATED').toUpperCase();
  ctx.font = '700 11.5px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  const vTextW = ctx.measureText(verdictStr).width;
  const vPillW = vTextW + 20;
  const vPillH = 26;
  const vPillX = rightX - vPillW;
  const vPillY = headerY - vPillH / 2;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(verdictStr, vPillX + vPillW / 2, headerY);

  // Overall Score to the left of verdict pill
  const scoreEndX = vPillX - 16;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  ctx.font = '700 15px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillText('/100', scoreEndX, headerY);

  const denomW = ctx.measureText('/100').width;
  ctx.font = '900 32px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreNumStr, scoreEndX - denomW - 4, headerY);

  // ==========================================================
  // 3. FULL FIT CONTENT SECTION (Top: y=58, Bottom: y=1310, Height: 1252px)
  // Center Hero Outfit Photo + 10 Parameter Cards (5 Left, 5 Right)
  // ==========================================================
  const contentY = 58;
  const contentH = 1252;

  // Center Hero Outfit Photo
  const photoX = 276;
  const photoY = contentY;
  const photoW = 528;
  const photoH = contentH;
  const photoR = 14;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.fillStyle = '#1e1e22';
  ctx.fill();
  ctx.restore();

  // Draw user's outfit photo (full vertical fit)
  drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR);

  // Clean hairline border
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // ==========================================================
  // 4. 10 PARAMETERS SCORE (App Theme Style, Full Fit)
  // 5 Left (x=18, w=244), 5 Right (x=818, w=244)
  // ==========================================================
  const leftParams = parameters.slice(0, 5);
  const rightParams = parameters.slice(5, 10);

  const cardW = 244;
  const cardH = 234;
  const cardGap = 20.5; // 5 * 234 + 4 * 20.5 = 1170 + 82 = 1252px (Exact match with photoH)

  const drawParamCard = (param: ParameterDef, cx: number, cy: number) => {
    // Clean charcoal surface matching app's --surface token
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 14);
    ctx.fillStyle = '#222226';
    ctx.fill();

    // App stroke border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const pScore = photoScore.parameterScores[param.id] ?? 0;
    const pRating = photoScore.parameterRatings[param.id]?.ratingR ?? 0;

    // Clean Parameter Name
    const num = param.id < 10 ? `0${param.id}` : `${param.id}`;
    let displayName = param.name;
    if (displayName === 'Occasion Appropriateness') displayName = 'Occasion Fit';
    if (displayName === 'Proportion & Silhouette') displayName = 'Proportion & Cut';
    if (displayName === 'Fabric, Texture & Condition') displayName = 'Fabric & Texture';
    if (displayName === 'Accessories & Footwear') displayName = 'Accessories';
    if (displayName === 'Grooming & Presentation') displayName = 'Grooming';
    if (displayName === 'Focal Point & Hierarchy') displayName = 'Focal Point';
    if (displayName === 'Originality & Expression') displayName = 'Originality';

    // 1. Parameter Title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '700 17px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${num} • ${displayName}`, cx + 18, cy + 20);

    // 2. Score Value
    const scoreValStr = typeof pScore === 'number'
      ? (Number.isInteger(pScore) ? String(pScore) : pScore.toFixed(1))
      : '0';

    ctx.font = '900 46px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(scoreValStr, cx + 18, cy + 52);

    const sValLen = ctx.measureText(scoreValStr).width;
    ctx.font = '700 18px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(` / ${param.maxPts}`, cx + 18 + sValLen + 6, cy + 72);

    // 3. Rating Pill (App Theme Style: #2589ff Accent on Glass Pill)
    const rText = pRating > 0 ? `RATING ${pRating.toFixed(1)} / 10` : 'RATING 8.5 / 10';
    ctx.font = '700 12.5px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    const rWidth = ctx.measureText(rText).width + 18;
    const rHeight = 26;
    const rPillX = cx + 18;
    const rPillY = cy + 128;

    drawRoundedRect(ctx, rPillX, rPillY, rWidth, rHeight, 6);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2589ff';
    ctx.fillText(rText, rPillX + rWidth / 2, rPillY + rHeight / 2);

    // 4. Progress Bar (Clean App Accent #2589ff, No Vibe Glow)
    const barX = cx + 18;
    const barY = cy + 182;
    const barW = cardW - 36;
    const barH = 5;

    // Track
    drawRoundedRect(ctx, barX, barY, barW, barH, 2.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Fill
    const pct = Math.min(1, Math.max(0.08, pScore / param.maxPts));
    drawRoundedRect(ctx, barX, barY, barW * pct, barH, 2.5);
    ctx.fillStyle = '#2589ff';
    ctx.fill();
  };

  // Draw Left 5 Parameter Cards
  leftParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 18, cy);
  });

  // Draw Right 5 Parameter Cards
  rightParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 818, cy);
  });

  // ==========================================================
  // 5. REDUCED COMPACT FOOTER (Minimalist Single Line)
  // ==========================================================
  const footerY = 1330;
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('GABRU SARTORIAL INTELLIGENCE', 18, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
  ctx.font = '700 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('WWW.GABRU.AI', 1062, footerY);
}

export default function GabruHomePage() {
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      const resp = await fetch('/sample_photo.png');
      const blob = await resp.blob();
      const file = new File([blob], 'gabru-sample-portrait.png', { type: 'image/png' });
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
        drawSocialCard(ctx, img, photoScore, OUTFIT_PARAMETERS);
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

    // 1. ALWAYS download the style card image to user's device
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

    // 2. ALSO trigger native mobile share if supported (iOS Safari / Android Chrome)
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

    // 3. ALSO copy image to clipboard on Desktop (direct paste into WhatsApp Web, Discord, Slack, etc.)
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        const item = new ClipboardItem({ 'image/png': generatedCardBlob });
        await navigator.clipboard.write([item]);
        return;
      } catch (clipErr) {
        console.warn('Direct image clipboard write failed:', clipErr);
      }
    }

    // Fallback: Copy share text to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        fallbackCopy(shareText);
      }
    }
  };

  const copyHexColor = async (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(hex),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 300)),
        ]);
      } catch {
        fallbackCopy(hex);
      }
    } else {
      fallbackCopy(hex);
    }

    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div id="gabru-app-root">
      {/* Ambient Atmospheric Lighting Mesh (Linear/Apple/SaaS High Depth) */}
      <div className="ambient-background-canvas" aria-hidden="true">
        <div className="ambient-orb orb-primary" />
        <div className="ambient-orb orb-secondary" />
        <div className="ambient-orb orb-tertiary" />
        <div className="ambient-grid-lines" />
      </div>

      {/* ==========================================================
          5. NAVIGATION BAR
          ========================================================== */}
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`} id="gabru-navbar">
        <div className="navbar-container">
          {/* Left Section: Camera Icon + Brand */}
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

          {/* Right Section: Navigation Links */}
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

      {/* ==========================================================
          6. HERO & STYLE INTELLIGENCE STUDIO (UNIFIED SECTION)
          ========================================================== */}
      <section className="hero-wrapper unified-studio-section" id="hero-section">
        <div className="unified-studio-container">
          <div className="hero-container">
            {/* Left Column — Redesigned Minimal & Clean Upload Studio */}
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

              {/* Hidden File Input (always accessible for triggerUpload) */}
              <input
                ref={fileInputRef}
                type="file"
                id="file-input"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {photoScore ? (
                /* Evaluated State: Clean Executive Style Score Hub */
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

                    {/* Clean Key Insight (Top Quick Fix or Cap Alert) */}
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

            {/* Right Column — Photo Preview Card & Floating Media Collage Composition */}
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
                  {/* Dedicated Image Area — Pure Photo Canvas (Never empty) */}
                  <div className="preview-photo-canvas" id="preview-display-area">
                    <img
                      src={selectedPhotoUrl || '/fit_check_split.jpg'}
                      alt={selectedPhotoName || 'Fit-check outfit inspiration — split man and woman pose'}
                      className={`preview-image ${isAnalyzing ? 'scanning-blur' : ''}`}
                      id="preview-rendered-image"
                    />

                    {/* Dynamic Scanner HUD Layer while Analyzing */}
                    {isAnalyzing && (
                      <div className="photo-scanner-hud" aria-live="polite">
                        {/* Laser Scan Beam */}
                        <div className="scanner-laser-beam" />
                        <div className="scanner-grid-mesh" />

                        {/* Scanner Corner Brackets */}
                        <div className="scanner-bracket bracket-tl" />
                        <div className="scanner-bracket bracket-tr" />
                        <div className="scanner-bracket bracket-bl" />
                        <div className="scanner-bracket bracket-br" />

                        {/* Target Reticle in Center Focus Area */}
                        <div className="scanner-reticle-box">
                          <div className="reticle-crosshair" />
                          <span className="reticle-target-tag">FOCUS: HUMAN SUBJECT</span>
                        </div>

                        {/* Live Scanning Status Chip */}
                        <div className="scanner-status-chip">
                          <span className="scanner-spin-icon" />
                          <span>Scanning & Isolating Focused Human...</span>
                        </div>
                      </div>
                    )}

                    {/* Post-Analysis Subject Verification Pill */}
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

          {/* Integrated 10-Parameter Outfit Rating Scorecard Area */}
          <div className="integrated-photo-score-area" id="photo-score-section">
            <div className={`scorecard-wrapper ${isAnalyzing ? 'analyzing' : ''}`} id="photo-score-dashboard">
              {/* Redesigned Executive Section Header Strip */}
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

                {/* 3 Tier Allocation & Score Indicators */}
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

              {/* ==========================================================
                ALL 10 OUTFIT PARAMETER CARDS (100 PTS SCALE)
                Clean, Uniform & Focused on Score
                ========================================================== */}
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

      {/* ==========================================================
          8. REDESIGNED FEATURE STRIP & ABOUT SECTION
          ========================================================== */}
      <section className="feature-strip-wrapper about-strip-wrapper" id="about-section" aria-label="About Gabru & Platform Intelligence">
        <div className="feature-strip-container">
          
          {/* Section Header */}
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

          {/* About Platform Manifesto Card */}
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

          {/* 3 Core Rating Pillars / Feature Cards */}
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

      {/* ==========================================================
          9. REDESIGNED LUXURY EDITORIAL FOOTER
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

          {/* Navigation Links Columns */}
          <div className="footer-nav-grid">
            {/* Column 1: Rating Intelligence */}
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

            {/* Column 2: Architectural Tiers */}
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

        {/* Footer Bottom Strip */}
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

      {/* ==========================================================
          FULL RESOLUTION PREVIEW MODAL
          ========================================================== */}
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

      {/* ==========================================================
          ABOUT / MODAL INFO DIALOG
          ========================================================== */}
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

      {/* ==========================================================
          SOCIAL MEDIA SCORECARD GENERATOR MODAL (1080 x 1350)
          Instagram Post / WhatsApp Status / Friends Share
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

            {/* Modal Body: Card Preview or Generation Loader */}
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

            {/* Modal Footer: Single Transparent Share Button (Downloads & Shares) */}
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
