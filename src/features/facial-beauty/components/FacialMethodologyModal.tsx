'use client';

import React from 'react';
import { BaseModal } from '@/shared';

export interface FacialMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * FacialMethodologyModal
 *
 * Explains the scientific governance, evidence allocation (Strong vs Moderate),
 * frontal renormalisation mathematics, and 100% private local processing.
 */
export const FacialMethodologyModal: React.FC<FacialMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Gabru Facial Attractiveness Framework"
      maxWidth="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', lineHeight: 1.6 }}>
        <p>
          <strong>Gabru</strong> implements the scientific 8-parameter facial attractiveness research framework on a
          100-point calibrated scale.
        </p>
        <p>
          Measurements are divided into <strong>Strong Evidence (56 pts)</strong> (Skin Quality, Expression, Averageness,
          Grooming) and <strong>Moderate Evidence (44 pts)</strong> (Proportions &amp; Harmony, Symmetry, Dimorphism,
          Features).
        </p>
        <p>
          When a frontal selfie is provided, profile angles are occluded and the visible 97 points are mathematically
          renormalised to a 100-point total (100 / 97 ≈ 1.0309×).
        </p>
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--glass)',
            borderRadius: '8px',
            color: 'var(--accent)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ✓ Zero signup &bull; Fast local preview &bull; 100% Client-side privacy
        </div>
      </div>
    </BaseModal>
  );
};
