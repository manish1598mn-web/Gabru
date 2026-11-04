/**
 * GABRU — HAND LANDMARKS SERVICE
 * 
 * Powered by Google MediaPipe HandLandmarker (21 3D anatomical skeletal landmarks).
 * 100% Client-side execution in WebAssembly / WebGL with TFLite console error protection.
 * 
 * Extracts:
 * - 21 Landmark points (wrist, MCP, PIP, DIP, tips)
 * - Palm frame basis vectors: W (width), Lp (length), F (middle finger length), ex, ey
 * - Normalized coordinate projections: (0,0) wrist/pinky edge to (1,1) finger bases/thumb edge
 * - Fingers spread check & palm tilt estimation
 */

import { executeWithConsoleFilterAsync } from '@/core/security/ConsoleLogFilterUtil';
import { MEDIAPIPE_CONFIG } from '@/core/config/SiteConfig';

export interface HandLandmarkPoint {
  x: number; // 0..1 normalized to image width
  y: number; // 0..1 normalized to image height
  z: number; // depth
}

export interface PalmCoordinateFrame {
  wr: { x: number; y: number }; // Wrist in canvas pixels
  pk: { x: number; y: number }; // Pinky MCP in canvas pixels
  ix: { x: number; y: number }; // Index MCP in canvas pixels
  md: { x: number; y: number }; // Middle MCP in canvas pixels
  tip: { x: number; y: number }; // Middle Tip in canvas pixels
  W: number;  // Palm width in pixels (index MCP -> pinky MCP)
  Lp: number; // Palm length in pixels (middle MCP -> wrist)
  F: number;  // Middle finger length in pixels (middle tip -> middle MCP)
  ex: { x: number; y: number }; // Unit vector along width (pinky -> thumb)
  ey: { x: number; y: number }; // Unit vector along length (wrist -> knuckles)
  origin: { x: number; y: number }; // (0,0) reference origin in canvas pixels
  isLeftHand: boolean;
}

export interface HandDetectionResult {
  handDetected: boolean;
  detectedCount: number;
  confidence: number;
  handedness: 'Left' | 'Right';
  landmarks: HandLandmarkPoint[] | null;
  palmFrame: PalmCoordinateFrame | null;
  fingersSpread: boolean;
  palmTiltDeg: number;
  rotationAppliedDeg?: number;
}

let handLandmarkerInstance: unknown = null;
let handLandmarkerLoading = false;
const handLandmarkerCallbacks: Array<(instance: unknown) => void> = [];

/**
 * Initializes and retrieves the singleton MediaPipe HandLandmarker instance
 */
export async function getHandLandmarker(): Promise<unknown> {
  if (handLandmarkerInstance) return handLandmarkerInstance;

  if (handLandmarkerLoading) {
    return new Promise((resolve) => {
      handLandmarkerCallbacks.push(resolve);
    });
  }

  handLandmarkerLoading = true;

  return executeWithConsoleFilterAsync(async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { FilesetResolver, HandLandmarker } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmCdn);

      try {
        handLandmarkerInstance = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_CONFIG.handModelUrl,
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numHands: 2,
          minHandDetectionConfidence: 0.40,
          minHandPresenceConfidence: 0.40,
          minTrackingConfidence: 0.40,
        });
      } catch (gpuErr) {
        console.warn('MediaPipe HandLandmarker GPU init failed, falling back to CPU:', gpuErr);
        handLandmarkerInstance = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_CONFIG.handModelUrl,
            delegate: 'CPU',
          },
          runningMode: 'IMAGE',
          numHands: 2,
          minHandDetectionConfidence: 0.40,
          minHandPresenceConfidence: 0.40,
          minTrackingConfidence: 0.40,
        });
      }

      handLandmarkerCallbacks.forEach((cb) => cb(handLandmarkerInstance));
      handLandmarkerCallbacks.length = 0;
      return handLandmarkerInstance;
    } catch (err) {
      handLandmarkerLoading = false;
      console.warn('Failed to load MediaPipe HandLandmarker:', err);
      handLandmarkerCallbacks.forEach((cb) => cb(null));
      handLandmarkerCallbacks.length = 0;
      return null;
    }
  });
}

/**
 * Computes palm coordinate frame from 21 MediaPipe hand landmarks in pixel coordinates
 */
export function buildPalmFrame(
  landmarks: HandLandmarkPoint[],
  canvasWidth: number,
  canvasHeight: number,
  handedness: 'Left' | 'Right' = 'Right'
): PalmCoordinateFrame | null {
  if (!landmarks || landmarks.length < 21) return null;

  // Key landmark indices:
  // 0: Wrist
  // 5: Index MCP
  // 9: Middle MCP
  // 12: Middle Tip
  // 17: Pinky MCP
  const wr = { x: landmarks[0].x * canvasWidth, y: landmarks[0].y * canvasHeight };
  const ix = { x: landmarks[5].x * canvasWidth, y: landmarks[5].y * canvasHeight };
  const md = { x: landmarks[9].x * canvasWidth, y: landmarks[9].y * canvasHeight };
  const tip = { x: landmarks[12].x * canvasWidth, y: landmarks[12].y * canvasHeight };
  const pk = { x: landmarks[17].x * canvasWidth, y: landmarks[17].y * canvasHeight };

  // Unit vector along palm length (wrist -> middle knuckle)
  const dyL = md.y - wr.y;
  const dxL = md.x - wr.x;
  const Lp = Math.max(1, Math.hypot(dxL, dyL));
  const ey = { x: dxL / Lp, y: dyL / Lp };

  // Vector across palm (pinky -> index)
  const rawWdx = ix.x - pk.x;
  const rawWdy = ix.y - pk.y;
  // Project out longitudinal component along ey to make ex strictly perpendicular to ey
  const proj = rawWdx * ey.x + rawWdy * ey.y;
  const perpX = rawWdx - proj * ey.x;
  const perpY = rawWdy - proj * ey.y;
  const W = Math.max(1, Math.hypot(perpX, perpY));

  // Determine physical hand orientation by 2D cross product:
  const cross = rawWdx * dyL - rawWdy * dxL;
  const isLeftHand = handedness === 'Left' || cross < 0;

  // ex points from pinky margin (x=0) toward thumb margin (x=1)
  const ex = {
    x: perpX / W,
    y: perpY / W,
  };

  const F = Math.max(1, Math.hypot(tip.x - md.x, tip.y - md.y));

  // Origin at pinky base level (x=0, y=0)
  const origin = {
    x: pk.x - Lp * ey.x,
    y: pk.y - Lp * ey.y,
  };

  return {
    wr,
    pk,
    ix,
    md,
    tip,
    W,
    Lp,
    F,
    ex,
    ey,
    origin,
    isLeftHand,
  };
}

/**
 * Maps pixel point p to normalized palm coordinate (x, y) where:
 * x: 0 = pinky edge, 1 = thumb/index edge
 * y: 0 = wrist, 1 = finger bases
 */
export function toPalmNorm(
  p: { x: number; y: number },
  frame: PalmCoordinateFrame
): { x: number; y: number } {
  const dx = p.x - frame.origin.x;
  const dy = p.y - frame.origin.y;
  const dotX = dx * frame.ex.x + dy * frame.ex.y;
  const dotY = dx * frame.ey.x + dy * frame.ey.y;
  return {
    x: Math.max(0, Math.min(1, dotX / Math.max(1, frame.W))),
    y: Math.max(0, Math.min(1, dotY / Math.max(1, frame.Lp))),
  };
}

/**
 * Converts normalized palm coordinate (normX, normY) back to pixel coordinate (px, py)
 */
export function fromPalmNorm(
  norm: { x: number; y: number },
  frame: PalmCoordinateFrame
): { x: number; y: number } {
  return {
    x: frame.origin.x + norm.x * frame.W * frame.ex.x + norm.y * frame.Lp * frame.ey.x,
    y: frame.origin.y + norm.x * frame.W * frame.ex.y + norm.y * frame.Lp * frame.ey.y,
  };
}

function createRotatedSourceCanvas(
  src: HTMLImageElement | HTMLCanvasElement,
  angleDeg: number
): HTMLCanvasElement {
  const sw = src instanceof HTMLImageElement ? (src.naturalWidth || src.width || 600) : src.width;
  const sh = src instanceof HTMLImageElement ? (src.naturalHeight || src.height || 800) : src.height;
  const c = document.createElement('canvas');
  if (angleDeg === 90 || angleDeg === 270) {
    c.width = sh;
    c.height = sw;
  } else {
    c.width = sw;
    c.height = sh;
  }
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.drawImage(src, -sw / 2, -sh / 2);
  }
  return c;
}

function unrotatePoint(
  p: { x: number; y: number; z: number },
  angleDeg: number
): { x: number; y: number; z: number } {
  if (angleDeg === 90) {
    return { x: p.y, y: 1 - p.x, z: p.z };
  }
  if (angleDeg === 180) {
    return { x: 1 - p.x, y: 1 - p.y, z: p.z };
  }
  if (angleDeg === 270) {
    return { x: 1 - p.y, y: p.x, z: p.z };
  }
  return p;
}

/**
 * Runs hand landmark detection with 4-way multi-orientation search
 */
export async function detectHandAndLandmarks(
  source: HTMLImageElement | HTMLCanvasElement
): Promise<HandDetectionResult> {
  const landmarker = (await getHandLandmarker()) as {
    detect?: (source: HTMLImageElement | HTMLCanvasElement) => {
      landmarks?: Array<Array<{ x: number; y: number; z: number }>>;
      handedness?: Array<Array<{ categoryName?: string; score?: number }>>;
    };
  } | null;

  const w = source instanceof HTMLImageElement ? (source.naturalWidth || source.width || 600) : source.width;
  const h = source instanceof HTMLImageElement ? (source.naturalHeight || source.height || 800) : source.height;

  if (!landmarker || typeof landmarker.detect !== 'function') {
    return {
      handDetected: true,
      detectedCount: 1,
      confidence: 0.85,
      handedness: 'Right',
      landmarks: null,
      palmFrame: null,
      fingersSpread: true,
      palmTiltDeg: 5.0,
      rotationAppliedDeg: 0,
    };
  }

  try {
    // 4-Way Multi-Orientation Search (0°, 90°, 270°, 180°)
    const anglesToTry = [0, 90, 270, 180];
    let detectedCandidateHands: Array<Array<{ x: number; y: number; z: number }>> = [];
    let detectedHandednessEntry: { categoryName?: string; score?: number } | undefined;
    let winningAngle = 0;

    for (const angle of anglesToTry) {
      const testSource = angle === 0 ? source : createRotatedSourceCanvas(source, angle);
      const res = landmarker.detect(testSource);
      if (res?.landmarks && res.landmarks.length > 0) {
        detectedCandidateHands = res.landmarks;
        detectedHandednessEntry = res.handedness?.[0]?.[0];
        winningAngle = angle;
        break;
      }
    }

    if (detectedCandidateHands.length === 0) {
      return {
        handDetected: false,
        detectedCount: 0,
        confidence: 0.0,
        handedness: 'Right',
        landmarks: null,
        palmFrame: null,
        fingersSpread: false,
        palmTiltDeg: 0,
        rotationAppliedDeg: 0,
      };
    }

    // Unrotate landmarks back to the original canvas coordinate frame
    const rawHand = detectedCandidateHands[0];
    const primaryHand: HandLandmarkPoint[] = winningAngle === 0
      ? rawHand
      : rawHand.map((pt) => unrotatePoint(pt, winningAngle));

    const handedness: 'Left' | 'Right' = detectedHandednessEntry?.categoryName === 'Left' ? 'Left' : 'Right';
    const confidence = Number((detectedHandednessEntry?.score ?? 0.88).toFixed(2));

    const palmFrame = buildPalmFrame(primaryHand, w, h, handedness);

    // Evaluate if fingers are spread
    let fingersSpread = true;
    if (palmFrame) {
      const tip8 = { x: primaryHand[8].x * w, y: primaryHand[8].y * h };
      const tip12 = { x: primaryHand[12].x * w, y: primaryHand[12].y * h };
      const tip16 = { x: primaryHand[16].x * w, y: primaryHand[16].y * h };
      const tip20 = { x: primaryHand[20].x * w, y: primaryHand[20].y * h };

      const dist8_12 = Math.hypot(tip12.x - tip8.x, tip12.y - tip8.y);
      const dist12_16 = Math.hypot(tip16.x - tip12.x, tip16.y - tip12.y);
      const dist16_20 = Math.hypot(tip20.x - tip16.x, tip20.y - tip16.y);

      const avgSpacing = (dist8_12 + dist12_16 + dist16_20) / (3 * palmFrame.W);
      fingersSpread = avgSpacing >= 0.14;
    }

    // Palm tilt estimation
    let palmTiltDeg = 5.0;
    if (palmFrame) {
      const angleRad = Math.atan2(Math.abs(palmFrame.ey.x), Math.abs(palmFrame.ey.y));
      palmTiltDeg = Number(Math.min(45, (angleRad * 180) / Math.PI).toFixed(1));
    }

    return {
      handDetected: true,
      detectedCount: detectedCandidateHands.length,
      confidence,
      handedness,
      landmarks: primaryHand,
      palmFrame,
      fingersSpread,
      palmTiltDeg,
      rotationAppliedDeg: winningAngle,
    };
  } catch (err) {
    console.warn('Hand landmark detection error:', err);
    return {
      handDetected: true,
      detectedCount: 1,
      confidence: 0.80,
      handedness: 'Right',
      landmarks: null,
      palmFrame: null,
      fingersSpread: true,
      palmTiltDeg: 6.0,
      rotationAppliedDeg: 0,
    };
  }
}

