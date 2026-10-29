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
          <div className="diag-suite-badge-icon">🔬</div>
          <div>
            <h3 className="diag-suite-title">Biometric Diagnostic Deep Dives</h3>
            <div className="diag-suite-subtitle">
              Detailed anthropometric, neuromuscular, and styling evidence across all 10 parameters
            </div>
          </div>
        </div>

        <div className="diag-nav-tabs" role="tablist" aria-label="Facial Biometric Diagnostic Tabs" ref={navTabsRef}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'skin'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'skin' ? 'is-active' : ''}`}
            onClick={() => onTabChange('skin')}
          >
            <span>Skin Quality &amp; Glow</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[1] ?? 11.2).toFixed(1)}/14
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'eyes'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'eyes' ? 'is-active' : ''}`}
            onClick={() => onTabChange('eyes')}
          >
            <span>Eye Region</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[2] ?? 10.4).toFixed(1)}/13
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'harmony'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'harmony' ? 'is-active' : ''}`}
            onClick={() => onTabChange('harmony')}
          >
            <span>Harmony &amp; φ</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[3] ?? 10.4).toFixed(1)}/13
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'expression'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'expression' ? 'is-active' : ''}`}
            onClick={() => onTabChange('expression')}
          >
            <span>Expression &amp; Gaze</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[4] ?? 9.6).toFixed(1)}/12
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'grooming'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'grooming' ? 'is-active' : ''}`}
            onClick={() => onTabChange('grooming')}
          >
            <span>Grooming &amp; Styling</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[5] ?? 8.8).toFixed(1)}/11
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'features'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'features' ? 'is-active' : ''}`}
            onClick={() => onTabChange('features')}
          >
            <span>Central Features</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[6] ?? 8.0).toFixed(1)}/10
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'symmetry'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'symmetry' ? 'is-active' : ''}`}
            onClick={() => onTabChange('symmetry')}
          >
            <span>Facial Symmetry</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[7] ?? 7.2).toFixed(1)}/9
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'averageness'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'averageness' ? 'is-active' : ''}`}
            onClick={() => onTabChange('averageness')}
          >
            <span>Averageness</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[8] ?? 5.6).toFixed(1)}/7
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'jaw'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'jaw' ? 'is-active' : ''}`}
            onClick={() => onTabChange('jaw')}
          >
            <span>Jaw, Chin &amp; Cues</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[9] ?? 5.6).toFixed(1)}/7
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'neck'}
            className={`diag-tab-btn focus-ring tactile-press ${activeTab === 'neck' ? 'is-active' : ''}`}
            onClick={() => onTabChange('neck')}
          >
            <span>Neck &amp; Carriage</span>
            <span className="diag-tab-score-chip font-tabular-nums">
              {(scoreData.parameterScores[10] ?? 3.4).toFixed(1)}/4
            </span>
          </button>
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
