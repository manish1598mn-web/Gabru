/**
 * GABRU — HAND LINE (PALM) SCORING ENGINE
 * 
 * Implements palm_score_v1.py scoring algorithm:
 * - Step 1: Photo quality factor gate q (sharpness, width, shadow/glare, tilt, fingers spread)
 * - Step 2: 10 Parameter Prominence Scores (0-100)
 * - Step 3: Confidence thresholds (q * detection_confidence, < 0.40 = unreadable)
 * - Step 4: Overall Prominence Index (Average of readable scores with Zero vs Exclude policy)
 * - Rule-matched traditional readings (Western Chiromancy vs Indian Samudrika Shastra)
 */

import {
  HandReadingResult,
  HandParameterScore,
  PhotoQualityGate,
  PalmTradition,
  AbsentFeaturePolicy,
  ProminenceBand,
  HandShapeType,
  LineMeasurement,
  RelationshipLinesMeasurement,
  MountsMeasurement,
  HandShapeMeasurement,
  SpecialMarkingsMeasurement,
} from '../types/HandReadingTypes';

import {
  HAND_PARAMETERS,
  HAND_SHAPE_PROTOTYPES,
  PROMINENCE_BANDS,
  TRADITION_READINGS,
  ENTERTAINMENT_DISCLAIMER,
} from '../constants/HandReadingConstants';

// -------------------------------------------------------------
// Quality Gate Step 1
// -------------------------------------------------------------

export function computeQualityGate(input: {
  sharpness: number;         // Laplacian variance / 100 (e.g. 90)
  palmWidthPx: number;       // Palm pixel width (e.g. 480)
  shadowGlareShare: number;  // 0.0 to 1.0 (e.g. 0.06)
  palmTiltDeg: number;       // 0 to 90 degrees (e.g. 8.0)
  fingersSpread: boolean;    // true / false
}): PhotoQualityGate {
  const tips: string[] = [];

  // 1. Sharpness check: >= 100 -> 1.0, >= 70 -> 0.7, >= 40 -> 0.4, < 40 -> 0.1
  let sharpnessScore = 0.1;
  if (input.sharpness >= 100) sharpnessScore = 1.0;
  else if (input.sharpness >= 70) sharpnessScore = 0.7;
  else if (input.sharpness >= 40) sharpnessScore = 0.4;
  else sharpnessScore = 0.1;

  if (sharpnessScore < 0.7) {
    tips.push('Hold camera steady or use tap-to-focus to increase line sharpness.');
  }

  // 2. Palm width in pixels: >= 500 -> 1.0, >= 300 -> 0.7, >= 200 -> 0.4, < 200 -> 0.1
  let palmWidthScore = 0.1;
  if (input.palmWidthPx >= 500) palmWidthScore = 1.0;
  else if (input.palmWidthPx >= 300) palmWidthScore = 0.7;
  else if (input.palmWidthPx >= 200) palmWidthScore = 0.4;
  else palmWidthScore = 0.1;

  if (palmWidthScore < 0.7) {
    tips.push('Move hand closer to camera to capture full palm detail.');
  }

  // 3. Shadow or glare share: <= 0.05 -> 1.0, <= 0.15 -> 0.7, <= 0.30 -> 0.4, > 0.30 -> 0.1
  let shadowGlareScore = 0.1;
  if (input.shadowGlareShare <= 0.05) shadowGlareScore = 1.0;
  else if (input.shadowGlareShare <= 0.15) shadowGlareScore = 0.7;
  else if (input.shadowGlareShare <= 0.30) shadowGlareScore = 0.4;
  else shadowGlareScore = 0.1;

  if (shadowGlareScore < 0.7) {
    tips.push('Use soft, diffused front lighting to avoid deep shadows or flash glares.');
  }

  // 4. Palm tilt: <= 10° -> 1.0, <= 20° -> 0.7, <= 30° -> 0.4, > 30° -> 0.1
  let palmTiltScore = 0.1;
  if (input.palmTiltDeg <= 10) palmTiltScore = 1.0;
  else if (input.palmTiltDeg <= 20) palmTiltScore = 0.7;
  else if (input.palmTiltDeg <= 30) palmTiltScore = 0.4;
  else palmTiltScore = 0.1;

  if (palmTiltScore < 0.7) {
    tips.push('Keep your palm parallel and flat toward the camera lens.');
  }

  if (!input.fingersSpread) {
    tips.push('Spread fingers slightly apart to clearly demarcate the mounts and perimeter.');
  }

  const minCheck = Math.min(sharpnessScore, palmWidthScore, shadowGlareScore, palmTiltScore);
  const meanFactors = (sharpnessScore + palmWidthScore + shadowGlareScore + palmTiltScore) / 4;
  // Robust soft minimum: 65% lowest factor + 35% overall quality average
  const blendedQuality = 0.65 * minCheck + 0.35 * meanFactors;
  const q = Number((blendedQuality * (input.fingersSpread ? 1.0 : 0.85)).toFixed(2));

  return {
    sharpness: input.sharpness,
    sharpnessScore,
    palmWidthPx: input.palmWidthPx,
    palmWidthScore,
    shadowGlareShare: input.shadowGlareShare,
    shadowGlareScore,
    palmTiltDeg: input.palmTiltDeg,
    palmTiltScore,
    fingersSpread: input.fingersSpread,
    q,
    tips,
  };
}

// -------------------------------------------------------------
// Step 2: Scoring Formulas (Lines 1 to 6)
// -------------------------------------------------------------

export function scoreLineParameter(m: LineMeasurement): number {
  if (!m.isDetected) return 0.0;
  const raw = 100 * (0.35 * m.length + 0.30 * m.depth + 0.25 * m.continuity + 0.10 * m.smoothness);
  return Number(Math.max(0, Math.min(100, raw)).toFixed(1));
}

// -------------------------------------------------------------
// Step 2: Parameter 7 Relationship Lines
// -------------------------------------------------------------

export function scoreRelationshipLines(m: RelationshipLinesMeasurement): number {
  if (!m.isDetected || m.count === 0) return 0.0;
  const countTerm = Math.min(1, m.count / 2);
  const raw = 100 * (0.40 * countTerm + 0.30 * m.meanLengthRatio + 0.30 * m.meanDepth);
  return Number(Math.max(0, Math.min(100, raw)).toFixed(1));
}

// -------------------------------------------------------------
// Step 2: Parameter 8 Mounts
// -------------------------------------------------------------

export function scoreMounts(m: MountsMeasurement): number {
  const raw = 100 * m.meanRelief;
  return Number(Math.max(0, Math.min(100, raw)).toFixed(1));
}

// -------------------------------------------------------------
// Step 2: Parameter 9 Hand Shape & Fingers
// -------------------------------------------------------------

export function scoreHandShape(m: { a: number; b: number }): {
  score: number;
  nearestType: HandShapeType;
  secondNearestType: HandShapeType;
  d1: number;
  d2: number;
  margin: number;
} {
  const prototypes = Object.values(HAND_SHAPE_PROTOTYPES);

  // Compute scaled anisotropic distances to the 4 prototypes: scale = (0.12, 0.10)
  const distances = prototypes.map((proto) => {
    const distScaled = Math.sqrt(
      Math.pow((m.a - proto.a) / 0.12, 2) + Math.pow((m.b - proto.b) / 0.10, 2)
    );
    return { type: proto.type, dist: distScaled };
  });

  distances.sort((x, y) => x.dist - y.dist);

  const nearest = distances[0];
  const second = distances[1];

  const d1 = nearest.dist;
  const d2 = second.dist;
  const margin = (d2 + d1 > 0) ? (d2 - d1) / (d2 + d1) : 0;
  const rawScore = 100 * Math.min(1, margin / 0.6);

  return {
    score: Number(Math.max(0, Math.min(100, rawScore)).toFixed(1)),
    nearestType: nearest.type,
    secondNearestType: second.type,
    d1: Number(d1.toFixed(3)),
    d2: Number(d2.toFixed(3)),
    margin: Number(margin.toFixed(3)),
  };
}

// -------------------------------------------------------------
// Step 2: Parameter 10 Special Markings
// -------------------------------------------------------------

export function scoreSpecialMarkings(m: SpecialMarkingsMeasurement): number {
  if (!m.isDetected || m.markings.length === 0) return 0.0;
  const totalClarity = m.markings.reduce((sum, item) => sum + item.clarity, 0);
  const raw = 100 * Math.min(1, totalClarity / 4.0);
  return Number(Math.max(0, Math.min(100, raw)).toFixed(1));
}

// -------------------------------------------------------------
// Step 3 & 4: Prominence Band Helper
// -------------------------------------------------------------

export function getProminenceBand(
  score: number,
  isAbsent: boolean,
  isReadable: boolean
): { band: ProminenceBand; label: string } {
  if (!isReadable) {
    return { band: 'unreadable', label: 'Unreadable' };
  }
  if (isAbsent || score === 0) {
    return { band: 'not_visible', label: 'Not visible' };
  }
  if (score >= 81) return { band: 'very_pronounced', label: 'Very pronounced' };
  if (score >= 61) return { band: 'pronounced', label: 'Pronounced' };
  if (score >= 41) return { band: 'moderate', label: 'Moderate' };
  if (score >= 21) return { band: 'light', label: 'Light' };
  return { band: 'faint', label: 'Faint' };
}

// -------------------------------------------------------------
// Main Evaluation Service
// -------------------------------------------------------------

export interface HandEvaluationPayload {
  qualityGate: PhotoQualityGate;
  tradition?: PalmTradition;
  absentPolicy?: AbsentFeaturePolicy;
  paramScores: Record<string, number>;
  detectionConfidences: Record<string, number>;
  handShapeData?: {
    a: number;
    b: number;
  };
  imageDataUri?: string;
}

export function evaluateHandReading(payload: HandEvaluationPayload): HandReadingResult {
  const tradition: PalmTradition = payload.tradition || 'western';
  const absentPolicy: AbsentFeaturePolicy = payload.absentPolicy || 'zero';
  const q = payload.qualityGate.q;

  // Hand shape evaluation
  const hsInput = payload.handShapeData || { a: 1.15, b: 0.82 };
  const hsResult = scoreHandShape(hsInput);

  const evaluatedParams: HandParameterScore[] = HAND_PARAMETERS.map((def) => {
    let score = payload.paramScores[def.key] ?? 0.0;
    if (def.key === 'hand_shape' && payload.paramScores['hand_shape'] === undefined) {
      score = hsResult.score;
    }

    const detConf = payload.detectionConfidences[def.key] ?? 0.80;
    // Step 3: Mounts confidence is capped at 0.60
    let confidence = q * detConf;
    if (def.key === 'mounts') {
      confidence = Math.min(0.60, confidence);
    }
    confidence = Number(confidence.toFixed(2));

    const isReadable = confidence >= 0.40;
    const isAbsent = score === 0.0;

    const { band, label } = getProminenceBand(score, isAbsent, isReadable);

    // Pick traditional reading sentence
    const traditionDict = TRADITION_READINGS[tradition][def.key] || TRADITION_READINGS[tradition]['life_line'];
    let readingSentence = traditionDict[band] || traditionDict.default;

    if (def.key === 'hand_shape') {
      const proto = HAND_SHAPE_PROTOTYPES[hsResult.nearestType];
      readingSentence = `${proto.traditionalTemperament} (Nearest prototype: ${proto.name}).`;
    }

    return {
      id: def.id,
      key: def.key as any,
      name: def.name,
      sanskritName: def.sanskritName,
      whereItIs: def.whereItIs,
      whatAiMeasures: def.whatAiMeasures,
      traditionalAssociation: def.traditionalAssociation,
      score,
      band,
      bandLabel: def.key === 'hand_shape'
        ? `${label} (nearest type: ${HAND_SHAPE_PROTOTYPES[hsResult.nearestType].element})`
        : label,
      confidence,
      isReadable,
      isAbsent,
      readingSentence,
      measurementsSummary: {
        rawScore: score,
        confidence,
        status: isReadable ? (isAbsent ? 'Absent' : 'Measured') : 'Unreadable',
      },
    };
  });

  // Step 4: Overall score calculation
  const readableParams = evaluatedParams.filter((p) => p.isReadable);
  const isOverallReadable = readableParams.length > 0;

  let overallScore = 0.0;
  if (isOverallReadable) {
    if (absentPolicy === 'exclude') {
      // Exclude absent parameters from average
      const presentParams = readableParams.filter((p) => !p.isAbsent);
      if (presentParams.length > 0) {
        const sum = presentParams.reduce((acc, curr) => acc + curr.score, 0);
        overallScore = Number((sum / presentParams.length).toFixed(1));
      }
    } else {
      // 'zero' policy: absent lines count as 0 in the average across all readable
      const sum = readableParams.reduce((acc, curr) => acc + curr.score, 0);
      overallScore = Number((sum / readableParams.length).toFixed(1));
    }
  }

  // Mean confidence across all 10
  const meanConfRaw = evaluatedParams.reduce((acc, curr) => acc + curr.confidence, 0) / evaluatedParams.length;
  const meanConfidence = Number(meanConfRaw.toFixed(2));

  let confidenceTier: 'High' | 'Medium' | 'Low' | 'Unreadable' = 'Medium';
  if (!isOverallReadable || meanConfidence < 0.40) confidenceTier = 'Unreadable';
  else if (meanConfidence >= 0.70) confidenceTier = 'High';
  else if (meanConfidence >= 0.50) confidenceTier = 'Medium';
  else confidenceTier = 'Low';

  const { band: overallBand, label: overallBandLabel } = getProminenceBand(
    overallScore,
    false,
    isOverallReadable
  );

  return {
    overallProminenceIndex: overallScore,
    overallBand,
    overallBandLabel,
    meanConfidence,
    confidenceTier,
    qualityGate: payload.qualityGate,
    parameters: evaluatedParams,
    handType: hsResult.nearestType,
    handTypeLabel: HAND_SHAPE_PROTOTYPES[hsResult.nearestType].name,
    tradition,
    absentPolicy,
    isOverallReadable,
    entertainmentDisclaimer: ENTERTAINMENT_DISCLAIMER,
    analyzedAt: new Date().toISOString(),
    imageDataUri: payload.imageDataUri,
  };
}

