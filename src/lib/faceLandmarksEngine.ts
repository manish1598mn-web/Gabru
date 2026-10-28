/**
 * ============================================================================
 * GABRU — FACIAL LANDMARKS & STEP 0 INTAKE GATE ENGINE
 * ============================================================================
 * 
 * Powered by Google MediaPipe FaceLandmarker (478 3D landmarks + 52 blendshapes).
 * Enforces Part A Step 0 Intake Gate:
 *   - Hard Stops: No face detected, multiple unisolatable faces, extreme low res.
 *   - Soft Checks: Head yaw, pitch, roll correction, IPD resolution, lighting balance.
 *   - Roll Normalisation: Rotates canvas so facial midline (g -> sn -> gn) is vertical.
 * 
 * 100% Client-side execution in WebAssembly / WebGL.
 */

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface CanonicalLandmarks {
  tr: NormalizedLandmark; // Trichion (hairline)
  g: NormalizedLandmark;  // Glabella (between brows)
  n: NormalizedLandmark;  // Nasion (nasal root)
  sn: NormalizedLandmark; // Subnasale (nose base)
  al_left: NormalizedLandmark;  // Left nose wing
  al_right: NormalizedLandmark; // Right nose wing
  en_left: NormalizedLandmark;  // Left inner eye corner (endocanthion)
  en_right: NormalizedLandmark; // Right inner eye corner (endocanthion)
  ex_left: NormalizedLandmark;  // Left outer eye corner (exocanthion)
  ex_right: NormalizedLandmark; // Right outer eye corner (exocanthion)
  p_left: NormalizedLandmark;   // Left pupil center (iris center)
  p_right: NormalizedLandmark;  // Right pupil center (iris center)
  ch_left: NormalizedLandmark;  // Left mouth corner (cheilion)
  ch_right: NormalizedLandmark; // Right mouth corner (cheilion)
  sto: NormalizedLandmark;      // Stomion (lip junction)
  upper_lip_top: NormalizedLandmark;
  lower_lip_bottom: NormalizedLandmark;
  gn: NormalizedLandmark;       // Menton (chin bottom)
  zy_left: NormalizedLandmark;  // Left cheekbone edge (zygion)
  zy_right: NormalizedLandmark; // Right cheekbone edge (zygion)
  go_left: NormalizedLandmark;  // Left jaw angle (gonion)
  go_right: NormalizedLandmark; // Right jaw angle (gonion)
  left_brow_peak: NormalizedLandmark;
  right_brow_peak: NormalizedLandmark;
  infraorbital_left: NormalizedLandmark;
  infraorbital_right: NormalizedLandmark;
  cheek_left: NormalizedLandmark;
  cheek_right: NormalizedLandmark;
  forehead_center: NormalizedLandmark;
}

export interface SoftCheckReport {
  yawDeg: number;       // Left/Right turn
  pitchDeg: number;     // Up/Down tilt
  rollDeg: number;      // Head tilt
  ipdPx: number;        // Interpupillary distance in pixels
  vYaw: number;         // 1.0, 0.5, or 0.0
  vPitch: number;       // 1.0 or 0.5
  vRes: number;         // 1.0, 0.5, or 0.0
  vLight: number;       // 1.0 or 0.5
  vComposite: number;   // Overall visibility multiplier
  notes: string[];      // Advisory notes explaining any lowered V
  isFilteredOrMirrored: boolean; // Flagged if asymmetry < 0.5%
}

export interface HardStopReport {
  triggered: boolean;
  code?: 'NO_FACE_DETECTED' | 'LOW_RESOLUTION' | 'HEAVY_FILTER_AI';
  message?: string;
}

export interface FaceDetectionResult {
  faceDetected: boolean;
  detectedCount: number;
  hardStop: HardStopReport;
  softChecks: SoftCheckReport;
  rawLandmarks: NormalizedLandmark[];
  canonical: CanonicalLandmarks | null;
  blendshapes: Record<string, number>;
  rollCorrectedCanvas: HTMLCanvasElement | null;
  rollAngleDeg: number;
}

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

/**
 * Filter out TensorFlow Lite / MediaPipe / Emscripten informational logs sent to stderr.
 * Next.js Turbopack dev server treats any console.error() as a fatal dev-overlay error.
 */
function isTfLiteInformationalMessage(args: any[]): boolean {
  try {
    const text = args
      .map((a) => {
        if (typeof a === 'string') return a;
        if (a && typeof a.message === 'string') return a.message;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(' ');

    return (
      text.includes('Created TensorFlow Lite') ||
      text.includes('XNNPACK delegate') ||
      text.includes('INFO: Created') ||
      text.startsWith('INFO:') ||
      text.includes('TensorFlow Lite XNNPACK') ||
      text.includes('delegate for CPU') ||
      text.includes('delegate for GPU') ||
      text.includes('Applying delegate')
    );
  } catch {
    return false;
  }
}

// Global browser-level guard
if (typeof window !== 'undefined') {
  const win = window as any;
  win.__detectFaceAndLandmarks = detectFaceAndLandmarks;
  if (!win.__tflite_log_filter_active) {
    win.__tflite_log_filter_active = true;
    const originalConsoleError = console.error;
    console.error = function (...args: any[]) {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      return originalConsoleError.apply(console, args);
    };
  }
}

export function executeWithTfLiteConsoleFilter<T>(fn: () => T): T {
  if (typeof window === 'undefined') return fn();
  const prevError = console.error;
  try {
    console.error = (...args: any[]) => {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      prevError.apply(console, args);
    };
    return fn();
  } finally {
    console.error = prevError;
  }
}

export async function executeWithTfLiteConsoleFilterAsync<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof window === 'undefined') return fn();
  const prevError = console.error;
  try {
    console.error = (...args: any[]) => {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      prevError.apply(console, args);
    };
    return await fn();
  } finally {
    console.error = prevError;
  }
}

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

  return executeWithTfLiteConsoleFilterAsync(async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { FilesetResolver, FaceLandmarker } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const modelAssetPath =
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';

      try {
        faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath,
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
            modelAssetPath,
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
      return null;
    }
  });
}

/**
 * Maps raw 478 MediaPipe points to the canonical 13 anatomical facial landmarks
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
    const r00 = matrix[0];
    const r01 = matrix[1];
    const r02 = matrix[2];
    const r10 = matrix[4];
    const r11 = matrix[5];
    const r12 = matrix[6];
    const r20 = matrix[8];
    const r21 = matrix[9];
    const r22 = matrix[10];

    const pitch = Math.atan2(-r12, Math.sqrt(r02 * r02 + r22 * r22)) * (180 / Math.PI);
    const yaw = Math.atan2(r02, r22) * (180 / Math.PI);
    const roll = Math.atan2(r10, r11) * (180 / Math.PI);

    if (!isNaN(yaw) && !isNaN(pitch) && !isNaN(roll)) {
      return { yaw, pitch, roll };
    }
  }

  // Fallback: Compute geometrically from key landmark anchors
  if (landmarks.length >= 468) {
    const pL = landmarks[FACE_MESH_INDICES.P_LEFT];
    const pR = landmarks[FACE_MESH_INDICES.P_RIGHT];
    const nose = landmarks[FACE_MESH_INDICES.SN];
    const g = landmarks[FACE_MESH_INDICES.G];
    const gn = landmarks[FACE_MESH_INDICES.GN];

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

    return { yaw, pitch, roll };
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
    const faceLandmarker = (await getFaceLandmarker()) as any;
    if (!faceLandmarker) {
      console.warn('FaceLandmarker unavailable, proceeding with pixel fallback');
      return emptyResult;
    }

    const detection = executeWithTfLiteConsoleFilter(() => faceLandmarker.detect(canvas));
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
    const pL = rawLandmarks[FACE_MESH_INDICES.P_LEFT];
    const pR = rawLandmarks[FACE_MESH_INDICES.P_RIGHT];
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

    // Yaw soft check: <= 5 deg -> V=1; 5-10 deg -> V=0.5; > 10 deg -> V=0
    let vYaw = 1.0;
    const absYaw = Math.abs(yaw);
    if (absYaw > 10) {
      vYaw = 0.0;
      notes.push(`Head turned ${absYaw.toFixed(1)}° (yaw > 10°: horizontal measures excluded)`);
    } else if (absYaw > 5) {
      vYaw = 0.5;
      notes.push(`Slight head turn ${absYaw.toFixed(1)}° (yaw > 5°: horizontal measures evaluated at partial visibility)`);
    }

    // Pitch soft check: <= 5 deg -> V=1; > 5 deg -> V=0.5
    let vPitch = 1.0;
    const absPitch = Math.abs(pitch);
    if (absPitch > 5) {
      vPitch = 0.5;
      notes.push(`Head tilted ${pitch > 0 ? 'up' : 'down'} ${absPitch.toFixed(1)}° (pitch > 5°: vertical ratios evaluated at partial visibility)`);
    }


    // Lighting balance check: Compare cheek luminance
    let vLight = 1.0;
    if (ctx) {
      try {
        const cheekL = rawLandmarks[FACE_MESH_INDICES.CHEEK_LEFT];
        const cheekR = rawLandmarks[FACE_MESH_INDICES.CHEEK_RIGHT];
        const pixL = ctx.getImageData(Math.round(cheekL.x * canvas.width), Math.round(cheekL.y * canvas.height), 1, 1).data;
        const pixR = ctx.getImageData(Math.round(cheekR.x * canvas.width), Math.round(cheekR.y * canvas.height), 1, 1).data;
        const lumL = 0.299 * pixL[0] + 0.587 * pixL[1] + 0.114 * pixL[2];
        const lumR = 0.299 * pixR[0] + 0.587 * pixR[1] + 0.114 * pixR[2];
        const lumDiff = Math.abs(lumL - lumR);
        if (lumDiff > 55) {
          vLight = 0.5;
          notes.push(`Strong side lighting detected (ΔL: ${Math.round(lumDiff)}): tone evenness evaluated at partial visibility`);
        }
      } catch {
        // Ignored
      }
    }

    // AI / Mirror filter check: test horizontal asymmetry across key pairs
    let isFilteredOrMirrored = false;
    if (canonical) {
      const gX = canonical.g.x;
      const leftDist = Math.abs(canonical.ex_left.x - gX);
      const rightDist = Math.abs(canonical.ex_right.x - gX);
      const asymEx = Math.abs(leftDist - rightDist) / (leftDist + rightDist);

      const leftPupilDist = Math.abs(canonical.p_left.x - gX);
      const rightPupilDist = Math.abs(canonical.p_right.x - gX);
      const asymPupil = Math.abs(leftPupilDist - rightPupilDist) / (leftPupilDist + rightPupilDist);

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
