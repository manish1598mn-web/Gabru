# 🌟 Gabru — AI Aesthetic & Biometric Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-6366f1.svg)](https://turbo.build/)
[![MediaPipe](https://img.shields.io/badge/Google-MediaPipe%20Vision-00897b.svg)](https://developers.google.com/mediapipe)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981.svg)](#-privacy--zero-data-retention)

Welcome to the **Gabru** codebase! Gabru is an aesthetic intelligence platform designed for peer-reviewed, research-backed biometric and outfit evaluation.

This repository is engineered to production SaaS standards for a team of 100+ engineers, adhering strictly to **Clean Architecture**, **Feature-Sliced Design (FSD)**, and **SOLID principles**.

---

## ⚡ Quickstart for New Developers

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)
- **Git**

### 2. Installation & First Run
```bash
# Clone the repository
git clone https://github.com/gabru-ai/gabru.git
cd Gabru

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# StartTurbopack dev server (accessible at http://localhost:3000)
npm run dev
```

### 3. Verification & Quality Gates
Before submitting any Pull Request, ensure all quality gates pass:
```bash
# 1. Zero TypeScript compiler warnings/errors
npm run type-check

# 2. Production Turbopack build
npm run build

# 3. Linter
npm run lint
```

---

## 🏛️ System Architecture

Gabru employs a strict **Feature-Sliced Clean Architecture**. Dependencies only flow **inward** toward domain logic, never between peer features.

```
src/
├── app/                        # [Thin Routing Layer] Next.js App Router entrypoints
│   ├── page.tsx                # Route "/" → delegates to FitCheckFeaturePage
│   ├── beauty-rating/page.tsx  # Route "/beauty-rating" → delegates to BeautyRatingFeaturePage
│   ├── layout.tsx              # Root HTML shell & global font definitions
│   └── globals.css             # Design tokens, themes, and CSS variables
│
├── core/                       # [Core Infrastructure] Cross-cutting configurations & security
│   ├── config/SiteConfig.ts    # Application metadata, CDN URLs, and feature toggles
│   ├── security/               # TF/MediaPipe console log filters & security bounds
│   └── index.ts                # Public core barrel export
│
├── shared/                     # [Shared Enterprise Layer] Reusable across all features
│   ├── components/
│   │   ├── layout/             # AppNavbar, AppFooter
│   │   └── ui/                 # BaseModal, accessible dialog overlays
│   ├── hooks/                  # useScrollState, useIntersectionReveal, useNumberShuffle, useClipboard
│   ├── utils/                  # CanvasUtil, ColorSpaceUtil (CIELAB ΔE2000), FormatUtil
│   └── index.ts                # Public shared barrel export
│
└── features/                   # [Feature Slices] Domain-encapsulated capabilities
    │
    ├── outfit-rating/          # FIT CHECK FEATURE MODULE (100 Pts Scale)
    │   ├── components/         # FitCheckHeroStudio, FitCheckParametersGrid, FitCheckShareModal
    │   ├── constants/          # OUTFIT_PARAMETERS (10 factors), OCCASIONS, Card backgrounds
    │   ├── pages/              # FitCheckFeaturePage (Clean ~350-line container)
    │   ├── services/           # OutfitScoringEngine, PoseLandmarksService (MediaPipe Pose)
    │   ├── types/              # OutfitRatingTypes
    │   ├── utils/              # OutfitShareCardUtil (1080x1350 canvas generation)
    │   └── index.ts            # Public feature barrel export
    │
    └── facial-beauty/          # BEAUTY RATING FEATURE MODULE (100 Pts Scale)
        ├── components/
        │   ├── FacialBeautyHeroStudio.tsx   # Studio HUD, dropzone, roll canvas preview
        │   ├── FacialBeautyScorecard.tsx    # 8-card grid, presentational vs structural allocation
        │   ├── FacialDeepDiveSection.tsx    # Dynamic tab switcher container
        │   ├── FacialBeautyAboutSection.tsx # Manifesto & 3 scientific pillars
        │   ├── FacialMethodologyModal.tsx   # Research boundary & limits dialog
        │   ├── FacialShareModal.tsx         # 1080x1350 preview & Web Share dialog
        │   └── diagnostics/                 # 8 ISOLATED BIOMETRIC DIAGNOSTIC TABS
        │       ├── SkinDiagnosticTab.tsx
        │       ├── ProportionsDiagnosticTab.tsx
        │       ├── ExpressionDiagnosticTab.tsx
        │       ├── AveragenessDiagnosticTab.tsx
        │       ├── SymmetryDiagnosticTab.tsx
        │       ├── GroomingDiagnosticTab.tsx
        │       ├── DimorphismDiagnosticTab.tsx
        │       └── FeaturesDiagnosticTab.tsx
        ├── constants/          # BEAUTY_PARAMETERS (8 factors), FRAMEWORK_LIMITS, PHI, BAYESIAN_PRIOR
        ├── pages/              # BeautyRatingFeaturePage (Clean ~400-line orchestrator)
        ├── services/           # FacialScoringEngine (Bayesian priors, rule caps), FaceLandmarksService
        ├── types/              # CanonicalLandmarks, BeautyScoreData, CompleteFacialAnalysisResult
        ├── utils/              # BeautyShareCardUtil (1080x1350 high-DPI social stylecard)
        └── index.ts            # Public feature barrel export
```

---

## 🎯 The 5 Architectural Questions for Every PR

Before adding or modifying any file, every engineer on the team must answer:

| # | Question | Rule |
|---|---|---|
| **1** | **What responsibility does this file have?** | Must follow SRP (Single Responsibility Principle). A component shouldn't run scoring math. An engine shouldn't render JSX. |
| **2** | **Does its name clearly communicate that responsibility?** | Use explicit domain suffixes: `*Service.ts`, `*Util.ts`, `*Constants.ts`, `*Types.ts`, `*Page.tsx`, `*Modal.tsx`, `*Tab.tsx`. |
| **3** | **Where should this file logically live?** | If it belongs to one domain, place it under `features/<feature-name>/`. If needed across features, place it in `shared/`. If infrastructural, in `core/`. |
| **4** | **Is this file reusable?** | If reusable across features, extract into `src/shared/`. Keep feature-specific helpers private to the feature. |
| **5** | **Is this file still needed?** | Zero dead code policy. If a file is superseded, delete it immediately. |

---

## 🔒 Privacy & Zero Data Retention

Gabru adheres to strict client-side data privacy standards:
1. **100% In-Browser Execution**: All MediaPipe landmark detection, pixel analysis, CIELAB delta computations, and canvas image synthesis execute exclusively in the client's memory.
2. **0 Bytes Stored**: No user images, portraits, facial meshes, or biometric telemetry are ever transmitted or stored on backend servers.
3. **Memory Management**: All generated `Blob` object URLs are automatically revoked upon component unmount or image reassignment to prevent memory leaks.

---

## 🔬 Scientific & Biometric Framework

### Fit Check Matrix (100 Points)
- **Top 3 Drivers (45 Pts)**: Fit & Silhouette (18 Pts), Color Coordination (15 Pts), Proportions & Balance (12 Pts).
- **Style Cohesion (30 Pts)**: Occasion Appropriateness (12 Pts), Layering (10 Pts), Texture Variety (8 Pts).
- **Finishing & Polish (25 Pts)**: Footwear (10 Pts), Accessories (7 Pts), Grooming (5 Pts), Confidence & Posture (3 Pts).

### Facial Attractiveness Matrix (100 Points)
- **Presentational Cues (44 Pts - Controllable)**:
  - Skin Quality & Vitality (21 Pts) — CIELAB $\Delta E_{2000}$, blemish clarity, specularity, under-eye vascular flush.
  - Expression & Warmth (13 Pts) — Duchenne AU6/AU12 smile mechanics, gaze alignment, muscle relaxation.
  - Grooming & Styling (10 Pts) — Hairline definition, eyebrow symmetry, facial hair contouring.
- **Structural Architecture (56 Pts - Anthropometric)**:
  - Proportions & Golden Ratio φ (19 Pts) — Facial thirds ($Tr-G / G-Sn / Sn-Gn$), fifths, and 6 golden harmonic factors.
  - Averageness (12 Pts) — Procrustes shape distance against population norm with Rule A4 distinctive trait protection.
  - Bilateral Symmetry (11 Pts) — Horizontal $A_h$ and vertical $A_v$ delta indices with filter/mirror detection guard.
  - Sexual Dimorphism (7 Pts) — Z-score distribution against male/female/neutral reference norms (mathematically renormalised when skipped).
  - Feature Definition (7 Pts) — Canthal tilt, palpebral fissure, nasal index, lip fullness ratio.

---

## 🤝 Contribution Guidelines

1. **Branch Naming**:
   - `feature/<ticket>-<short-description>`
   - `fix/<ticket>-<short-description>`
   - `refactor/<ticket>-<short-description>`
2. **Commit Conventions**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(facial-beauty): add canthal tilt visualization to features tab`
   - `fix(outfit-rating): prevent zero division in aspect ratio calculation`
   - `refactor(shared): extract universal clipboard feedback hook`
3. **Adding a New Diagnostic Tab**:
   1. Create `src/features/facial-beauty/components/diagnostics/YourNewTab.tsx`.
   2. Export it in `src/features/facial-beauty/components/diagnostics/index.ts`.
   3. Add the corresponding `DeepDiveTabKey` in `src/features/facial-beauty/types/FacialBeautyTypes.ts`.
   4. Render it inside `FacialDeepDiveSection.tsx`.
   5. Run `npm run type-check && npm run build` to verify.

---

## 📄 License & Governance

Copyright &copy; 2026 Gabru Technologies Inc. All rights reserved.
For internal developer inquiries, consult the Engineering Architecture Council.

#   G a b r u  
 