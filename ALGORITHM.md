# Gabru — The Ultimate Merged Outfit Scoring Algorithm, Calculation & Logic

> **Version:** 2.0 (Ultimate Merged Production Architecture)  
> **Engine:** Local Vision Canvas + Client-Side MediaPipe PoseLandmarker (33 Body Landmarks)  
> **Total Score:** 100 Points across 10 Parameters in 3 Weighted Tiers  
> **Client Sartorial Index (CSI):** Style Score / 10 (Scale: 0.0 – 10.0)  
> **Privacy Guarantee:** 100% Client-Side Processing · 0 Bytes Server Retention · Fully Deterministic

---

## Table of Contents

1. [Executive Summary & Merged Architecture](#1-executive-summary--merged-architecture)
2. [Step 0: Photo Quality & Focused Human Subject Isolation](#2-step-0-photo-quality--focused-human-subject-isolation)
3. [Part A: Shared Engine Core Mechanics](#3-part-a-shared-engine-core-mechanics)
   - [A1. Outfit Inventory & Multi-Feature Extraction](#a1-outfit-inventory--multi-feature-extraction)
   - [A2. Core Engine Mathematical Equations](#a2-core-engine-mathematical-equations)
   - [A3. Double-Counting Boundaries & Separation Rules](#a3-double-counting-boundaries--separation-rules)
4. [Part B: Detailed Parameter Specifications (1 to 10)](#4-part-b-detailed-parameter-specifications-1-to-10)
   - [Parameter 1: Fit & Tailoring (25 Pts)](#parameter-1-fit--tailoring-25-pts)
   - [Parameter 2: Proportion & Silhouette (16 Pts)](#parameter-2-proportion--silhouette-16-pts)
   - [Parameter 3: Occasion Appropriateness (12 Pts)](#parameter-3-occasion-appropriateness-12-pts)
   - [Parameter 4: Color Harmony (10 Pts)](#parameter-4-color-harmony-10-pts)
   - [Parameter 5: Style Cohesion (8 Pts)](#parameter-5-style-cohesion-8-pts)
   - [Parameter 6: Fabric, Texture & Condition (8 Pts)](#parameter-6-fabric-texture--condition-8-pts)
   - [Parameter 7: Accessories & Footwear (7 Pts)](#parameter-7-accessories--footwear-7-pts)
   - [Parameter 8: Grooming & Presentation (5 Pts)](#parameter-8-grooming--presentation-5-pts)
   - [Parameter 9: Focal Point & Visual Hierarchy (5 Pts)](#parameter-9-focal-point--visual-hierarchy-5-pts)
   - [Parameter 10: Originality & Personal Expression (4 Pts)](#parameter-10-originality--personal-expression-4-pts)
5. [Part C: Master Assembly, Master Caps & Optimization](#5-part-c-master-assembly-master-caps--optimization)
   - [C1. Master Computation Sequence](#c1-master-computation-sequence)
   - [C2. Master Aggregation, Master Caps & CSI](#c2-master-aggregation-master-caps--csi)
   - [C3. Top Quick Fix Value Calculation (ΔPoints)](#c3-top-quick-fix-value-calculation-δpoints)
   - [C4. Verified Reference Implementation (TypeScript & Python)](#c4-verified-reference-implementation-typescript--python)
   - [C5. End-to-End Worked Verification Example](#c5-end-to-end-worked-verification-example)
   - [C6. Limitations, Fairness Constraints & Safeguards](#c6-limitations-fairness-constraints--safeguards)

---

## 1. Executive Summary & Merged Architecture

The **Gabru Ultimate Scoring Engine** marries **computer vision pose estimation** with an **editorial defect-deduction and credit rating methodology**.

Rather than relying on vague heuristic impressions or stochastic LLM guesses, the engine executes in three deterministic phases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 1: CLIENT-SIDE VISION SCAN                      │
│  - MediaPipe PoseLandmarker (33 3D skeletal landmarks)                      │
│  - Multi-pose foreground scoring: Center proximity + Bounding area + Angle  │
│  - Isolates the ONE front-focused human figure; extracts exact body metrics │
│  - Canvas pixel clustering: CIELAB ΔE2000, LCH chroma, Luminance zones      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PHASE 2: 10-PARAMETER DISCRETE ENGINE RUN                   │
│  - Sub-factors with weights W totalling 100 per parameter                   │
│  - Visibility Factor V ∈ {1.0, 0.5, 0}: Neutral prior 7.0 for partial       │
│  - Defect penalties: Minor (-1.0), Moderate (-2.5), Major (-4.5)            │
│  - Parameter rating R = (1 - β)·WA + β·lowest (weakest-link blending)       │
│  - Critical flaw parameter caps & hard violation checks                     │
│  - Originality & Personal Expression credit model with execution gate       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PHASE 3: MASTER ASSEMBLY & CAPS                         │
│  - Style Score = 100 × Σ Points / Σ MaxPts (Renormalises if N/A)            │
│  - Master Caps: Fit R < 4.0 ⟹ Max 70; Occasion R < 4.0 ⟹ Max 65            │
│  - CSI (Client Sartorial Index) = Style Score / 10                          │
│  - Overall Confidence = Σ(W · V) / 100 with High / Medium / Low labels      │
│  - Top Quick Fix Discovery: Identifies max ΔPoints action across outfit     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step 0: Photo Quality & Focused Human Subject Isolation

### 2.1 Photo Quality Gate Checklist

| Check | Pass Condition | Degraded Action |
|---|---|---|
| **Body Visibility** | Shoulders to shoes visible (full body preferred) | If feet cropped, $V = 0$ for footwear sub-factor (renormalised) |
| **Angle & Tilt** | Front-facing, camera at chest height, horizon level | Head/body tilt factored into Grooming and Fit confidence |
| **Lighting & Contrast** | Even exposure, clear value contrast, no dark wash | Low contrast pulls Color and Texture confidence to $V = 0.5$ |
| **Posture & Stance** | Natural upright posture, uninhibited garment lines | Spine lean and shoulder tilt penalized in Grooming GP4 |

### 2.2 Multi-Candidate Front-Focused Human Isolation

When multiple people or background figures exist in the photograph, MediaPipe evaluates candidate poses ($K \le 4$) to isolate the **primary subject**:

$$\text{FocusScore} = 4.5 \cdot \text{BoxArea} + 2.5 \cdot \text{CenterProximity} + 2.5 \cdot \text{AvgVisibility} + 2.5 \cdot \text{IsFrontFacing}$$

Where:
- $\text{BoxArea} = (X_{\max} - X_{\min}) \cdot (Y_{\max} - Y_{\min})$
- $\text{CenterProximity} = \max(0, 1 - 2 \cdot \sqrt{(X_{\text{core}} - 0.5)^2 + 0.49 \cdot (Y_{\text{core}} - 0.5)^2})$
- $\text{IsFrontFacing} = \text{true}$ if nose $X$ coordinate lies between left and right shoulders with shoulder span $> 0.08$.

The candidate with $\max(\text{FocusScore})$ is selected for all 33 skeletal body metrics.

---

## 3. Part A: Shared Engine Core Mechanics

### A1. Outfit Inventory & Multi-Feature Extraction

All 10 parameters read from a single extracted outfit feature table:

| Dimension | Analyzed Values |
|---|---|
| **Garment Pieces** | Top, Bottom, One-piece (dress/kurta/sherwani), Outer layer, Footwear, Accessories |
| **Color Spaces** | Dominant CIELAB ($L^*, a^*, b^*$) & LCH ($L^*, C^*, h^\circ$) per garment zone |
| **Volume Class** | Fitted ($F$), Regular ($R$), Loose ($L$), Oversized ($O$) |
| **Texture Families** | Smooth, Matte-rough, Knit, Shiny/Silk, Leather/Suede, Denim, Sheer, Embellished |
| **Formality Scale (FL)** | $1$ (Loungewear/Gym) to $10$ (Black Tie/Bridal Couture) |
| **Archetypes** | Classic, Smart Casual, Casual, Streetwear, Athleisure, Traditional, Minimal, Boho, Glam |

#### Formality Reference Scale (FL)
- **1–2:** Loungewear, sleepwear, athletic gym kit
- **3:** Everyday casual: graphic tee, distressed denim, slip-on sneakers
- **4–5:** Elevated casual, smart casual, linen button-down, festive-light kurta set
- **6:** Business casual, unstructured blazer, semi-formal ethnic
- **7:** Business formal, tailored bandhgala, raw silk saree
- **8:** Cocktail, festive formal, embroidered sherwani or lehenga
- **9–10:** Black tie tuxedo, bridal couture

---

### A2. Core Engine Mathematical Equations

1. **Sub-Factor Weights:** Each parameter consists of sub-factors with internal weights $W_i$ where $\sum W_i = 100$.
2. **Visibility Factor ($V_i$):**
   - $V = 1.0$: Sub-factor clearly visible in frame.
   - $V = 0.5$: Partially visible (hands, bags, angle, or layers obscure portion).
   - $V = 0.0$: Not observable (e.g. feet cut off, no layers, face not visible). Sub-factor is **excluded** and remaining weights renormalise to 100.
3. **Neutral Prior Pull:** When visibility is partial ($V = 0.5$), the rating is pulled toward a neutral prior of $7.0$:
   $$\text{AdjustedRating}_i = V_i \cdot \text{Raw}_i + (1 - V_i) \cdot 7.0$$
4. **Defect Deduction:** Each defect-deduction sub-factor begins at $10.0$:
   $$\text{Raw}_i = \max\left(0, 10.0 - \sum \text{Penalties}\right)$$
   - Minor defect (barely noticeable): $-1.0$
   - Moderate defect (visible at normal distance): $-2.5$
   - Major defect (obvious at first glance): $-4.5$
5. **Weighted Average ($WA$):**
   $$WA = \frac{\sum_{i \in \text{Visible}} \text{AdjustedRating}_i \cdot W_i}{\sum_{i \in \text{Visible}} W_i}$$
6. **Weakest-Link Blending:** The human eye immediately registers the worst flaw:
   $$R = (1 - \beta) \cdot WA + \beta \cdot \min_{i \in \text{Visible}}(\text{AdjustedRating}_i)$$
   Where $\beta \in [0.10, 0.20]$ is configured per parameter.
7. **Critical-Flaw Caps:** If a designated foundational sub-factor fails ($\le 2$ or $\le 3$), the parameter rating $R$ is capped (e.g., $R \le 5.0$).
8. **Point Conversion:**
   $$\text{Points} = R \cdot \left(\frac{\text{MaxPts}}{10}\right)$$
9. **Parameter Confidence:**
   $$\text{Confidence} = \frac{\sum W_i \cdot V_i}{\sum W_i}$$

---

### A3. Double-Counting Boundaries & Separation Rules

To maintain strict mathematical fairness, each aesthetic defect is penalized in **exactly one parameter**:

| Defect Type | Scored In | Never Scored In |
|---|---|---|
| Creases or pulls caused by poor fit | **Fit & Tailoring** | Fabric, Texture & Condition |
| Creases, stains, pilling from poor care | **Fabric, Texture & Condition** | Fit & Tailoring |
| Shoe formality & physical scuffs | **Accessories & Footwear** | Occasion / Fit |
| Weather suitability of cloth | **Occasion Appropriateness** | Fabric, Texture & Condition |
| Seasonal signal clash between fabrics | **Fabric, Texture & Condition** | Occasion Appropriateness |
| Color clash, near-miss shades, undertone | **Color Harmony** | Style Cohesion / Focal Point |
| How loudly an element grabs visual attention | **Focal Point & Hierarchy** | Color Harmony |
| Garment vertical split & silhouette volume | **Proportion & Silhouette** | Fit & Tailoring |
| Accessory count and leather/metal match | **Accessories & Footwear** | Focal Point |

---

## 4. Part B: Detailed Parameter Specifications (1 to 10)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: FOUNDATIONS (71 PTS)                    │
│  01. Fit & Tailoring (25 Pts)       04. Color Harmony (10 Pts)         │
│  02. Proportion & Silhouette (16)   05. Style Cohesion (8 Pts)         │
│  03. Occasion Appropriateness (12)                                     │
├────────────────────────────────────────────────────────────────────────┤
│                        TIER 2: DETAILS (20 PTS)                        │
│  06. Fabric, Texture & Condition (8) 08. Grooming & Presentation (5)   │
│  07. Accessories & Footwear (7 Pts)                                    │
├────────────────────────────────────────────────────────────────────────┤
│                     TIER 3: EXPERT POLISH (9 PTS)                      │
│  09. Focal Point & Visual Hierarchy (5 Pts)                            │
│  10. Originality & Personal Expression (4 Pts)                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Parameter 1: Fit & Tailoring (25 Pts)
- **Engine Constant:** $\beta = 0.15$
- **Critical Flaw Cap:** If F1, F2, or F5 $\le 2 \implies R \le 5.0$
- **Points Formula:** $\text{Points} = R \times 2.5$
- **Master Cap Trigger:** If Fit $R < 4.0$, final Style Score capped at $70$.

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **F1** | Shoulder alignment | 20 | Seam offset vs. shoulder edge. $2\text{--}4\%$ offset (Minor $-1.0$), $4\text{--}8\%$ (Mod $-2.5$), $>8\%$ (Major $-4.5$). Collar must sit flush. |
| **F2** | Chest & torso fit | 16 | Button pull $X$-wrinkles, gaping, excess side seam pinch. $2\text{--}3\text{ cm}$ (Minor $-1.0$), $3\text{--}5\text{ cm}$ (Mod $-2.5$), $>5\text{ cm}$ or strain (Major $-4.5$). |
| **F3** | Waist, rise & seat | 14 | Waistband gap/digging, seat pulling or sagging, thigh tightness. If obscured by hand/bag, $V = 0.5$. |
| **F4** | Length & break | 14 | Trouser hem break, jacket/kurta hem length. Minor break mismatch ($-1.0$), puddling/shin gap ($-2.5$), dragging ($-4.5$). |
| **F5** | Drape & fabric behavior | 14 | Unbroken vertical fall. One faint fold ($-1.0$), repeated pull lines ($-2.5$), strong $X$-creases/twisting ($-4.5$). |
| **F6** | Sleeve length & width | 12 | Cuff at wrist bone; jacket reveals $0.5\text{--}1.5\text{ cm}$ shirt cuff. $1\text{--}2\text{ cm}$ off ($-1.0$), $2\text{--}3.5\text{ cm}$ off ($-2.5$), $>3.5\text{ cm}$ off ($-4.5$). |
| **F7** | Alteration quality | 10 | Taper, jacket balance, back-collar roll, signs of intentional tailored finish vs. borrowed off-the-rack look. |

---

### Parameter 2: Proportion & Silhouette (16 Pts)
- **Engine Constant:** $\beta = 0.10$
- **Critical Flaw Cap:** If PR1 or PR2 $\le 2 \implies R \le 5.5$
- **Points Formula:** $\text{Points} = R \times 1.6$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **PR1** | Vertical split ratio | 25 | $s = \frac{\text{Shoulder to Waist/Hem}}{\text{Shoulder to Floor}}$. Ideal band: $[0.33, 0.42]$ ($1:2$ to $2:3$). Let $d = \max(0, 0.33 - s, s - 0.42)$. $d \le 0.02 \to 0$; $0.02 < d \le 0.04 \to -1.0$; $0.04 < d \le 0.07 \to -2.5$; $d > 0.07 \to -4.5$. Kurta band: $[0.45, 0.60]$. |
| **PR2** | Volume balance | 25 | Volume matrix: F-F, F-R, F-L, F-O, R-R, R-L $= 0$; R-O, L-L $= -1.0$; L-O $= -2.5$; O-O $= -4.5$. Coordinated streetwear intent halves penalty. |
| **PR3** | Body-line definition | 20 | Visible waist, rise, or taper line. Waist hidden by untucked hem ($-1.0$ to $-2.5$); no visible line at all ($-2.5$). |
| **PR4** | Layering structure | 15 | Layer hems within $1\text{ cm}$ near miss ($-1.0$); competing collars ($-1.0$ each); bulky torso ($-2.5$). **If no layers, $V = 0$ (excluded & renormalised)**. |
| **PR5** | Cut-to-frame compatibility | 15 | Evaluates if necklines, hem placements, and rises flatter the wearer's natural frame. |

---

### Parameter 3: Occasion Appropriateness (12 Pts)
- **Engine Constant:** $\beta = 0.20$
- **Critical Flaw Cap:** If OC1 $\le 3$ or hard violation in OC2/OC4 $\implies R \le 3.9$
- **Points Formula:** $\text{Points} = R \times 1.2$
- **Master Cap Trigger:** If Occasion $R < 4.0$, final Style Score capped at $65$.

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **OC1** | Formality-level match | 35 | Outfit $\text{FL} = 0.35\cdot\text{top} + 0.30\cdot\text{bottom} + 0.20\cdot\text{shoe} + 0.15\cdot\text{outer}$. Target range $[\text{Lo}, \text{Hi}]$. $g_{\text{under}} = \max(0, \text{Lo} - \text{FL})$, $g_{\text{over}} = \max(0, \text{FL} - \text{Hi})$. $\text{Raw} = \max(0, 10 - 2.5\cdot g_{\text{under}} - 1.8\cdot g_{\text{over}})$. |
| **OC2** | Dress-code compliance | 20 | Hard violation (code plainly broken) $-4.5$; soft violation $-1.5$. If no explicit code, $V = 0.5$ (neutral prior). |
| **OC3** | Climate, season & daylight | 15 | Fabric weight vs. weather; daylight-inappropriate heavy sparkle or evening satin. |
| **OC4** | Cultural & venue etiquette | 20 | Coverage norms, ceremonial color significance, venue customs. Hard breach $-4.5$. |
| **OC5** | Activity practicality | 10 | Ergonomic movement, sitting, dancing, and walkability for the target setting. |

---

### Parameter 4: Color Harmony (10 Pts)
- **Engine Constant:** $\beta = 0.10$
- **Critical Flaw Cap:** If CH1 $\le 2 \implies R \le 5.5$
- **Points Formula:** $\text{Points} = R \times 1.0$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **CH1** | Palette logic | 30 | Group chromatic colors into hue groups within $30^\circ$ ($H$). $H \le 1 \to 0$; $H = 2$ analogous ($\le 60^\circ$) or complementary ($155^\circ\text{--}205^\circ$) $\to 0$; other $H=2 \to -1.0$; $H=3$ triadic/split $\to 0$, other $H=3 \to -2.5$; $H \ge 4 \to -4.5$. |
| **CH2** | Colour count & distribution | 20 | $2\text{--}3$ main colors or neutral base $+ 1$ accent $\to 0$; $4$ colors $\to -1.0$; $5$ colors $\to -2.5$; $6+$ colors $\to -4.5$. Two saturated colors ($C^* > 45$) competing at $50/50$ area $\to -2.5$. |
| **CH3** | Contrast, value & near-miss | 20 | Near-miss: two large garments with $\Delta E_{2000} \in [5, 12]$ in different color families (e.g. black vs. dark navy) $\to -2.5$. Muddy palette with no light/dark anchor $\to -1.0$. |
| **CH4** | Skin-tone compatibility | 30 | Evaluates near-face garments vs. skin $L^*$ and undertone hue $h^*$. Washout ($\Delta L^* < 10, C^* < 25$) $\to -2.5$; temperature clash $\to -1.0$. If face not in frame, $V = 0$. |

---

### Parameter 5: Style Cohesion (8 Pts)
- **Engine Constant:** $\beta = 0.10$
- **Critical Flaw Cap:** If SC1 $\le 3 \implies R \le 5.5$
- **Points Formula:** $\text{Points} = R \times 0.8$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **SC1** | Archetype consistency | 35 | Dominant archetype $D$. Cohesion $C = \sum w_i \cdot \text{compat}(\text{item}_i, D)$. Compatibility: Same $= 1.0$, Neighbor $= 0.7$, Distant $= 0.4$, Clash $= 0.0$. $\text{Raw} = 10 \cdot \text{clamp}\left(\frac{C - 0.30}{0.70}, 0, 1\right)$. |
| **SC2** | Formality consistency | 25 | $\text{Spread} = \max(\text{FL}) - \min(\text{FL})$ across pieces. $\text{Raw} = \max(0, 10 - 2.0 \cdot \max(0, \text{Spread} - 1))$. High-low bridge halves penalty. |
| **SC3** | Pattern & detail language | 15 | $>2$ patterns ($-2.5$); two patterns competing at identical scale ($-2.5$); $>2$ prominent logos ($-1.0$). |
| **SC4** | Vibe clarity | 15 | Clarity confidence $p$: $p \ge 0.70 \to 0$; $0.55\text{--}0.70 \to -1.0$; $0.40\text{--}0.55 \to -2.5$; $< 0.40 \to -4.5$. |
| **SC5** | Intended-vibe match | 10 | Match between user intended vibe and detected archetype. If unstated, $V = 0.5$. |

---

### Parameter 6: Fabric, Texture & Condition (8 Pts)
- **Engine Constant:** $\beta = 0.15$
- **Critical Flaw Cap:** If FT2 $\le 3 \implies R \le 6.0$
- **Points Formula:** $\text{Points} = R \times 0.8$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **FT1** | Material quality (appearance) | 25 | Visual cloth weight. Cheap synthetic sheen on formal piece ($-2.5$); flimsy rippling ($-2.5$); unintended sheer or peeling print ($-4.5$). |
| **FT2** | Condition & care | 30 | Wrinkled surface area ($5\text{--}15\% \to -1.0$, $15\text{--}30\% \to -2.5$, $>30\% \to -4.5$); visible stains, pilling, holes, or frayed threads. |
| **FT3** | Texture mixing & depth | 20 | Distinct texture families $t$: $t \in [2, 3] \to 0$; $t = 1$ with no depth $\to -1.0$; $t = 4 \to -1.0$; $t \ge 5 \to -2.5$. Two clashing statement textures $\to -2.5$. |
| **FT4** | Season-signal harmony | 15 | Summer-coded (linen, voile) vs. winter-coded (wool, tweed, heavy fleece) clash in core outfit ($-2.5$). |
| **FT5** | Structure & finish | 10 | Soft sagging collar where crispness expected, unpressed seams, loose buttons, misaligned stripes at seam lines ($-1.0$ to $-2.5$). |

---

### Parameter 7: Accessories & Footwear (7 Pts)
- **Engine Constant:** $\beta = 0.15$
- **Critical Flaw Cap:** If AF1 $\le 3 \implies R \le 5.5$
- **Points Formula:** $\text{Points} = R \times 0.7$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **AF1** | Footwear suitability & condition | 30 | Formality gap $g = |\text{FL}_{\text{shoe}} - \text{FL}_{\text{core}}|$. $\text{Penalty} = 2.0 \cdot \max(0, g - 1)$. Physical scuffs, dirt, or worn soles ($-1.0$ to $-2.5$). **If shoes cut off, $V = 0$ (excluded & renormalised)**. |
| **AF2** | Coordination (leather, metal, colour) | 30 | Formal belt & shoe leather mismatch $\Delta E_{2000} > 20 \to -2.5$. 3 metal tones $\to -1.0$; 4+ metal tones $\to -2.5$ (bridging piece halves penalty). Bag formality mismatch $\to -2.5$. |
| **AF3** | Quantity & balance | 25 | Count $N_{\text{acc}}$ (excluding shoes/belt). Expected: Casual $\le 3$ ($0\text{--}3$), Smart Casual $4\text{--}6$ ($1\text{--}4$), Formal $\ge 7$ ($2\text{--}5$). Each item outside range costs $-1.0$. |
| **AF4** | Scale & placement | 15 | Watch case width vs. wrist outside $[0.55, 0.80] \to -1.0$; necklace colliding with collar neckline $\to -1.0$; strap cutting silhouette awkwardly $\to -1.0$. |

---

### Parameter 8: Grooming & Presentation (5 Pts)
- **Engine Constant:** $\beta = 0.10$
- **Fairness Rules:** Evaluates styling *choices* only. Never penalizes natural skin texture, acne, scars, natural hair texture, body shape, turbans, hijabs, or disability posture.
- **Points Formula:** $\text{Points} = R \times 0.5$

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **GP1** | Hair styling & neatness | 25 | Intentional styling, neat perimeter lines. Unintentionally unkempt $-2.5$; flyaways $-1.0$; black-tie formality clash $-2.5$. Head coverings scored solely on neat pinning/tying. |
| **GP2** | Facial grooming | 20 | Clean shave lines, deliberate stubble, makeup blending lines. Visible unblended foundation edge $-1.0$ to $-2.5$. No makeup earns $10.0$. |
| **GP3** | Cleanliness & neatness | 15 | Clean hands, nail grooming ($-1.0$ to $-2.5$ for chipped paint/dirt). |
| **GP4** | Posture alignment | 25 | Measured from MediaPipe keypoints: Shoulder tilt ($>2^\circ \to -1.0, >4^\circ \to -2.5, >7^\circ \to -4.5$); Spine lean ($>3^\circ \to -1.0, >6^\circ \to -2.5, >10^\circ \to -4.5$); Head forward offset ($>5\% \to -1.0, >10\% \to -2.5$). Contrapposto pose $= 0$. |
| **GP5** | Visible ease & comfort | 15 | Tugging garment, defensive arm hunching. Single photo always $V \le 0.5$, pulled to $7.0$. |

---

### Parameter 9: Focal Point & Visual Hierarchy (5 Pts)
- **Engine Constant:** $\beta = 0.10$
- **Points Formula:** $\text{Points} = R \times 0.5$

#### Element Salience Metric ($S$)
For every garment, accessory, and embellishment covering $\ge 1\%$ area:
$$S = 0.35c + 0.25v + 0.20a + 0.10x + 0.10p$$
- $c$: Color contrast vs. outfit mean ($\min(1, \Delta E_{2000} / 40)$)
- $v$: Intensity ($\min(1, C^* / 70) + 0.3$ if metallic/glossy)
- $a$: Area share ($\min(1, \text{area} / 0.30)$)
- $x$: Complexity ($0$ for solid, up to $1$ for intricate pattern/embroidery)
- $p$: Position weight ($1.0$ face/upper torso, $0.8$ waist/mid, $0.6$ hips/thighs, $0.5$ shoes)

Let $S_1 = \max(S)$, runner-up $S_2$, margin $M = S_1 - S_2$, competitors $K = \text{count}(S_i \ge 0.6 \cdot S_1)$.

| ID | Sub-factor | Weight ($W$) | Measurement & Inspection Logic |
|---|---|---|---|
| **FP1** | Hero presence | 35 | $S_1 \ge 0.60 \to 10.0$; $S_1 \in [0.45, 0.60) \to 8.0$; $S_1 \in [0.35, 0.45) \to 6.0$. If $S_1 < 0.35$ (quiet outfit path), $\text{FP1} = 7.0$ if tonal & cohesive, else $4.0$. |
| **FP2** | Competition control | 25 | $\text{Raw} = 10.0 - \text{pen}(M) - 1.5 \cdot \max(0, K - 1)$. $M \ge 0.20 \to 0$; $M \in [0.10, 0.20) \to -1.0$; $M \in [0.05, 0.10) \to -2.5$; $M < 0.05 \to -4.5$. |
| **FP3** | Placement & eye path | 20 | Hero in lower half pulling gaze from face ($-1.0$); $4\text{--}5$ salience peaks along vertical axis ($-1.0$); $6+$ peaks scattered eye path ($-2.5$). |
| **FP4** | Support harmony | 20 | Hero color/motif echoed in supporting element ($\Delta E_{2000} \le 15$); supporting pieces not overly muted ($S \ge 0.15$). |

---

### Parameter 10: Originality & Personal Expression (4 Pts)
- **Model Type:** Credit Model (Earned rather than deducted).
- **Baseline:** Competent, safe standard styling starts at $5.0$.
- **Points Formula:** $\text{Points} = R \times 0.4$

$$R = \text{clamp}\left(5.0 + \text{Gate} \cdot \min\left(5.0, \sum \text{Credits}\right) - \sum \text{Penalties}, 3.0, 10.0\right)$$

#### Execution Gate
$$\text{Gate} = \begin{cases} 1.0 & \text{if Fit } R \ge 5.0 \text{ and Style Cohesion } R \ge 6.0 \\ 0.5 & \text{otherwise (creative risks without good execution receive half credit)} \end{cases}$$

#### Earned Credits List
- **Signature Detail (+1.0 each, max +2.0):** Heirloom jewelry, handmade embroidery, vintage watch, personal motif.
- **Unexpected Pairing That Works (+1.5):** Cross-archetype piece passing the high-low bridge test.
- **Considered Color/Texture Play (+1.0):** Intentional palette play beyond safe neutral defaults (with Color $R \ge 7$).
- **Styling Technique (+1.0, or +1.5 for two+):** French tuck, barrel cuff, personalized dupatta/stole drape, asymmetrical knot.
- **Modern Heritage Reinterpretation (+1.0):** Styling traditional ethnic garments with contemporary tailoring.
- **Trend Piece with Personal Twist (+0.5):** Current silhouette adapted to personal identity.

#### Deductions List
- **Template Look ($-1.5$):** Direct copy of a mannequin or store catalogue look with zero personal input.
- **Generic ($-1.0$):** Unstyled basics only, zero non-functional accessories, zero styling technique.
*(Deductions waived if user indicates a uniform or strict dress code applies).*

---

## 5. Part C: Master Assembly, Master Caps & Optimization

### C1. Master Computation Sequence

Dependencies require computing parameters in exact sequence:
1. Multi-pose foreground isolation & 33 landmark extraction
2. CIELAB/LCH color clustering & luminance zone calculation
3. Parameter 1: **Fit & Tailoring**
4. Parameter 2: **Proportion & Silhouette**
5. Parameter 4: **Color Harmony**
6. Parameter 6: **Fabric, Texture & Condition**
7. Parameter 7: **Accessories & Footwear**
8. Parameter 8: **Grooming & Presentation**
9. Parameter 5: **Style Cohesion** (Depends on garment tags & archetype distribution)
10. Parameter 3: **Occasion Appropriateness** (Depends on composite formality FL)
11. Parameter 9: **Focal Point & Hierarchy** (Depends on color contrast & cohesion)
12. Parameter 10: **Originality & Expression** (Depends on Fit $R$ and Cohesion $R$ for execution gate)

---

### C2. Master Aggregation, Master Caps & CSI

1. **Style Score:**
   $$\text{StyleScore} = 100 \times \frac{\sum_{p \in \text{Active}} \text{Points}_p}{\sum_{p \in \text{Active}} \text{MaxPts}_p}$$
   Automatically renormalises if Grooming or Originality is marked N/A.

2. **Master Style Caps:**
   $$\text{If Fit } R < 4.0 \implies \text{StyleScore} = \min(\text{StyleScore}, 70.0)$$
   $$\text{If Occasion } R < 4.0 \implies \text{StyleScore} = \min(\text{StyleScore}, 65.0)$$
   *(If both caps trigger, the lower cap of $65.0$ wins).*

3. **Client Sartorial Index (CSI):**
   $$\text{CSI} = \text{round}\left(\frac{\text{StyleScore}}{10}, 1\right)$$

4. **Overall Confidence:**
   $$\text{Confidence}_{\text{overall}} = \frac{\sum_{p=1}^{10} \text{MaxPts}_p \cdot \text{Confidence}_p}{100}$$
   - $\ge 0.80$: **High** (Certified score)
   - $0.50\text{--}0.79$: **Medium** (Note on partially obscured sub-factors)
   - $< 0.50$: **Low (Provisional)** (Advises uploading a cleaner front-facing photo)

---

### C3. Top Quick Fix Value Calculation ($\Delta\text{Points}$)

The engine evaluates every sub-factor with defects to find the single highest-yield styling improvement:

$$\Delta\text{Points} \approx (1 - \beta) \cdot \Delta\text{Rating} \cdot \left(\frac{W_i}{\sum W}\right) \cdot \left(\frac{\text{MaxPts}}{10}\right) + \begin{cases} \beta \cdot \Delta\text{Lowest} \cdot \left(\frac{\text{MaxPts}}{10}\right) & \text{if sub-factor was the weakest link} \\ 0 & \text{otherwise} \end{cases}$$

The action producing $\max(\Delta\text{Points})$ is featured as the **Top Quick Fix** on the user's score dashboard.

---

### C4. Verified Reference Implementation (TypeScript & Python)

```typescript
// Shared Engine Evaluation Engine
function runEngine(cfg: EngineConfig, factors: Record<string, FactorInput>): EngineResult {
  const rated: Record<string, { adjusted: number; w: number; raw: number; defects: number[]; note: string; fixAction?: string }> = {};
  let confNum = 0;
  const totalW = Object.values(cfg.W).reduce((a, b) => a + b, 0);

  for (const [k, w] of Object.entries(cfg.W)) {
    const f = factors[k] || { V: 0, defects: [] };
    const V = f.V;
    confNum += w * V;
    if (V === 0) continue; // Exclude and renormalise remaining weights

    const raw = typeof f.raw === 'number'
      ? f.raw
      : Math.max(0, 10 - (f.defects || []).reduce((sum, s) => sum + (PENALTY[s] ?? 0), 0));
    const adjusted = V * raw + (1 - V) * PRIOR;
    rated[k] = { adjusted, w, raw, defects: f.defects || [], note: f.note || '', fixAction: f.fixAction };
  }

  const ratedValues = Object.values(rated);
  if (ratedValues.length === 0) return { R: 7.0, points: 7.0 * (cfg.max / 10), confidence: 0, subfactors: [] };

  const wsum = ratedValues.reduce((acc, v) => acc + v.w, 0);
  const WA = ratedValues.reduce((acc, v) => acc + v.adjusted * v.w, 0) / wsum;
  const lowest = Math.min(...ratedValues.map((v) => v.adjusted));
  let R = (1 - cfg.beta) * WA + cfg.beta * lowest;

  // Critical-flaw caps
  for (const [keys, thr, cap] of cfg.crit) {
    if (keys.some((k) => rated[k] && rated[k].raw <= thr)) R = Math.min(R, cap);
  }

  // Hard violations
  if (cfg.hard) {
    for (const k of cfg.hard) {
      if (rated[k] && rated[k].defects.includes(3)) R = Math.min(R, 3.9);
    }
  }

  const confidence = confNum / totalW;
  const points = Math.round((R * (cfg.max / 10)) * 10) / 10;
  return { R: Math.round(R * 100) / 100, points, confidence: Math.round(confidence * 100) / 100, subfactors: [] };
}
```

---

### C5. End-to-End Worked Verification Example

Verified live test using an uploaded portrait:

| Parameter | Rating ($R$) | Max Pts | Points Awarded | Key Inspection Note |
|---|---|---|---|---|
| **01. Fit & Tailoring** | 8.86 / 10 | 25 | **22.2** | Minor shoulder seam tilt, clean body-skimming torso |
| **02. Proportion & Silhouette** | 9.77 / 10 | 16 | **15.6** | Split ratio in golden band ($0.42$), balanced volume |
| **03. Occasion Appropriateness** | 9.28 / 10 | 12 | **11.1** | Formality FL $4.8$ aligned with social/smart casual |
| **04. Color Harmony** | 9.45 / 10 | 10 | **9.5** | Complementary color harmony, clean value contrast |
| **05. Style Cohesion** | 9.19 / 10 | 8 | **7.4** | Strong Smart Casual archetype consistency |
| **06. Fabric, Texture & Condition** | 9.77 / 10 | 8 | **7.8** | Natural texture depth, pristine care condition |
| **07. Accessories & Footwear** | 9.59 / 10 | 7 | **6.7** | Coordinated hardware tones, balanced count |
| **08. Grooming & Presentation** | 9.19 / 10 | 5 | **4.6** | Poised spine alignment, intentional hair styling |
| **09. Focal Point & Hierarchy** | 9.56 / 10 | 5 | **4.8** | Dominant upper hero piece, clear gaze trajectory |
| **10. Originality & Expression** | 7.00 / 10 | 4 | **2.8** | Gate $1.0\times$ unlocked, subtle styling flair |
| **TOTAL** | — | **100** | **92.5 / 100** | **Editorial / Iconic Level** |

- **Style Score:** `92.5 / 100 Pts`
- **CSI:** `9.3 / 10`
- **Overall Confidence:** `High (96%)`
- **Top Quick Fix:** *Align jacket/shirt shoulder seam flush to natural shoulder edge (+1.5 pts in Fit & Tailoring)*
- **Master Caps:** None triggered (Fit $R = 8.86 > 4.0$, Occasion $R = 9.28 > 4.0$).

---

### C6. Limitations, Fairness Constraints & Safeguards

1. **Camera Perspective & Lighting:** Single photographs approximate 3D tailoring via 2D projections. Whenever camera tilt, harsh shadows, or partial cropping occur, the algorithm lowers $V$ and pulls estimates toward neutral $7.0$.
2. **Body & Identity Invariance:** Gabru rates clothing and styling choices only. It contains **zero algorithms** evaluating body shape, weight, age, skin color, facial beauty, disability, or religious dress. Turbans, hijabs, and head coverings are scored strictly on neatness of tying.
3. **Reproducibility:** The algorithm contains zero stochastic functions in final evaluation. Uploading the identical image file at any time produces the exact same score, sub-factors, and recommendations.
