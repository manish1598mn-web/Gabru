/**
 * GABRU — SITE & CORE CONFIGURATION
 */

export const SITE_CONFIG = {
  name: 'Gabru',
  tagline: 'AI Fashion Intelligence & Facial Attractiveness Studio',
  description:
    'Instant, 100% private in-browser biometric evaluation across outfit tailoring, proportions, harmony, and facial aesthetic canons. Zero data retention.',
  url: 'https://gabru.app',
  ogImage: '/hero_fashion_mosaic.jpg',
  navLinks: [
    { label: 'Fit Check', href: '/', id: 'nav-link-home' },
    { label: 'Beauty rating', href: '/beauty-rating', id: 'nav-btn-beauty-rating' },
  ],
  version: '2.0.0',
};

export const MEDIAPIPE_CONFIG = {
  wasmCdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  poseModelUrl:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
  faceModelUrl:
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
};

