'use client';

import React from 'react';
import { BaseModal } from '../ui/BaseModal';

export interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy & Data Security"
      maxWidth="580px"
    >
      <div className="governance-modal-body">
        {/* Hero Highlight */}
        <div className="governance-highlight-card">
          <span className="gov-icon" aria-hidden="true">🔒</span>
          <div>
            <strong>100% In-Browser &amp; Private</strong>
            <p>
              Your photos and media never leave your device. All biometric scans and aesthetic calculations execute locally inside your browser sandbox.
            </p>
          </div>
        </div>

        {/* 4 Bite-Sized Cards */}
        <div className="gov-cards-grid">
          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">👤</span>
              <h4 className="gov-card-title">No Identity Tracking</h4>
            </div>
            <p className="gov-card-text">
              Zero facial recognition, biometric profiling, or tracking. Scanned coordinates vanish immediately when you refresh or close the tab.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🧠</span>
              <h4 className="gov-card-title">No AI Training</h4>
            </div>
            <p className="gov-card-text">
              Your photos belong entirely to you. Gabru never uses your images to train, fine-tune, or feed external machine learning models.
            </p>
          </div>

          <div className="gov-card-item">
            <div className="gov-card-header">
              <span className="gov-card-icon" aria-hidden="true">🎨</span>
              <h4 className="gov-card-title">Only Local Theme Saved</h4>
            </div>
            <p className="gov-card-text">
              The only preference retained on your device is your Dark or Light mode choice, kept safely in standard browser <code>localStorage</code>.
            </p>
          </div>
        </div>

        {/* Confidence Footer */}
        <div className="gov-footer-badge">
          <span>🛡️ Certified Private · No Accounts Needed · Zero Tracking</span>
        </div>
      </div>
    </BaseModal>
  );
};
