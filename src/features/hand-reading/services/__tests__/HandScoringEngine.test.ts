/**
 * GABRU — HAND READING SCORING ENGINE TESTS
 * 
 * Verifies:
 * 1. Photo quality gate calculation (sharpness, width, shadow, tilt, fingers spread)
 * 2. Exact reproduction of the specification's worked example:
 *    - Life Line: 86.9 (Very pronounced, conf 0.66)
 *    - Head Line: 75.2 (Pronounced, conf 0.63)
 *    - Heart Line: 71.8 (Pronounced, conf 0.59)
 *    - Fate Line: 0.0 (Not visible, conf 0.56)
 *    - Sun Line: 51.2 (Moderate, conf 0.49)
 *    - Mercury Line: 51.2 (Moderate, conf 0.45)
 *    - Relationship Lines: 73.0 (Pronounced, conf 0.52)
 *    - Mounts: 48.6 (Moderate, conf 0.56)
 *    - Hand Shape & Fingers: 63.7 (Pronounced Fire, conf 0.66)
 *    - Special Markings: 25.0 (Light, conf 0.42)
 *    - Overall with "zero": 54.7
 *    - Overall with "exclude": 60.7
 *    - Mean confidence: 0.55
 * 3. 4 Elemental hand shape prototypes (Earth, Air, Fire, Water)
 * 4. Unreadable threshold (< 0.40) & Absent feature policy toggle
 */

import {
  computeQualityGate,
  scoreLineParameter,
  scoreRelationshipLines,
  scoreMounts,
  scoreHandShape,
  scoreSpecialMarkings,
  evaluateHandReading,
} from '../HandScoringEngine';

import { DEMO_PALM_PRESETS } from '../../constants/HandReadingConstants';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('\n================================================================');
console.log('🧪 RUNNING HAND READING SCORING ENGINE TESTS');
console.log('================================================================\n');

// -------------------------------------------------------------
// TEST 1: Photo Quality Gate (q)
// -------------------------------------------------------------
console.log('--- TEST 1: Photo Quality Gate (q) ---');
const qResult = computeQualityGate({
  sharpness: 90,           // score 0.70 (since < 100 and >= 70)
  palmWidthPx: 480,        // score 0.70 (since < 500 and >= 300)
  shadowGlareShare: 0.06,  // score 0.70 (since > 0.05 and <= 0.15)
  palmTiltDeg: 8.0,        // score 1.00 (since <= 10°)
  fingersSpread: true,
});

assert(qResult.q === 0.73, `Quality factor q matches expected 0.73 (got ${qResult.q})`);
assert(qResult.sharpnessScore === 0.70, 'Sharpness score is 0.70');
assert(qResult.palmTiltScore === 1.00, 'Palm tilt score is 1.00');

// Closed fingers test
const qClosed = computeQualityGate({
  sharpness: 110,
  palmWidthPx: 550,
  shadowGlareShare: 0.02,
  palmTiltDeg: 5.0,
  fingersSpread: false, // 1.0 * 0.85 = 0.85
});
assert(qClosed.q === 0.85, `Closed fingers reduces q by 0.85 multiplier (got ${qClosed.q})`);

// -------------------------------------------------------------
// TEST 2: Worked Example Real Output
// -------------------------------------------------------------
console.log('\n--- TEST 2: Worked Example Real Output ---');
const workedPreset = DEMO_PALM_PRESETS[0];

// Test with default 'zero' policy
const resultZero = evaluateHandReading({
  qualityGate: workedPreset.qualityGate as any,
  tradition: 'western',
  absentPolicy: 'zero',
  paramScores: workedPreset.scores,
  detectionConfidences: workedPreset.detectionConfidences,
  handShapeData: workedPreset.handShapeMetrics,
});

console.log('Worked Example Parameters (Zero Policy):');
resultZero.parameters.forEach((p) => {
  console.log(`  ${p.name.padEnd(22)}: Score ${p.score.toFixed(1).padStart(5)} | ${p.bandLabel.padEnd(25)} | Conf ${p.confidence.toFixed(2)}`);
});
console.log(`Overall with "zero"    : ${resultZero.overallProminenceIndex}`);
console.log(`Mean confidence        : ${resultZero.meanConfidence}`);

// Assert individual parameters
const pLife = resultZero.parameters.find((p) => p.key === 'life_line')!;
assert(pLife.score === 86.9, `Life Line score is 86.9 (got ${pLife.score})`);
assert(pLife.band === 'very_pronounced', 'Life Line is Very pronounced');
assert(pLife.confidence === 0.66, `Life Line confidence is 0.66 (got ${pLife.confidence})`);

const pHead = resultZero.parameters.find((p) => p.key === 'head_line')!;
assert(pHead.score === 75.2, `Head Line score is 75.2 (got ${pHead.score})`);
assert(pHead.band === 'pronounced', 'Head Line is Pronounced');
assert(pHead.confidence === 0.63, `Head Line confidence is 0.63 (got ${pHead.confidence})`);

const pHeart = resultZero.parameters.find((p) => p.key === 'heart_line')!;
assert(pHeart.score === 71.8, `Heart Line score is 71.8 (got ${pHeart.score})`);
assert(pHeart.band === 'pronounced', 'Heart Line is Pronounced');
assert(pHeart.confidence === 0.59, `Heart Line confidence is 0.59 (got ${pHeart.confidence})`);

const pFate = resultZero.parameters.find((p) => p.key === 'fate_line')!;
assert(pFate.score === 0.0, `Fate Line is 0.0 (got ${pFate.score})`);
assert(pFate.band === 'not_visible', 'Fate Line is Not visible');
assert(pFate.confidence === 0.56, `Fate Line confidence is 0.56 (got ${pFate.confidence})`);

const pSun = resultZero.parameters.find((p) => p.key === 'sun_line')!;
assert(pSun.score === 51.2, `Sun Line score is 51.2 (got ${pSun.score})`);
assert(pSun.confidence === 0.49, `Sun Line confidence is 0.49 (got ${pSun.confidence})`);

const pMercury = resultZero.parameters.find((p) => p.key === 'mercury_line')!;
assert(pMercury.score === 51.2, `Mercury Line score is 51.2 (got ${pMercury.score})`);
assert(pMercury.confidence === 0.45, `Mercury Line confidence is 0.45 (got ${pMercury.confidence})`);

const pRel = resultZero.parameters.find((p) => p.key === 'relationship_lines')!;
assert(pRel.score === 73.0, `Relationship Lines score is 73.0 (got ${pRel.score})`);
assert(pRel.confidence === 0.52, `Relationship Lines confidence is 0.52 (got ${pRel.confidence})`);

const pMounts = resultZero.parameters.find((p) => p.key === 'mounts')!;
assert(pMounts.score === 48.6, `Mounts score is 48.6 (got ${pMounts.score})`);
assert(pMounts.confidence === 0.56, `Mounts confidence is 0.56 (got ${pMounts.confidence})`);

const pShape = resultZero.parameters.find((p) => p.key === 'hand_shape')!;
assert(pShape.score === 63.7, `Hand Shape score is 63.7 (got ${pShape.score})`);
assert(resultZero.handType === 'fire', `Hand Shape nearest prototype is Fire (got ${resultZero.handType})`);
assert(pShape.confidence === 0.66, `Hand Shape confidence is 0.66 (got ${pShape.confidence})`);

const pMarkings = resultZero.parameters.find((p) => p.key === 'special_markings')!;
assert(pMarkings.score === 25.0, `Special Markings score is 25.0 (got ${pMarkings.score})`);
assert(pMarkings.band === 'light', 'Special Markings is Light');
assert(pMarkings.confidence === 0.42, `Special Markings confidence is 0.42 (got ${pMarkings.confidence})`);

// Overall with "zero" = 54.7
assert(resultZero.overallProminenceIndex === 54.7, `Overall score with 'zero' is 54.7 (got ${resultZero.overallProminenceIndex})`);

// Mean confidence = 0.55
assert(resultZero.meanConfidence === 0.55, `Mean confidence is 0.55 (got ${resultZero.meanConfidence})`);

// -------------------------------------------------------------
// TEST 3: Overall with "Exclude" Policy
// -------------------------------------------------------------
console.log('\n--- TEST 3: Overall with "Exclude" Policy ---');
const resultExclude = evaluateHandReading({
  qualityGate: workedPreset.qualityGate as any,
  tradition: 'western',
  absentPolicy: 'exclude',
  paramScores: workedPreset.scores,
  detectionConfidences: workedPreset.detectionConfidences,
  handShapeData: workedPreset.handShapeMetrics,
});

console.log(`Overall with "exclude" : ${resultExclude.overallProminenceIndex}`);
// Total of 9 present features: 86.9+75.2+71.8+51.2+51.2+73.0+48.6+63.7+25.0 = 546.6 / 9 = 60.7333 -> 60.7
assert(resultExclude.overallProminenceIndex === 60.7, `Overall score with 'exclude' is 60.7 (got ${resultExclude.overallProminenceIndex})`);

// -------------------------------------------------------------
// TEST 4: Traditional Reading Sentences (Western vs Indian)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Traditional Reading Sentences ---');
const indianReading = evaluateHandReading({
  qualityGate: workedPreset.qualityGate as any,
  tradition: 'indian',
  absentPolicy: 'zero',
  paramScores: workedPreset.scores,
  detectionConfidences: workedPreset.detectionConfidences,
});

const indianLife = indianReading.parameters.find((p) => p.key === 'life_line')!;
assert(indianLife.readingSentence.includes('Ojas'), `Indian Samudrika reading mentions Ojas/Prana (got: "${indianLife.readingSentence}")`);
assert(pLife.readingSentence.startsWith('Traditionally associated with'), 'Western reading starts with "Traditionally associated with"');

// -------------------------------------------------------------
// TEST 5: Unreadable Filter (< 0.40)
// -------------------------------------------------------------
console.log('\n--- TEST 5: Unreadable Filter (< 0.40) ---');
const blurryQ = computeQualityGate({
  sharpness: 20,           // < 40 -> 0.10
  palmWidthPx: 150,        // < 200 -> 0.10
  shadowGlareShare: 0.50,  // > 0.30 -> 0.10
  palmTiltDeg: 45.0,       // > 30 -> 0.10
  fingersSpread: true,
});
assert(blurryQ.q === 0.10, `Blurry quality factor is 0.10 (got ${blurryQ.q})`);

const blurryResult = evaluateHandReading({
  qualityGate: blurryQ,
  paramScores: workedPreset.scores,
  detectionConfidences: {
    life_line: 0.80, // 0.10 * 0.80 = 0.08 < 0.40 -> unreadable
  },
});
const blurryLife = blurryResult.parameters.find((p) => p.key === 'life_line')!;
assert(blurryLife.isReadable === false, 'Blurry parameter is marked unreadable');
assert(blurryLife.band === 'unreadable', 'Blurry band is unreadable');

console.log('\n================================================================');
console.log('🎉 ALL HAND READING SCORING ENGINE TESTS PASSED!');
console.log('================================================================\n');

