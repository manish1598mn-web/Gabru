# 🌟 Gabru — AI Aesthetic, Biometric & Sartorial Intelligence Platform

[![Production](https://img.shields.io/badge/Live-gabru.online-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://gabru.online)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MediaPipe](https://img.shields.io/badge/Google-MediaPipe%20Vision-00897b?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20In--Browser-10b981?style=for-the-badge&logo=shield&logoColor=white)](#-privacy--zero-data-retention)
[![License](https://img.shields.io/badge/License-Proprietary-blueviolet?style=for-the-badge)](#-license--governance)

Welcome to the **Gabru** repository! Gabru is an enterprise-grade aesthetic intelligence platform designed for peer-reviewed, research-backed biometric and visual evaluation.

Engineered to production SaaS standards for high-scale teams, adhering strictly to **Clean Architecture**, **Feature-Sliced Design (FSD)**, **SOLID principles**, and **100% client-side privacy**.

🌐 **Official Production Platform**: [https://gabru.online](https://gabru.online)

---

## 📑 Table of Contents

- [Platform Overview](#-platform-overview)
- [Core Feature Suites](#-core-feature-suites)
  - [1. Fit Check (Outfit Rating Studio)](#1-fit-check-outfit-rating-studio)
  - [2. Beauty Rating (Facial Harmony & Golden Ratio Studio)](#2-beauty-rating-facial-harmony--golden-ratio-studio)
  - [3. Hand Reading (Palmistry & Samudrika Shastra Studio)](#3-hand-reading-palmistry--samudrika-shastra-studio)
  - [4. Content Rating (Social Media Virality Studio)](#4-content-rating-social-media-virality-studio)
- [9:16 Smartphone Share Cards & Reactive Themes](#-916-smartphone-share-cards--reactive-themes)
- [System Architecture (Feature-Sliced Design)](#-system-architecture)
- [Privacy & Zero Data Retention Guarantee](#-privacy--zero-data-retention-guarantee)
- [Quickstart for Developers](#-quickstart-for-developers)
- [Automated Testing & Quality Gates](#-automated-testing--quality-gates)
- [SEO, Domain & Deployment](#-seo-domain--deployment)
- [Contribution Guidelines](#-contribution-guidelines)
- [License & Governance](#-license--governance)

---

## ⚡ Platform Overview

Gabru evaluates human visual aesthetics, anatomical symmetry, sartorial harmony, and digital content virality directly inside the browser using client-side WebAssembly machine learning models.

```
                    ┌──────────────────────────────────────────────┐
                    │               GABRU PLATFORM                 │
                    │            https://gabru.online              │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┐
         │                  │                    │                  │
         ▼                  ▼                    ▼                  ▼
  [ Fit Check ]     [ Beauty Rating ]    [ Hand Reading ]   [ Content Rating ]
   MediaPipe Pose     468-pt 3D Mesh       21-pt 3D Hand      Scraped Telemetry
  10 Sartorial Dims  Golden Ratio φ Matrix 7 Mounts + Creases 10 Virality Rubrics
```

### Why Gabru is Unique:
1. **Zero Server Inference Cost**: All 3D meshes (Face Mesh 468 points, Pose 33 points, Hand 21 points) execute in WebAssembly on the user's GPU/CPU.
2. **Deterministic Mathematical Formulations**: Zero random numbers. Every score is derived from geometric landmark ratios, CIELAB color deltas, and empirical Bayesian priors.
3. **Melanin & Ethnicity Invariance**: Strict mathematical guards against skin-tone bias in facial harmony and skin quality scoring.
4. **9:16 Full Smartphone Story Share Cards**: Generates ultra-crisp $1080 \times 1920\text{ px}$ ($2\times$ Retina $2160 \times 3840\text{ px}$) canvas cards matching the user's active Dark/Light theme mode.

---

## 🔬 Core Feature Suites

### 1. Fit Check (Outfit Rating Studio)
**Route**: [`/`](https://gabru.online) • **Entrypoint**: `src/features/outfit-rating/`

Evaluates full-length outfit photographs across **10 Sartorial Dimensions** grouped into an executive 3-tier allocation:

- **Tier 1: Foundations & Silhouette (71 Points Max)**:
  - `📐 Fit & Silhouette` (18 Pts) — Shoulder seam alignment, sleeve break, jacket collar stance, garment taper.
  - `⚖️ Proportions & Balance` (15 Pts) — Neoclassical 8-head canon, torso-to-leg golden ratio ($1:1.618$), rise harmony.
  - `🎨 Color Coordination` (15 Pts) — 60-30-10 color rule, complementary & analogous harmonies calculated in CIELAB $\Delta E_{2000}$ color space.
  - `🏛️ Occasion Appropriateness` (12 Pts) — Formality spectrum (Black Tie, Smart Casual, Streetwear, Business Formal).
  - `👔 Layering Architecture` (11 Pts) — Collar layering, cuff exposure, jacket-to-shirt length offset.
- **Tier 2: Styling & Polish (20 Points Max)**:
  - `🧵 Fabric & Texture Variety` (8 Pts) — Tactile contrast (matte vs. sheen, knit vs. structure).
  - `👞 Footwear Harmony` (7 Pts) — Shoe visual weight, leather matching, trouser hem break.
  - `✨ Accessories & Details` (5 Pts) — Watch, belt, jewelry, and eyewear cohesion.
- **Tier 3: Execution & Presence (9 Points Max)**:
  - `🎯 Tailoring Details & Ironing` (5 Pts) — Crease sharpness, hem symmetry, drape cleanliness.
  - `⚡ Confidence & Posture` (4 Pts) — Spinal alignment, shoulder roll, relaxed stance.

---

### 2. Beauty Rating (Facial Harmony & Golden Ratio Studio)
**Route**: [`/beauty-rating`](https://gabru.online/beauty-rating) • **Entrypoint**: `src/features/facial-beauty/`

Processes facial portraits using **Google MediaPipe 468-point 3D Face Mesh** detection. Evaluates facial architecture across **9 Essential Biometric Pillars**:

| Pillar | Biometric Indicator | Anthropometric Mathematical Formula |
| :--- | :--- | :--- |
| 👁️ **Eyes** | Canthal Tilt & Palpebral Fissure | Angle between medial & lateral canthi ($\theta_{\text{tilt}}$), eye aperture aspect ratio |
| 👃 **Nose** | Bridge Linearity & Dorsum | Nasal index ($\text{Alar width} / \text{Nasal height}$), dorsal deviation angle |
| 👄 **Lips** | Vermilion Fullness & Cupid's Bow | Upper to lower lip height ratio ($\approx 1 : 1.618$), philtrum column definition |
| ✨ **Smoothness** | Epidermal Texture Uniformity | High-frequency luminance variance, blemish clarity, pore dispersion |
| 🌿 **Face Health** | Radiance & Vitality | Under-eye vascular flush index, CIELAB $L^*$ chromatic radiance, restfulness |
| 💎 **Jawline** | Mandibular Contour | Gonial angle ($\approx 120^\circ\text{–}130^\circ$), chin projection, jaw-to-bizygomatic width |
| ⚜️ **Attractiveness** | Neoclassical Thirds & Golden Ratio | Forehead ($Tr\text{-}G$), midface ($G\text{-}Sn$), lower face ($Sn\text{-}Gn$) parity; $\varphi = 1.618$ harmonic intervals |
| 😊 **Smile** | Duchenne AU6/AU12 Kinematics | Zygomaticus major activation, eye crinkling (orbicularis oculi), commissure symmetry |
| 🪞 **Symmetry** | Bilateral Facial Parity | Horizontal asymmetry $A_h = \frac{1}{N}\sum |x_i - x_i'|$, Vertical asymmetry $A_v = \frac{1}{N}\sum |y_i - y_i'|$ |

---

### 3. Hand Reading (Palmistry & Samudrika Shastra Studio)
**Route**: [`/hand-reading`](https://gabru.online/hand-reading) • **Entrypoint**: `src/features/hand-reading/`

Blends Western Chiromancy with Indian Samudrika Shastra using **MediaPipe 21-point 3D Hand Mesh**:

- **Photo Quality Gate ($q \ge 0.40$)**: Validates Laplacian image sharpness, palm tilt angle ($\le 20^\circ$), glare/shadow shares, and finger spread.
- **Creases & Ridge Tracing**:
  - `❤️ Heart Line (Hridaya Rekha)` — Emotional processing, empathy, attachment style.
  - `🧠 Head Line (Matri Rekha)` — Intellectual focus, analytical stamina, mental clarity.
  - `🌿 Life Line (Pitri Rekha)` — Physical vitality ($Prana$), constitution, life rhythm stability.
  - `⚡ Fate Line (Saturn Line)` — Career momentum, vocation discipline, focus vector.
  - `☀️ Sun Line (Apollo Line)` — Creative recognition, social charisma, reputation.
  - `💬 Mercury Line (Health/Communication)` — Verbal wit, commercial acumen, nervous system poise.
  - `💍 Relationship Lines` — Partnership attachments and interpersonal depth.
- **7 Planetary Mounts**: Jupiter (leadership), Saturn (discipline), Apollo (artistry), Mercury (intelligence), Venus (vitality), Moon (intuition), Mars (resilience).
- **Hand Shape Typology**: Exact geometric classification into classical elemental prototypes (Earth, Air, Fire, Water).

---

### 4. Content Rating (Social Media Virality Studio)
**Route**: [`/content-rating`](https://gabru.online/content-rating) • **Entrypoint**: `src/features/content-rating/`

Audits single social media posts (Instagram, TikTok, YouTube, X) across an empirical $100$-point composite index:
- **Mathematical Engine**: $40\%$ Scraped Hard Telemetry (Likes, Comments, Shares, Saves, Reposts, True Engagement Rate) $+$ $60\%$ Multimodal AI Evaluation $+$ Viral Ego Curve.
- **10 Parameter Vectors**: Main Character Energy, Visual Aura & Frame, Scroll-Stopper Hook, Caption Wit, Group-Chat Forwardability, Secret Bookmark Bait, Comment Chaos, Upload Timing, Trend Originality, Single-Post Verdict.
- **Deterministic Badges**: Awards badges including *Group-Chat Hall of Famer*, *Certified Thirst Trap / Aesthetic Flex*, *Gatekept Goldmine*, and *Comment Section Warzone*.

---

## 📱 9:16 Smartphone Share Cards & Reactive Themes

All four feature studios feature custom canvas engines producing **9:16 vertical smartphone format ($1080 \times 1920\text{ px}$)** cards designed for **Instagram Stories, TikTok, WhatsApp Status, and Snapchat**.

### Reactive Theme Engine
The canvas generators dynamically detect the user's active interface theme via `isClientLightMode()`:

```
┌──────────────────────────────────────────────────────────────┐
│                    MODE-REACTIVE PALETTES                    │
├──────────────────────────────┬───────────────────────────────┤
│  ☀️ LIGHT MODE               │  🌙 DARK MODE                 │
│  Canvas: #f8fafc (Porcelain) │  Canvas: #09090e (Obsidian)   │
│  Cards:  rgba(255,255,255,.9)│  Cards:  rgba(18,18,28,.90)   │
│  Text:   #0f172a (Deep Slate)│  Text:   #ffffff (Pure White) │
│  Borders:rgba(15,23,42,0.08) │  Borders:rgba(255,255,255,.1) │
│  Accents:Violet & Emerald    │  Accents:Bioluminescent Glow  │
└──────────────────────────────┴───────────────────────────────┘
```

### Visual Architecture of the 9:16 Card:
1. **Header ($y = 44$)**: Single-baseline brand logo, feature title, and platform pill.
2. **Upper Hero Stage ($y = 86$ to $770$)**:
   - Left ($484 \times 684\text{ px}$): Cover image with rounded borders, bottom dark vignette, and verified telemetry badges.
   - Right ($484 \times 684\text{ px}$): Executive Biometrics / Style Hub with big tabular scores, verdict badge, and core diagnostic dials.
3. **Stage Divider ($y = 794$ to $836$)**: Section title and calibration methodology banner.
4. **Lower Matrix Stage ($y = 848$ to $1818$)**: Dedicated $2 \times 5$ or $3 \times 3$ grid displaying the full parameter matrix with progress bars, weights, and roasting/complimentary snippets.
5. **Viral CTA Bar ($y = 1846$ to $1888$)**: Full-width rounded pill driving free traffic back to `https://gabru.online`.

---

## 🏛️ System Architecture

Gabru adheres strictly to **Feature-Sliced Design (FSD)** and **Clean Architecture**. Dependencies only flow inward toward domain logic.

```
src/
├── app/                                 # [Thin Routing Layer] Next.js App Router
│   ├── page.tsx                         # Route "/" → Fit Check (Dedicated SEO Metadata)
│   ├── beauty-rating/page.tsx           # Route "/beauty-rating" → Golden Ratio Check
│   ├── hand-reading/page.tsx            # Route "/hand-reading" → Palm Reading AI
│   ├── content-rating/page.tsx          # Route "/content-rating" → Virality Predictor
│   ├── layout.tsx                       # Root HTML shell, fonts, global schema & icons
│   ├── sitemap.ts                       # Dynamic XML sitemap generator (gabru.online)
│   ├── robots.ts                        # Crawler directives
│   └── globals.css                      # Design tokens, CSS variables, and light/dark themes
│
├── core/                                # [Core Layer] Cross-cutting configurations
│   ├── config/SiteConfig.ts             # Domain metadata, MediaPipe CDN URLs, feature flags
│   ├── security/                        # Console security filters & boundary guards
│   └── index.ts                         # Public core barrel export
│
├── shared/                              # [Shared Layer] Reusable enterprise primitives
│   ├── components/
│   │   ├── layout/                      # AppNavbar, AppFooter, StudioHeroBackdrop
│   │   └── ui/                          # BaseModal, Button, Slider, LoadingSkeleton
│   ├── hooks/                           # useScrollState, useIntersectionReveal, useRealisticAnalysis
│   ├── utils/                           # CanvasUtil (isClientLightMode), ColorSpaceUtil, ShareUrlUtil
│   └── index.ts                         # Public shared barrel export
│
└── features/                            # [Domain Slices] Isolated business logic
    │
    ├── outfit-rating/                   # FIT CHECK MODULE (100 Pts Scale)
    │   ├── components/                  # FitCheckHeroStudio, FitCheckParametersGrid, FitCheckShareModal
    │   ├── constants/                   # OUTFIT_PARAMETERS (10 factors), OCCASIONS
    │   ├── pages/                       # FitCheckFeaturePage (Clean orchestrator)
    │   ├── services/                    # OutfitScoringEngine, PoseLandmarksService
    │   ├── types/                       # OutfitRatingTypes
    │   ├── utils/                       # OutfitShareCardUtil (1080x1920 9:16 Canvas)
    │   └── index.ts                     # Feature barrel
    │
    ├── facial-beauty/                   # BEAUTY RATING MODULE (100 Pts Scale)
    │   ├── components/
    │   │   ├── FacialBeautyHeroStudio.tsx   # Studio HUD, dropzone, canvas preview
    │   │   ├── FacialBeautyScorecard.tsx    # 8-card grid with visual watermarks
    │   │   ├── FacialDeepDiveSection.tsx    # Dynamic diagnostic tab switcher
    │   │   ├── FacialBeautyAboutSection.tsx # Manifesto & 3 scientific pillars
    │   │   ├── FacialShareModal.tsx         # 9:16 preview & Web Share dialog
    │   │   └── diagnostics/                 # 8 BIOMETRIC DIAGNOSTIC TABS
    │   │       ├── SkinDiagnosticTab.tsx
    │   │       ├── ProportionsDiagnosticTab.tsx
    │   │       ├── ExpressionDiagnosticTab.tsx
    │   │       ├── AveragenessDiagnosticTab.tsx
    │   │       ├── SymmetryDiagnosticTab.tsx
    │   │       ├── GroomingDiagnosticTab.tsx
    │   │       ├── DimorphismDiagnosticTab.tsx
    │   │       └── FeaturesDiagnosticTab.tsx
    │   ├── constants/                   # BEAUTY_PARAMETERS (8 factors), PHI = 1.618
    │   ├── pages/                       # BeautyRatingFeaturePage
    │   ├── services/                    # FacialScoringEngine, FaceLandmarksService
    │   ├── types/                       # CanonicalLandmarks, BeautyScoreData
    │   ├── utils/                       # BeautyShareCardUtil (1080x1920 9:16 Matrix Card)
    │   └── index.ts                     # Feature barrel
    │
    ├── hand-reading/                    # PALM READING MODULE (100 Pts Scale)
    │   ├── components/                  # HandReadingHeroStudio, PalmLandmarkVisualizer, HandShareModal
    │   ├── constants/                   # HAND_PARAMETERS (10 factors), MOUNT_REGIONS
    │   ├── pages/                       # HandReadingFeaturePage
    │   ├── services/                    # HandScoringEngine, HandLandmarksService
    │   ├── types/                       # HandReadingTypes
    │   ├── utils/                       # HandShareCardUtil (1080x1920 9:16 Canvas)
    │   └── index.ts                     # Feature barrel
    │
    └── content-rating/                  # VIRALITY PREDICTOR MODULE (100 Pts Scale)
        ├── components/                  # ContentRatingHeroStudio, ContentRatingScorecard, ContentShareModal
        ├── constants/                   # CONTENT_PARAMETERS (10 factors), INTERNET_SLANG
        ├── pages/                       # ContentRatingFeaturePage
        ├── services/                    # ContentScoringEngine, ScrapedTelemetryParser
        ├── types/                       # ContentRatingTypes
        ├── utils/                       # ContentShareCardUtil (1080x1920 9:16 Canvas)
        └── index.ts                     # Feature barrel
```

---

## 🔒 Privacy & Zero Data Retention Guarantee

Gabru operates under a zero-trust, client-side data privacy mandate:
1. **100% In-Browser Execution**: All MediaPipe landmark detection, pixel classification, and canvas rendering happen exclusively in the browser's memory via WebAssembly.
2. **0 Bytes Stored or Transmitted**: Images, biometric landmarks, and scan results are **never** uploaded to any server, database, or external API.
3. **Immediate Memory Deallocation**: All generated `Blob` object URLs are revoked using `URL.revokeObjectURL()` upon dialog dismissal or photo reassignment.

---

## ⚡ Quickstart for Developers

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)
- **Git**

### Installation
```bash
# 1. Clone repository
git clone https://github.com/manish55555/Gabru.git
cd Gabru

# 2. Install dependencies
npm install

# 3. Start development server with Turbopack
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 🧪 Automated Testing & Quality Gates

Gabru runs an automated test suite verifying deterministic pipeline calculation, mathematical limits, and zero mock data.

Run the test suite:
```bash
npm test
```

### Verified Test Suites:
- `ContentScoringEngine.test.ts` — Validates NLP parsing, telemetry fallback, viral ego curving, and verdict badge assignment.
- `ContentDeterministicPipeline.test.ts` — Tests FNV-1a binary hashing, deterministic rubric derivation, and CSV/JSON parsing.
- `FacialScoringEngineCalibration.test.ts` — Verifies 468-point 3D Face Mesh geometry, Golden Ratio $\varphi$, and 9-pillar matrix boundaries.
- `HandScoringEngine.test.ts` — Tests photo quality gating ($q$), crease prominence, 7-mount relief, and dual-tradition reading synthesis.

Run TypeScript compiler checks:
```bash
npm run type-check
```

---

## 🌐 SEO, Domain & Deployment

### Production Domain Configuration
- **Primary Domain**: [https://gabru.online](https://gabru.online)
- **Host**: Vercel Global Edge Network (`76.76.21.21` & `cname.vercel-dns.com`)
- **DNS Registrar**: BigRock (Managed DNS with custom A, CNAME, and Google Search Console TXT records)
- **SSL/TLS**: Automated Let's Encrypt TLS 1.3 with HTTP/2 and HTTP/3 support.

### Multi-Route Keywords Architecture
Each page implements targeted metadata for Google Search:
- `/` — Targeted for *"AI Outfit Rater"*, *"Fit Check"*, *"AI Fit Check"*, *"Rate My Outfit"*.
- `/beauty-rating` — Targeted for *"Golden Ratio Check"*, *"Golden Ratio Face Test"*, *"Face Beauty Calculator"*, *"Rate My Face AI"*.
- `/hand-reading` — Targeted for *"AI Palm Reading"*, *"Online Palmistry"*, *"Palm Line Reader Free"*.
- `/content-rating` — Targeted for *"Instagram Post Rater"*, *"Viral Post Predictor"*, *"Social Media Content Rater"*.

### Favicon & Search Snippet Assets
- `public/favicon.ico` — Standard root fallback icon.
- `public/icon-48x48.png` — Exact Google Search Console specification ($48\times 48\text{ px}$).
- `public/icon-96x96.png` & `public/icon-192x192.png` — High-DPI Android/Chrome icons.
- `public/apple-touch-icon.png` — iOS Safari touch icon ($180\times 180\text{ px}$).

---

## 🤝 Contribution Guidelines

1. **Branch Naming**:
   - `feat/<short-description>`
   - `fix/<short-description>`
   - `refactor/<short-description>`
2. **Commit Message Format**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(beauty): add canthal tilt angle measurement to eye diagnostic tab`
   - `fix(share): ensure 9:16 aspect ratio across iOS Safari lightboxes`
   - `test(hand): add unit tests for elemental hand shape typing`
3. **Commit Author Requirement**:
   All commits must use the verified author identity:
   `Manish <manish55555.mn@gmail.com>`

---

## 📄 License & Governance

Copyright &copy; 2026 **Gabru Technologies Inc.** All rights reserved.  
Built with passion for research-grade aesthetic intelligence.
