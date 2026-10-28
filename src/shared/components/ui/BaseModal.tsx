'use client';

import React, { useEffect } from 'react';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: string;
  children: React.ReactNode;
  id?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  maxWidth = '540px',
  children,
  id,
}: BaseModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id={id}
    >
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              type="button"
              className="btn-close-modal"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        )}
        <div className="modal-body-container">{children}</div>
      </div>
    </div>
  );
}
