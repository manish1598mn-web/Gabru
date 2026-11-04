'use client';

import React from 'react';
import { BaseModal } from '@/shared';

export interface FacialMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacialMethodologyModal: React.FC<FacialMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Gabru Facial Attractiveness Framework"
      maxWidth="580px"
    >
      <div className="governance-modal-body">
        {/* Hero Highlight */}
        <div className="governance-highlight-card highlight-fun">
          <span className="gov-icon" aria-hidden="true">🎉</span>
          <div>
            <strong>Built for Entertainment &amp; Fun — Never to Hurt Feelings</strong>
            <p>
              Our platform is built for entertainment and fun, not to hurt anyone&apos;s feelings. This is the core vibe of Gabru! We translate classical Renaissance art canons into an uplifting digital sandbox.
            </p>
          </div>
        </div>

        {/* 4 Bite-Sized Cards */}
        <div className="gov-cards-grid">
          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">📐</span>
              <h4 className="gov-card-title">10 Balanced Parameters</h4>
            </div>
            <p className="gov-card-text">
              Evaluates Neoclassical thirds, golden ratio (&phi; &asymp; 1.618), bilateral symmetry, eye aperture, and jawline definition on a 100-point scale.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🎯</span>
              <h4 className="gov-card-title">Controllable Levers First</h4>
            </div>
            <p className="gov-card-text">
              Suggestions isolate changeable cues (skin vitality, grooming, smile, and posture) from fixed bone structure so tips remain fun and actionable.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">📏</span>
              <h4 className="gov-card-title">Transparent Golden Ratio</h4>
            </div>
            <p className="gov-card-text">
              Proportions are compared against ideal &phi; = 1.618 with transparent math:
            </p>
            <div className="gov-formula-chip">
              Match % = (Measured / 1.618) &times; 100
            </div>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🔒</span>
              <h4 className="gov-card-title">100% In-Browser Privacy</h4>
            </div>
            <p className="gov-card-text">
              MediaPipe 468-point tracking runs completely inside your browser sandbox. Zero photos are sent to servers or saved in databases.
            </p>
          </div>
        </div>

        {/* Confidence Footer */}
        <div className="gov-footer-badge footer-badge-fun">
          <span>✨ Good Energy Only · Celebrate Your Unique Look · Share the Fun</span>
        </div>
      </div>
    </BaseModal>
  );
};
