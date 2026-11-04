'use client';

/**
 * GABRU — PALM PREVIEW & STUDIO CANVAS DOCK
 * 
 * Clean, distraction-free palm photo preview:
 * - Displays the user's uploaded palm photo in an elegant obsidian dock
 * - Subtle, high-tech scanning laser sweep during live analysis
 * - Post-analysis evaluation status chip (Palm Prominence score + Archetype badge)
 * - Zero artificial stickers, zero mount pills, zero drawn lines over the palm image
 * - Fallback to architectural blueprint sketch when no photo is uploaded
 */

import React from 'react';
import { PalmLinePath, PalmMountRegion } from '../utils/HandImageAnalysisUtil';
import { ScanningReticleOverlay } from '@/shared/components/ui/ScanningReticleOverlay';

export interface PalmLandmarkVisualizerProps {
  imageUri: string | null;
  linePaths?: PalmLinePath[];
  mountRegions?: PalmMountRegion[];
  activeParamKey?: string | null;
  onSelectParam?: (paramKey: string) => void;
  isAnalyzing: boolean;
  scanPhase?: 1 | 2 | 3 | 4;
  scanProgress?: number;
  scanStatusMessage?: string;
  handTypeLabel?: string;
  overallScore?: number;
  overallBandLabel?: string;
}

export function PalmLandmarkVisualizer({
  imageUri,
  isAnalyzing,
  scanPhase = 1,
  scanProgress = 0,
  scanStatusMessage,
  handTypeLabel,
  overallScore,
  overallBandLabel,
}: PalmLandmarkVisualizerProps) {
  return (
    <div className="palm-visualizer-container" id="palm-visualizer-root">
      {/* Main Image Stage Wrapper */}
      <div className="visualizer-stage-wrapper">
        <div className="visualizer-canvas-stage">
          {/* The Clean Palm Photo or Blueprint */}
          <img
            src={imageUri || '/hand_reading_sketch.jpg'}
            alt={imageUri ? 'Uploaded Palm Photo' : 'Anatomical Palmistry & Crease Lines Blueprint'}
            className={`visualizer-palm-image ${isAnalyzing ? 'is-analyzing-blur' : ''}`}
            id="palm-uploaded-preview"
          />

          {/* Unified 2.8s - 3.2s Holographic Scanning Reticle */}
          <ScanningReticleOverlay
            studio="hand-reading"
            isAnalyzing={isAnalyzing}
            phase={scanPhase}
            progressRatio={scanProgress}
            statusMessage={scanStatusMessage}
          />

          {/* Post-Analysis Palm Status Pill */}
          {!isAnalyzing && overallScore !== undefined && (
            <div className="dock-evaluated-badge" id="palm-evaluated-badge">
              <span className="dock-badge-title">PALM PROMINENCE</span>
              <span className="dock-badge-score font-tabular-nums">
                {typeof overallScore === 'number' ? overallScore.toFixed(1) : '--'}
                <span className="denom">/100</span>
              </span>
              <span className="dock-badge-band">{overallBandLabel}</span>
            </div>
          )}

          {/* Constitutional Hand Archetype Pill */}
          {!isAnalyzing && handTypeLabel && (
            <div className="visualizer-archetype-pill" id="palm-archetype-pill">
              <span>ARCHETYPE: <strong>{handTypeLabel.toUpperCase()}</strong></span>
            </div>
          )}

          {/* Idle Blueprint Caption */}
          {!imageUri && !isAnalyzing && overallScore === undefined && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 15, 20, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#f4f4f5',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                zIndex: 10,
              }}
            >
              <span>PALMISTRY ARCHITECTURAL BLUEPRINT</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
