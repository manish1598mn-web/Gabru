'use client';

import React from 'react';
import { Modal, Button } from '@/shared';

export interface FitCheckShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGeneratingCard: boolean;
  generatedCardUrl: string | null;
  shareCardCopied: boolean;
  onShare: () => void;
}

export function FitCheckShareModal({
  isOpen,
  onClose,
  isGeneratingCard,
  generatedCardUrl,
  shareCardCopied,
  onShare,
}: FitCheckShareModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verified Sartorial Scorecard"
      subtitle="High-resolution 1080x1350 style card formatted for social export."
      maxWidth="540px"
      id="fit-check-share-modal"
      footer={
        <div className="share-modal-footer-flex">
          {shareCardCopied && (
            <div className="share-feedback-toast" role="status">
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
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="share-card-generating-box" aria-live="polite">
            <div className="share-card-spinner-ring" />
            <h4 className="generating-title">Generating Style Card...</h4>
            <p className="generating-sub">
              Composing your outfit photo and 10-parameter audit breakdown...
            </p>
          </div>
        ) : (
          <div className="share-card-preview-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedCardUrl}
              alt="Gabru Social Media Outfit Scorecard"
              className="share-card-preview-img"
              id="share-card-preview-img"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
