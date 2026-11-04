/**
 * GABRU — SHARED MODULE BARREL EXPORT
 */

// Hooks
export { useScrollState } from './hooks/useScrollState';
export { useIntersectionReveal } from './hooks/useIntersectionReveal';
export { useNumberShuffle, type ShuffleItem } from './hooks/useNumberShuffle';
export { useClipboard, type UseClipboardResult } from './hooks/useClipboard';
export { useTheme, type Theme, type ResolvedTheme } from './hooks/useTheme';
export {
  useRealisticAnalysis,
  type StudioAnalysisType,
  type UseRealisticAnalysisOptions,
  type UseRealisticAnalysisReturn,
} from './hooks/useRealisticAnalysis';
export {
  useWebviewSafeNavigation,
  resolveNavDestination,
  type UseWebviewSafeNavigationOptions,
} from './hooks/useWebviewSafeNavigation';

// Layout Components
export { AppNavbar, type AppNavbarProps } from './components/layout/AppNavbar';
export { AppFooter, type AppFooterProps } from './components/layout/AppFooter';
export { StudioHeroBackdrop, type StudioHeroBackdropProps, type StudioBackdropType } from './components/layout/StudioHeroBackdrop';

// Standardized UI Primitives
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
  Card,
  type CardProps,
  type CardVariant,
  Badge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
  Skeleton,
  type SkeletonProps,
  Modal,
  type ModalProps,
  BaseModal,
  type BaseModalProps,
  ThemeToggle,
  type ThemeToggleProps,
  ScanningReticleOverlay,
  type ScanningReticleOverlayProps,
  GabruLogoIcon,
  type GabruLogoIconProps,
  CssInspectorCompanion,
} from './components/ui';

// Governance Modals
export {
  PrivacyPolicyModal,
  type PrivacyPolicyModalProps,
  TermsOfEvaluationModal,
  type TermsOfEvaluationModalProps,
  ScientificMethodologyModal,
  type ScientificMethodologyModalProps,
} from './components/modals';

// Utilities
export { drawRoundedRect, drawImageCover } from './utils/CanvasUtil';
export { rgbToLab, deltaE2000, rgbToHsl, type LabColor } from './utils/ColorSpaceUtil';
export { formatFileSize, clamp, roundTo } from './utils/FormatUtil';
export {
  getPlatformShareUrl,
  buildViralSharePayload,
  executeViralShare,
  type FeatureShareConfig,
} from './utils/ShareUrlUtil';
