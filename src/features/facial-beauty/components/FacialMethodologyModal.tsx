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
          <strong>Gabru</strong> implements the scientific 10-parameter Facial Attractiveness Framework (v2), built on
          the 29 Beauty Points on a 100-point calibrated scale.
        </p>
        <p>
          Measurements separate <strong>Changeable Factors (~43 pts)</strong> (Skin Quality &amp; Glow, Expression &amp; Gaze,
          Grooming &amp; Styling, Under-Eye Vitality, Eyebrow Grooming, Head Posture) from <strong>Fixed Structural Architecture (~57 pts)</strong> (Harmony &amp; Thirds,
          Eye Geometry, Central Features, Facial Symmetry, Averageness, Jaw &amp; Chin).
        </p>
        <p>
          Every beauty point lands in exactly one parameter without double counting. When a frontal photo is provided,
          unseen profile angles are excluded and visible parameters are mathematically renormalised to 100 points.
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

