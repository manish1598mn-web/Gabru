'use client';

import React from 'react';
import { BaseModal } from '../ui/BaseModal';

export interface ScientificMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificMethodologyModal: React.FC<ScientificMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Aesthetic & Scientific Methodology"
      maxWidth="580px"
    >
      <div className="governance-modal-body">
        {/* Hero Highlight */}
        <div className="governance-highlight-card highlight-math">
          <span className="gov-icon" aria-hidden="true">📐</span>
          <div>
            <strong>Renaissance Canons &amp; Geometry in Code</strong>
            <p>
              How classical art history, tailoring proportions, and computer vision geometry are translated into transparent aesthetic benchmarks.
            </p>
          </div>
        </div>

        {/* 4 Bite-Sized Cards */}
        <div className="gov-cards-grid">
          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">📏</span>
              <h4 className="gov-card-title">Golden Ratio &amp; Thirds</h4>
            </div>
            <p className="gov-card-text">
              Measures balance inspired by Leonardo da Vinci&apos;s classical proportion studies. Adherence is computed transparently:
            </p>
            <div className="gov-formula-chip">
              Match % = (Measured / 1.618) &times; 100
            </div>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🎯</span>
              <h4 className="gov-card-title">Controllable Levers (~43 Pts)</h4>
            </div>
            <p className="gov-card-text">
              We isolate changeable traits (grooming, smile, posture, lighting) from fixed bone structure so suggestions stay constructive and fun.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">👔</span>
              <h4 className="gov-card-title">Sartorial Tailoring Rules</h4>
            </div>
            <p className="gov-card-text">
              Fit Check checks classic 8-head menswear and couture tailoring standards (shoulder seam drop, torso ratio, and trouser break).
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">⚖️</span>
              <h4 className="gov-card-title">Transparent 100-Pt Math</h4>
            </div>
            <p className="gov-card-text">
              Every parameter is mutually exclusive with zero double counting. Scored in real-time and renormalised directly on your device.
            </p>
          </div>
        </div>

        {/* Confidence Footer */}
        <div className="gov-footer-badge footer-badge-math">
          <span>⚜️ 100-Point Calibrated Scale · Open Math · Zero Double-Counting</span>
        </div>
      </div>
    </BaseModal>
  );
};
