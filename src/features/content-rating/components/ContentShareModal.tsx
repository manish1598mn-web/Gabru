'use client';

/**
 * GABRU — CONTENT RATING SHARE LIGHTBOX MODAL
 * 
 * Content-focused, frameless lightbox:
 * - Pure focus on the Content Share Card
 * - Zero outer modal border, zero header boxes, zero technical subtitle clutter
 * - Single clean action button to download the card
 */

import React, { useEffect, useState, useRef } from 'react';
import { ContentScoreData } from '../types/ContentRatingTypes';
import {
  generateContentShareCard,
  downloadCanvasAsPng,
} from '../utils/ContentShareCardUtil';
import {
  buildViralSharePayload,
  executeViralShare,
  getPlatformShareUrl,
} from '@/shared';

interface ContentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ContentScoreData | null;
}

export function ContentShareModal({
  isOpen,
  onClose,
  scoreData,
}: ContentShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [shareCardCopied, setShareCardCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !scoreData) {
      setDataUrl(null);
      canvasRef.current = null;
      return;
    }

    let isMounted = true;
    setIsGenerating(true);

    generateContentShareCard(scoreData)
      .then((canvas) => {
        if (!isMounted) return;
        canvasRef.current = canvas;
        setDataUrl(canvas.toDataURL('image/png'));
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate share card:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, scoreData]);

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

  if (!isOpen || !scoreData) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const safeTitle = (scoreData.item.title || 'audit')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    downloadCanvasAsPng(canvasRef.current, `gabru-content-audit-${safeTitle || 'report'}.png`);
  };

  const handleShareWithFriends = async () => {
    if (!scoreData || !canvasRef.current) return;

    const payload = buildViralSharePayload({
      featureName: 'Content Virality Audit',
      path: '/content-rating',
      scoreText: `My post scored ${scoreData.contentScore}/100`,
      verdictText: scoreData.verdictBadge,
      ctaText: 'Audit your post hook, retention & virality free',
    });

    canvasRef.current.toBlob(async (blob) => {
      const fileName = `gabru-content-audit-${scoreData.contentScore}pts.png`;
      const result = await executeViralShare(payload, blob, fileName);
      if (result.copiedToClipboard || result.sharedViaNative) {
        setShareCardCopied(true);
        setTimeout(() => setShareCardCopied(false), 3500);
      }
    }, 'image/png');
  };

  return (
    <div
      className="share-frameless-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Content Intelligence Share Card Preview"
      id="content-share-modal"
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
            <p>Composing content intelligence card...</p>
          </div>
        ) : (
          <div className="share-frameless-card-stage">
            <img
              src={dataUrl}
              alt="Gabru Content Intelligence Audit Report"
              className="share-frameless-image"
              id="content-share-card-image"
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
                id="btn-share-content-with-friends"
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
              🔗 Auto-attached: {getPlatformShareUrl('/content-rating')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
