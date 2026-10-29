'use client';

/**
 * GABRU — CONTENT DIAGNOSTIC DEEP DIVE SECTION
 * 
 * Interactive 10-tab diagnostic explorer for social media craft & performance telemetry:
 * - 10 Tab navigation bar with live parameter score chips
 * - Direct evidence inspection with timestamps, quotes, LUFS meters, and pacing graphs
 */

import React from 'react';
import { ContentScoreData, DeepDiveContentTabKey } from '../types/ContentRatingTypes';

import {
  HookDiagnosticTab,
  ValueDiagnosticTab,
  StructureDiagnosticTab,
  MediaQualityDiagnosticTab,
  CopyHashtagDiagnosticTab,
  CtaDiagnosticTab,
  FormatDiagnosticTab,
  OriginalityDiagnosticTab,
  TimingDiagnosticTab,
  ComplianceDiagnosticTab,
} from './diagnostics';

export interface ContentDeepDiveSectionProps {
  scoreData: ContentScoreData;
  activeTab: DeepDiveContentTabKey;
  onTabChange: (tab: DeepDiveContentTabKey) => void;
}

export function ContentDeepDiveSection({
  scoreData,
  activeTab,
  onTabChange,
}: ContentDeepDiveSectionProps) {
  const pScores = scoreData.qualityBreakdown.parameterScores;

  return (
    <div className="phase3-diagnostic-suite content-diagnostic-suite" id="content-diagnostic-suite">
      {/* Suite Navigation Header */}
      <div className="diag-tabs-header">
        <div className="diag-suite-title-group">
          <div className="diag-suite-badge-icon content-badge-icon">📊</div>
          <div>
            <h3 className="diag-suite-title">Biometric &amp; Craft Diagnostic Deep Dives</h3>
            <div className="diag-suite-subtitle">
              Granular evidence, timestamps, retention timelines, and technical telemetry across all 10 dimensions
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="diag-nav-tabs" role="tablist" aria-label="Diagnostic Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'hook'}
            className={`diag-tab-btn ${activeTab === 'hook' ? 'is-active' : ''}`}
            onClick={() => onTabChange('hook')}
          >
            <span>Hook &amp; Opening</span>
            <span className="diag-tab-score-chip">
              {(pScores[1] ?? 11.7).toFixed(1)}/18
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'value'}
            className={`diag-tab-btn ${activeTab === 'value' ? 'is-active' : ''}`}
            onClick={() => onTabChange('value')}
          >
            <span>Value &amp; Relevance</span>
            <span className="diag-tab-score-chip">
              {(pScores[2] ?? 12.8).toFixed(1)}/16
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'structure'}
            className={`diag-tab-btn ${activeTab === 'structure' ? 'is-active' : ''}`}
            onClick={() => onTabChange('structure')}
          >
            <span>Structure &amp; Flow</span>
            <span className="diag-tab-score-chip">
              {(pScores[3] ?? 9.0).toFixed(1)}/12
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'media'}
            className={`diag-tab-btn ${activeTab === 'media' ? 'is-active' : ''}`}
            onClick={() => onTabChange('media')}
          >
            <span>Visual &amp; Audio</span>
            <span className="diag-tab-score-chip">
              {(pScores[4] ?? 9.8).toFixed(1)}/14
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'copy'}
            className={`diag-tab-btn ${activeTab === 'copy' ? 'is-active' : ''}`}
            onClick={() => onTabChange('copy')}
          >
            <span>Copy &amp; Hashtags</span>
            <span className="diag-tab-score-chip">
              {(pScores[5] ?? 5.5).toFixed(1)}/10
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cta'}
            className={`diag-tab-btn ${activeTab === 'cta' ? 'is-active' : ''}`}
            onClick={() => onTabChange('cta')}
          >
            <span>CTA &amp; Prompt</span>
            <span className="diag-tab-score-chip">
              {(pScores[6] ?? 2.8).toFixed(1)}/7
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'format'}
            className={`diag-tab-btn ${activeTab === 'format' ? 'is-active' : ''}`}
            onClick={() => onTabChange('format')}
          >
            <span>Platform Fit</span>
            <span className="diag-tab-score-chip">
              {(pScores[7] ?? 7.2).toFixed(1)}/8
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'originality'}
            className={`diag-tab-btn ${activeTab === 'originality' ? 'is-active' : ''}`}
            onClick={() => onTabChange('originality')}
          >
            <span>Originality</span>
            <span className="diag-tab-score-chip">
              {(pScores[8] ?? 4.2).toFixed(1)}/6
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'timing'}
            className={`diag-tab-btn ${activeTab === 'timing' ? 'is-active' : ''}`}
            onClick={() => onTabChange('timing')}
          >
            <span>Timing</span>
            <span className="diag-tab-score-chip">
              {pScores[9] && pScores[9] > 0 ? `${pScores[9].toFixed(1)}/4` : 'V=0'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'compliance'}
            className={`diag-tab-btn ${activeTab === 'compliance' ? 'is-active' : ''}`}
            onClick={() => onTabChange('compliance')}
          >
            <span>Compliance</span>
            <span className="diag-tab-score-chip">
              {(pScores[10] ?? 5.0).toFixed(1)}/5
            </span>
          </button>
        </div>
      </div>

      {/* Selected Tab Content Area */}
      <div className="diag-tab-content-area">
        {activeTab === 'hook' && <HookDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'value' && <ValueDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'structure' && <StructureDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'media' && <MediaQualityDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'copy' && <CopyHashtagDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'cta' && <CtaDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'format' && <FormatDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'originality' && <OriginalityDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'timing' && <TimingDiagnosticTab scoreData={scoreData} />}
        {activeTab === 'compliance' && <ComplianceDiagnosticTab scoreData={scoreData} />}
      </div>
    </div>
  );
}

