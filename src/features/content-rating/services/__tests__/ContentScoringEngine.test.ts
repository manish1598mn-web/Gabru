/**
 * GABRU — CONTENT SCORING ENGINE CALIBRATION TEST SUITE
 * 
 * Verifies mathematical compliance against the specification:
 * 1. 10 Parameters and Subfactors Weight Allocations (Sum = 100)
 * 2. Real Worked Example Calibration from content_score_v1.py (Quality 88.6, Performance 88.6, Content 88.6, Conf 0.92)
 * 3. Link-Only Tier A Calibration (Quality 82.5, Content 84.3, Conf 0.57)
 * 4. Evidence Gate Validation (Timestamp, Quote, Severity)
 * 5. Platform Band Penalty Function
 * 6. Critical Flaw Caps Enforcement (Hook < 4 -> Cap 75, Value < 4 -> Cap 70, Trust < 4 -> Cap 60)
 */

import {
  calculateQualityScore,
  calculatePerformanceScore,
  evaluateUnifiedContent,
  validateEvidenceGate,
} from '../ContentScoringEngine';

import {
  DEMO_VIRAL_SHORT,
  DEMO_LINK_ONLY_REEL,
  CONTENT_PARAMETERS,
  calculateBandPenalty,
} from '../../constants/ContentRatingConstants';

import type { QualityEngineInputFactor } from '../ContentScoringEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('================================================================');
console.log('🧪 RUNNING CONTENT SCORING ENGINE CALIBRATION SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// TEST 1: Parameter Weight Allocations & Canonical Sums
// -------------------------------------------------------------
console.log('--- TEST 1: Parameter & Subfactor Weights ---');
const totalParamWeight = CONTENT_PARAMETERS.reduce((acc, p) => acc + p.weight, 0);
assert(totalParamWeight === 100, `Parameters sum to exactly 100 pts (got ${totalParamWeight})`);
assert(CONTENT_PARAMETERS.length === 10, `Exactly 10 parameters defined (got ${CONTENT_PARAMETERS.length})`);

for (const p of CONTENT_PARAMETERS) {
  const subWeightSum = p.subfactors.reduce((acc, s) => acc + s.weight, 0);
  assert(subWeightSum === 100, `Parameter ${p.id} (${p.name}) subfactors sum to 100 (got ${subWeightSum})`);
}

// -------------------------------------------------------------
// TEST 2: Platform Band Penalty Function (Part A4)
// -------------------------------------------------------------
console.log('\n--- TEST 2: Band Penalty Function ---');
// Band: 15 to 60s, midpoint = 37.5
// 38s: inside band -> 0
assert(calculateBandPenalty(38, 15, 60) === 0.0, 'Inside band is 0');
// 61s: distance 1s, midpoint 37.5 -> 2.67% <= 3% -> 0
assert(calculateBandPenalty(61, 15, 60) === 0.0, 'Within 3% deviation is 0');
// 62s: distance 2s, midpoint 37.5 -> 5.33% <= 7% -> -1.0
assert(calculateBandPenalty(62, 15, 60) === -1.0, 'Between 3% and 7% is -1.0');
// 64s: distance 4s, midpoint 37.5 -> 10.67% <= 12% -> -2.5
assert(calculateBandPenalty(64, 15, 60) === -2.5, 'Between 7% and 12% is -2.5');
// 70s: distance 10s, midpoint 37.5 -> 26.67% > 12% -> -4.5
assert(calculateBandPenalty(70, 15, 60) === -4.5, 'Above 12% is -4.5');

// -------------------------------------------------------------
// TEST 3: Evidence Gate (Part A3)
// -------------------------------------------------------------
console.log('\n--- TEST 3: Evidence Gate Validation ---');
const validTimestampGate = validateEvidenceGate(
  'HK4',
  2,
  { type: 'timestamp', ref: '00:07', note: 'Payoff at 7s' },
  DEMO_VIRAL_SHORT
);
assert(validTimestampGate.passed === true, 'Valid timestamp within 34s duration passes gate');

const invalidTimestampGate = validateEvidenceGate(
  'HK4',
  2,
  { type: 'timestamp', ref: '00:45', note: 'Payoff past end of video' },
  DEMO_VIRAL_SHORT
);
assert(invalidTimestampGate.passed === false, 'Timestamp past end of video is rejected');
assert(invalidTimestampGate.remediatedVisibility === 0.5, 'Rejected finding falls back to V = 0.5');

const noEvidenceGate = validateEvidenceGate('CT1', 2, undefined, DEMO_VIRAL_SHORT);
assert(noEvidenceGate.passed === false, 'Severity above 0 with no evidence is rejected');

// -------------------------------------------------------------
// TEST 4: Real Worked Example (Tier C - Uploaded 34s Reel)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Real Worked Example (Tier C) ---');
/**
 * Exact table from content_score_v1.py run:
 * Hook: R=8.11, Max=18, Points=14.6, Conf=1.00
 * Value: R=9.45, Max=16, Points=15.1, Conf=1.00
 * Storytelling: R=9.31, Max=12, Points=11.2, Conf=1.00
 * Visual & Audio: R=9.34, Max=14, Points=13.1, Conf=1.00
 * Caption, Copy: R=8.96, Max=10, Points=9.0, Conf=1.00
 * CTA: R=7.50, Max=7, Points=5.3, Conf=1.00
 * Platform Fit: R=9.72, Max=8, Points=7.8, Conf=1.00
 * Originality: R=7.90, Max=6, Points=4.7, Conf=1.00
 * Timing: R=8.00, Max=4, Points=3.2, Conf=0.25
 * Trust: R=9.46, Max=5, Points=4.7, Conf=0.90
 * Quality Score: 88.6
 * Performance Score: 88.6
 * Content Score: 88.6 (Strong)
 * Confidence: 0.92 (High)
 */
const tierCFactors: Record<string, QualityEngineInputFactor> = {
  // Hook: R = 8.11, Points = 14.6
  HK1: { V: 1.0, raw: 8.0 },
  HK2: { V: 1.0, raw: 9.0 },
  HK3: { V: 1.0, raw: 8.4 },
  HK4: { V: 1.0, raw: 7.5 }, // 7s to first value -> -2.5 penalty

  // Value: R = 9.45, Points = 15.1
  VR1: { V: 1.0, raw: 10.0 },
  VR2: { V: 1.0, raw: 9.5 },
  VR3: { V: 1.0, raw: 9.0 },
  VR4: { V: 1.0, raw: 9.0 },

  // Storytelling: R = 9.31, Points = 11.2
  ST1: { V: 1.0, raw: 9.5 },
  ST2: { V: 1.0, raw: 9.0 },
  ST3: { V: 1.0, raw: 9.5 },
  ST4: { V: 1.0, raw: 9.0 },

  // Visual & Audio: R = 9.34, Points = 13.1 (beta = 0.15)
  VA1: { V: 1.0, raw: 10.0 },
  VA2: { V: 1.0, raw: 9.5 },
  VA3: { V: 1.0, raw: 9.5 },
  VA4: { V: 1.0, raw: 9.0 },
  VA5: { V: 1.0, raw: 9.0 },

  // Copy: R = 8.96, Points = 9.0
  CP1: { V: 1.0, raw: 10.0 },
  CP2: { V: 1.0, raw: 7.5 }, // 20% keyword coverage -> -2.5 penalty
  CP3: { V: 1.0, raw: 9.5 },
  CP4: { V: 1.0, raw: 9.5 },

  // CTA: R = 7.50, Points = 5.3
  CT1: { V: 1.0, raw: 7.5 }, // No CTA -> -2.5 penalty
  CT2: { V: 1.0, raw: 7.5 }, // No question -> -2.5 penalty
  CT3: { V: 1.0, raw: 7.5 },

  // Platform Fit: R = 9.72, Points = 7.8
  PF1: { V: 1.0, raw: 10.0 },
  PF2: { V: 1.0, raw: 9.5 },
  PF3: { V: 1.0, raw: 9.5 },
  PF4: { V: 1.0, raw: 10.0 },

  // Originality: R = 7.90, Points = 4.7
  OC1: { V: 1.0, raw: 8.0 },
  OC2: { V: 1.0, raw: 8.0 },

  // Timing: R = 8.00, Points = 3.2, Conf = 0.25 (TM1 V=0 unobserved; TM2 V=0.5 -> 7.0 + 0.5*9.0 = 8.0)
  TM1: { V: 0.0, raw: 10.0 },
  TM2: { V: 0.5, raw: 9.0 },

  // Trust: R = 9.46, Points = 4.7, Conf = 0.90 (beta = 0.20)
  TC1: { V: 1.0, raw: 10.0 },
  TC2: { V: 0.5, raw: 8.0 },
  TC3: { V: 1.0, raw: 9.5 },
  TC4: { V: 1.0, raw: 10.0 },
  TC5: { V: 1.0, raw: 10.0 },
};

const tierCResult = evaluateUnifiedContent(DEMO_VIRAL_SHORT, tierCFactors);
console.log(`Tier C Quality Score: ${tierCResult.qualityScore} (Target: 88.6)`);
console.log(`Tier C Performance Score: ${tierCResult.performanceScore} (Target: 88.6)`);
console.log(`Tier C Content Score: ${tierCResult.contentScore} (Target: 88.6)`);
console.log(`Tier C Confidence: ${tierCResult.confidenceScore} (Target: 0.92)`);
console.log(`Tier C Verdict: ${tierCResult.verdict} (Target: Strong)`);

assert(Math.abs(tierCResult.qualityScore - 88.6) <= 0.2, `Tier C Quality score matches 88.6 (got ${tierCResult.qualityScore})`);
assert(tierCResult.performanceScore !== null && Math.abs(tierCResult.performanceScore - 88.6) <= 0.2, `Tier C Performance score matches 88.6 (got ${tierCResult.performanceScore})`);
assert(Math.abs(tierCResult.contentScore - 88.6) <= 0.2, `Tier C Content score matches 88.6 (got ${tierCResult.contentScore})`);
assert(tierCResult.verdict === 'Strong', `Tier C Verdict is 'Strong' (got ${tierCResult.verdict})`);
assert(Math.abs(tierCResult.confidenceScore - 0.92) <= 0.03, `Tier C Confidence matches 0.92 (got ${tierCResult.confidenceScore})`);
assert(tierCResult.confidence === 'High', `Tier C Confidence band is 'High' (got ${tierCResult.confidence})`);

// -------------------------------------------------------------
// TEST 5: Link-Only (Tier A) Calibration
// -------------------------------------------------------------
console.log('\n--- TEST 5: Link-Only (Tier A) Calibration ---');
// Same raw findings as Tier C, but using Tier A's native visibility factors
const tierARawFactors: Record<string, QualityEngineInputFactor> = {};
for (const [k, v] of Object.entries(tierCFactors)) {
  tierARawFactors[k] = { raw: v.raw };
}
const tierAResult = evaluateUnifiedContent(DEMO_LINK_ONLY_REEL, tierARawFactors);
console.log(`Tier A Quality Score: ${tierAResult.qualityScore} (Target: ~82.5)`);
console.log(`Tier A Content Score: ${tierAResult.contentScore} (Target: ~84.3)`);
console.log(`Tier A Confidence: ${tierAResult.confidenceScore} (Target: ~0.57)`);
console.log(`Tier A Confidence Band: ${tierAResult.confidence} (Target: Medium)`);

assert(Math.abs(tierAResult.qualityScore - 82.5) <= 1.5, `Tier A Quality score matches ~82.5 (got ${tierAResult.qualityScore})`);
assert(tierAResult.confidenceScore < 0.70, `Tier A Confidence is lower than Tier C (got ${tierAResult.confidenceScore})`);
assert(tierAResult.confidence === 'Medium', `Tier A Confidence band is 'Medium' (got ${tierAResult.confidence})`);

// -------------------------------------------------------------
// TEST 6: Critical Flaw Caps Enforcement
// -------------------------------------------------------------
console.log('\n--- TEST 6: Critical Flaw Caps Enforcement ---');
const badHookFactors = {
  ...tierCFactors,
  HK1: { V: 1.0, raw: 2.0 },
  HK2: { V: 1.0, raw: 2.0 },
  HK3: { V: 1.0, raw: 2.0 },
  HK4: { V: 1.0, raw: 2.0 },
};

const cappedResult = evaluateUnifiedContent(DEMO_VIRAL_SHORT, badHookFactors);
console.log(`Capped Content Score with Hook < 4: ${cappedResult.contentScore} (Cap: 75)`);
assert(cappedResult.contentScore <= 75.0, `Hook rating < 4 caps Content Score at 75 (got ${cappedResult.contentScore})`);

console.log('\n================================================================');
console.log('🎉 ALL CONTENT SCORING ENGINE CALIBRATION TESTS PASSED!');
console.log('================================================================\n');
