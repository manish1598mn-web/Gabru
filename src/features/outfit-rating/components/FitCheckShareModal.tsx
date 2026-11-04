'use client';

/**
 * GABRU — FIT CHECK SHARE LIGHTBOX MODAL
 * 
 * Content-focused, frameless lightbox:
 * - Pure focus on the Sartorial Fit Check Share Card
 * - Zero outer modal border, zero header boxes, zero technical subtitle clutter
 * - Single clean action button to download the card
 */

import React, { useEffect } from 'react';
import { getPlatformShareUrl } from '@/shared';

export interface FitCheckShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGeneratingCard: boolean;
  generatedCardUrl: string | null;
  shareCardCopied: boolean;
  onShare: () => void;
  onDownload?: () => void;
}

export function FitCheckShareModal({
  isOpen,
  onClose,
  isGeneratingCard,
  generatedCardUrl,
  shareCardCopied,
  onShare,
  onDownload,
}: FitCheckShareModalProps) {
  // Lock scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="share-frameless-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sartorial Scorecard Preview"
      id="fit-check-share-modal"
    >
      <div
        className="share-frameless-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          className="share-frameless-close-btn focus-ring touch-target"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Card Stage — Pure Content Focus */}
        {isGeneratingCard || !generatedCardUrl ? (
          <div className="share-frameless-loading" aria-live="polite">
            <div className="share-spinner" />
            <p>Composing sartorial style card...</p>
          </div>
        ) : (
          <div className="share-frameless-card-stage">
            <img
              src={generatedCardUrl}
              alt="Gabru Social Media Outfit Scorecard"
              className="share-frameless-image"
              id="share-card-preview-img"
            />
          </div>
        )}

        {/* Action Group: Share Card & Link + Download PNG */}
        {!isGeneratingCard && generatedCardUrl && (
          <div className="share-action-group">
            <div className="share-frameless-action-bar">
              <button
                type="button"
                className="share-frameless-download-btn focus-ring tactile-press"
                onClick={onShare}
                id="btn-share-with-friends"
                title="Share card with platform URL auto-attached"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>{shareCardCopied ? 'Link Copied to Clipboard!' : 'Share Card & Link'}</span>
              </button>

              <button
                type="button"
                className="share-frameless-secondary-btn focus-ring tactile-press"
                onClick={onDownload || onShare}
                id="btn-download-card-png"
                title="Download high-resolution 1080x1350 card"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download PNG</span>
              </button>
            </div>

            <span className="share-url-pill">
              🔗 Auto-attached: {getPlatformShareUrl('/')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
