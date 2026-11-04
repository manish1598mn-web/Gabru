/**
 * GABRU — OUTFIT RATING CONSTANTS
 */

import { ParameterDef } from '../types/OutfitRatingTypes';

export const OUTFIT_PARAMETERS: ParameterDef[] = [
  // Tier 1: Foundations (71 pts)
  {
    id: 1,
    name: 'Fit & Tailoring',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 25,
    whatGetsChecked: 'Shoulder alignment, sleeve length, trouser break, waist fit, drape, alteration quality',
  },
  {
    id: 2,
    name: 'Proportion & Silhouette',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 16,
    whatGetsChecked: 'Top-to-bottom ratio, slim vs. relaxed balance, weight distribution, layering structure, body-flattering shape',
  },
  {
    id: 3,
    name: 'Occasion Appropriateness',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 12,
    whatGetsChecked: 'Event, dress code, time of day, season and weather, cultural fit',
  },
  {
    id: 4,
    name: 'Color Harmony',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 10,
    whatGetsChecked: 'Palette logic, contrast, color distribution, skin-tone match',
  },
  {
    id: 5,
    name: 'Style Cohesion',
    tier: 'tier1',
    tierLabel: 'Tier 1 • Foundations',
    maxPts: 8,
    whatGetsChecked: 'One consistent fashion language, no random pieces, the intended vibe comes through',
  },

  // Tier 2: Details (20 pts)
  {
    id: 6,
    name: 'Fabric, Texture & Condition',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 8,
    whatGetsChecked: 'Material quality, texture mixing, seasonal weight, wrinkles, stains, wear',
  },
  {
    id: 7,
    name: 'Accessories & Footwear',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 7,
    whatGetsChecked: 'Shoes, belt, watch, jewelry, bag, and how well they coordinate',
  },
  {
    id: 8,
    name: 'Grooming & Presentation',
    tier: 'tier2',
    tierLabel: 'Tier 2 • Details',
    maxPts: 5,
    whatGetsChecked: 'Hair, beard, skin, cleanliness, posture and confidence',
  },

  // Tier 3: Expert Polish (9 pts)
  {
    id: 9,
    name: 'Focal Point & Hierarchy',
    tier: 'tier3',
    tierLabel: 'Tier 3 • Expert Polish',
    maxPts: 5,
    whatGetsChecked: 'A clear hero piece, eye movement, attention control',
  },
  {
    id: 10,
    name: 'Originality & Expression',
    tier: 'tier3',
    tierLabel: 'Tier 3 • Expert Polish',
    maxPts: 4,
    whatGetsChecked: 'Individuality, creativity, signature style',
  },
];

export const OUTFIT_CARD_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  2: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  3: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  4: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  5: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  6: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  7: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  8: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  9: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
  10: 'linear-gradient(145deg, rgba(24, 22, 30, 0.75) 0%, rgba(13, 12, 18, 0.88) 100%)',
};

