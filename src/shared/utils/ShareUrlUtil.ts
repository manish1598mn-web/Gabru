/**
 * GABRU — SHARE & PLATFORM REACH UTILITY
 * 
 * Provides canonical URLs, formatted viral share copy, and cross-platform
 * sharing orchestration to maximize organic reach when users export or share their cards.
 */

export interface FeatureShareConfig {
  featureName: string;
  path: string;
  scoreText: string;
  verdictText?: string;
  ctaText: string;
}

/**
 * Returns the canonical platform URL for any feature route.
 * In production, it dynamically resolves to the active origin (or https://gabru.online).
 */
export function getPlatformShareUrl(path: string = ''): string {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  if (typeof window !== 'undefined' && window.location.origin) {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      return `${window.location.origin}${cleanPath}`;
    }
  }
  return `https://gabru.online${cleanPath}`;
}

/**
 * Builds formatted viral share title, copy text with link, and destination URL.
 */
export function buildViralSharePayload(config: FeatureShareConfig): {
  title: string;
  text: string;
  url: string;
} {
  const url = getPlatformShareUrl(config.path);
  const title = `Gabru ${config.featureName} • ${config.scoreText}`;
  const verdictSnippet = config.verdictText ? ` (${config.verdictText})` : '';
  const text = `${config.scoreText}${verdictSnippet} on Gabru. ${config.ctaText}: ${url}`;

  return { title, text, url };
}

/**
 * Executes cross-platform share:
 * 1. Tries native Web Share API with image file + url + text.
 * 2. If unsupported or cancelled, falls back to copying text with link to clipboard.
 */
export async function executeViralShare(
  payload: { title: string; text: string; url: string },
  imageBlob?: Blob | null,
  fileName?: string
): Promise<{ sharedViaNative: boolean; copiedToClipboard: boolean }> {
  // 1. Try native Web Share API with image file and link
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    imageBlob &&
    fileName &&
    navigator.canShare
  ) {
    try {
      const file = new File([imageBlob], fileName, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url,
          files: [file],
        });
        return { sharedViaNative: true, copiedToClipboard: false };
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        return { sharedViaNative: false, copiedToClipboard: false };
      }
      console.warn('Native file share failed, falling back to clipboard copy:', err);
    }
  }

  // 2. Try native Web Share API without file if files not supported
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return { sharedViaNative: true, copiedToClipboard: false };
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        return { sharedViaNative: false, copiedToClipboard: false };
      }
      console.warn('Native text share failed, falling back to clipboard copy:', err);
    }
  }

  // 3. Fallback: Copy link and viral text to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(payload.text);
      return { sharedViaNative: false, copiedToClipboard: true };
    } catch (clipErr) {
      console.warn('Clipboard writeText failed:', clipErr);
    }
  }

  return { sharedViaNative: false, copiedToClipboard: false };
}

