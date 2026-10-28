'use client';

import { useState, useCallback } from 'react';

export interface UseClipboardResult {
  copiedText: string | null;
  copy: (text: string, durationMs?: number) => Promise<boolean>;
  isCopied: boolean;
}

/**
 * Provides robust clipboard copying with fallback support for non-secure contexts
 * and automated state resetting for toast notifications.
 */
export function useClipboard(): UseClipboardResult {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fallbackCopy = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const copy = useCallback(async (text: string, durationMs: number = 2000): Promise<boolean> => {
    let success = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(text),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 500)),
        ]);
        success = true;
      } catch {
        success = fallbackCopy(text);
      }
    } else {
      success = fallbackCopy(text);
    }

    if (success) {
      setCopiedText(text);
      setTimeout(() => {
        setCopiedText(null);
      }, durationMs);
    }

    return success;
  }, []);

  return {
    copiedText,
    copy,
    isCopied: copiedText !== null,
  };
}

