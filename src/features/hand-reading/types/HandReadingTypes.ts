/**
 * GABRU — HAND READING & PALM PROMINENCE TYPES
 * 
 * Traditional palmistry (Western Chiromancy & Indian Samudrika Shastra)
 * For entertainment and prominence evaluation — never predictive or medical.
 */

export type PalmTradition = 'western' | 'indian';

export type AbsentFeaturePolicy = 'zero' | 'exclude';

export type ProminenceBand =
  | 'faint'
  | 'light'
  | 'moderate'
  | 'pronounced'
  | 'very_pronounced'
  | 'not_visible'
  | 'unreadable';

export type HandShapeType = 'earth' | 'air' | 'fire' | 'water';

export interface PhotoQualityGate {
  sharpness: number;         // Laplacian variance / 100, capped at 1.0
  sharpnessScore: number;    // 1.0 (>=100), 0.7 (70), 0.4 (40), 0.1 (<40)
  palmWidthPx: number;       // Palm width in pixels
  palmWidthScore: number;    // 1.0 (>=500), 0.7 (>=300), 0.4 (>=200), 0.1 (<200)
  shadowGlareShare: number;  // Fraction (0 to 1)
  shadowGlareScore: number;  // 1.0 (<=0.05), 0.7 (<=0.15), 0.4 (<=0.30), 0.1 (>0.30)
  palmTiltDeg: number;       // Palm tilt toward camera in degrees
  palmTiltScore: number;     // 1.0 (<=10°), 0.7 (<=20°), 0.4 (<=30°), 0.1 (>30°)
  fingersSpread: boolean;    // If false, q is multiplied by 0.8
  q: number;                 // Final quality factor min(checks) * (fingersSpread ? 1.0 : 0.8)
  tips: string[];            // Constructive tips if q < 1.0
}

export interface LineMeasurement {
  length: number;            // min(1, traced / reference)
  depth: number;             // mean ridge response / calibration (capped at 1)
  continuity: number;        // 1 - (gap length / total length)
  smoothness: number;        // 1 - min(1, jitter / 0.30)
  isDetected: boolean;
}

export interface RelationshipLinesMeasurement {
  count: number;
  meanLengthRatio: number;   // reference: 0.25 * palm width
  meanDepth: number;
  isDetected: boolean;
}

export interface MountReliefItem {
  mountKey: 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'venus' | 'moon' | 'mars';
  name: string;
  sanskritName: string;
  associatedTrait: string;
  relief: number;            // 0 to 1 estimated from shading
}

export interface MountsMeasurement {
  mounts: MountReliefItem[];
  meanRelief: number;
}

export interface HandShapeMeasurement {
  palmLength: number;
  palmWidth: number;
  middleFingerLength: number;
  a: number;                 // palmLength / palmWidth
  b: number;                 // middleFingerLength / palmLength
  nearestType: HandShapeType;
  secondNearestType: HandShapeType;
  distance1: number;
  distance2: number;
  margin: number;
}

export interface SpecialMarkingItem {
  type: 'island' | 'fork' | 'star' | 'cross' | 'square' | 'chain' | 'break';
  locationOnLine: string;
  confidence: number;
  relativeSize: number;
  clarity: number;           // confidence * relativeSize
}

export interface SpecialMarkingsMeasurement {
  markings: SpecialMarkingItem[];
  totalClarity: number;
  isDetected: boolean;
}

export interface HandParameterScore {
  id: number;
  key:
    | 'life_line'
    | 'head_line'
    | 'heart_line'
    | 'fate_line'
    | 'sun_line'
    | 'mercury_line'
    | 'relationship_lines'
    | 'mounts'
    | 'hand_shape'
    | 'special_markings';
  name: string;
  sanskritName: string;
  whereItIs: string;
  whatAiMeasures: string;
  traditionalAssociation: string;
  score: number;             // 0 to 100
  band: ProminenceBand;
  bandLabel: string;
  confidence: number;        // q * detection_confidence
  isReadable: boolean;       // confidence >= 0.40
  isAbsent: boolean;
  readingSentence: string;   // e.g. "Traditionally associated with strong vitality and steady rhythm..."
  measurementsSummary: Record<string, number | string>;
}

export interface HandReadingResult {
  overallProminenceIndex: number; // Average of readable scores
  overallBand: ProminenceBand;
  overallBandLabel: string;
  meanConfidence: number;
  confidenceTier: 'High' | 'Medium' | 'Low' | 'Unreadable';
  qualityGate: PhotoQualityGate;
  parameters: HandParameterScore[];
  handType: HandShapeType;
  handTypeLabel: string;
  tradition: PalmTradition;
  absentPolicy: AbsentFeaturePolicy;
  isOverallReadable: boolean;
  entertainmentDisclaimer: string;
  analyzedAt: string;
  imageDataUri?: string;
}

