'use client';

import React from 'react';
import { BaseModal } from '../ui/BaseModal';

export interface TermsOfEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfEvaluationModal: React.FC<TermsOfEvaluationModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Evaluation & Entertainment Vibe"
      maxWidth="580px"
    >
      <div className="governance-modal-body">
        {/* Hero Highlight */}
        <div className="governance-highlight-card highlight-fun">
          <span className="gov-icon" aria-hidden="true">🎉</span>
          <div>
            <strong>Built for Entertainment &amp; Fun — Never to Hurt Feelings</strong>
            <p>
              Our platform is built for entertainment and fun, not to hurt anyone&apos;s feelings. This is the core vibe of Gabru! A playful sandbox to celebrate personal style and share laughs with friends.
            </p>
          </div>
        </div>

        {/* 4 Bite-Sized Cards */}
        <div className="gov-cards-grid">
          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🎭</span>
              <h4 className="gov-card-title">Pure Entertainment</h4>
            </div>
            <p className="gov-card-text">
              All ratings, ratios, and diagnostic scores are algorithmic simulations designed for creative curiosity, sharing with friends, and good energy.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">✨</span>
              <h4 className="gov-card-title">Beauty Has No Limits</h4>
            </div>
            <p className="gov-card-text">
              True human beauty, style, and charisma cannot be measured by a single number. Classical art formulas are historical curiosities, not definitions of worth.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🤝</span>
              <h4 className="gov-card-title">Positive Vibes Only</h4>
            </div>
            <p className="gov-card-text">
              Strict anti-bullying policy. Use these insights to boost self-esteem, enjoy playful comparisons with friends, and experiment with bold new aesthetics.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">💡</span>
              <h4 className="gov-card-title">Playful Style Tips</h4>
            </div>
            <p className="gov-card-text">
              Tips on lighting balance, tailoring drape, and color harmony are friendly styling suggestions—never medical, clinical, or personal judgment.
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
