'use client';

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = '580px',
  children,
  footer,
  id,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    const previousActiveElement = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titleId = id ? `${id}-title` : undefined;
  const descId = id && subtitle ? `${id}-desc` : undefined;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      id={id}
    >
      <div
        ref={modalRef}
        className="modal-content focus-ring"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            {title && (
              <h3 className="modal-title" id={titleId}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="modal-subtitle" id={descId}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn-modal-close focus-ring touch-target"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-container">{children}</div>

        {/* Optional Sticky/Bordered Footer */}
        {footer && <div className="modal-footer-container">{footer}</div>}
      </div>
    </div>
  );
}
