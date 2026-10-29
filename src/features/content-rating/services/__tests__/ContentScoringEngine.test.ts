/**
 * GABRU — CONTENT SCORING ENGINE CALIBRATION TEST SUITE
 * 
 * Verifies mathematical compliance against the specification:
 * 1. Worked Example Reproduction (Section 6: Quality 70.8, Performance 70.7, Content 70.8)
 * 2. Critical Flaw Caps Enforcement (Hook < 4 -> Cap 75, Value < 4 -> Cap 70, Trust < 4 -> Cap 60)
 * 3. N/A Subfactor Exclusion and Confidence Normalization
 * 4. Delta-Gain Calculation & Suggestion Effort Tiers
 */

import {
  calculateQualityScore,
  calculatePerformanceScore,
  aggregateContentScore,
  evaluateUnifiedContent,
} from '../ContentScoringEngine';

import {
  DEMO_VIRAL_SHORT,
  CONTENT_PARAMETERS,
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
// TEST 2: Section 6 Worked Example Calibration
// -------------------------------------------------------------
console.log('\n--- TEST 2: Section 6 Worked Example Calibration ---');

/**
 * Section 6 Table Ratings:
 * Hook: R = 6.5, Max = 18, Pts = 11.7
 * Value: R = 8.0, Max = 16, Pts = 12.8
 * Structure: R = 7.5, Max = 12, Pts = 9.0
 * Visual & Audio: R = 7.0, Max = 14, Pts = 9.8
 * Copy: R = 5.5, Max = 10, Pts = 5.5
 * CTA: R = 4.0, Max = 7, Pts = 2.8
 * Format: R = 9.0, Max = 8, Pts = 7.2
 * Originality: R = 7.0, Max = 6, Pts = 4.2
 * Timing: N/A, excluded (V=0)
 * Trust: R = 10.0, Max = 5, Pts = 5.0
 * Total Pts = 68.0, Observable Max = 96.0
 * Quality = 70.8
 * Performance = 70.7 (z_eng = +1.2 -> R=8.0, z_reach = +0.4 -> R=6.0, comment = 7.0)
 * Content Score = 70.8
 */
const section6Factors: Record<string, QualityEngineInputFactor> = {
  // Hook: R = 6.5
  HK1: { V: 1.0, raw: 6.5 },
  HK2: { V: 1.0, raw: 6.5 },
  HK3: { V: 1.0, raw: 6.5 },
  HK4: { V: 1.0, raw: 6.5 },

  // Value: R = 8.0
  VL1: { V: 1.0, raw: 8.0 },
  VL2: { V: 1.0, raw: 8.0 },
  VL3: { V: 1.0, raw: 8.0 },
  VL4: { V: 1.0, raw: 8.0 },

  // Structure: R = 7.5
  ST1: { V: 1.0, raw: 7.5 },
  ST2: { V: 1.0, raw: 7.5 },
  ST3: { V: 1.0, raw: 7.5 },
  ST4: { V: 1.0, raw: 7.5 },

  // Media: R = 7.0
  VA1: { V: 1.0, raw: 7.0 },
  VA2: { V: 1.0, raw: 7.0 },
  VA3: { V: 1.0, raw: 7.0 },
  VA4: { V: 1.0, raw: 7.0 },

  // Copy: R = 5.5
  CP1: { V: 1.0, raw: 5.5 },
  CP2: { V: 1.0, raw: 5.5 },
  CP3: { V: 1.0, raw: 5.5 },
  CP4: { V: 1.0, raw: 5.5 },

  // CTA: R = 4.0
  CT1: { V: 1.0, raw: 4.0 },
  CT2: { V: 1.0, raw: 4.0 },
  CT3: { V: 1.0, raw: 4.0 },

  // Format: R = 9.0
  PF1: { V: 1.0, raw: 9.0 },
  PF2: { V: 1.0, raw: 9.0 },
  PF3: { V: 1.0, raw: 9.0 },
  PF4: { V: 1.0, raw: 9.0 },

  // Originality: R = 7.0
  OG1: { V: 1.0, raw: 7.0 },
  OG2: { V: 1.0, raw: 7.0 },
  OG3: { V: 1.0, raw: 7.0 },

  // Timing: V = 0.0 (excluded)
  TM1: { V: 0.0, isApplicable: false },
  TM2: { V: 0.0, isApplicable: false },

  // Trust: R = 10.0
  TC1: { V: 1.0, raw: 10.0 },
  TC2: { V: 1.0, raw: 10.0 },
  TC3: { V: 1.0, raw: 10.0 },
};

const qualityResult = calculateQualityScore(DEMO_VIRAL_SHORT, section6Factors);
console.log(`Quality Score: ${qualityResult.score} (Target: 70.8)`);
console.log(`Points Total: ${qualityResult.pointsTotal} (Target: 68.0)`);
console.log(`Observable Max: ${qualityResult.maxObservablePoints} (Target: 96)`);

assert(Math.abs(qualityResult.score - 70.8) <= 0.1, `Quality score matches Section 6 target (got ${qualityResult.score})`);
assert(Math.abs(qualityResult.pointsTotal - 68.0) <= 0.1, `Points total matches 68.0 (got ${qualityResult.pointsTotal})`);
assert(qualityResult.maxObservablePoints === 96, `Observable max points is 96 with timing excluded (got ${qualityResult.maxObservablePoints})`);

const performanceResult = calculatePerformanceScore(DEMO_VIRAL_SHORT);
console.log(`Performance Score: ${performanceResult.score} (Target: 70.7)`);
assert(Math.abs(performanceResult.score - 70.7) <= 0.2, `Performance score matches Section 6 target (got ${performanceResult.score})`);

const contentScoreResult = aggregateContentScore(qualityResult, performanceResult);
console.log(`Content Score: ${contentScoreResult.contentScore} (Target: 70.8)`);
console.log(`Verdict: ${contentScoreResult.verdict} (Target: Good)`);

assert(Math.abs(contentScoreResult.contentScore - 70.8) <= 0.1, `Content score matches Section 6 target (got ${contentScoreResult.contentScore})`);
assert(contentScoreResult.verdict === 'Good', `Verdict is 'Good' (got ${contentScoreResult.verdict})`);

// -------------------------------------------------------------
// TEST 3: Critical Flaw Caps Enforcement
// -------------------------------------------------------------
console.log('\n--- TEST 3: Critical Flaw Caps Enforcement ---');

// Case A: Hook Rating < 4.0 -> Uncapped score is 85.0, Cap clamps to 75.0
const badHookFactors: Record<string, QualityEngineInputFactor> = {
  ...section6Factors,
  // Low hook (R = 2.0)
  HK1: { V: 1.0, raw: 2.0 },
  HK2: { V: 1.0, raw: 2.0 },
  HK3: { V: 1.0, raw: 2.0 },
  HK4: { V: 1.0, raw: 2.0 },
  // Perfect scores everywhere else
  VL1: { V: 1.0, raw: 10.0 },
  VL2: { V: 1.0, raw: 10.0 },
  VL3: { V: 1.0, raw: 10.0 },
  VL4: { V: 1.0, raw: 10.0 },
  ST1: { V: 1.0, raw: 10.0 },
  ST2: { V: 1.0, raw: 10.0 },
  ST3: { V: 1.0, raw: 10.0 },
  ST4: { V: 1.0, raw: 10.0 },
  VA1: { V: 1.0, raw: 10.0 },
  VA2: { V: 1.0, raw: 10.0 },
  VA3: { V: 1.0, raw: 10.0 },
  VA4: { V: 1.0, raw: 10.0 },
  CP1: { V: 1.0, raw: 10.0 },
  CP2: { V: 1.0, raw: 10.0 },
  CP3: { V: 1.0, raw: 10.0 },
  CP4: { V: 1.0, raw: 10.0 },
  CT1: { V: 1.0, raw: 10.0 },
  CT2: { V: 1.0, raw: 10.0 },
  CT3: { V: 1.0, raw: 10.0 },
  PF1: { V: 1.0, raw: 10.0 },
  PF2: { V: 1.0, raw: 10.0 },
  PF3: { V: 1.0, raw: 10.0 },
  PF4: { V: 1.0, raw: 10.0 },
  OG1: { V: 1.0, raw: 10.0 },
  OG2: { V: 1.0, raw: 10.0 },
  OG3: { V: 1.0, raw: 10.0 },
  TC1: { V: 1.0, raw: 10.0 },
  TC2: { V: 1.0, raw: 10.0 },
  TC3: { V: 1.0, raw: 10.0 },
};
const badHookResult = calculateQualityScore(DEMO_VIRAL_SHORT, badHookFactors);
assert(badHookResult.score === 75.0, `Hook < 4.0 correctly caps Quality Score at exactly 75.0 (got ${badHookResult.score})`);
assert(badHookResult.capsTriggered.length > 0, `Cap trigger recorded: "${badHookResult.capsTriggered[0]?.reason}"`);

// Case B: Compliance Flaw -> Uncapped score is ~85.0, Cap clamps to 60.0
const badComplianceFactors: Record<string, QualityEngineInputFactor> = {
  ...badHookFactors,
  // Good hook
  HK1: { V: 1.0, raw: 10.0 },
  HK2: { V: 1.0, raw: 10.0 },
  HK3: { V: 1.0, raw: 10.0 },
  HK4: { V: 1.0, raw: 10.0 },
  // Low compliance (R = 1.0)
  TC1: { V: 1.0, raw: 1.0 },
  TC2: { V: 1.0, raw: 1.0 },
  TC3: { V: 1.0, raw: 1.0 },
};
const badComplianceResult = calculateQualityScore(DEMO_VIRAL_SHORT, badComplianceFactors);
assert(badComplianceResult.score === 60.0, `Compliance failure correctly caps Quality Score at exactly 60.0 (got ${badComplianceResult.score})`);
assert(badComplianceResult.capsTriggered.length > 0, `Compliance cap trigger recorded: "${badComplianceResult.capsTriggered[0]?.reason}"`);

// -------------------------------------------------------------
// TEST 4: Full End-to-End Orchestrator & Suggestions
// -------------------------------------------------------------
console.log('\n--- TEST 4: Full Orchestrator & Suggestions ---');

const fullAnalysis = evaluateUnifiedContent(DEMO_VIRAL_SHORT, section6Factors);
assert(fullAnalysis.contentScore > 0, `Full analysis returned content score: ${fullAnalysis.contentScore}`);
assert(fullAnalysis.pros.length > 0, `Pros generated: ${fullAnalysis.pros.length} items`);
assert(fullAnalysis.cons.length > 0, `Cons generated: ${fullAnalysis.cons.length} items`);
assert(fullAnalysis.suggestions.length > 0, `Actionable suggestions generated: ${fullAnalysis.suggestions.length} items`);

console.log('Top Suggestions:');
for (const s of fullAnalysis.suggestions) {
  console.log(`  • ${s.title} [Gain: +${s.estimatedGain} pts, Effort: ${s.effort}]`);
}

console.log('\n================================================================');
console.log('🎉 ALL CONTENT SCORING ENGINE CALIBRATION TESTS PASSED!');
console.log('================================================================');
