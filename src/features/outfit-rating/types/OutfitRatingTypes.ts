/**
 * GABRU — OUTFIT RATING TYPES
 */

export interface ParameterDef {
  id: number;
  name: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  tierLabel: string;
  maxPts: number;
  whatGetsChecked: string;
}

export interface SubfactorDetail {
  code: string;
  name: string;
  w: number;
  v: number;
  raw: number;
  adjusted: number;
  defects: number[];
  note: string;
}

export interface ParameterRatingDetail {
  id: number;
  name: string;
  maxPts: number;
  ratingR: number; // 0-10
  points: number; // 0-maxPts
  confidence: number; // 0-1
  subfactors: SubfactorDetail[];
  bestFix?: {
    action: string;
    gainPts: number;
  };
}

export interface OutfitScoreData {
  overallScore: number; // 0 - 100 points
  csi: number; // Style Score / 10 (0.0 - 10.0)
  confidence: number; // 0 - 1
  confidenceLabel: 'High' | 'Medium' | 'Low (Provisional)';
  verdict: string;
  fashionLevel: string;
  summarySentence: string;
  tier1Score: number; // out of 71
  tier2Score: number; // out of 20
  tier3Score: number; // out of 9
  parameterScores: Record<number, number>;
  parameterRatings: Record<number, ParameterRatingDetail>;
  topQuickFix?: {
    paramName: string;
    action: string;
    gainPts: number;
  };
  capsTriggered: string[];
  humanDetected: boolean;
  poseConfidence: number;
  isFrontFacing?: boolean;
  focusedPersonFound?: boolean;
  detectedCount?: number;
  detectionDetails?: string;
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}
