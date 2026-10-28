'use client';

import React from 'react';

export interface FacialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGeneratingCard: boolean;
  generatedCardUrl: string | null;
  shareCardCopied: boolean;
  onShare: () => void;
}

/**
 * FacialShareModal
 *
 * 1080x1350 High-Resolution Social Media Beauty Scorecard Preview & Share modal:
 * - Floating glassmorphic close trigger
 * - Card generation spinner with step progression
 * - High-DPI canvas preview image
 * - Native Web Share API trigger with automated PNG download fallback
 */
export function FacialShareModal({
  isOpen,
  onClose,
  isGeneratingCard,
  generatedCardUrl,
  shareCardCopied,
  onShare,
}: FacialShareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay share-card-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="share-card-modal"
    >
      <div
        className="share-card-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimalist Floating Close Button */}
        <button
          type="button"
          className="share-card-floating-close"
          onClick={onClose}
          aria-label="Close"
          id="btn-close-share-modal"
        >
          &times;
        </button>

        {/* Modal Body: Card Preview */}
        <div className="share-card-modal-body">
          {isGeneratingCard || !generatedCardUrl ? (
            <div className="share-card-generating-box">
              <div className="share-card-spinner-ring" />
              <h4 className="generating-title">Generating Facial Style Card...</h4>
              <p className="generating-sub">
                Composing your portrait and 10-parameter attractiveness breakdown...
              </p>
            </div>
          ) : (
            <div className="share-card-preview-wrapper">
              <img
                src={generatedCardUrl}
                alt="Gabru Facial Beauty Scorecard"
                className="share-card-preview-img"
                id="share-card-preview-img"
              />
            </div>
          )}
        </div>

        {/* Modal Footer: Transparent Dual-Action Share Button */}
        <div className="share-card-modal-footer">
          {shareCardCopied && (
            <div className="share-feedback-toast">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Card Downloaded &amp; Ready to Share!</span>
            </div>
          )}

          <button
            type="button"
            className="btn-share-transparent"
            onClick={onShare}
            disabled={isGeneratingCard || !generatedCardUrl}
            id="btn-share-with-friends"
            title="Download card and share with friends"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

