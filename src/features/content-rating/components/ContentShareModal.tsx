'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ContentScoreData } from '../types/ContentRatingTypes';
import {
  generateContentShareCard,
  downloadCanvasAsPng,
  copyCanvasToClipboard,
} from '../utils/ContentShareCardUtil';

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
  const [copied, setCopied] = useState(false);
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

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose} id="share-modal-overlay">
      <div
        className="share-modal-container"
        onClick={(e) => e.stopPropagation()}
        id="share-modal-container"
      >
        {/* Modal Header */}
        <div className="share-modal-header">
          <div className="share-modal-title-box">
            <div className="about-section-eyebrow">
              <span>EXPORT VERIFIED AUDIT</span>
            </div>
            <h3 className="share-modal-heading">High-Resolution Share Card (1080 &times; 1350)</h3>
            <p className="share-modal-sub">
              Instagram/Twitter 4:5 vertical portrait standard. Grounded in deterministic rubric standards.
            </p>
          </div>

          <button
            type="button"
            className="share-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="share-modal-body">
          {isGenerating && (
            <div className="share-card-loading">
              <div className="share-spinner" />
              <p>Rendering 1080 &times; 1350 audit card...</p>
            </div>
          )}

          {!isGenerating && dataUrl && (
            <div className="share-preview-card-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="Gabru Content Intelligence Audit Report"
                className="share-card-preview-image"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="share-modal-footer">
          <div className="share-footer-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>100% Client-Side Rendered • Private &amp; Watermarked</span>
          </div>

          <div className="share-footer-buttons">
            <button
              type="button"
              className={`btn-share-secondary ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={isGenerating || !dataUrl}
            >
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-share-primary"
              onClick={handleDownload}
              disabled={isGenerating || !dataUrl}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

