'use client';

/**
 * GABRU — HAND READING SHARE LIGHTBOX MODAL
 * 
 * Content-focused, frameless lightbox:
 * - Pure focus on the Palm Share Card
 * - Zero outer modal border, zero header boxes, zero technical subtitle clutter
 * - Single clean action button to download the card
 */

import React, { useEffect, useState } from 'react';
import { HandReadingResult } from '../types/HandReadingTypes';
import { generateHandShareCardCanvas } from '../utils/HandShareCardUtil';
import {
  buildViralSharePayload,
  executeViralShare,
  getPlatformShareUrl,
} from '@/shared';

export interface HandShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: HandReadingResult | null;
  userImageUri?: string;
}

export function HandShareModal({
  isOpen,
  onClose,
  result,
  userImageUri,
}: HandShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !result) {
      setDataUrl(null);
      return;
    }

    let isMounted = true;
    setIsGenerating(true);

    generateHandShareCardCanvas(result, userImageUri)
      .then((url) => {
        if (!isMounted) return;
        setDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate palm share card:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, result, userImageUri]);

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

  if (!isOpen || !result) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `gabru-palm-reading-${result.handType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWithFriends = async () => {
    if (!result || !dataUrl) return;

    const payload = buildViralSharePayload({
      featureName: 'Palm Prominence Reading',
      path: '/hand-reading',
      scoreText: `My palm prominence score is ${result.overallProminenceIndex}/100`,
      verdictText: `${result.handType.toUpperCase()} HAND`,
      ctaText: 'Scan your palm lines & mounts free',
    });

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const fileName = `gabru-palm-reading-${result.overallProminenceIndex}pts.png`;
      const shareResult = await executeViralShare(payload, blob, fileName);
      if (shareResult.copiedToClipboard || shareResult.sharedViaNative) {
        setShareCardCopied(true);
        setTimeout(() => setShareCardCopied(false), 3500);
      }
    } catch (err) {
      console.warn('Failed to share palm card:', err);
    }
  };

  return (
    <div
      className="share-frameless-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Palm Reading Share Card Preview"
      id="hand-share-modal"
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
        {isGenerating || !dataUrl ? (
          <div className="share-frameless-loading">
            <div className="share-spinner" />
            <p>Composing palm reading card...</p>
          </div>
        ) : (
          <div className="share-frameless-card-stage">
            <img
              src={dataUrl}
              alt="Gabru Palm Prominence Share Card"
              className="share-frameless-image"
              id="palm-share-card-image"
            />
          </div>
        )}

        {/* Action Group: Share Card & Link + Download PNG */}
        {!isGenerating && dataUrl && (
          <div className="share-action-group">
            <div className="share-frameless-action-bar">
              <button
                type="button"
                className="share-frameless-download-btn focus-ring tactile-press"
                onClick={handleShareWithFriends}
                id="btn-share-palm-with-friends"
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
                onClick={handleDownload}
                id="btn-download-share-card"
                title="Download high-resolution 1080x1920 (Story / 9:16) card"
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
              🔗 Auto-attached: {getPlatformShareUrl('/hand-reading')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
