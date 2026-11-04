/**
 * GABRU — HAND READING CONSTANTS & RULE TABLES
 * 
 * 10 Traditional Parameters for Palm Line Prominence Reading:
 * - Western Chiromancy & Indian Samudrika Shastra
 * - 4 Element Hand Shape Prototypes (Earth, Air, Fire, Water)
 * - Calibrated Reference Lengths & Quality Gate Thresholds
 * - Strict Entertainment Notice
 */

import {
  HandShapeType,
  PalmTradition,
  ProminenceBand,
} from '../types/HandReadingTypes';

export const ENTERTAINMENT_DISCLAIMER =
  'For entertainment only. Palm reading follows ancient Western chiromancy and Indian Samudrika Shastra traditions and has no scientific validity. Results evaluate photographic line prominence and must not be used for health, lifespan, marriage, pregnancy, or legal predictions.';

export const HAND_CARD_BACKGROUNDS: Record<number, string> = {
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

// -------------------------------------------------------------
// The 10 Parameters Definition
// -------------------------------------------------------------

export interface HandParamDefinition {
  id: number;
  key: string;
  name: string;
  sanskritName: string;
  icon: string;
  whereItIs: string;
  whatAiMeasures: string;
  traditionalAssociation: string;
  referenceMultiplier: number; // relative to palm length or width
  referenceDimension: 'length' | 'width';
}

export const HAND_PARAMETERS: HandParamDefinition[] = [
  {
    id: 1,
    key: 'life_line',
    name: 'Life Line',
    sanskritName: 'Jeevan Rekha',
    icon: '🌱',
    whereItIs: "Curves around the thumb's base (Venus mount)",
    whatAiMeasures: 'Length, depth, curvature (arc width), start and end points, continuity',
    traditionalAssociation: 'Vitality, energy, major life changes. Traditionally not a measure of lifespan.',
    referenceMultiplier: 0.75,
    referenceDimension: 'length',
  },
  {
    id: 2,
    key: 'head_line',
    name: 'Head Line',
    sanskritName: 'Mastishk Rekha',
    icon: '💡',
    whereItIs: 'Runs across the middle of the palm',
    whatAiMeasures: 'Length, slope (straight or downward curve), start point separation, forks',
    traditionalAssociation: 'Thinking style: practical vs. imaginative, focused vs. exploratory.',
    referenceMultiplier: 0.85,
    referenceDimension: 'width',
  },
  {
    id: 3,
    key: 'heart_line',
    name: 'Heart Line',
    sanskritName: 'Hriday Rekha',
    icon: '❤️',
    whereItIs: 'The upper major line running directly beneath the fingers',
    whatAiMeasures: 'Length, upward curvature, end termination beneath index/middle finger, depth',
    traditionalAssociation: 'Emotional style, relational empathy, and how feelings are communicated.',
    referenceMultiplier: 0.90,
    referenceDimension: 'width',
  },
  {
    id: 4,
    key: 'fate_line',
    name: 'Fate Line',
    sanskritName: 'Bhagya Rekha',
    icon: '🧭',
    whereItIs: 'Vertical line ascending from wrist toward middle finger (Saturn)',
    whatAiMeasures: 'Presence/absence, start origin, vertical length, continuity, shifts',
    traditionalAssociation: 'Career path and life direction. It is absent in many palms, and tradition considers that entirely normal.',
    referenceMultiplier: 0.60,
    referenceDimension: 'length',
  },
  {
    id: 5,
    key: 'sun_line',
    name: 'Sun Line',
    sanskritName: 'Surya Rekha',
    icon: '☀️',
    whereItIs: 'Vertical line beneath the ring finger (Apollo mount)',
    whatAiMeasures: 'Presence/absence, length, depth, line parallelism',
    traditionalAssociation: 'Creativity, public recognition, artistic expression, and social presence.',
    referenceMultiplier: 0.30,
    referenceDimension: 'length',
  },
  {
    id: 6,
    key: 'mercury_line',
    name: 'Mercury Line',
    sanskritName: 'Budh Rekha',
    icon: '🗣️',
    whereItIs: 'Diagonal line running from near wrist toward little finger',
    whatAiMeasures: 'Presence/absence, continuity, shape, crossings across minor lines',
    traditionalAssociation: 'Communication clarity, business acuity, and spontaneous articulation. (Historically called the "health line", but not for medical conclusions).',
    referenceMultiplier: 0.50,
    referenceDimension: 'length',
  },
  {
    id: 7,
    key: 'relationship_lines',
    name: 'Relationship Lines',
    sanskritName: 'Vivah Rekha',
    icon: '🤝',
    whereItIs: 'Short horizontal lines on the outer palm edge below the little finger',
    whatAiMeasures: 'Line count, length relative to edge, depth, fork structure',
    traditionalAssociation: 'Emotionally significant partnerships. Line count does not predict marriage or divorce counts.',
    referenceMultiplier: 0.25,
    referenceDimension: 'width',
  },
  {
    id: 8,
    key: 'mounts',
    name: 'Mounts (7 Regions)',
    sanskritName: 'Sapta Parvat',
    icon: '🏔️',
    whereItIs: 'Fleshy pads at the base of fingers & palm perimeter (Jupiter, Saturn, Apollo, Mercury, Venus, Moon, Mars)',
    whatAiMeasures: 'Relative height and fullness from photo shading relief (confidence capped at 0.60)',
    traditionalAssociation: 'Archetypal trait reservoirs: Jupiter (ambition), Venus (affection), Moon (imagination).',
    referenceMultiplier: 1.0,
    referenceDimension: 'length',
  },
  {
    id: 9,
    key: 'hand_shape',
    name: 'Hand Shape & Fingers',
    sanskritName: 'Hasta Prakriti',
    icon: '✋',
    whereItIs: 'Proportions of palm length to width and middle finger to palm length',
    whatAiMeasures: 'Ratio a = palm_length / palm_width, ratio b = middle_finger / palm_length',
    traditionalAssociation: 'The 4 Elemental Archetypes: Earth (grounded), Air (intellectual), Fire (dynamic), Water (intuitive).',
    referenceMultiplier: 1.0,
    referenceDimension: 'length',
  },
  {
    id: 10,
    key: 'special_markings',
    name: 'Special Markings',
    sanskritName: 'Vishesh Chinha',
    icon: '✨',
    whereItIs: 'Geometric markings across lines & mounts (islands, forks, stars, crosses, squares, chains)',
    whatAiMeasures: 'Detection clarity times relative size of identified markings',
    traditionalAssociation: 'Traditionally read as focal pivots, protective cushions (squares), or intensified energy (stars).',
    referenceMultiplier: 1.0,
    referenceDimension: 'length',
  },
];

// -------------------------------------------------------------
// 4 Element Hand Shape Prototypes
// -------------------------------------------------------------

export interface HandShapePrototype {
  type: HandShapeType;
  name: string;
  sanskritName: string;
  element: string;
  a: number; // palmLength / palmWidth
  b: number; // middleFingerLength / palmLength
  description: string;
  traditionalTemperament: string;
}

export const HAND_SHAPE_PROTOTYPES: Record<HandShapeType, HandShapePrototype> = {
  earth: {
    type: 'earth',
    name: 'Earth Hand',
    sanskritName: 'Prithvi Hasta',
    element: 'Earth',
    a: 1.20,
    b: 0.75,
    description: 'Square palm with shorter, sturdy fingers.',
    traditionalTemperament: 'Traditionally associated with practical realism, physical stamina, craft discipline, and grounded stability.',
  },
  air: {
    type: 'air',
    name: 'Air Hand',
    sanskritName: 'Vayu Hasta',
    element: 'Air',
    a: 1.20,
    b: 0.95,
    description: 'Square palm with long, elegant fingers.',
    traditionalTemperament: 'Traditionally associated with intellectual curiosity, articulate verbal expression, analytical synthesis, and social versatility.',
  },
  fire: {
    type: 'fire',
    name: 'Fire Hand',
    sanskritName: 'Agni Hasta',
    element: 'Fire',
    a: 1.45,
    b: 0.75,
    description: 'Oblong palm with relatively short, energetic fingers.',
    traditionalTemperament: 'Traditionally associated with adventurous enthusiasm, charismatic drive, spontaneous leadership, and high kinetic motivation.',
  },
  water: {
    type: 'water',
    name: 'Water Hand',
    sanskritName: 'Jala Hasta',
    element: 'Water',
    a: 1.45,
    b: 0.95,
    description: 'Oblong palm with long, flexible, and tapered fingers.',
    traditionalTemperament: 'Traditionally associated with receptive intuition, aesthetic sensitivity, empathetic depth, and creative imagination.',
  },
};

// -------------------------------------------------------------
// Prominence Band Definitions & Labels
// -------------------------------------------------------------

export const PROMINENCE_BANDS: Record<
  ProminenceBand,
  { label: string; min: number; max: number; color: string; badgeClass: string }
> = {
  very_pronounced: {
    label: 'Very pronounced',
    min: 81,
    max: 100,
    color: '#34d399',
    badgeClass: 'band-very-pronounced',
  },
  pronounced: {
    label: 'Pronounced',
    min: 61,
    max: 80,
    color: '#60a5fa',
    badgeClass: 'band-pronounced',
  },
  moderate: {
    label: 'Moderate',
    min: 41,
    max: 60,
    color: '#c084fc',
    badgeClass: 'band-moderate',
  },
  light: {
    label: 'Light',
    min: 21,
    max: 40,
    color: '#fbbf24',
    badgeClass: 'band-light',
  },
  faint: {
    label: 'Faint',
    min: 0,
    max: 20,
    color: '#94a3b8',
    badgeClass: 'band-faint',
  },
  not_visible: {
    label: 'Not visible',
    min: 0,
    max: 0,
    color: '#64748b',
    badgeClass: 'band-absent',
  },
  unreadable: {
    label: 'Unreadable',
    min: 0,
    max: 0,
    color: '#ef4444',
    badgeClass: 'band-unreadable',
  },
};

// -------------------------------------------------------------
// Traditional Interpretation Tables (Rule-Matched Sentences)
// -------------------------------------------------------------

export const TRADITION_READINGS: Record<
  PalmTradition,
  Record<string, Record<ProminenceBand | 'default', string>>
> = {
  western: {
    life_line: {
      very_pronounced: 'Traditionally associated with vigorous vitality, high physical resilience, and an expansive life arc.',
      pronounced: 'Traditionally associated with steady stamina, grounded personal rhythms, and resilient recovery.',
      moderate: 'Traditionally associated with balanced endurance, mindful energy management, and adaptable pacing.',
      light: 'Traditionally associated with delicate constitutional rhythms and deliberate preservation of physical vitality.',
      faint: 'Traditionally associated with gentle vitality and sensitive nervous system responses.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with vitality and personal energy flow.',
    },
    head_line: {
      very_pronounced: 'Traditionally associated with laser-focused concentration, decisive mental clarity, and structured logic.',
      pronounced: 'Traditionally associated with practical intellect, disciplined problem solving, and versatile reasoning.',
      moderate: 'Traditionally associated with adaptable thinking, balance between logic and imaginative intuition.',
      light: 'Traditionally associated with impressionistic thinking, fluid perceptions, and creative lateral associations.',
      faint: 'Traditionally associated with spontaneous and non-linear cognitive pathways.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with intellectual focus and thinking style.',
    },
    heart_line: {
      very_pronounced: 'Traditionally associated with passionate emotional expression, deep empathetic warmth, and wholehearted commitment.',
      pronounced: 'Traditionally associated with balanced emotional expression, healthy boundaries, and loyal affection.',
      moderate: 'Traditionally associated with measured emotional openness and discerning personal intimacy.',
      light: 'Traditionally associated with quiet inner feelings, understated affection, and guarded sensitivity.',
      faint: 'Traditionally associated with private, gentle emotional responses and solitude appreciation.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with emotional warmth and relational expression.',
    },
    fate_line: {
      very_pronounced: 'Traditionally associated with a strongly defined vocation, singular purpose, and early sense of career trajectory.',
      pronounced: 'Traditionally associated with clear career continuity, self-directed milestones, and steady advancement.',
      moderate: 'Traditionally associated with flexible professional pivots and adaptable career pacing.',
      light: 'Traditionally associated with multi-faceted interests and opportunistic, non-linear career exploration.',
      faint: 'Traditionally associated with self-made direction guided by intrinsic curiosity rather than institutional tracks.',
      not_visible: 'Fate line is absent in this capture—traditional chiromancy considers this completely normal, reflecting self-directed freedom.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with career direction and vocational focus.',
    },
    sun_line: {
      very_pronounced: 'Traditionally associated with pronounced creative flair, charismatic magnetism, and social recognition.',
      pronounced: 'Traditionally associated with cultivated artistic taste, engaging public warmth, and creative gratification.',
      moderate: 'Traditionally associated with balanced appreciation for beauty, personal fulfillment, and collaborative appreciation.',
      light: 'Traditionally associated with subtle artistic sensibilities enjoyed primarily in private spheres.',
      faint: 'Traditionally associated with quiet modesty regarding personal accomplishments.',
      not_visible: 'Sun line is absent or very faint, which is common and normal in traditional readings.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with creative expression and recognition.',
    },
    mercury_line: {
      very_pronounced: 'Traditionally associated with articulate communication, persuasive verbal fluency, and commercial intuition.',
      pronounced: 'Traditionally associated with clear self-expression, pragmatic business sense, and collaborative rapport.',
      moderate: 'Traditionally associated with straightforward communicative honesty and functional dialogue.',
      light: 'Traditionally associated with quiet introspection and careful, considered speech.',
      faint: 'Traditionally associated with selective communication and thoughtful pacing.',
      not_visible: 'Mercury line is absent, which tradition notes as common and benign.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with communicative articulation and commercial acumen.',
    },
    relationship_lines: {
      very_pronounced: 'Traditionally associated with deeply felt emotional partnerships and high significance placed on close bonds.',
      pronounced: 'Traditionally associated with meaningful, sustained companion bonds and heartfelt connection.',
      moderate: 'Traditionally associated with thoughtful selectivity in personal attachments.',
      light: 'Traditionally associated with understated, low-drama companionship.',
      faint: 'Traditionally associated with quiet independence in relational spaces.',
      not_visible: 'No prominent relationship line detected along the outer perimeter.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with emotional commitments and significant bonds.',
    },
    mounts: {
      very_pronounced: 'Traditionally associated with rich energetic reserves across planetary archetypes (ambition, affection, imagination).',
      pronounced: 'Traditionally associated with well-proportioned energetic cushions supporting active temperament.',
      moderate: 'Traditionally associated with balanced, grounded energetic distribution across palm sectors.',
      light: 'Traditionally associated with refined, economical energy deployment without excess strain.',
      faint: 'Traditionally associated with delicate muscular contour and contemplative temperament.',
      not_visible: 'Mount shading not distinctly delineated.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with energetic reserves and personality cushions.',
    },
    hand_shape: {
      very_pronounced: 'Traditionally associated with a vivid, archetypal embodiment of elemental temperament.',
      pronounced: 'Traditionally associated with clear alignment to one of the four classic elemental archetypes.',
      moderate: 'Traditionally associated with a harmonious hybrid of neighboring elemental qualities.',
      light: 'Traditionally associated with versatile, blended elemental characteristics.',
      faint: 'Traditionally associated with subtle, adaptable hand proportions.',
      not_visible: 'Hand silhouette could not be bounded.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with elemental temperament and constitution.',
    },
    special_markings: {
      very_pronounced: 'Traditionally associated with distinctive focal markings (stars, crosses, squares) indicating concentrated emphasis or protection.',
      pronounced: 'Traditionally associated with notable signposts (forks or squares) suggesting adaptive pivots.',
      moderate: 'Traditionally associated with occasional focal markings adding nuance to primary lines.',
      light: 'Traditionally associated with clean, unencumbered line paths with minimal secondary interruptions.',
      faint: 'Traditionally associated with smooth, uninterrupted line avenues.',
      not_visible: 'No special markings (stars, islands, squares) detected on this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with focal accents and transitional signposts.',
    },
  },
  indian: {
    life_line: {
      very_pronounced: 'Traditionally associated in Samudrika Shastra with robust Ojas (vital vigor), strong Prana, and steady resilience.',
      pronounced: 'Traditionally associated with harmonious Pranic vitality, balanced longevity rhythms, and physical endurance.',
      moderate: 'Traditionally associated with moderate physical vitality and a need for mindful energy conservation.',
      light: 'Traditionally associated with sensitive constitutional temperament requiring sattvic nourishment.',
      faint: 'Traditionally associated with delicate physical vitality.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated in Samudrika Shastra with Pranic vitality and Ojas.',
    },
    head_line: {
      very_pronounced: 'Traditionally associated with penetrating Buddhi (intellect), strong Dharana (retention), and decisive discrimination.',
      pronounced: 'Traditionally associated with practical wisdom, disciplined analytical thought, and steady focus.',
      moderate: 'Traditionally associated with balanced intellect harmonizing deductive logic and intuitive discernment.',
      light: 'Traditionally associated with adaptable imagination and flexible thought currents.',
      faint: 'Traditionally associated with contemplative mental flow.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Buddhi (discernment) and mental focus.',
    },
    heart_line: {
      very_pronounced: 'Traditionally associated with generous Hridaya (heart-centered compassion), warm emotional devotion, and expansive Bhakti.',
      pronounced: 'Traditionally associated with balanced emotional harmony, loyal affection, and genuine empathy.',
      moderate: 'Traditionally associated with serene emotional self-containment and mindful relationships.',
      light: 'Traditionally associated with reserved emotional expression and quiet contemplation.',
      faint: 'Traditionally associated with understated personal feeling.',
      not_visible: 'Feature not clearly traced in this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Hridaya (emotional depth) and relational warmth.',
    },
    fate_line: {
      very_pronounced: 'Traditionally associated with prominent Purva-Punya (accumulated effort fruition), clear Karma path, and societal recognition.',
      pronounced: 'Traditionally associated with steady self-made Karma, vocational focus, and reliable career continuity.',
      moderate: 'Traditionally associated with flexible vocational chapters and responsive adaptations to opportunity.',
      light: 'Traditionally associated with non-traditional career paths driven by personal autonomy.',
      faint: 'Traditionally associated with complete self-determination free from inherited vocational molds.',
      not_visible: 'Bhagya Rekha is absent—Samudrika Shastra affirms this as completely natural, signifying an unscripted, self-created path.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with vocational Karma and career path.',
    },
    sun_line: {
      very_pronounced: 'Traditionally associated with radiant Tejas (luster), Surya blessings, public esteem, and artistic prestige.',
      pronounced: 'Traditionally associated with creative fulfillment, pleasant public respect, and cultural appreciation.',
      moderate: 'Traditionally associated with balanced self-expression and harmonious social standing.',
      light: 'Traditionally associated with modest, quiet creative pursuit.',
      faint: 'Traditionally associated with private artistic enjoyment without vanity.',
      not_visible: 'Surya Rekha is absent, which is very common in classical Samudrika analysis.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Surya Tejas (creative luster and reputation).',
    },
    mercury_line: {
      very_pronounced: 'Traditionally associated with sharp Budha (mercurial eloquence), skillful trade acumen, and persuasive dialogue.',
      pronounced: 'Traditionally associated with clear communicative speech, practical enterprise, and cooperative diplomacy.',
      moderate: 'Traditionally associated with sensible expression and transparent business dealings.',
      light: 'Traditionally associated with economical speech and introspective silence.',
      faint: 'Traditionally associated with quiet contemplation.',
      not_visible: 'Budh Rekha is absent, which classical texts treat as benign and normal.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Budha influence (eloquence and commerce).',
    },
    relationship_lines: {
      very_pronounced: 'Traditionally associated with deeply rooted Sambandha (relational bonds) marked by emotional depth.',
      pronounced: 'Traditionally associated with devoted partnership and steady, loyal companionship.',
      moderate: 'Traditionally associated with mindful selectivity in emotional commitments.',
      light: 'Traditionally associated with simple, peaceful companionship.',
      faint: 'Traditionally associated with personal independence.',
      not_visible: 'No prominent Vivah Rekha traced at the palm perimeter.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Sambandha (significant emotional relationships).',
    },
    mounts: {
      very_pronounced: 'Traditionally associated with energized Graha Parvats (planetary mounts), indicating expansive energetic potential.',
      pronounced: 'Traditionally associated with well-balanced planetary cushions supporting vital activity.',
      moderate: 'Traditionally associated with even energetic distribution across the hand.',
      light: 'Traditionally associated with subtle, gentle energetic constitution.',
      faint: 'Traditionally associated with meditative and calm palm contours.',
      not_visible: 'Mount shading not distinctly delineated.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Graha Parvats (planetary energetic reservoirs).',
    },
    hand_shape: {
      very_pronounced: 'Traditionally associated with pronounced Hasta Prakriti reflecting archetypal elemental dominance.',
      pronounced: 'Traditionally associated with harmonious alignment to traditional constitutional element types.',
      moderate: 'Traditionally associated with a mixed Prakriti blending two primary elements.',
      light: 'Traditionally associated with adaptable constitutional versatility.',
      faint: 'Traditionally associated with subtle, understated hand contours.',
      not_visible: 'Hand silhouette could not be bounded.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with Hasta Prakriti (constitutional elemental hand type).',
    },
    special_markings: {
      very_pronounced: 'Traditionally associated with auspicious or focal Lakshan (markings like Trishul, Padma, or protective squares).',
      pronounced: 'Traditionally associated with clear protective or amplifying signposts along energy channels.',
      moderate: 'Traditionally associated with occasional focal nuances across lines.',
      light: 'Traditionally associated with clean, unencumbered line pathways.',
      faint: 'Traditionally associated with smooth, uninterrupted Prana flow.',
      not_visible: 'No special markings identified on this capture.',
      unreadable: 'Image resolution insufficient for line verification.',
      default: 'Traditionally associated with focal Lakshan and protective signs.',
    },
  },
};

// -------------------------------------------------------------
// Demo Palm Datasets (Including Worked Example)
// -------------------------------------------------------------

export interface DemoPalmPreset {
  id: string;
  name: string;
  subtitle: string;
  handType: HandShapeType;
  description: string;
  q: number;
  qualityGate: {
    sharpness: number;
    sharpnessScore: number;
    palmWidthPx: number;
    palmWidthScore: number;
    shadowGlareShare: number;
    shadowGlareScore: number;
    palmTiltDeg: number;
    palmTiltScore: number;
    fingersSpread: boolean;
    q: number;
    tips: string[];
  };
  scores: Record<string, number>;
  detectionConfidences: Record<string, number>;
  handShapeMetrics: {
    a: number;
    b: number;
  };
  sampleImageUrl: string;
}

export const DEMO_PALM_PRESETS: DemoPalmPreset[] = [
  {
    id: 'worked_example',
    name: 'The Classical Reference Palm',
    subtitle: 'From palm_score_v1.py Specification • Fire Hand Archetype',
    handType: 'fire',
    description: 'Exact worked example from the specification: pronounced Life, Head, Heart, absent Fate line, and balanced mounts.',
    q: 0.70,
    qualityGate: {
      sharpness: 90,
      sharpnessScore: 0.70,
      palmWidthPx: 480,
      palmWidthScore: 0.70,
      shadowGlareShare: 0.06,
      shadowGlareScore: 0.70,
      palmTiltDeg: 8.0,
      palmTiltScore: 1.00,
      fingersSpread: true,
      q: 0.70,
      tips: ['Reduce side shadows slightly to lift quality factor above 0.85.'],
    },
    scores: {
      life_line: 86.9,
      head_line: 75.2,
      heart_line: 71.8,
      fate_line: 0.0, // absent
      sun_line: 51.2,
      mercury_line: 51.2,
      relationship_lines: 73.0,
      mounts: 48.6,
      hand_shape: 63.7,
      special_markings: 25.0,
    },
    detectionConfidences: {
      life_line: 0.943,        // 0.70 * 0.943 = 0.66
      head_line: 0.900,        // 0.70 * 0.900 = 0.63
      heart_line: 0.843,       // 0.70 * 0.843 = 0.59
      fate_line: 0.800,        // 0.70 * 0.800 = 0.56
      sun_line: 0.700,         // 0.70 * 0.700 = 0.49
      mercury_line: 0.643,     // 0.70 * 0.643 = 0.45
      relationship_lines: 0.743, // 0.70 * 0.743 = 0.52
      mounts: 0.800,           // 0.70 * 0.800 = 0.56 (capped at 0.60)
      hand_shape: 0.943,       // 0.70 * 0.943 = 0.66
      special_markings: 0.600, // 0.70 * 0.600 = 0.42
    },
    handShapeMetrics: {
      a: 1.45,
      b: 0.77,
    },
    sampleImageUrl: '/hand_reading_sketch.jpg',
  },
  {
    id: 'earth_artisan',
    name: 'The Earth Artisan Hand',
    subtitle: 'Square Palm • Practical & Grounded',
    handType: 'earth',
    description: 'Deep Life and Head lines with wide thumb clearance and prominent Venus mount.',
    q: 0.90,
    qualityGate: {
      sharpness: 120,
      sharpnessScore: 1.0,
      palmWidthPx: 560,
      palmWidthScore: 1.0,
      shadowGlareShare: 0.03,
      shadowGlareScore: 1.0,
      palmTiltDeg: 4.0,
      palmTiltScore: 1.0,
      fingersSpread: true,
      q: 0.90,
      tips: ['High quality capture. Line contrasts well-illuminated.'],
    },
    scores: {
      life_line: 91.5,
      head_line: 82.4,
      heart_line: 68.2,
      fate_line: 74.0,
      sun_line: 45.0,
      mercury_line: 58.0,
      relationship_lines: 65.0,
      mounts: 58.0,
      hand_shape: 78.5,
      special_markings: 32.0,
    },
    detectionConfidences: {
      life_line: 0.95,
      head_line: 0.92,
      heart_line: 0.88,
      fate_line: 0.85,
      sun_line: 0.75,
      mercury_line: 0.78,
      relationship_lines: 0.80,
      mounts: 0.85,
      hand_shape: 0.95,
      special_markings: 0.70,
    },
    handShapeMetrics: {
      a: 1.20,
      b: 0.74,
    },
    sampleImageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'air_communicator',
    name: 'The Air Communicator Hand',
    subtitle: 'Square Palm & Long Fingers • Intellectual & Articulate',
    handType: 'air',
    description: 'Long Head line extending across the palm with prominent Mercury line and agile finger joints.',
    q: 0.85,
    qualityGate: {
      sharpness: 110,
      sharpnessScore: 1.0,
      palmWidthPx: 510,
      palmWidthScore: 1.0,
      shadowGlareShare: 0.04,
      shadowGlareScore: 1.0,
      palmTiltDeg: 6.0,
      palmTiltScore: 1.0,
      fingersSpread: true,
      q: 0.85,
      tips: ['Excellent finger articulation and clear line continuity.'],
    },
    scores: {
      life_line: 78.0,
      head_line: 92.6,
      heart_line: 74.5,
      fate_line: 68.0,
      sun_line: 62.0,
      mercury_line: 84.0,
      relationship_lines: 60.0,
      mounts: 50.0,
      hand_shape: 82.0,
      special_markings: 45.0,
    },
    detectionConfidences: {
      life_line: 0.90,
      head_line: 0.96,
      heart_line: 0.88,
      fate_line: 0.82,
      sun_line: 0.80,
      mercury_line: 0.90,
      relationship_lines: 0.75,
      mounts: 0.80,
      hand_shape: 0.95,
      special_markings: 0.78,
    },
    handShapeMetrics: {
      a: 1.20,
      b: 0.96,
    },
    sampleImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'water_intuitive',
    name: 'The Water Intuitive Hand',
    subtitle: 'Long Palm & Slender Fingers • Empathetic & Creative',
    handType: 'water',
    description: 'Curved Heart line arcing toward Jupiter mount, delicate Moon mount shading, and fine secondary lines.',
    q: 0.80,
    qualityGate: {
      sharpness: 85,
      sharpnessScore: 0.70,
      palmWidthPx: 440,
      palmWidthScore: 0.70,
      shadowGlareShare: 0.05,
      shadowGlareScore: 1.0,
      palmTiltDeg: 5.0,
      palmTiltScore: 1.0,
      fingersSpread: true,
      q: 0.80,
      tips: ['Fine lines captured well; soft lighting preserves subtle mount relief.'],
    },
    scores: {
      life_line: 72.0,
      head_line: 76.0,
      heart_line: 94.2,
      fate_line: 55.0,
      sun_line: 74.0,
      mercury_line: 48.0,
      relationship_lines: 80.0,
      mounts: 54.0,
      hand_shape: 85.0,
      special_markings: 50.0,
    },
    detectionConfidences: {
      life_line: 0.88,
      head_line: 0.88,
      heart_line: 0.96,
      fate_line: 0.75,
      sun_line: 0.85,
      mercury_line: 0.72,
      relationship_lines: 0.88,
      mounts: 0.80,
      hand_shape: 0.95,
      special_markings: 0.80,
    },
    handShapeMetrics: {
      a: 1.46,
      b: 0.96,
    },
    sampleImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
];

