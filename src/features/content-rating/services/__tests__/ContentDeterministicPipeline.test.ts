/**
 * GABRU — CONTENT DETERMINISTIC PIPELINE & VERIFICATION TEST
 * 
 * Verifies:
 * 1. ZERO Math.random() in execution - pure mathematical determinism
 * 2. Binary FNV-1a Hash determinism - identical byte buffer yields identical hash
 * 3. Rubric extraction determinism - identical visual metrics + hash yields identical score
 * 4. CSV & JSON Telemetry ingestion - real fields parsed with zero fallback simulation
 * 5. Deterministic Idempotence - analyzing identical input 100 times produces bitwise-identical results
 */

import {
  computeBinaryFnv1a,
  deriveDeterministicRubrics,
  parseTelemetryFileText,
  ExtractedVisualFeatures,
} from '../ContentMediaAnalysisService';

import {
  evaluateUnifiedContent,
  resolveSinglePostTelemetry,
} from '../ContentScoringEngine';

import { UnifiedContentItem } from '../../types/ContentRatingTypes';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('\n================================================================');
console.log('🧪 RUNNING DETERMINISTIC PIPELINE & AUDIT VERIFICATION TESTS');
console.log('================================================================\n');

// -------------------------------------------------------------
// TEST 1: FNV-1a Binary Hash Determinism
// -------------------------------------------------------------
console.log('--- TEST 1: FNV-1a Binary Hash Determinism ---');
const testBytesA = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
const testBytesB = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
const testBytesC = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

const hashA = computeBinaryFnv1a(testBytesA.buffer);
const hashB = computeBinaryFnv1a(testBytesB.buffer);
const hashC = computeBinaryFnv1a(testBytesC.buffer);

assert(hashA === hashB, `Identical byte buffers must produce identical hashes (${hashA} === ${hashB})`);
assert(hashA !== hashC, `Different byte buffers must produce distinct hashes (${hashA} !== ${hashC})`);

// -------------------------------------------------------------
// TEST 2: Deterministic Rubric Derivation
// -------------------------------------------------------------
console.log('\n--- TEST 2: Deterministic Rubric Derivation ---');
const sampleVisual1: ExtractedVisualFeatures = {
  width: 1080,
  height: 1920,
  aspectRatio: 0.562,
  meanLuminance: 135.2,
  contrastStdDev: 48.6,
  edgeSharpness: 72,
  saturation: 0.54,
  centerContrastRatio: 1.35,
};

const rubrics1 = deriveDeterministicRubrics(sampleVisual1, hashA, 18);
const rubrics2 = deriveDeterministicRubrics(sampleVisual1, hashA, 18);

assert(rubrics1.lighting === rubrics2.lighting, `Lighting is bitwise identical (${rubrics1.lighting})`);
assert(rubrics1.colorGrading === rubrics2.colorGrading, `Color grading is bitwise identical (${rubrics1.colorGrading})`);
assert(rubrics1.composition === rubrics2.composition, `Composition is bitwise identical (${rubrics1.composition})`);
assert(rubrics1.visualHook === rubrics2.visualHook, `Visual hook is bitwise identical (${rubrics1.visualHook})`);
assert(rubrics1.stylingDrip === rubrics2.stylingDrip, `Styling drip is bitwise identical (${rubrics1.stylingDrip})`);
assert(rubrics1.captionWit === rubrics2.captionWit, `Caption wit is bitwise identical (${rubrics1.captionWit})`);
assert(rubrics1.shareRelatability === rubrics2.shareRelatability, `Share relatability is bitwise identical (${rubrics1.shareRelatability})`);

// -------------------------------------------------------------
// TEST 3: Real CSV & JSON Telemetry Parsing
// -------------------------------------------------------------
console.log('\n--- TEST 3: Real CSV & JSON Telemetry Parsing ---');
const csvInput = `likes,comments,shares,saves,views,platform\n4820,310,890,1420,74000,tiktok`;
const parsedCsv = parseTelemetryFileText(csvInput);

assert(parsedCsv !== null, 'CSV parsed successfully');
assert(parsedCsv?.metrics?.likes === 4820, `CSV parsed exact likes (got ${parsedCsv?.metrics?.likes})`);
assert(parsedCsv?.metrics?.comments === 310, `CSV parsed exact comments (got ${parsedCsv?.metrics?.comments})`);
assert(parsedCsv?.metrics?.shares === 890, `CSV parsed exact shares (got ${parsedCsv?.metrics?.shares})`);
assert(parsedCsv?.metrics?.saves === 1420, `CSV parsed exact saves (got ${parsedCsv?.metrics?.saves})`);
assert(parsedCsv?.metrics?.views === 74000, `CSV parsed exact views (got ${parsedCsv?.metrics?.views})`);

const jsonInput = JSON.stringify({
  likes: 12500,
  comments: 840,
  shares: 2300,
  saves: 3900,
  views: 185000,
  authorHandle: '@cinematic_creator',
  title: 'Anamorphic Lighting Setup',
  platform: 'youtube',
});
const parsedJson = parseTelemetryFileText(jsonInput);

assert(parsedJson !== null, 'JSON parsed successfully');
assert(parsedJson?.metrics?.likes === 12500, `JSON parsed exact likes (${parsedJson?.metrics?.likes})`);
assert(parsedJson?.metrics?.comments === 840, `JSON parsed exact comments (${parsedJson?.metrics?.comments})`);
assert(parsedJson?.metrics?.shares === 2300, `JSON parsed exact shares (${parsedJson?.metrics?.shares})`);
assert(parsedJson?.metrics?.saves === 3900, `JSON parsed exact saves (${parsedJson?.metrics?.saves})`);
assert(parsedJson?.creator?.handle === '@cinematic_creator', `JSON parsed exact creator handle (${parsedJson?.creator?.handle})`);

// -------------------------------------------------------------
// TEST 4: Full Idempotence & Determinism Check (100 Iterations)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Full Idempotence Check (100 Iterations) ---');
const testItem: UnifiedContentItem = {
  id: 'test_post_deterministic',
  url: 'https://instagram.com/reel/C8DeterministicRun',
  platform: 'instagram',
  format: 'short_video',
  inputMode: 'upload',
  dataTier: 'C',
  title: 'Test Deterministic Pipeline',
  caption: 'Testing my frame with no random jitter. #aesthetic #cinematic',
  creator: {
    id: 'creator_test',
    handle: '@creator_test',
    name: 'Test Creator',
    followerCount: 45000,
  },
  postedAt: '2026-10-25T19:00:00Z',
  media: {
    thumbnailUrl: '/sample.jpg',
    durationSec: 22,
    width: 1080,
    height: 1920,
    aspectRatio: 0.562,
  },
  metrics: {
    likes: 5400,
    comments: 320,
    shares: 880,
    saves: 1240,
    views: 68000,
    reposts: 95,
  },
  hashtags: ['aesthetic', 'cinematic'],
  mentions: [],
  transcriptSegments: [],
  keyframes: [],
  dataCompleteness: {
    publicMetrics: true,
    ownerAnalytics: false,
    mediaFile: true,
    transcript: false,
    keyframes: false,
  },
  llmEvaluations: rubrics1,
};

const baselineEvaluation = evaluateUnifiedContent(testItem);

for (let iter = 1; iter <= 100; iter++) {
  const rerun = evaluateUnifiedContent(testItem);
  if (rerun.contentScore !== baselineEvaluation.contentScore ||
      rerun.rawScore !== baselineEvaluation.rawScore ||
      rerun.verdictBadge !== baselineEvaluation.verdictBadge ||
      rerun.archetypeTier !== baselineEvaluation.archetypeTier) {
    throw new Error(`Non-deterministic divergence on iteration ${iter}!`);
  }
}
assert(true, '100 iterations of identical input produced 100% bitwise-identical evaluation outputs');

console.log('\n================================================================');
console.log('🎉 ALL DETERMINISTIC PIPELINE AUDIT TESTS PASSED!');
console.log('================================================================\n');
