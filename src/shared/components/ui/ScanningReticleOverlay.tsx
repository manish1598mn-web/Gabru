'use client';

/**
 * GABRU — SCANNING RETICLE OVERLAY
 * 
 * High-tech holographic laser scanner and biometric HUD reticle overlay
 * rendered directly above the photo / link preview canvas during analysis.
 * 
 * Features:
 * - Dual-axis smooth sweeping laser bar with glowing diffraction wake
 * - 4-corner animated HUD calipers framing the subject
 * - Geometric landmark coordinate stream in monospace
 * - Dynamic 4-stage telemetry status capsule with micro progress track
 * - Dual-theme calibrated (luminescent neon in Dark Mode, crisp blueprint ink in Light Mode)
 */

import React from 'react';
import type { StudioAnalysisType } from '@/shared/hooks/useRealisticAnalysis';

export interface ScanningReticleOverlayProps {
  studio: StudioAnalysisType;
  isAnalyzing: boolean;
  phase?: 1 | 2 | 3 | 4;
  statusMessage?: string;
  progressRatio?: number;
  className?: string;
}

const STUDIO_TAG_MAP: Record<StudioAnalysisType, string> = {
  'fit-check': 'SARTORIAL ANTHROPOMETRY SCAN',
  'beauty-rating': 'CRANIOFACIAL BIOMETRICS SCAN',
  'content-rating': 'VIRAL ARCHITECTURE & HOOK TELEMETRY',
  'hand-reading': 'VEDIC PALMAR REKHA CALIBRATION',
};

export function ScanningReticleOverlay({
  studio,
  isAnalyzing,
  phase = 1,
  statusMessage,
  progressRatio = 0,
  className = '',
}: ScanningReticleOverlayProps) {
  if (!isAnalyzing) return null;

  const defaultMessage = statusMessage || 'Initializing Multimodal Neural Engine...';
  const displayPercent = Math.min(100, Math.round(progressRatio * 100));

  return (
    <div
      className={`scanning-reticle-overlay studio-scan-${studio} ${className}`}
      aria-live="polite"
      role="status"
    >
      {/* 1. Holographic Laser Beam & Trailing Diffraction Wake */}
      <div className="holographic-laser-scanner" aria-hidden="true">
        <div className="laser-sweep-bar" />
        <div className="laser-trailing-wake" />
        <div className="laser-ambient-pulse" />
      </div>

      {/* 2. HUD Reticle Corner Brackets & Calibration Calipers */}
      <div className="scanner-hud-reticle" aria-hidden="true">
        <span className="reticle-corner corner-tl" />
        <span className="reticle-corner corner-tr" />
        <span className="reticle-corner corner-bl" />
        <span className="reticle-corner corner-br" />

        {/* Live Monospace Telemetry Coordinates */}
        <div className="scanner-coordinates-strip">
          <span className="coord-chip">OPT_FOV: 94.2°</span>
          <span className="coord-chip">FPS: 60.0</span>
          <span className="coord-chip">CONF: {Math.max(94, 90 + Math.round(progressRatio * 9))}%</span>
        </div>

        {/* Subtle Central Crosshair Target */}
        <div className="scanner-center-crosshair">
          <div className="crosshair-ring" />
          <div className="crosshair-dot" />
        </div>
      </div>

      {/* 3. Floating Telemetry HUD Status Capsule */}
      <div className="scanner-telemetry-hud">
        <div className="telemetry-hud-inner">
          <div className="telemetry-top-row">
            <span className="telemetry-studio-tag">{STUDIO_TAG_MAP[studio]}</span>
            <span className="telemetry-percent-badge font-tabular-nums">{displayPercent}%</span>
          </div>

          <div className="telemetry-message-row">
            <span className="telemetry-pulse-dot" aria-hidden="true" />
            <span className="telemetry-message-text">{defaultMessage}</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="telemetry-progress-track">
            <div
              className="telemetry-progress-bar"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

