/**
 * GABRU — POSE LANDMARKS SERVICE
 * 
 * Powered by Google MediaPipe PoseLandmarker (33 full-body skeletal landmarks).
 * Executes 100% client-side in WebAssembly/WebGL with TFLite console error protection.
 */

import { executeWithConsoleFilter, executeWithConsoleFilterAsync } from '@/core/security/ConsoleLogFilterUtil';
import { MEDIAPIPE_CONFIG } from '@/core/config/SiteConfig';
import { LandmarkPoint } from '../types/OutfitRatingTypes';

let poseLandmarkerInstance: unknown = null;
let poseLandmarkerLoading = false;
const poseLandmarkerCallbacks: Array<(pl: unknown) => void> = [];

/**
 * Initializes and retrieves the singleton MediaPipe PoseLandmarker instance
 */
export async function getPoseLandmarker(): Promise<unknown> {
  if (poseLandmarkerInstance) return poseLandmarkerInstance;

  if (poseLandmarkerLoading) {
    return new Promise((resolve) => {
      poseLandmarkerCallbacks.push(resolve);
    });
  }

  poseLandmarkerLoading = true;

  return executeWithConsoleFilterAsync(async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { FilesetResolver, PoseLandmarker } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmCdn);

      try {
        poseLandmarkerInstance = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_CONFIG.poseModelUrl,
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
            modelAssetPath: MEDIAPIPE_CONFIG.poseModelUrl,
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
      console.warn('Failed to load PoseLandmarker:', err);
      poseLandmarkerCallbacks.forEach((cb) => cb(null));
      poseLandmarkerCallbacks.length = 0;
      return null;
    }
  });
}

export interface PoseDetectionResult {
  humanDetected: boolean;
  detectedCount: number;
  primaryPose: LandmarkPoint[] | null;
}

/**
 * Detects poses on a prepared canvas and isolates the primary front-focused human
 */
export async function detectPose(canvas: HTMLCanvasElement): Promise<PoseDetectionResult> {
  const landmarker = (await getPoseLandmarker()) as {
    detect: (canvas: HTMLCanvasElement) => { landmarks?: LandmarkPoint[][] };
  } | null;

  if (!landmarker) {
    return { humanDetected: false, detectedCount: 0, primaryPose: null };
  }

  const result = executeWithConsoleFilter(() => landmarker.detect(canvas));

  if (!result || !result.landmarks || result.landmarks.length === 0) {
    return { humanDetected: false, detectedCount: 0, primaryPose: null };
  }

  const candidatePoses = result.landmarks;
  const detectedCount = candidatePoses.length;

  let primaryPose: LandmarkPoint[] = candidatePoses[0];
  let maxProminence = -1;

  for (let c = 0; c < candidatePoses.length; c++) {
    const candidate = candidatePoses[c];
    if (!candidate || candidate.length < 33) continue;

    const leftShoulder = candidate[11];
    const rightShoulder = candidate[12];
    const leftHip = candidate[23];
    const rightHip = candidate[24];
    const nose = candidate[0];

    const shoulderDist = Math.hypot(rightShoulder.x - leftShoulder.x, rightShoulder.y - leftShoulder.y);
    const hipDist = Math.hypot(rightHip.x - leftHip.x, rightHip.y - leftHip.y);
    const torsoHeight = Math.abs((leftHip.y + rightHip.y) / 2 - (leftShoulder.y + rightShoulder.y) / 2);
    const bodyBoxArea = Math.max(shoulderDist, hipDist) * torsoHeight;

    const centerX = (leftShoulder.x + rightShoulder.x) / 2;
    const centerY = (leftShoulder.y + rightShoulder.y) / 2;
    const distFromCenter = Math.hypot(centerX - 0.5, centerY - 0.5);

    const leftEye = candidate[2];
    const rightEye = candidate[5];
    const eyeSpan = Math.abs(rightEye.x - leftEye.x);
    const noseDistToLeft = Math.abs(nose.x - leftEye.x);
    const noseDistToRight = Math.abs(nose.x - rightEye.x);
    const facialAsymmetry = eyeSpan > 0.01 ? Math.abs(noseDistToLeft - noseDistToRight) / eyeSpan : 0;
    const isFrontFacing = facialAsymmetry < 0.6;

    const prominence = bodyBoxArea * 2.0 - distFromCenter * 0.5 + (isFrontFacing ? 0.3 : 0);

    if (prominence > maxProminence) {
      maxProminence = prominence;
      primaryPose = candidate;
    }
  }

  return {
    humanDetected: true,
    detectedCount,
    primaryPose,
  };
}

