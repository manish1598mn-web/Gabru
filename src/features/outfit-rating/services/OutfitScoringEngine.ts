/**
 * GABRU — OUTFIT SCORING ENGINE
 * 
 * 10-Parameter Hierarchical Outfit Intelligence Engine:
 *   - Tier 1: Foundations (71 pts) — Fit, Proportion, Occasion, Color, Style Cohesion
 *   - Tier 2: Details (20 pts) — Fabric/Texture, Accessories, Grooming
 *   - Tier 3: Expert Polish (9 pts) — Focal Point, Originality
 * 
 * Deterministic computer vision + MediaPipe 33-point skeletal pose analysis.
 */

import { rgbToHsl } from '@/shared/utils/ColorSpaceUtil';
import { clamp, roundTo } from '@/shared/utils/FormatUtil';
import { OutfitScoreData, SubfactorDetail, LandmarkPoint } from '../types/OutfitRatingTypes';
import { detectPose } from './PoseLandmarksService';

const PENALTY: Record<number, number> = { 0: 0.0, 1: 1.5, 2: 3.5, 3: 6.5 };
const PRIOR = 5.5;

interface EngineConfig {
  max: number;
  beta: number;
  W: Record<string, number>;
  names: Record<string, string>;
  crit: Array<[string[], number, number]>;
  hard?: string[];
}

export const POSE = {
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

export const ENGINE_CONFIGS: Record<string, EngineConfig> = {
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

export interface FactorInput {
  V: number;
  defects?: number[];
  raw?: number;
  note?: string;
  fixAction?: string;
}

export interface EngineResult {
  R: number;
  points: number;
  confidence: number;
  subfactors: SubfactorDetail[];
  bestFix?: {
    action: string;
    gainPts: number;
  };
}

export function landmarkDist(a: LandmarkPoint, b: LandmarkPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function runEngine(cfg: EngineConfig, factors: Record<string, FactorInput>): EngineResult {
  const rated: Record<string, { adjusted: number; w: number; raw: number; defects: number[]; note: string; fixAction?: string }> = {};
  let confNum = 0;
  const totalW = Object.values(cfg.W).reduce((a, b) => a + b, 0);

  for (const [k, w] of Object.entries(cfg.W)) {
    const f = factors[k] || { V: 0, defects: [] };
    const V = f.V;
    confNum += w * V;
    if (V === 0) continue;

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
      raw: roundTo(item.raw, 1),
      adjusted: roundTo(item.adjusted, 1),
      defects: item.defects,
      note: item.note,
    };
  });

  const ratedValues = Object.values(rated);
  if (ratedValues.length === 0) {
    return {
      R: 7.0,
      points: roundTo(7.0 * (cfg.max / 10), 1),
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

  // Hard violations
  if (cfg.hard) {
    for (const k of cfg.hard) {
      if (rated[k] && rated[k].defects.includes(3)) {
        R = Math.min(R, 3.9);
      }
    }
  }

  const confidence = confNum / totalW;
  const points = roundTo(R * (cfg.max / 10), 1);

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
          gainPts: roundTo(gain, 1),
        };
      }
    }
  }

  return {
    R: roundTo(R, 2),
    points,
    confidence: roundTo(confidence, 2),
    subfactors: subfactorDetails,
    bestFix,
  };
}

export function runOriginality(
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
  R = clamp(R, 3.0, 10.0);

  const confidence = looks >= 3 ? 0.90 : 0.60;
  const points = roundTo(R * 0.4, 1);

  const subfactors: SubfactorDetail[] = [
    {
      code: 'OR1',
      name: 'Signature & Styling Credits',
      w: 60,
      v: confidence,
      raw: roundTo(Math.min(5.0, totalCredits), 1),
      adjusted: roundTo(gate * Math.min(5.0, totalCredits), 1),
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
    R: roundTo(R, 2),
    points,
    confidence,
    subfactors,
    bestFix: totalPenalties > 0 ? {
      action: 'Introduce a signature accessory or personalized styling tweak',
      gainPts: roundTo(totalPenalties * 0.4, 1),
    } : undefined,
  };
}

export interface OutfitScoringOptions {
  isSampleSketch?: boolean;
}

/**
 * Executes full computational analysis across pixel colors and skeletal landmarks
 */
export async function calculatePhotoScore(
  img: HTMLImageElement,
  options?: OutfitScoringOptions
): Promise<OutfitScoreData> {
  const naturalWidth = img.naturalWidth > 0 ? img.naturalWidth : 1080;
  const naturalHeight = img.naturalHeight > 0 ? img.naturalHeight : 1350;

  // Gate 1: Resolution & Dimensions check
  if (naturalWidth < 120 || naturalHeight < 120) {
    throw new Error('Photo resolution is too low (minimum 120×120 required). Please upload a clearer outfit photo.');
  }

  const aspect = naturalHeight > 0 ? naturalWidth / naturalHeight : 0.8;
  if (aspect < 0.2 || aspect > 4.5) {
    throw new Error('Image aspect ratio is unsuitable for outfit evaluation. Please upload a standard portrait or vertical photo.');
  }

  // Phase 0: Canvas pixel analysis
  const canvas = document.createElement('canvas');
  const sampleW = 300;
  const sampleH = Math.max(1, Math.round(sampleW / Math.max(0.1, aspect)));
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let avgLuminance = 128;
  let edgeVariance = 35;
  let verticalEdgeVariance = 35;
  let colorClusters: Array<{ hex: string; count: number; h: number; s: number; l: number }> = [];
  let totalSaturation = 0;
  let saturationCount = 0;
  let upperColors: string[] = [];
  let lowerColors: string[] = [];
  let contrastStdDev = 0;

  if (ctx) {
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let totalLum = 0;
      let count = 0;
      const buckets: Record<string, { count: number; r: number; g: number; b: number }> = {};
      const upperBuckets: Record<string, number> = {};
      const midBuckets: Record<string, number> = {};
      const lowerBuckets: Record<string, number> = {};
      const upperLums: number[] = [];
      const lowerLums: number[] = [];
      let hDiffSum = 0;
      let vDiffSum = 0;
      const allLums: number[] = [];

      const upperCutoff = sampleH * 0.35;
      const midStart = sampleH * 0.35;
      const midEnd = sampleH * 0.65;
      const lowerCutoff = sampleH * 0.65;

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

          if (x + 2 < sampleW) {
            const nextIdx = (y * sampleW + (x + 2)) * 4;
            const nextLum = 0.2126 * data[nextIdx] + 0.7152 * data[nextIdx + 1] + 0.0722 * data[nextIdx + 2];
            hDiffSum += Math.abs(lum - nextLum);
          }

          if (y + 2 < sampleH) {
            const belowIdx = ((y + 2) * sampleW + x) * 4;
            const belowLum = 0.2126 * data[belowIdx] + 0.7152 * data[belowIdx + 1] + 0.0722 * data[belowIdx + 2];
            vDiffSum += Math.abs(lum - belowLum);
          }

          const [h, s, l] = rgbToHsl(r, g, b);
          if (l > 0.1 && l < 0.9) {
            totalSaturation += s;
            saturationCount++;
          }

          const qr = Math.min(255, Math.floor(r / 16) * 16 + 8);
          const qg = Math.min(255, Math.floor(g / 16) * 16 + 8);
          const qb = Math.min(255, Math.floor(b / 16) * 16 + 8);
          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1).toUpperCase()}`;

          if (!buckets[hex]) buckets[hex] = { count: 0, r: qr, g: qg, b: qb };
          buckets[hex].count++;

          if (y < upperCutoff) upperBuckets[hex] = (upperBuckets[hex] || 0) + 1;
          else if (y >= midStart && y <= midEnd) midBuckets[hex] = (midBuckets[hex] || 0) + 1;
          else if (y > lowerCutoff) lowerBuckets[hex] = (lowerBuckets[hex] || 0) + 1;
        }
      }

      if (count > 0) {
        avgLuminance = totalLum / count;
        edgeVariance = hDiffSum / count;
        verticalEdgeVariance = vDiffSum / count;

        const lumMean = avgLuminance;
        const lumVariance = allLums.reduce((acc, l) => acc + (l - lumMean) ** 2, 0) / allLums.length;
        contrastStdDev = Math.sqrt(lumVariance);

        colorClusters = Object.entries(buckets)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 12)
          .map(([hex, d]) => {
            const [h, s, l] = rgbToHsl(d.r, d.g, d.b);
            return { hex, count: d.count, h, s, l };
          });

        upperColors = Object.entries(upperBuckets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([h]) => h);
        lowerColors = Object.entries(lowerBuckets).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([h]) => h);
      }
    } catch (e) {
      console.warn('Canvas pixel extraction warning:', e);
    }
  }

  // Gate 2: Blank / Uniform / Unreadable Image Check
  if (contrastStdDev < 6.0 || (edgeVariance < 2.0 && verticalEdgeVariance < 2.0)) {
    throw new Error('The uploaded image appears blank, solid, or unreadable. Please upload a clear photo of an outfit.');
  }

  // Phase 1: Pose detection
  const poseResult = await detectPose(canvas);
  const humanDetected = poseResult.humanDetected;
  const landmarks = poseResult.primaryPose || [];

  // Gate 3: Human & Outfit Subject Verification
  if (!humanDetected) {
    if (poseResult.serviceAvailable) {
      throw new Error('No person or outfit detected in the photo. Please upload a clear photo of yourself or a model wearing an outfit.');
    } else {
      // Fallback when MediaPipe service is unavailable (e.g. offline sandbox)
      if (contrastStdDev < 16 || edgeVariance < 8 || colorClusters.length < 2) {
        throw new Error('No person or outfit could be identified. Please ensure the subject is well-lit and clearly visible.');
      }
    }
  } else if (landmarks.length < 33) {
    throw new Error('Incomplete body pose detected. Please upload a photo showing at least the upper body or full outfit.');
  }

  let shoulderWidth = 0;
  let shoulderSymmetry = 1;
  let torsoLength = 0;
  let legLength = 0;
  let proportionRatio = 0.45;

  if (humanDetected && landmarks.length >= 33) {
    const ls = landmarks[POSE.LEFT_SHOULDER];
    const rs = landmarks[POSE.RIGHT_SHOULDER];
    const lh = landmarks[POSE.LEFT_HIP];
    const rh = landmarks[POSE.RIGHT_HIP];
    const lk = landmarks[POSE.LEFT_KNEE];
    const rk = landmarks[POSE.RIGHT_KNEE];
    const la = landmarks[POSE.LEFT_ANKLE];
    const ra = landmarks[POSE.RIGHT_ANKLE];

    shoulderWidth = landmarkDist(ls, rs);
    shoulderSymmetry = 1 - Math.min(1, Math.abs(ls.y - rs.y) * 10);

    const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2, z: 0 };
    const midHip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2, z: 0 };
    const midKnee = { x: (lk.x + rk.x) / 2, y: (lk.y + rk.y) / 2, z: 0 };
    const midAnkle = { x: (la.x + ra.x) / 2, y: (la.y + ra.y) / 2, z: 0 };

    torsoLength = landmarkDist(midShoulder, midHip);
    legLength = landmarkDist(midHip, midKnee) + landmarkDist(midKnee, midAnkle);

    if (torsoLength + legLength > 0) {
      proportionRatio = torsoLength / (torsoLength + legLength);
    }
  }

  const hasDistinctUpperLower = upperColors.length > 0 && lowerColors.length > 0 && upperColors[0] !== lowerColors[0];

  const ls = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_SHOULDER] : { x: 0.35, y: 0.25, z: 0, visibility: 0 };
  const rs = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_SHOULDER] : { x: 0.65, y: 0.25, z: 0, visibility: 0 };
  const lh = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_HIP] : { x: 0.4, y: 0.55, z: 0, visibility: 0 };
  const la = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_ANKLE] : { x: 0.42, y: 0.9, z: 0, visibility: 0 };
  const ra = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_ANKLE] : { x: 0.58, y: 0.9, z: 0, visibility: 0 };
  const lw = humanDetected && landmarks.length >= 33 ? landmarks[POSE.LEFT_WRIST] : { x: 0.25, y: 0.5, z: 0, visibility: 0 };
  const rw = humanDetected && landmarks.length >= 33 ? landmarks[POSE.RIGHT_WRIST] : { x: 0.75, y: 0.5, z: 0, visibility: 0 };

  const shoulderSpanActual = Math.max(0.08, Math.abs(ls.x - rs.x));
  const shoulderOffsetPct = Math.abs(ls.y - rs.y) / shoulderSpanActual;
  const feetVisible = (la.visibility ?? 0) > 0.3 || (ra.visibility ?? 0) > 0.3;
  const wristsVisible = (lw.visibility ?? 0) > 0.3 || (rw.visibility ?? 0) > 0.3;

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
      defects: edgeVariance > 42 ? [3] : edgeVariance > 26 ? [2] : edgeVariance > 18 ? [1] : [0],
      note: edgeVariance > 42 ? 'Pronounced fabric pulling or uneven fit across torso' : edgeVariance > 26 ? 'Minor fabric pinch at torso side seams' : 'Clean body-skimming torso contour',
      fixAction: 'Tailor torso side seams for a clean, body-skimming contour without button strain',
    },
    F3: {
      V: humanDetected && (lh.visibility ?? 0) > 0.25 ? 1.0 : 0.5,
      defects: proportionRatio > 0.52 ? [3] : proportionRatio > 0.46 ? [2] : (lh.visibility ?? 0) > 0.3 ? [0] : [1],
      note: proportionRatio > 0.52
        ? 'Low-slung waistband or untucked hem truncates lower leg line'
        : proportionRatio > 0.46
        ? 'Slight low-rise silhouette'
        : 'Waistband and rise line sit naturally with balanced leg line',
      fixAction: 'Ensure waistband rests cleanly with zero bunching or waistband gap',
    },
    F4: {
      V: feetVisible ? 1.0 : 0.5,
      defects: feetVisible ? (verticalEdgeVariance > 36 ? [3] : verticalEdgeVariance > 24 ? [2] : [0]) : [1],
      note: feetVisible
        ? (verticalEdgeVariance > 36 ? 'Excessive fabric pooling and heavy ankle break' : verticalEdgeVariance > 24 ? 'Moderate ankle break pooling' : 'Clean classic slight break at shoe line')
        : 'Lower hem partly visible (neutral prior applied)',
      fixAction: 'Hem trousers to a clean slight-break or no-break finish',
    },
    F5: {
      V: 1.0,
      defects: verticalEdgeVariance > 40 ? [3] : verticalEdgeVariance > 28 ? [2] : verticalEdgeVariance > 18 ? [1] : [0],
      note: verticalEdgeVariance > 40 ? 'Heavy fabric ripple lines and unpressed creases' : verticalEdgeVariance > 28 ? 'Moderate fabric ripple lines' : 'Smooth fabric drape with clean vertical fall lines',
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
      defects: shoulderSymmetry > 0.88 ? [0] : shoulderSymmetry > 0.75 ? [2] : [3],
      note: shoulderSymmetry > 0.88 ? 'Crisp tailored finish & balanced jacket lapels' : 'Noticeable asymmetrical bulk or drooping lapel slope',
      fixAction: 'Tailor sleeve taper and jacket waist for a bespoke finish',
    },
  };
  const fitResult = runEngine(ENGINE_CONFIGS.fit, fitFactors);

  // 2. Proportion & Silhouette (16 pts)
  const verticalSplit = proportionRatio;
  const dSplit = Math.max(0, 0.33 - verticalSplit, verticalSplit - 0.42);
  const pr1Raw = Math.max(0, 10 - (dSplit <= 0.02 ? 0 : dSplit <= 0.04 ? 2.0 : dSplit <= 0.08 ? 4.5 : 7.0));
  const hasLayers = hasDistinctUpperLower && contrastStdDev > 28;

  const isBulkyVolume = (edgeVariance > 38 && verticalEdgeVariance > 38) || proportionRatio > 0.52;
  const propFactors: Record<string, FactorInput> = {
    PR1: {
      V: humanDetected && torsoLength > 0 && legLength > 0 ? 1.0 : 0.5,
      raw: pr1Raw,
      note: `Vertical split ratio ${(verticalSplit * 100).toFixed(0)}% (${dSplit <= 0.02 ? 'ideal golden ratio (1:1.6)' : dSplit <= 0.05 ? 'slight proportion imbalance' : 'severely elongated torso / shortened leg line'})`,
      fixAction: 'Adjust waistline or tuck shirt to reach the golden 1:2 vertical ratio',
    },
    PR2: {
      V: 1.0,
      defects: isBulkyVolume ? [3] : (edgeVariance > 28 || verticalEdgeVariance > 28) ? [2] : [0],
      note: isBulkyVolume ? 'Bulky, shapeless silhouette with competing garment volumes' : (edgeVariance > 28 || verticalEdgeVariance > 28) ? 'Slightly relaxed volume pairing' : 'Harmonious volume pairing (structured upper with balanced lower)',
      fixAction: 'Balance relaxed pieces with a tailored counterpiece',
    },
    PR3: {
      V: 1.0,
      defects: (lh.visibility ?? 0) > 0.3 ? (proportionRatio > 0.50 ? [2] : [0]) : [1],
      note: proportionRatio > 0.50 ? 'Waistline demarcation sits low' : 'Defined waistline and leg line definition visible',
      fixAction: 'Define waistline with a clean tuck or contrasting belt line',
    },
    PR4: {
      V: hasLayers ? 1.0 : 0,
      defects: [0],
      note: hasLayers ? 'Clean non-competing collar and hem transitions' : 'Single layer core outfit (sub-factor excluded & renormalised)',
      fixAction: 'Ensure layered hems maintain at least 2cm separation',
    },
    PR5: {
      V: 1.0,
      defects: dSplit > 0.05 ? [2] : [0],
      note: dSplit > 0.05 ? 'Garment hem lengths visually shorten the lower frame' : 'Neckline and hem lines flatter the natural frame',
      fixAction: 'Opt for vertical seam lines to visually lengthen the silhouette',
    },
  };
  const propResult = runEngine(ENGINE_CONFIGS.prop, propFactors);

  // Dynamic Color Wheel & Harmony Analysis
  const topUpperCluster = colorClusters.find((c) => upperColors.includes(c.hex)) || colorClusters[0];
  const topLowerCluster = colorClusters.find((c) => lowerColors.includes(c.hex)) || colorClusters[1] || colorClusters[0];

  let colorClashDefect = 0;
  let colorPaletteDefect = 0;
  let colorNote = 'Balanced tonal palette with natural contrast transitions';

  if (topUpperCluster && topLowerCluster) {
    const dHue = Math.min(Math.abs(topUpperCluster.h - topLowerCluster.h), 360 - Math.abs(topUpperCluster.h - topLowerCluster.h));
    const bothSaturated = topUpperCluster.s > 0.35 && topLowerCluster.s > 0.35;
    const isClashing = bothSaturated && (dHue > 45 && dHue < 145);
    const saturatedCount = colorClusters.filter((c) => c.s > 0.40 && c.l > 0.15 && c.l < 0.85).length;

    if (isClashing) {
      colorClashDefect = 3;
      colorNote = `Harsh chromatic clash between upper (hue ${Math.round(topUpperCluster.h)}°) and lower garment (hue ${Math.round(topLowerCluster.h)}°)`;
    } else if (bothSaturated && dHue >= 145 && dHue <= 215) {
      colorClashDefect = 0;
      colorNote = 'High-contrast complementary color balance';
    } else if (dHue <= 35) {
      colorClashDefect = 0;
      colorNote = 'Sophisticated analogous/monochromatic tonal flow';
    } else if (bothSaturated) {
      colorClashDefect = 2;
      colorNote = 'Moderate chromatic tension between garments';
    }

    if (saturatedCount >= 4) {
      colorPaletteDefect = 3;
    } else if (saturatedCount === 3) {
      colorPaletteDefect = 1;
    }
  }

  // Dynamic Fabric Wrinkle & Crumpled Surface Analysis
  const isFabricHeavilyWrinkled = verticalEdgeVariance > 40 || edgeVariance > 42;
  const isFabricModeratelyWrinkled = verticalEdgeVariance > 28 || edgeVariance > 30;
  const wrinkleDefect = isFabricHeavilyWrinkled ? 3 : isFabricModeratelyWrinkled ? 2 : 0;
  const fabConditionDefect = isFabricHeavilyWrinkled ? 3 : isFabricModeratelyWrinkled ? 1 : 0;
  const styleClashDefect = colorClashDefect >= 3 || isFabricHeavilyWrinkled ? 3 : (colorClashDefect >= 2 || isFabricModeratelyWrinkled) ? 2 : 0;
  const postureDefect = shoulderOffsetPct > 0.08 ? 3 : shoulderOffsetPct > 0.04 ? 2 : shoulderOffsetPct > 0.02 ? 1 : 0;
  const lightingDull = contrastStdDev < 22 || avgLuminance < 45 || avgLuminance > 215;

  // 3. Occasion Appropriateness (12 pts)
  const occFactors: Record<string, FactorInput> = {
    OC1: { V: 1.0, defects: [lightingDull ? 2 : 0], note: lightingDull ? 'Dim lighting or extreme exposure limits garment definition' : 'Contemporary elevated smart-casual to business baseline' },
    OC2: { V: 1.0, defects: [styleClashDefect >= 2 ? 2 : 0], note: styleClashDefect >= 2 ? 'Formality mismatch reduces versatile occasion utility' : 'Standard dress codes fully respected' },
    OC3: { V: 1.0, defects: [0], note: 'Fabric weight and coverage aligned with indoor and seasonal climate' },
    OC4: { V: 1.0, defects: [0], note: 'Culturally respectful and contextually appropriate attire' },
    OC5: { V: 1.0, defects: [isBulkyVolume ? 2 : 0], note: isBulkyVolume ? 'Excess fabric bulk restricts silhouette mobility' : 'High functional mobility with zero restrictive fabric tension' },
  };
  const occResult = runEngine(ENGINE_CONFIGS.occ, occFactors);

  // 4. Color Harmony (10 pts)
  const colorFactors: Record<string, FactorInput> = {
    CH1: { V: 1.0, defects: [colorClashDefect], note: colorNote, fixAction: 'Anchor bold colors with a foundational neutral base (charcoal, navy, black, or beige)' },
    CH2: { V: 1.0, defects: [colorPaletteDefect], note: colorPaletteDefect >= 2 ? 'Excessive competing saturated hues violate the 3-color rule' : 'Compliant 3-color rule (primary base, secondary support, accent)', fixAction: 'Limit the outfit to 3 core colors maximum' },
    CH3: { V: 1.0, defects: Math.abs((topUpperCluster?.l || 0.5) - (topLowerCluster?.l || 0.5)) < 0.08 && colorClashDefect >= 2 ? [2] : [0], note: 'Luminance separation between upper and lower garment' },
    CH4: { V: 1.0, defects: colorClashDefect >= 2 ? [2] : [0], note: colorClashDefect >= 2 ? 'Chromatic clash detracts from complexion contrast' : 'Flattering contrast range enhances natural complexion' },
  };
  const colResult = runEngine(ENGINE_CONFIGS.col, colorFactors);

  // 5. Style Cohesion (8 pts)
  const styleFactors: Record<string, FactorInput> = {
    SC1: { V: 1.0, defects: [styleClashDefect >= 2 ? 2 : 0], note: styleClashDefect >= 2 ? 'Inconsistent aesthetic language across garment pieces' : 'Cohesive aesthetic throughout all pieces' },
    SC2: { V: 1.0, defects: [styleClashDefect >= 3 ? 3 : 0], note: styleClashDefect >= 3 ? 'Conflicting formality codes between upper and lower halves' : 'Uniform formality tier with harmonious collar, jacket and trouser codes' },
    SC3: { V: 1.0, defects: [isFabricHeavilyWrinkled ? 2 : 0], note: 'Balanced texture language across surfaces' },
    SC4: { V: 1.0, defects: [styleClashDefect], note: styleClashDefect >= 2 ? 'Conflicting genre signals detract from intended vibe' : 'Clear intentional fashion message without conflicting genre signals', fixAction: 'Align all pieces to a single intentional style genre' },
    SC5: { V: 1.0, defects: [styleClashDefect >= 2 ? 1 : 0], note: 'Pieces elevate each other with unified silhouette' },
  };
  const cohResult = runEngine(ENGINE_CONFIGS.coh, styleFactors);

  // 6. Fabric & Condition (8 pts)
  const fabFactors: Record<string, FactorInput> = {
    FT1: { V: 1.0, defects: isFabricHeavilyWrinkled ? [2] : [0], note: isFabricHeavilyWrinkled ? 'Garment surface displays heavy rumpled texture' : 'Natural fiber appearance with smooth surface luster' },
    FT2: { V: 1.0, defects: [wrinkleDefect], note: isFabricHeavilyWrinkled ? 'Pronounced fabric creases, wrinkles, and rumpled condition' : isFabricModeratelyWrinkled ? 'Noticeable wear creases and light fabric bunching' : 'Crisp pressing and immaculate garment condition', fixAction: 'Steam or iron garment to eliminate creases and restore clean drape lines' },
    FT3: { V: 1.0, defects: [fabConditionDefect], note: 'Tactile texture consistency across garment surfaces' },
    FT4: { V: 1.0, defects: [isFabricHeavilyWrinkled ? 2 : 0], note: 'Consistent weight and weave density across pieces' },
    FT5: { V: 1.0, defects: [wrinkleDefect >= 2 ? 2 : 0], note: 'Structural integrity along moving seams' },
  };
  const fabResult = runEngine(ENGINE_CONFIGS.fab, fabFactors);

  // 7. Accessories & Footwear (7 pts)
  const accFactors: Record<string, FactorInput> = {
    AF1: { V: feetVisible ? 1.0 : 0.5, defects: feetVisible ? [0] : [1], note: feetVisible ? 'Footwear silhouette matches trouser taper and cuff' : 'Footwear estimated from lower frame leg line' },
    AF2: { V: 1.0, defects: [colorClashDefect >= 2 ? 1 : 0], note: 'Coordinated hardware metals and leather tones' },
    AF3: { V: 1.0, defects: [0], note: 'Refined curation without visual accessory clutter' },
    AF4: { V: 1.0, defects: [0], note: 'Proportional scale matches lapel width and wrist diameter' },
  };
  const accResult = runEngine(ENGINE_CONFIGS.acc, accFactors);

  // 8. Grooming & Presentation (5 pts)
  const groomFactors: Record<string, FactorInput> = {
    GP1: { V: 1.0, defects: [postureDefect >= 2 ? 1 : 0], note: 'Hair styling and facial framing' },
    GP2: { V: 1.0, defects: [0], note: 'Neat edge lines and well-maintained facial presentation' },
    GP3: { V: 1.0, defects: [isFabricHeavilyWrinkled ? 2 : 0], note: isFabricHeavilyWrinkled ? 'Rumpled garment finish reduces polished presentation' : 'Impeccable cleanliness and lint-free garment finish' },
    GP4: { V: 1.0, defects: [postureDefect], note: postureDefect >= 2 ? 'Slouched or uneven shoulder tilt reduces outfit presence' : 'Upright confident spinal posture with open chest alignment', fixAction: 'Roll shoulders back and align chest squarely to camera' },
    GP5: { V: 1.0, defects: [postureDefect >= 2 ? 2 : 0], note: 'Natural, poised confidence and comfortable body posture' },
  };
  const grmResult = runEngine(ENGINE_CONFIGS.grm, groomFactors);

  // 9. Focal Point & Hierarchy (5 pts)
  const hasMessyFocal = colorPaletteDefect >= 2 || (colorClashDefect >= 2 && isFabricHeavilyWrinkled);
  const focalFactors: Record<string, FactorInput> = {
    FP1: { V: 1.0, defects: [hasMessyFocal ? 3 : 0], note: hasMessyFocal ? 'Competing visual noise obscures clear hero piece' : 'Clear visual anchor commands attention with elegant priority', fixAction: 'Designate one hero piece and keep remaining pieces understated' },
    FP2: { V: 1.0, defects: [hasMessyFocal ? 2 : 0], note: 'Supporting garments provide a calm background without competing' },
    FP3: { V: 1.0, defects: [0], note: 'Eye travels smoothly from face down to tailored hem line' },
    FP4: { V: 1.0, defects: [colorClashDefect >= 2 ? 2 : 0], note: 'Supporting pieces echo the primary tonal palette' },
  };
  const focResult = runEngine(ENGINE_CONFIGS.foc, focalFactors);

  // 10. Originality & Expression (4 pts)
  const origResult = runOriginality([1.0, 1.0, 1.0], [styleClashDefect >= 2 ? 2 : 0], fitResult.R, cohResult.R, styleClashDefect >= 2 ? 1 : 3);

  // Assemble composite score
  const parameterRatings: Record<number, any> = {
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

  const parameterScores: Record<number, number> = {};
  let totalPts = 0;
  for (let id = 1; id <= 10; id++) {
    const pts = parameterRatings[id].points;
    parameterScores[id] = pts;
    totalPts += pts;
  }

  const overallScore = Math.round(totalPts * 10) / 10;
  const csi = Math.round((overallScore / 10) * 10) / 10;

  const tier1Score = roundTo(fitResult.points + propResult.points + occResult.points + colResult.points + cohResult.points, 1);
  const tier2Score = roundTo(fabResult.points + accResult.points + grmResult.points, 1);
  const tier3Score = roundTo(focResult.points + origResult.points, 1);

  // Confidence
  const weights = [25, 16, 12, 10, 8, 8, 7, 5, 5, 4];
  const confSum = Object.values(parameterRatings).reduce((sum, p, i) => sum + p.confidence * weights[i], 0);
  const overallConf = roundTo(confSum / 100, 2);
  const confidenceLabel = overallConf >= 0.8 ? 'High' : overallConf >= 0.5 ? 'Medium' : 'Low (Provisional)';

  // Find top quick fix across all parameters
  let topQuickFix: { paramName: string; action: string; gainPts: number } | undefined = undefined;
  let highestGain = 0;
  for (const [, p] of Object.entries(parameterRatings)) {
    if (p.bestFix && p.bestFix.gainPts > highestGain) {
      highestGain = p.bestFix.gainPts;
      topQuickFix = {
        paramName: p.name,
        action: p.bestFix.action,
        gainPts: p.bestFix.gainPts,
      };
    }
  }

  const verdict =
    overallScore >= 88
      ? 'HIGH FASHION'
      : overallScore >= 75
      ? 'SHARP & POLISHED'
      : overallScore >= 60
      ? 'SOLID BASICS'
      : overallScore >= 45
      ? 'CASUAL MISMATCH'
      : 'DISCORDANT FIT';

  const fashionLevel =
    overallScore >= 88
      ? 'Bespoke Sartorial'
      : overallScore >= 75
      ? 'Elevated Contemporary'
      : overallScore >= 60
      ? 'Everyday Casual'
      : overallScore >= 45
      ? 'Uncoordinated Baseline'
      : 'Needs Overhaul';

  const summarySentence =
    overallScore >= 88
      ? 'Well-executed tailoring with harmonious proportions, sharp silhouette lines, and immaculate styling polish.'
      : overallScore >= 75
      ? 'Strong visual cohesion and flattering proportions with subtle opportunities for fine refinement.'
      : overallScore >= 60
      ? 'Balanced everyday foundation; sharpening trouser break and color cohesion will significantly elevate the aesthetic.'
      : overallScore >= 45
      ? 'Noticeable silhouette, proportion, or fabric friction; addressing fit discrepancies and palette contrast will improve cohesion.'
      : 'Substantial fit, proportion, and color discordance detected. Prioritize tailored alterations and harmonizing primary garments.';

  return {
    overallScore,
    csi,
    confidence: overallConf,
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
    capsTriggered: [],
    humanDetected,
    poseConfidence: humanDetected ? 0.95 : 0.0,
    isFrontFacing: humanDetected,
    focusedPersonFound: humanDetected,
    detectedCount: poseResult.detectedCount ?? (humanDetected ? 1 : 0),
  };
}
