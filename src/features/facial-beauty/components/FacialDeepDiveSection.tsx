'use client';

import React from 'react';
import { BeautyScoreData, DeepDiveTabKey } from '../types/FacialBeautyTypes';

import { SkinDiagnosticTab } from './diagnostics/SkinDiagnosticTab';
import { ProportionsDiagnosticTab } from './diagnostics/ProportionsDiagnosticTab';
import { ExpressionDiagnosticTab } from './diagnostics/ExpressionDiagnosticTab';
import { AveragenessDiagnosticTab } from './diagnostics/AveragenessDiagnosticTab';
import { SymmetryDiagnosticTab } from './diagnostics/SymmetryDiagnosticTab';
import { GroomingDiagnosticTab } from './diagnostics/GroomingDiagnosticTab';
import { DimorphismDiagnosticTab } from './diagnostics/DimorphismDiagnosticTab';
import { FeaturesDiagnosticTab } from './diagnostics/FeaturesDiagnosticTab';

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
  return (
    <div className="beauty-deep-dive-area phase3-diagnostic-suite" id="phase3-diagnostic-suite">
      <div className="deep-dive-panel-box">
        {/* Navigation Tabs Header */}
        <div className="deep-dive-tabs-bar" role="tablist" aria-label="Facial Parameter Deep Dive">
          <div className="deep-dive-tabs-scroll">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'skin'}
              className={`diag-tab-btn ${activeTab === 'skin' ? 'is-active' : ''}`}
              onClick={() => onTabChange('skin')}
            >
              <span>✨ Skin Quality</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[1] ?? 16.8).toFixed(1)}/21
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'proportions'}
              className={`diag-tab-btn ${activeTab === 'proportions' ? 'is-active' : ''}`}
              onClick={() => onTabChange('proportions')}
            >
              <span>📐 Proportions &amp; φ</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[2] ?? 15.6).toFixed(1)}/19
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'expression'}
              className={`diag-tab-btn ${activeTab === 'expression' ? 'is-active' : ''}`}
              onClick={() => onTabChange('expression')}
            >
              <span>🎭 Expression</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[3] ?? 10.4).toFixed(1)}/13
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'averageness'}
              className={`diag-tab-btn ${activeTab === 'averageness' ? 'is-active' : ''}`}
              onClick={() => onTabChange('averageness')}
            >
              <span>🧬 Averageness</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[4] ?? 9.8).toFixed(1)}/12
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'symmetry'}
              className={`diag-tab-btn ${activeTab === 'symmetry' ? 'is-active' : ''}`}
              onClick={() => onTabChange('symmetry')}
            >
              <span>⚖️ Symmetry</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[5] ?? 8.9).toFixed(1)}/11
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'grooming'}
              className={`diag-tab-btn ${activeTab === 'grooming' ? 'is-active' : ''}`}
              onClick={() => onTabChange('grooming')}
            >
              <span>💈 Grooming</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[6] ?? 8.9).toFixed(1)}/10
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dimorphism'}
              className={`diag-tab-btn ${activeTab === 'dimorphism' ? 'is-active' : ''}`}
              onClick={() => onTabChange('dimorphism')}
            >
              <span>🧬 Dimorphism</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[7] ?? 5.5).toFixed(1)}/7
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'features'}
              className={`diag-tab-btn ${activeTab === 'features' ? 'is-active' : ''}`}
              onClick={() => onTabChange('features')}
            >
              <span>👁️ Features</span>
              <span className="tab-pill-score">
                {(scoreData.parameterScores[8] ?? 5.6).toFixed(1)}/7
              </span>
            </button>
          </div>
        </div>

        {/* Selected Tab Content */}
        {activeTab === 'skin' && (
          <SkinDiagnosticTab
            scoreData={scoreData}
            copiedColor={copiedColor}
            onCopyColor={onCopyColor}
          />
        )}
        {activeTab === 'proportions' && (
          <ProportionsDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'expression' && (
          <ExpressionDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'averageness' && (
          <AveragenessDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'symmetry' && (
          <SymmetryDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'grooming' && (
          <GroomingDiagnosticTab scoreData={scoreData} />
        )}
        {activeTab === 'dimorphism' && (
          <DimorphismDiagnosticTab
            scoreData={scoreData}
            dimorphismRef={dimorphismRef}
            onSelectDimorphism={onSelectDimorphism}
          />
        )}
        {activeTab === 'features' && (
          <FeaturesDiagnosticTab scoreData={scoreData} />
        )}
      </div>
    </div>
  );
}
