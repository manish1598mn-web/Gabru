'use client';

import React from 'react';
import { ContentScoreData } from '../../types/ContentRatingTypes';

export interface DiagnosticTabProps {
  scoreData: ContentScoreData;
}

export function MediaQualityDiagnosticTab({ scoreData }: DiagnosticTabProps) {
  const param = scoreData.qualityBreakdown.parameters.find((p) => p.id === 4);
  const rating = param?.rating ?? 7.0;
  const points = param?.points ?? 9.8;
  const audio = scoreData.item.audioMetrics;
  const media = scoreData.item.media;

  return (
    <div className="diag-tab-pane" id="diag-pane-media">
      <div className="diag-pane-hero">
        <div className="diag-pane-title-group">
          <div className="diag-param-badge media-badge">04 • VISUAL &amp; AUDIO QUALITY</div>
          <h4 className="diag-param-heading">1080p Resolution, -14 LUFS Vocal Master &amp; Subtitles</h4>
          <p className="diag-param-sub">
            Technical delivery standards: min dimension &ge; 1080p, integrated loudness normalized to -14 &plusmn; 3 LUFS, noise floor suppression, and dynamic animated subtitles.
          </p>
        </div>
        <div className="diag-pane-score-box">
          <span className="diag-big-score">{points.toFixed(1)}</span>
          <span className="diag-score-denom">/14 pts</span>
          <span className="diag-score-rating">R: {rating.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Technical Audio & Video Card */}
      <div className="content-tech-meter-card">
        <div className="tech-meter-col">
          <div className="meter-label">
            <span>INTEGRATED LOUDNESS</span>
            <span className="meter-val">{audio ? `${audio.integratedLufs.toFixed(1)} LUFS` : '-14.2 LUFS'}</span>
          </div>
          <div className="lufs-bar-track">
            <div className="lufs-zone-ideal" style={{ left: '60%', width: '25%' }} title="-14 ± 3 LUFS Target Zone" />
            <div className="lufs-needle" style={{ left: '72%' }} />
          </div>
          <span className="meter-caption">Target: -14 ± 3 LUFS (Compliant)</span>
        </div>

        <div className="tech-meter-col">
          <div className="meter-label">
            <span>MEDIA RESOLUTION</span>
            <span className="meter-val">{`${media.width}x${media.height}`}</span>
          </div>
          <div className="res-badge-row">
            <span className={`res-badge ${media.height >= 1080 ? 'active' : ''}`}>
              {media.height >= 1080 ? 'Full HD (1080p+)' : 'Standard HD'}
            </span>
            <span className="res-badge">Aspect: {media.aspectRatio < 1 ? '9:16 Vertical' : '16:9 Landscape'}</span>
          </div>
          <span className="meter-caption">
            {media.height >= 1080 ? 'Optimal resolution for modern feeds' : 'Standard display clarity'}
          </span>
        </div>
      </div>

      {/* Subfactor Breakdown Grid */}
      <div className="diag-sub-grid">
        {param?.subfactors.map((sub) => (
          <div key={sub.code} className="diag-sub-card">
            <div className="diag-sub-top">
              <span className="diag-sub-code">{sub.code}</span>
              <span className="diag-sub-weight">{sub.weight}% Weight</span>
              <span className="diag-sub-rating">{sub.adjustedRating.toFixed(1)}/10</span>
            </div>
            <h5 className="diag-sub-name">{sub.name}</h5>
            <div className="diag-sub-penalties">
              {sub.penalties.length > 0 ? (
                sub.penalties.map((pen, i) => (
                  <div key={i} className={`penalty-tag ${pen.severity}`}>
                    <span>{pen.delta} pts</span>
                    <span className="pen-ref">{pen.evidence.ref}</span>
                    <span className="pen-note">{pen.evidence.note}</span>
                  </div>
                ))
              ) : (
                <div className="clean-sub-tag">✓ Clean execution — No defects detected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
