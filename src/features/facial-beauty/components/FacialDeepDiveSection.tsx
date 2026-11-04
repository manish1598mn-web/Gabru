'use client';

import React from 'react';
import { BeautyScoreData, DeepDiveTabKey } from '../types/FacialBeautyTypes';

import {
  SkinDiagnosticTab,
  EyeRegionDiagnosticTab,
  HarmonyDiagnosticTab,
  ExpressionDiagnosticTab,
  GroomingDiagnosticTab,
  FeaturesDiagnosticTab,
  SymmetryDiagnosticTab,
  AveragenessDiagnosticTab,
  JawChinDiagnosticTab,
  NeckPostureDiagnosticTab,
} from './diagnostics';

interface TabDefinition {
  key: DeepDiveTabKey;
  label: string;
  shortLabel: string;
  icon: string;
  paramId: number;
  maxScore: number;
}

const TAB_DEFINITIONS: TabDefinition[] = [
  { key: 'skin', label: 'Skin Quality & Glow', shortLabel: 'Skin Glow', icon: '✨', paramId: 1, maxScore: 14 },
  { key: 'eyes', label: 'Eye Region', shortLabel: 'Eye Region', icon: '👁️', paramId: 2, maxScore: 13 },
  { key: 'harmony', label: 'Harmony & φ', shortLabel: 'Harmony & φ', icon: '📐', paramId: 3, maxScore: 13 },
  { key: 'expression', label: 'Expression & Gaze', shortLabel: 'Expression', icon: '😊', paramId: 4, maxScore: 12 },
  { key: 'grooming', label: 'Grooming & Styling', shortLabel: 'Grooming', icon: '✂️', paramId: 5, maxScore: 11 },
  { key: 'features', label: 'Central Features', shortLabel: 'Features', icon: '🏛️', paramId: 6, maxScore: 10 },
  { key: 'symmetry', label: 'Facial Symmetry', shortLabel: 'Symmetry', icon: '🪞', paramId: 7, maxScore: 9 },
  { key: 'averageness', label: 'Averageness', shortLabel: 'Averageness', icon: '📊', paramId: 8, maxScore: 7 },
  { key: 'jaw', label: 'Jaw, Chin & Cues', shortLabel: 'Jaw & Chin', icon: '💎', paramId: 9, maxScore: 7 },
  { key: 'neck', label: 'Neck & Carriage', shortLabel: 'Neck & Posture', icon: '🧘', paramId: 10, maxScore: 4 },
];

export interface FacialDeepDiveSectionProps {
  scoreData: BeautyScoreData;
  activeTab: DeepDiveTabKey;
  onTabChange: (tab: DeepDiveTabKey) => void;
  copiedColor: string | null;
  onCopyColor: (hex: string) => void;
  dimorphismRef: 'skip' | 'M-typical' | 'F-typical';
  onSelectDimorphism: (ref: 'skip' | 'M-typical' | 'F-typical') => void;
}

export function FacialDeepDiveSection({
  scoreData,
  activeTab,
  onTabChange,
  copiedColor,
  onCopyColor,
  dimorphismRef,
  onSelectDimorphism,
}: FacialDeepDiveSectionProps) {
  const navTabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!navTabsRef.current) return;
    const activeBtn = navTabsRef.current.querySelector<HTMLElement>('.diag-tab-btn.is-active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  return (
    <div className="phase3-diagnostic-suite" id="phase3-diagnostic-suite">
      {/* Suite Navigation Header */}
      <div className="diag-tabs-header">
        <div className="diag-suite-title-group">
          <div className="diag-suite-badge-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div className="diag-suite-eyebrow">BIOMETRIC TELEMETRY</div>
            <h3 className="diag-suite-title">Diagnostic Deep Dives</h3>
            <div className="diag-suite-subtitle">
              Anthropometric landmark measurements and parameter evidence
            </div>
          </div>
        </div>

        <div className="diag-nav-tabs" role="tablist" aria-label="Facial Biometric Diagnostic Tabs" ref={navTabsRef}>
          {TAB_DEFINITIONS.map((tab) => {
            const score = scoreData.parameterScores[tab.paramId] ?? (tab.maxScore * 0.8);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`diag-tab-btn focus-ring tactile-press ${isActive ? 'is-active' : ''}`}
                onClick={() => onTabChange(tab.key)}
                title={tab.label}
              >
                <span className="diag-tab-icon" aria-hidden="true">{tab.icon}</span>
                <span className="diag-tab-label">{tab.shortLabel}</span>
                <span className="diag-tab-score-chip font-tabular-nums">
                  {score.toFixed(1)}/{tab.maxScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tab Content */}
      <div className="diag-tab-content-area">
        {activeTab === 'skin' && (
          <SkinDiagnosticTab
            scoreData={scoreData}
            copiedColor={copiedColor}
            onCopyColor={onCopyColor}
          />
        )}
        {activeTab === 'eyes' && (
          <EyeRegionDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'harmony' && (
          <HarmonyDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'expression' && (
          <ExpressionDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'grooming' && (
          <GroomingDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'features' && (
          <FeaturesDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'symmetry' && (
          <SymmetryDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'averageness' && (
          <AveragenessDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'jaw' && (
          <JawChinDiagnosticTab
            scoreData={scoreData}
            dimorphismRef={dimorphismRef}
            onSelectDimorphism={onSelectDimorphism}
          />
        )}
        {activeTab === 'neck' && (
          <NeckPostureDiagnosticTab scoreData={scoreData} />
        )}
      </div>
    </div>
  );
}
