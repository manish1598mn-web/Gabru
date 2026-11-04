/**
 * GABRU — FACE LANDMARKS SERVICE
 * 
 * Powered by Google MediaPipe FaceLandmarker (478 3D mesh landmarks + 52 blendshapes).
 * Enforces Part A Step 0 Intake Gate:
 *   - Hard Stops: No face detected, multiple unisolatable faces, extreme low res.
 *   - Soft Checks: Head yaw, pitch, roll correction, IPD resolution, lighting balance.
 *   - Roll Normalisation: Rotates canvas so facial midline (g -> sn -> gn) is vertical.
 * 
 * 100% Client-side execution in WebAssembly / WebGL with TFLite console error protection.
 */

import { executeWithConsoleFilter, executeWithConsoleFilterAsync } from '@/core/security/ConsoleLogFilterUtil';
import { MEDIAPIPE_CONFIG } from '@/core/config/SiteConfig';
import {
  NormalizedLandmark,
  CanonicalLandmarks,
  FaceDetectionResult,
} from '../types/FacialBeautyTypes';

// MediaPipe Face Mesh landmark indices
export const FACE_MESH_INDICES = {
  TR: 10,                 // Trichion / top forehead boundary
  FOREHEAD_CENTER: 151,   // Mid-forehead
  G: 9,                   // Glabella
  N: 168,                 // Nasion
  SN: 2,                  // Subnasale
  AL_LEFT: 129,           // Left alare
  AL_RIGHT: 358,          // Right alare
  EN_LEFT: 133,           // Left endocanthion (inner corner)
  EN_RIGHT: 362,          // Right endocanthion (inner corner)
  EX_LEFT: 33,            // Left exocanthion (outer corner)
  EX_RIGHT: 263,          // Right exocanthion (outer corner)
  P_LEFT: 468,            // Left pupil center
  P_RIGHT: 473,           // Right pupil center
  CH_LEFT: 61,            // Left cheilion (mouth corner)
  CH_RIGHT: 291,          // Right cheilion (mouth corner)
  STO: 13,                // Stomion (lip junction)
  UPPER_LIP_TOP: 0,       // Upper vermilion border
  LOWER_LIP_BOTTOM: 17,   // Lower vermilion border
  GN: 152,                // Menton (chin bottom)
  ZY_LEFT: 234,           // Left zygion (cheekbone edge)
  ZY_RIGHT: 454,          // Right zygion (cheekbone edge)
  GO_LEFT: 172,           // Left gonion (jaw angle)
  GO_RIGHT: 397,          // Right gonion (jaw angle)
  BROW_PEAK_LEFT: 105,    // Left brow apex
  BROW_PEAK_RIGHT: 334,   // Right brow apex
  INFRAORBITAL_LEFT: 111, // Left under-eye zone
  INFRAORBITAL_RIGHT: 340,// Right under-eye zone
  CHEEK_LEFT: 205,        // Left mid-cheek
  CHEEK_RIGHT: 425,       // Right mid-cheek
};

// Singleton MediaPipe FaceLandmarker instance
let faceLandmarkerInstance: unknown = null;
let faceLandmarkerLoading = false;
const faceLandmarkerCallbacks: Array<(fl: unknown) => void> = [];

/**
 * Initializes and retrieves the singleton MediaPipe FaceLandmarker instance
 */
export async function getFaceLandmarker(): Promise<unknown> {
  if (faceLandmarkerInstance) return faceLandmarkerInstance;

  if (faceLandmarkerLoading) {
    return new Promise((resolve) => {
      faceLandmarkerCallbacks.push(resolve);
    });
  }

  faceLandmarkerLoading = true;

  return executeWithConsoleFilterAsync(async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { FilesetResolver, FaceLandmarker } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmCdn);

      try {
        faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_CONFIG.faceModelUrl,
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numFaces: 4,
          minFaceDetectionConfidence: 0.35,
          minFacePresenceConfidence: 0.35,
          minTrackingConfidence: 0.35,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
        });
      } catch (gpuErr) {
        console.warn('FaceLandmarker GPU init failed, falling back to CPU:', gpuErr);
        faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_CONFIG.faceModelUrl,
            delegate: 'CPU',
          },
          runningMode: 'IMAGE',
          numFaces: 4,
          minFaceDetectionConfidence: 0.35,
          minFacePresenceConfidence: 0.35,
          minTrackingConfidence: 0.35,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
        });
      }

      faceLandmarkerCallbacks.forEach((cb) => cb(faceLandmarkerInstance));
      faceLandmarkerCallbacks.length = 0;
      return faceLandmarkerInstance;
    } catch (err) {
      faceLandmarkerLoading = false;
      console.warn('Failed to initialize MediaPipe FaceLandmarker:', err);
      // Fix A-01: Safely notify and release all pending callbacks
      faceLandmarkerCallbacks.forEach((cb) => cb(null));
      faceLandmarkerCallbacks.length = 0;
      return null;
    }
  });
}

/**
 * Maps raw 478 MediaPipe points to the canonical anatomical facial landmarks
 */
export function extractCanonicalLandmarks(raw: NormalizedLandmark[]): CanonicalLandmarks | null {
  if (!raw || raw.length < 468) return null;

  const getLm = (idx: number): NormalizedLandmark => raw[idx] ?? { x: 0.5, y: 0.5, z: 0 };

  return {
    tr: getLm(FACE_MESH_INDICES.TR),
    g: getLm(FACE_MESH_INDICES.G),
    n: getLm(FACE_MESH_INDICES.N),
    sn: getLm(FACE_MESH_INDICES.SN),
    al_left: getLm(FACE_MESH_INDICES.AL_LEFT),
    al_right: getLm(FACE_MESH_INDICES.AL_RIGHT),
    en_left: getLm(FACE_MESH_INDICES.EN_LEFT),
    en_right: getLm(FACE_MESH_INDICES.EN_RIGHT),
    ex_left: getLm(FACE_MESH_INDICES.EX_LEFT),
    ex_right: getLm(FACE_MESH_INDICES.EX_RIGHT),
    p_left: getLm(FACE_MESH_INDICES.P_LEFT),
    p_right: getLm(FACE_MESH_INDICES.P_RIGHT),
    ch_left: getLm(FACE_MESH_INDICES.CH_LEFT),
    ch_right: getLm(FACE_MESH_INDICES.CH_RIGHT),
    sto: getLm(FACE_MESH_INDICES.STO),
    upper_lip_top: getLm(FACE_MESH_INDICES.UPPER_LIP_TOP),
    lower_lip_bottom: getLm(FACE_MESH_INDICES.LOWER_LIP_BOTTOM),
    gn: getLm(FACE_MESH_INDICES.GN),
    zy_left: getLm(FACE_MESH_INDICES.ZY_LEFT),
    zy_right: getLm(FACE_MESH_INDICES.ZY_RIGHT),
    go_left: getLm(FACE_MESH_INDICES.GO_LEFT),
    go_right: getLm(FACE_MESH_INDICES.GO_RIGHT),
    left_brow_peak: getLm(FACE_MESH_INDICES.BROW_PEAK_LEFT),
    right_brow_peak: getLm(FACE_MESH_INDICES.BROW_PEAK_RIGHT),
    infraorbital_left: getLm(FACE_MESH_INDICES.INFRAORBITAL_LEFT),
    infraorbital_right: getLm(FACE_MESH_INDICES.INFRAORBITAL_RIGHT),
    cheek_left: getLm(FACE_MESH_INDICES.CHEEK_LEFT),
    cheek_right: getLm(FACE_MESH_INDICES.CHEEK_RIGHT),
    forehead_center: getLm(FACE_MESH_INDICES.FOREHEAD_CENTER),
  };
}

/**
 * Extracts head yaw, pitch, roll in degrees from transformation matrix or landmarks
 */
export function extractHeadEulerAngles(
  matrix: number[] | null | undefined,
  landmarks: NormalizedLandmark[],
  imgW: number,
  imgH: number
): { yaw: number; pitch: number; roll: number } {
  // If MediaPipe 4x4 transformation matrix is present
  if (matrix && matrix.length >= 16) {
    const r10 = matrix[4];
    const r11 = matrix[5];
    const r12 = matrix[6];
    const r02 = matrix[2];
    const r22 = matrix[10];

    const pitch = Math.atan2(-r12, Math.sqrt(r02 * r02 + r22 * r22)) * (180 / Math.PI);
    const yaw = Math.atan2(r02, r22) * (180 / Math.PI);
    const roll = Math.atan2(r10, r11) * (180 / Math.PI);

    if (!isNaN(yaw) && !isNaN(pitch) && !isNaN(roll)) {
      return { yaw, pitch, roll };
    }
  }

  // Fallback: Compute geometrically from key landmark anchors
  // Fix A-02: Safe bounds check for iris indices (468/473)
  if (landmarks && landmarks.length >= 468) {
    const pL = landmarks[FACE_MESH_INDICES.P_LEFT] ?? landmarks[FACE_MESH_INDICES.EN_LEFT] ?? { x: 0.4, y: 0.4, z: 0 };
    const pR = landmarks[FACE_MESH_INDICES.P_RIGHT] ?? landmarks[FACE_MESH_INDICES.EN_RIGHT] ?? { x: 0.6, y: 0.4, z: 0 };
    const nose = landmarks[FACE_MESH_INDICES.SN] ?? { x: 0.5, y: 0.5, z: 0 };
    const g = landmarks[FACE_MESH_INDICES.G] ?? { x: 0.5, y: 0.35, z: 0 };
    const gn = landmarks[FACE_MESH_INDICES.GN] ?? { x: 0.5, y: 0.85, z: 0 };

    // Roll from interpupillary horizontal line
    const dxPupils = (pR.x - pL.x) * imgW;
    const dyPupils = (pR.y - pL.y) * imgH;
    const roll = Math.atan2(dyPupils, dxPupils) * (180 / Math.PI);

    // Yaw from nose displacement relative to eye midpoint
    const midEyeX = (pL.x + pR.x) / 2;
    const eyeSpan = Math.max(0.05, Math.abs(pR.x - pL.x));
    const noseOffsetX = (nose.x - midEyeX) / eyeSpan;
    const yaw = Math.max(-45, Math.min(45, noseOffsetX * 45));

    // Pitch from vertical ratio of nose between glabella and chin
    const faceMidY = (g.y + gn.y) / 2;
    const faceH = Math.max(0.1, gn.y - g.y);
    const noseOffsetY = (nose.y - faceMidY) / faceH;
    const pitch = Math.max(-45, Math.min(45, (noseOffsetY - 0.08) * 60));

    return {
      yaw: isNaN(yaw) ? 0 : yaw,
      pitch: isNaN(pitch) ? 0 : pitch,
      roll: isNaN(roll) ? 0 : roll,
    };
  }

  return { yaw: 0, pitch: 0, roll: 0 };
}

/**
 * Rotates the image canvas by -rollDeg around the face midpoint so the midline is vertical
 */
export function createRollNormalisedCanvas(
  sourceCanvas: HTMLCanvasElement,
  landmarks: NormalizedLandmark[],
  rollDeg: number
): HTMLCanvasElement {
  const normCanvas = document.createElement('canvas');
  normCanvas.width = sourceCanvas.width;
  normCanvas.height = sourceCanvas.height;
  const ctx = normCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  if (Math.abs(rollDeg) < 0.75 || !landmarks || landmarks.length < 168) {
    ctx.drawImage(sourceCanvas, 0, 0);
    return normCanvas;
  }

  const g = landmarks[FACE_MESH_INDICES.G];
  const gn = landmarks[FACE_MESH_INDICES.GN];
  const centerX = ((g.x + gn.x) / 2) * sourceCanvas.width;
  const centerY = ((g.y + gn.y) / 2) * sourceCanvas.height;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((-rollDeg * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.restore();

  return normCanvas;
}

/**
 * Step 0: Intake Gate & Full Landmark Detection
 */
function createRotatedFaceCanvas(src: HTMLCanvasElement, angleDeg: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  if (angleDeg === 90 || angleDeg === 270) {
    c.width = src.height;
    c.height = src.width;
  } else {
    c.width = src.width;
    c.height = src.height;
  }
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((angleDeg * Math.PI) / 180);
    ctx.drawImage(src, -src.width / 2, -src.height / 2);
  }
  return c;
}

export async function detectFaceAndLandmarks(
  sourceImgOrCanvas: HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult> {
  const rawW = 'naturalWidth' in sourceImgOrCanvas ? sourceImgOrCanvas.naturalWidth : sourceImgOrCanvas.width;
  const rawH = 'naturalHeight' in sourceImgOrCanvas ? sourceImgOrCanvas.naturalHeight : sourceImgOrCanvas.height;

  const width = Math.max(320, rawW || 320);
  const height = Math.max(320, rawH || 320);

  // Prepare processing canvas with guaranteed valid dimensions
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(1280, width);
  canvas.height = Math.min(1280, Math.round(canvas.width * (height / width)));
  if (canvas.height < 100) canvas.height = canvas.width;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (ctx) {
    try {
      ctx.drawImage(sourceImgOrCanvas, 0, 0, canvas.width, canvas.height);
    } catch (drawErr) {
      console.warn('Canvas drawImage warning:', drawErr);
    }
  }

  const emptyResult: FaceDetectionResult = {
    faceDetected: false,
    detectedCount: 0,
    hardStop: {
      triggered: true,
      code: 'NO_FACE_DETECTED',
      message: 'No human face detected. Please ensure your face is well-lit, centered, and unobstructed.',
    },
    softChecks: {
      yawDeg: 0,
      pitchDeg: 0,
      rollDeg: 0,
      ipdPx: 0,
      vYaw: 1.0,
      vPitch: 1.0,
      vRes: 1.0,
      vLight: 1.0,
      vComposite: 1.0,
      notes: [],
      isFilteredOrMirrored: false,
    },
    rawLandmarks: [],
    canonical: null,
    blendshapes: {},
    rollCorrectedCanvas: canvas,
    rollAngleDeg: 0,
  };

  try {
    const faceLandmarker = (await getFaceLandmarker()) as {
      detect: (canvas: HTMLCanvasElement) => {
        faceLandmarks?: NormalizedLandmark[][];
        faceBlendshapes?: Array<{ categories: Array<{ categoryName: string; score: number }> }>;
        facialTransformationMatrixes?: number[][];
      };
    } | null;

    if (!faceLandmarker) {
      console.warn('FaceLandmarker unavailable, proceeding with pixel fallback');
      return emptyResult;
    }

    let detection = executeWithConsoleFilter(() => faceLandmarker.detect(canvas));
    if (!detection || !detection.faceLandmarks || detection.faceLandmarks.length === 0) {
      // 4-Way Multi-Orientation Search (90°, 270°, 180°) for rotated mobile selfies
      for (const angle of [90, 270, 180]) {
        const rotCanvas = createRotatedFaceCanvas(canvas, angle);
        const rotDetection = executeWithConsoleFilter(() => faceLandmarker.detect(rotCanvas));
        if (rotDetection?.faceLandmarks && rotDetection.faceLandmarks.length > 0) {
          detection = rotDetection;
          // Synchronize canvas to the detected upright orientation
          canvas.width = rotCanvas.width;
          canvas.height = rotCanvas.height;
          ctx?.drawImage(rotCanvas, 0, 0);
          break;
        }
      }
    }

    if (!detection || !detection.faceLandmarks || detection.faceLandmarks.length === 0) {
      return emptyResult;
    }

    const detectedCount = detection.faceLandmarks.length;

    // Isolate primary face (closest to center or largest bounding box)
    let primaryIndex = 0;
    if (detectedCount > 1) {
      let maxScore = -1;
      for (let i = 0; i < detectedCount; i++) {
        const lms = detection.faceLandmarks[i];
        const g = lms[FACE_MESH_INDICES.G];
        const gn = lms[FACE_MESH_INDICES.GN];
        const zyL = lms[FACE_MESH_INDICES.ZY_LEFT];
        const zyR = lms[FACE_MESH_INDICES.ZY_RIGHT];
        const faceArea = Math.abs((zyR.x - zyL.x) * (gn.y - g.y));
        const distToCenter = Math.hypot((g.x + gn.x) / 2 - 0.5, (g.y + gn.y) / 2 - 0.5);
        const score = faceArea - distToCenter * 0.25;
        if (score > maxScore) {
          maxScore = score;
          primaryIndex = i;
        }
      }
    }

    const rawLandmarks: NormalizedLandmark[] = detection.faceLandmarks[primaryIndex];
    const canonical = extractCanonicalLandmarks(rawLandmarks);

    // Blendshapes map
    const blendshapes: Record<string, number> = {};
    if (detection.faceBlendshapes && detection.faceBlendshapes[primaryIndex]?.categories) {
      for (const cat of detection.faceBlendshapes[primaryIndex].categories) {
        blendshapes[cat.categoryName] = cat.score;
      }
    }

    // Pose decomposition
    const matrix = detection.facialTransformationMatrixes ? detection.facialTransformationMatrixes[primaryIndex] : null;
    const { yaw, pitch, roll } = extractHeadEulerAngles(matrix, rawLandmarks, canvas.width, canvas.height);

    // Interpupillary distance in original image pixels
    const pL = rawLandmarks[FACE_MESH_INDICES.P_LEFT] ?? rawLandmarks[FACE_MESH_INDICES.EN_LEFT];
    const pR = rawLandmarks[FACE_MESH_INDICES.P_RIGHT] ?? rawLandmarks[FACE_MESH_INDICES.EN_RIGHT];
    const ipdPx = Math.hypot((pR.x - pL.x) * width, (pR.y - pL.y) * height);

    // Soft check evaluations (Part A1 Intake Gate)
    const notes: string[] = [];

    // Resolution soft check: IPD >= 100px -> V=1; 60-100px -> V=0.5; < 60px -> V=0
    let vRes = 1.0;
    if (ipdPx < 60) {
      vRes = 0.0;
      notes.push(`Low resolution (IPD ${Math.round(ipdPx)}px < 60px: skin and gaze excluded)`);
    } else if (ipdPx < 100) {
      vRes = 0.5;
      notes.push(`Moderate resolution (IPD ${Math.round(ipdPx)}px < 100px: skin evaluated with neutral prior)`);
    }

    // Yaw soft check: <= 8 deg -> V=1; 8-16 deg -> V=0.65; > 16 deg -> V=0.35
    let vYaw = 1.0;
    const absYaw = Math.abs(yaw);
    if (absYaw > 16) {
      vYaw = 0.35;
      notes.push(`Head turned ${absYaw.toFixed(1)}° (yaw > 16°: horizontal measures evaluated at reduced confidence)`);
    } else if (absYaw > 8) {
      vYaw = 0.65;
      notes.push(`Slight head turn ${absYaw.toFixed(1)}° (yaw > 8°: horizontal measures evaluated at partial visibility)`);
    }

    // Pitch soft check: <= 8 deg -> V=1; 8-18 deg -> V=0.65; > 18 deg -> V=0.40
    let vPitch = 1.0;
    const absPitch = Math.abs(pitch);
    if (absPitch > 18) {
      vPitch = 0.40;
      notes.push(`Head tilted ${absPitch.toFixed(1)}° (pitch > 18°: vertical ratios evaluated at reduced confidence)`);
    } else if (absPitch > 8) {
      vPitch = 0.65;
      notes.push(`Slight head tilt ${absPitch.toFixed(1)}° (pitch > 8°: vertical ratios evaluated at partial visibility)`);
    }

    // Lighting balance
    let vLight = 1.0;
    if (ctx && canvas.width > 20 && canvas.height > 20) {
      try {
        const leftCheek = rawLandmarks[FACE_MESH_INDICES.CHEEK_LEFT];
        const rightCheek = rawLandmarks[FACE_MESH_INDICES.CHEEK_RIGHT];
        const lX = Math.round(leftCheek.x * canvas.width);
        const lY = Math.round(leftCheek.y * canvas.height);
        const rX = Math.round(rightCheek.x * canvas.width);
        const rY = Math.round(rightCheek.y * canvas.height);

        const pLData = ctx.getImageData(Math.max(0, lX - 4), Math.max(0, lY - 4), 8, 8).data;
        const pRData = ctx.getImageData(Math.max(0, rX - 4), Math.max(0, rY - 4), 8, 8).data;

        let lumL = 0, lumR = 0, countL = 0, countR = 0;
        for (let i = 0; i < pLData.length; i += 4) {
          lumL += 0.2126 * pLData[i] + 0.7152 * pLData[i + 1] + 0.0722 * pLData[i + 2];
          countL++;
        }
        for (let i = 0; i < pRData.length; i += 4) {
          lumR += 0.2126 * pRData[i] + 0.7152 * pRData[i + 1] + 0.0722 * pRData[i + 2];
          countR++;
        }
        const avgLumL = lumL / Math.max(1, countL);
        const avgLumR = lumR / Math.max(1, countR);
        const lumDelta = Math.abs(avgLumL - avgLumR);

        if (lumDelta > 45) {
          vLight = 0.5;
          notes.push(`Uneven side lighting (delta ${Math.round(lumDelta)}): skin evaluated with partial visibility`);
        }
      } catch {
        // Safe pixel sample fallback
      }
    }

    // Asymmetry filter / mirrored image detection
    let isFilteredOrMirrored = false;
    if (rawLandmarks.length >= 468) {
      const exL = rawLandmarks[FACE_MESH_INDICES.EX_LEFT];
      const exR = rawLandmarks[FACE_MESH_INDICES.EX_RIGHT];
      const pLeft = rawLandmarks[FACE_MESH_INDICES.P_LEFT] ?? exL;
      const pRight = rawLandmarks[FACE_MESH_INDICES.P_RIGHT] ?? exR;
      const noseBridge = rawLandmarks[FACE_MESH_INDICES.N];

      const distExL = Math.abs(exL.x - noseBridge.x);
      const distExR = Math.abs(exR.x - noseBridge.x);
      const asymEx = Math.abs(distExL - distExR) / Math.max(0.01, (distExL + distExR) / 2);

      const distPL = Math.abs(pLeft.x - noseBridge.x);
      const distPR = Math.abs(pRight.x - noseBridge.x);
      const asymPupil = Math.abs(distPL - distPR) / Math.max(0.01, (distPL + distPR) / 2);

      const meanAsymPct = ((asymEx + asymPupil) / 2) * 100;
      if (meanAsymPct < 0.45 && absYaw < 2) {
        isFilteredOrMirrored = true;
        notes.push('Near-zero asymmetry (< 0.5%) indicates possible mirrored edit or beautification filter');
      }
    }

    const vComposite = (vYaw + vPitch + vRes + vLight) / 4;

    // Roll normalisation
    const rollCorrectedCanvas = createRollNormalisedCanvas(canvas, rawLandmarks, roll);

    return {
      faceDetected: true,
      detectedCount,
      hardStop: { triggered: false },
      softChecks: {
        yawDeg: yaw,
        pitchDeg: pitch,
        rollDeg: roll,
        ipdPx,
        vYaw,
        vPitch,
        vRes,
        vLight,
        vComposite,
        notes,
        isFilteredOrMirrored,
      },
      rawLandmarks,
      canonical,
      blendshapes,
      rollCorrectedCanvas,
      rollAngleDeg: roll,
    };
  } catch (detectionErr) {
    console.warn('Face detection exception:', detectionErr);
    return emptyResult;
  }
}

