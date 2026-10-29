/**
 * GABRU — SHARED MODULE BARREL EXPORT
 */

// Hooks
export { useScrollState } from './hooks/useScrollState';
export { useIntersectionReveal } from './hooks/useIntersectionReveal';
export { useNumberShuffle, type ShuffleItem } from './hooks/useNumberShuffle';
export { useClipboard, type UseClipboardResult } from './hooks/useClipboard';
export { useWebviewSafeNavigation, type UseWebviewSafeNavigationOptions } from './hooks/useWebviewSafeNavigation';

// Layout Components
export { AppNavbar, type AppNavbarProps } from './components/layout/AppNavbar';
export { AppFooter, type AppFooterProps } from './components/layout/AppFooter';

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
} from './components/ui';

// Utilities
export { drawRoundedRect, drawImageCover } from './utils/CanvasUtil';
export { rgbToLab, deltaE2000, rgbToHsl, type LabColor } from './utils/ColorSpaceUtil';
export { formatFileSize, clamp, roundTo } from './utils/FormatUtil';
