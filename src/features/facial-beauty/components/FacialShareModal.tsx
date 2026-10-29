'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';

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
 * - Unified accessible Modal primitive with escape handler and focus trapping
 * - Card generation spinner placeholder
 * - High-DPI canvas preview image
 * - Standardized primary action button
 */
export function FacialShareModal({
  isOpen,
  onClose,
  isGeneratingCard,
  generatedCardUrl,
  shareCardCopied,
  onShare,
}: FacialShareModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Facial Beauty Scorecard (1080 × 1350)"
      subtitle="High-resolution verified biometric breakdown optimized for 4:5 social cards."
      maxWidth="620px"
      id="share-card-modal"
      footer={
        <div className="share-modal-footer">
          {shareCardCopied && (
            <div className="share-feedback-toast">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Card Downloaded &amp; Ready to Share!</span>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={onShare}
            disabled={isGeneratingCard || !generatedCardUrl}
            id="btn-share-with-friends"
            title="Download card and share with friends"
            leftIcon={
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
            }
          >
            Download &amp; Share
          </Button>
        </div>
      }
    >
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
    </Modal>
  );
}
