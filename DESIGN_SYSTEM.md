# GABRU DESIGN SYSTEM (v1.0 Production)

## 1. Brand Vibe & Architectural Direction
**Core Aesthetic:** Clean, high-trust, tactile precision. Obsidian dark surfaces (`#09090b` / `#121217`) grounded in crisp 1px borders (`rgba(255, 255, 255, 0.08)`), subtle micro-glassmorphism, and a disciplined single-primary accent (**Royal Violet `#a855f7`**) reserved exclusively for the one primary action per screen.

---

## 2. Token Architecture (Source of Truth in `globals.css`)

### A. Surfaces
| Token | Value | Purpose |
|---|---|---|
| `--bg-background` | `#09090b` | Page root & outer canvas |
| `--bg-surface-elevated` | `#121217` | Primary content cards, hero studios, scorecards |
| `--bg-surface-muted` | `#181822` | Inner nested cards, code blocks, parameter bars |
| `--bg-surface-glass` | `rgba(255, 255, 255, 0.04)` | Translucent overlays & hover states |
| `--bg-surface-glass-hover`| `rgba(255, 255, 255, 0.07)` | Interactive card/row hover surface |

### B. Borders & Dividing Strokes
| Token | Value | Purpose |
|---|---|---|
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card boundary & grid line |
| `--border-muted` | `rgba(255, 255, 255, 0.14)` | Hover highlight & focused input boundary |
| `--border-focus` | `#a855f7` | Active selection, tab indicator, keyboard focus |

### C. Text & Readability Hierarchy
| Token | Value | Purpose |
|---|---|---|
| `--text-primary` | `#ffffff` | Page titles, key scores, primary button text |
| `--text-secondary` | `rgba(255, 255, 255, 0.72)` | Descriptions, card headers, body copy |
| `--text-muted` | `rgba(255, 255, 255, 0.48)` | Subfactor codes, timestamps, footnote specs |
| `--text-inverse` | `#09090b` | Text on solid light backgrounds |

### D. Single Primary Accent
| Token | Value | Purpose |
|---|---|---|
| `--accent-primary` | `#a855f7` | The single primary filled CTA per view (max 10% screen) |
| `--accent-primary-hover` | `#9333ea` | Hover state for primary CTA |
| `--accent-subtle` | `rgba(168, 85, 247, 0.12)` | Active tab pills, badge backgrounds |

### E. Semantic Status Tokens
| State | Text / Icon | Surface Background | Subtle Border |
|---|---|---|---|
| **Success** | `#10b981` | `rgba(16, 185, 129, 0.12)` | `rgba(16, 185, 129, 0.28)` |
| **Warning** | `#f59e0b` | `rgba(245, 158, 11, 0.12)` | `rgba(245, 158, 11, 0.28)` |
| **Destructive**| `#ef4444` | `rgba(239, 68, 68, 0.12)` | `rgba(239, 68, 68, 0.28)` |
| **Info** | `#06b6d4` | `rgba(6, 182, 212, 0.12)` | `rgba(6, 182, 212, 0.28)` |

---

## 3. Spatial & Geometric Discipline

### A. Border Radii
- **Outer Containers & Modals:** `12px` (`--radius-lg`)
- **Inner Cards, Inputs & Dropzones:** `8px` (`--radius-md`)
- **Compact Badges, Code Tags & Sub-elements:** `4px` or `6px` (`--radius-sm`)
- **Status Pills & Round Toggles:** `9999px` (`--radius-pill`)

### B. 4px / 8px Spacing Rhythm
All margins, paddings, and gaps must strictly draw from:
`4px (0.5), 8px (1), 12px (1.5), 16px (2), 20px (2.5), 24px (3), 32px (4), 48px (6), 64px (8)`.

### C. Typography & Tabular Numerals
- **Hierarchy:**
  - Page Title: `clamp(28px, 4vw, 42px)` | SemiBold 700
  - Section Header: `20px` to `24px` | SemiBold 600
  - Body: `14px` to `15px` | Regular 400
  - Caption / Label: `11px` to `12.5px` | Medium 500
- **Tabular Numbers:** Every numerical readout (scores, timestamps, percentages, counters, LUFS) **MUST** use `font-variant-numeric: tabular-nums` or `font-tabular-nums` class to eliminate visual jitter.

---

## 4. Component Primitives Standards (`src/shared/components/ui/`)

1. **`<Button>`:**
   - Variants: `primary` (solid violet), `secondary` (subtle glass), `outline` (border stroke), `ghost` (text only).
   - Sizes: `sm` (36px, 12px font), `md` (44px touch target, 14px font), `lg` (48px, 15px font).
   - Built-in tactile press: `active:scale-[0.98]`.
   - Built-in accessibility: `focus-visible` high-contrast 2px offset ring.
   - Built-in `isLoading` state: Locks pointer-events, renders layout-matched inline spinner, prevents double-clicks.

2. **`<Card>`:**
   - Standardized surface with clean 1px border.
   - Variants: `default`, `elevated`, `interactive` (with subtle hover lift and border shift).

3. **`<Badge>`:**
   - Semantic color variants (`default`, `success`, `warning`, `destructive`, `info`).
   - Built-in `tabular-nums` for numeric indicators.

4. **`<Modal>`:**
   - Standardized dialog wrapper with focus-trap, ESC keyboard handler, backdrop-blur overlay, and explicit WCAG `role="dialog"` + `aria-modal="true"`.

5. **`<Skeleton>`:**
   - Layout-matched shimmer placeholder that prevents Cumulative Layout Shift (CLS) during ingestion and scoring pipelines.

---

## 5. Screen UX Rules (5-State Hardening)
1. **One Primary Action Rule:** Only one solid filled primary button per screen.
2. **Loading State:** Layout-matched skeleton shimmer instead of blank layout shifts.
3. **Empty State:** Intentional explanatory copy + contextual fallback icon + action trigger.
4. **Populated State:** Crisp visual scannability with subtle borders.
5. **Overflow State:** Truncate user-submitted strings (`min-w-0 text-truncate`), add deterministic image fallbacks (`onError`).
6. **Error State:** Human-readable recovery message + retry action.
