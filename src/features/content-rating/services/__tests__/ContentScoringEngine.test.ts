/**
 * GABRU — CONTENT RATING ENGINE TEST SUITE
 * 
 * Verifies:
 * 1. Telemetry parsing & fallback estimations (shares/saves)
 * 2. Mathematical formulations for S1 to S9
 * 3. Deterministic Badge Priority Classifier (S10)
 * 4. Transparent 100-Point Impact Scale with verified benchmark tiers
 * 5. Pre-parsed Demo Datasets (Group-Chat Hall of Famer, Aesthetic Flex, 3 AM Goblin Hours)
 */

import {
  scoreSinglePost,
  evaluateUnifiedContent,
  countFirstPersonWords,
  countEmojis,
  detectSlangMatches,
  resolveSinglePostTelemetry,
} from '../ContentScoringEngine';
import {
  DEMO_VIRAL_SHORT,
  DEMO_AESTHETIC_FLEX,
  DEMO_GOBLIN_HOURS,
} from '../../constants/ContentRatingConstants';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('\n================================================================');
console.log('🧪 RUNNING REDESIGNED SINGLE-POST CONTENT SCORING ENGINE TESTS');
console.log('================================================================\n');

// -------------------------------------------------------------
// TEST 1: NLP and Telemetry Parsing Helpers
// -------------------------------------------------------------
console.log('--- TEST 1: NLP & Telemetry Parsing Helpers ---');

const testCaption = 'Me thinking I could finish this before 3am delulu era #coding #dev #help';
const firstPersonCount = countFirstPersonWords(testCaption);
assert(firstPersonCount === 2, `Detected 2 first-person words ("me", "i") in caption (got ${firstPersonCount})`);

const emojiCaption = 'Look at this fit 🔥🔥🔥 and this bag ✨';
const emojiCount = countEmojis(emojiCaption);
assert(emojiCount === 4, `Detected 4 emojis in caption (got ${emojiCount})`);

const slangCheck = detectSlangMatches(testCaption);
assert(slangCheck.count === 2, `Detected 2 slang terms ("delulu", "era") (got ${slangCheck.count})`);

// -------------------------------------------------------------
// TEST 2: Fallback Telemetry Estimation
// -------------------------------------------------------------
console.log('\n--- TEST 2: Fallback Telemetry Estimation ---');

const hiddenMetricsItem = {
  ...DEMO_VIRAL_SHORT,
  metrics: {
    views: 10000,
    likes: 1000,
    comments: 50,
    shares: null, // Hidden on public Instagram
    saves: null, // Hidden on public Instagram
    reposts: 20,
  },
};

const telemetry = resolveSinglePostTelemetry(hiddenMetricsItem);
assert(telemetry.isSharesEstimated === true, 'Shares marked as estimated when null');
assert(telemetry.isSavesEstimated === true, 'Saves marked as estimated when null');
// shares fallback: 50 * 0.8 + 1000 * 0.015 = 40 + 15 = 55
assert(telemetry.shares === 55, `Shares estimated via velocity (expected 55, got ${telemetry.shares})`);
// saves fallback: 50 * 1.1 + 1000 * 0.025 = 55 + 25 = 80
assert(telemetry.saves === 80, `Saves estimated via velocity (expected 80, got ${telemetry.saves})`);
assert(telemetry.bookmarkRate === '8.0%', `Bookmark rate computed correctly (got ${telemetry.bookmarkRate})`);
assert(telemetry.groupChatMultiplier === '7.5%', `Group chat multiplier computed correctly (got ${telemetry.groupChatMultiplier})`);

// -------------------------------------------------------------
// TEST 3: Demo 1 (The Group-Chat Hall of Famer)
// -------------------------------------------------------------
console.log('\n--- TEST 3: Demo 1 (The Group-Chat Hall of Famer) ---');

const result1 = evaluateUnifiedContent(DEMO_VIRAL_SHORT);
console.log(`Demo 1 Raw Score: ${result1.rawScore}`);
console.log(`Demo 1 Final Curved Score: ${result1.contentScore}`);
console.log(`Demo 1 Verdict Badge: "${result1.verdictBadge}"`);
console.log(`Demo 1 Archetype Tier: "${result1.archetypeTier}"`);
console.log(`Demo 1 S5 (Group-Chat Forwardability): ${result1.scores.S5}`);

assert(result1.scores.S5 >= 78, `S5 meets or exceeds 78 (got ${result1.scores.S5})`);
assert(result1.verdictBadge === 'Group-Chat Hall of Famer', `Priority 1 Badge is awarded (got "${result1.verdictBadge}")`);
assert(result1.contentScore >= 70 && result1.contentScore <= 100, `Final score in valid 0..100 range (got ${result1.contentScore})`);

// -------------------------------------------------------------
// TEST 4: Demo 2 (The Certified Thirst Trap / Aesthetic Flex)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Demo 2 (The Certified Thirst Trap / Aesthetic Flex) ---');

const result2 = evaluateUnifiedContent(DEMO_AESTHETIC_FLEX);
console.log(`Demo 2 Raw Score: ${result2.rawScore}`);
console.log(`Demo 2 Final Curved Score: ${result2.contentScore}`);
console.log(`Demo 2 Verdict Badge: "${result2.verdictBadge}"`);
console.log(`Demo 2 S6 (Bookmark Bait): ${result2.scores.S6}, S1 (Main Character): ${result2.scores.S1}`);

assert(result2.scores.S6 >= 78, `S6 meets or exceeds 78 (got ${result2.scores.S6})`);
assert(result2.scores.S1 >= 75, `S1 meets or exceeds 75 (got ${result2.scores.S1})`);
assert(result2.verdictBadge === 'Certified Thirst Trap / Aesthetic Flex', `Priority 2 Badge is awarded (got "${result2.verdictBadge}")`);

// -------------------------------------------------------------
// TEST 5: Demo 3 (3 AM Goblin Hours Chaos Dump)
// -------------------------------------------------------------
console.log('\n--- TEST 5: Demo 3 (3 AM Goblin Hours Chaos Dump) ---');

const result3 = evaluateUnifiedContent(DEMO_GOBLIN_HOURS);
console.log(`Demo 3 Raw Score: ${result3.rawScore}`);
console.log(`Demo 3 Final Curved Score: ${result3.contentScore}`);
console.log(`Demo 3 Verdict Badge: "${result3.verdictBadge}"`);
console.log(`Demo 3 S8 (Upload Timing): ${result3.scores.S8}`);
console.log(`Demo 3 S4 (Caption Poetry vs Cringe): ${result3.scores.S4}`);

assert(DEMO_GOBLIN_HOURS.uploadHourLocal === 3, 'Post upload hour is 3 AM');
assert(result3.scores.S4 <= 60, `Caption score penalized by hashtag and slang soup (got ${result3.scores.S4})`);
assert(result3.verdictBadge === '3 AM Unhinged Chaos Dump', `Priority 6 Badge is awarded (got "${result3.verdictBadge}")`);
assert(result3.archetypeTier === 'Goblin Hours Shitposter', `Archetype tier matches goblin hours (got "${result3.archetypeTier}")`);

// -------------------------------------------------------------
// TEST 6: Viral Ego Curve Range
// -------------------------------------------------------------
console.log('\n--- TEST 6: Calibrated Score Range (0 to 100) ---');

const lowPost = {
  ...DEMO_GOBLIN_HOURS,
  llmEvaluations: {
    subjectSpotlight: 1,
    poseAudacity: 1,
    lighting: 1,
    colorGrading: 1,
    composition: 1,
    stylingDrip: 1,
    visualHook: 1,
    openingLinePunch: 1,
    captionWit: 0,
    shareRelatability: 0,
    saveUtilityEnvy: 0,
    commentVibe: 0,
    conceptOriginality: 0,
  },
};

const lowResult = evaluateUnifiedContent(lowPost);
console.log(`Worst-case Post Curved Score: ${lowResult.contentScore}`);
assert(lowResult.contentScore >= 0 && lowResult.contentScore <= 100, `Calibrated score stays within 0..100 range (got ${lowResult.contentScore})`);

// -------------------------------------------------------------
// TEST 7: Raw Flat Scraper Object Parity (Direct User Code Snippet Test)
// -------------------------------------------------------------
console.log('\n--- TEST 7: Raw Flat Scraper Object Parity ---');

const flatScraperPost = {
  likes: 2400,
  comments: 180,
  shares: 420,
  saves: 310,
  reposts: 85,
  views: 35000,
  authorFollowers: 12000,
  uploadHourLocal: 19, // 7 PM peak time
  firstPersonWords: 3,
  wordCount: 25,
  emojiCount: 2,
  hashtagCount: 3,
  isTrendingAudio: false,
  slangMatchCount: 0,
};

const flatLlm = {
  subjectSpotlight: 9.0,
  poseAudacity: 8.5,
  lighting: 9.0,
  colorGrading: 8.8,
  composition: 8.5,
  stylingDrip: 9.2,
  visualHook: 8.5,
  openingLinePunch: 8.0,
  captionWit: 22,
  shareRelatability: 30,
  saveUtilityEnvy: 28,
  commentVibe: 32,
  conceptOriginality: 52,
};

const flatResult = scoreSinglePost(flatScraperPost, flatLlm);

console.log('Flat Post Telemetry:', flatResult.telemetry);
console.log('Flat Post Parameter Scores (S1-S9):', flatResult.scores);
console.log('Flat Post Verdict Badge:', flatResult.badge);
console.log('Flat Post Raw Score:', flatResult.rawScore);
console.log('Flat Post Final Curved Score:', flatResult.finalCurvedScore);

assert(flatResult.telemetry.likes === 2400, 'Flat post likes preserved');
assert(flatResult.telemetry.shares === 420, 'Flat post shares preserved');
assert(flatResult.telemetry.saves === 310, 'Flat post saves preserved');
assert(flatResult.telemetry.trueEngagementRate === '9.70%', `True engagement rate formatted correctly (got ${flatResult.telemetry.trueEngagementRate})`);
assert(flatResult.telemetry.groupChatMultiplier === '21.0%', `Group chat multiplier formatted correctly (got ${flatResult.telemetry.groupChatMultiplier})`);
assert(flatResult.telemetry.bookmarkRate === '12.9%', `Bookmark rate formatted correctly (got ${flatResult.telemetry.bookmarkRate})`);
assert(flatResult.scores.S1 >= 85, `S1 Main character energy calculated properly (got ${flatResult.scores.S1})`);
assert(flatResult.scores.S2 >= 85, `S2 Visual aura calculated properly (got ${flatResult.scores.S2})`);
assert(flatResult.scores.S5 >= 78, `S5 Group chat forwardability calculated properly (got ${flatResult.scores.S5})`);
assert(flatResult.badge === 'Group-Chat Hall of Famer', `S5 >= 78 awards Group-Chat Hall of Famer (got "${flatResult.badge}")`);
assert(flatResult.finalCurvedScore >= 0 && flatResult.finalCurvedScore <= 100, `Final score in 0..100 range (got ${flatResult.finalCurvedScore})`);

console.log('\n================================================================');
console.log('🎉 ALL SINGLE-POST CONTENT SCORING ENGINE TESTS PASSED!');
console.log('================================================================\n');
