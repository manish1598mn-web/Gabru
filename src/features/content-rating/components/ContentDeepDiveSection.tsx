'use client';

/**
 * GABRU — CONTENT DIAGNOSTIC DEEP DIVE SECTION
 * 
 * Clean, calm, and simple 10-tab diagnostic explorer for single-post viral metrics & personality:
 * - Serene 10-Tab navigation pill bar with live score chips (0-100)
 * - 3-Pillar layout per parameter:
 *   1. Left Pillar: Score gauge, parameter code, and verdict badge
 *   2. Right Pillar: Vibe verdict roast quote, 3 human-readable progress meters, and actionable takeaway
 */

import React from 'react';
import { ContentScoreData, DeepDiveContentTabKey } from '../types/ContentRatingTypes';

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
  const { scores, verdictBadge, archetypeTier, telemetry, item } = scoreData;
  const navTabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!navTabsRef.current) return;
    const activeBtn = navTabsRef.current.querySelector<HTMLElement>('.diag-nav-pill.is-active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const isTabActive = (tabKey: DeepDiveContentTabKey, legacyAlias?: DeepDiveContentTabKey) => {
    return activeTab === tabKey || (legacyAlias && activeTab === legacyAlias);
  };

  const llm = item.llmEvaluations || {};

  return (
    <div className="content-diagnostic-suite" id="content-diagnostic-suite">
      {/* Suite Header */}
      <div className="diag-tabs-header">
        <div className="diag-suite-title-group">
          <div className="diag-suite-badge-icon content-badge-icon" aria-hidden="true">📊</div>
          <div>
            <h3 className="diag-suite-title">Single-Post Diagnostic Deep Dives</h3>
            <div className="diag-suite-subtitle">
              Granular breakdown across personality, aesthetics, viral DM momentum, and secret bookmark rates.
            </div>
          </div>
        </div>

        {/* Serene 10-Tab Navigation Pill Bar */}
        <div className="diag-nav-bar" role="tablist" aria-label="Diagnostic Tabs" ref={navTabsRef}>
          {/* 1. Main Character */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('main_character', 'value')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('main_character', 'value') ? 'is-active' : ''}`}
            onClick={() => onTabChange('main_character')}
          >
            <span>👑 Main Character</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S1}</span>
          </button>

          {/* 2. Visual Aura */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('visual_aura', 'media')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('visual_aura', 'media') ? 'is-active' : ''}`}
            onClick={() => onTabChange('visual_aura')}
          >
            <span>✨ Visual Aura</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S2}</span>
          </button>

          {/* 3. Scroll Hook */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('scroll_hook', 'hook')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('scroll_hook', 'hook') ? 'is-active' : ''}`}
            onClick={() => onTabChange('scroll_hook')}
          >
            <span>🛑 Scroll Hook</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S3}</span>
          </button>

          {/* 4. Caption Poetry */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('caption_wit', 'copy')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('caption_wit', 'copy') ? 'is-active' : ''}`}
            onClick={() => onTabChange('caption_wit')}
          >
            <span>✍️ Caption Poetry</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S4}</span>
          </button>

          {/* 5. Group-Chat */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('group_chat', 'structure')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('group_chat', 'structure') ? 'is-active' : ''}`}
            onClick={() => onTabChange('group_chat')}
          >
            <span>🚀 Group-Chat</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S5}</span>
          </button>

          {/* 6. Bookmark Bait */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('bookmark_bait', 'cta')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('bookmark_bait', 'cta') ? 'is-active' : ''}`}
            onClick={() => onTabChange('bookmark_bait')}
          >
            <span>🔖 Bookmark Bait</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S6}</span>
          </button>

          {/* 7. Comment Chaos */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('comment_chaos')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('comment_chaos') ? 'is-active' : ''}`}
            onClick={() => onTabChange('comment_chaos')}
          >
            <span>💬 Comment Chaos</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S7}</span>
          </button>

          {/* 8. Goblin Hours */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('upload_timing', 'timing')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('upload_timing', 'timing') ? 'is-active' : ''}`}
            onClick={() => onTabChange('upload_timing')}
          >
            <span>⏰ Goblin Hours</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S8}</span>
          </button>

          {/* 9. Original Brain */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('trend_originality', 'originality')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('trend_originality', 'originality') ? 'is-active' : ''}`}
            onClick={() => onTabChange('trend_originality')}
          >
            <span>🧠 Original Brain</span>
            <span className="diag-score-tag font-tabular-nums">{scores.S9}</span>
          </button>

          {/* 10. Verdict Badge */}
          <button
            type="button"
            role="tab"
            aria-selected={isTabActive('verdict_badge', 'compliance')}
            className={`diag-nav-pill focus-ring tactile-press ${isTabActive('verdict_badge', 'compliance') ? 'is-active' : ''}`}
            onClick={() => onTabChange('verdict_badge')}
          >
            <span>🏆 Verdict Badge</span>
            <span className="diag-score-tag font-tabular-nums">
              {verdictBadge}
            </span>
          </button>
        </div>
      </div>

      {/* Selected Tab Content Area: 3-Pillar Clean Layout */}
      <div className="diag-tab-content-area">
        {/* 1. Main Character Energy */}
        {isTabActive('main_character', 'value') && (
          <div className="diag-pane-3pillar" id="diag-pane-main-character">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">PARAM 01 • S1</span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S1}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S1 >= 80 ? 'High Prominence' : scores.S1 >= 65 ? 'Balanced Focus' : 'Subtle Presence'}
              </span>
              <span className="pane-param-name-label">
                Main Character Energy
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 1)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Solo Frame Spotlight</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.subjectSpotlight ?? 8.5).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.subjectSpotlight ?? 8.5) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Pose Audacity &amp; Camera Confidence</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.poseAudacity ?? 8.0).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.poseAudacity ?? 8.0) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">First-Person Pronouns (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;)</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.firstPersonWords ?? 2} words
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(((item.firstPersonWords ?? 2) / 6) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Maintain confident eye-level framing in the first 2 seconds to firmly establish subject dominance.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Visual Aura & Frame Quality */}
        {isTabActive('visual_aura', 'media') && (
          <div className="diag-pane-3pillar" id="diag-pane-visual-aura">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 02 • S2
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S2}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S2 >= 82 ? 'Studio Quality' : scores.S2 >= 65 ? 'Clean Frame' : 'Low Contrast'}
              </span>
              <span className="pane-param-name-label">
                Visual Aura &amp; Frame Quality
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AESTHETIC VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 2)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Lighting &amp; Exposure Balance</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.lighting ?? 8.5).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.lighting ?? 8.5) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Color Grading &amp; Palette Mood</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.colorGrading ?? 8.2).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.colorGrading ?? 8.2) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Composition &amp; Styling Drip</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.composition ?? 8.4).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(((llm.composition ?? 8.4) / 10) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Clean up grain with balanced front lighting and maintain uniform color temperature across all shots.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Scroll-Stopper Hook */}
        {isTabActive('scroll_hook', 'hook') && (
          <div className="diag-pane-3pillar" id="diag-pane-scroll-hook">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 03 • S3
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S3}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S3 >= 80 ? 'High Retention' : 'Low Friction'}
              </span>
              <span className="pane-param-name-label">
                Scroll-Stopper Hook
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 3)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Like-to-Reach Conversion Rate</span>
                    <span className="meter-score-text font-tabular-nums">
                      {((telemetry.likes / Math.max(1, telemetry.reach)) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((telemetry.likes / Math.max(1, telemetry.reach)) * 100) * 10))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Thumb-Stop Visual Contrast</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.visualHook ?? 8.0).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.visualHook ?? 8.0) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">First 6 Words Hook Punch</span>
                    <span className="meter-score-text font-tabular-nums">
                      {(llm.openingLinePunch ?? 7.8).toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(((llm.openingLinePunch ?? 7.8) / 10) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Hook the viewer within the opening 3 seconds with immediate curiosity rather than slow intros.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Caption Poetry vs. Cringe */}
        {isTabActive('caption_wit', 'copy') && (
          <div className="diag-pane-3pillar" id="diag-pane-caption-wit">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 04 • S4
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S4}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S4 >= 80 ? 'Concise Delivery' : scores.S4 >= 60 ? 'Balanced Copy' : 'Dense Text'}
              </span>
              <span className="pane-param-name-label">
                Caption Poetry vs. Cringe
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 4)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Effortless Line Wit</span>
                    <span className="meter-score-text font-tabular-nums">
                      {llm.captionWit ?? 18} / 25
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.captionWit ?? 18) / 25) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Hashtag Restraint (&le; 5 tags)</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.hashtagCount ?? 0} hashtags
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.max(10, Math.min(100, 100 - ((item.hashtagCount ?? 0) > 5 ? ((item.hashtagCount ?? 0) - 5) * 15 : 0)))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Clean Emoji Balance</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.emojiCount ?? 0} emojis
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.max(10, Math.min(100, 100 - ((item.emojiCount ?? 0) > 6 ? ((item.emojiCount ?? 0) - 6) * 15 : 0)))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Keep captions concise and witty. Never clutter the copy with dozens of hashtags.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Group-Chat Forwardability */}
        {isTabActive('group_chat', 'structure') && (
          <div className="diag-pane-3pillar" id="diag-pane-group-chat">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 05 • S5
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S5}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S5 >= 78 ? 'High Shareability' : 'Standard Reach'}
              </span>
              <span className="pane-param-name-label">
                Group-Chat Forwardability
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 5)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">DM Forward Velocity</span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.shares.toLocaleString()} shares ({telemetry.groupChatMultiplier})
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(parseFloat(telemetry.groupChatMultiplier) * 8))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Organic Reposts</span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.reposts.toLocaleString()} reposts
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round((telemetry.reposts / Math.max(1, telemetry.likes)) * 400))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Meme &amp; Relatability Index</span>
                    <span className="meter-score-text font-tabular-nums">
                      {llm.shareRelatability ?? 26} / 35
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(((llm.shareRelatability ?? 26) / 35) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Focus on relatable situations that compel users to immediately send this to group chats.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Secret Bookmark Bait */}
        {isTabActive('bookmark_bait', 'cta') && (
          <div className="diag-pane-3pillar" id="diag-pane-bookmark-bait">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 06 • S6
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S6}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S6 >= 78 ? 'High Save Utility' : 'Standard Save Rate'}
              </span>
              <span className="pane-param-name-label">
                Secret Bookmark Bait
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 6)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Quiet Bookmark Count</span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.saves.toLocaleString()} saves ({telemetry.bookmarkRate})
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(parseFloat(telemetry.bookmarkRate) * 14))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Utility &amp; Future Reference Value</span>
                    <span className="meter-score-text font-tabular-nums">
                      {llm.saveUtilityEnvy ?? 25} / 35
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.saveUtilityEnvy ?? 25) / 35) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Save-to-Like Saturation</span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.bookmarkRate} bookmark rate
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(parseFloat(telemetry.bookmarkRate) * 16))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Deliver high-utility cheat sheets or curated resource lists that compel viewers to save.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Comment Section Chaos */}
        {isTabActive('comment_chaos') && (
          <div className="diag-pane-3pillar" id="diag-pane-comment-chaos">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 07 • S7
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S7}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S7 >= 80 ? 'Active Discussion' : scores.S7 >= 60 ? 'Engaged Comments' : 'Quiet Thread'}
              </span>
              <span className="pane-param-name-label">
                Comment Section Chaos
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 7)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Comments-to-Likes Ratio</span>
                    <span className="meter-score-text font-tabular-nums">
                      {((telemetry.comments / Math.max(1, telemetry.likes)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((telemetry.comments / Math.max(1, telemetry.likes)) * 100) * 12))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Hype-Man vs Debate Sentiment</span>
                    <span className="meter-score-text font-tabular-nums">
                      {llm.commentVibe ?? 28} / 40
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(((llm.commentVibe ?? 28) / 40) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Audience Thread Volume</span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.comments.toLocaleString()} replies
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round((telemetry.comments / 500) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Prompt comments with an open question or lighthearted debate to build algorithmic reply momentum.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 8. Upload Timing & Goblin Hours */}
        {isTabActive('upload_timing', 'timing') && (
          <div className="diag-pane-3pillar" id="diag-pane-goblin-hours">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 08 • S8
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S8}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S8 >= 75 ? 'Optimal Window' : scores.S8 >= 50 ? 'Standard Window' : 'Off-Peak Window'}
              </span>
              <span className="pane-param-name-label">
                Upload Timing &amp; Goblin Hours
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 8)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Local Drop Hour</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.uploadHourLocal !== undefined ? `${item.uploadHourLocal}:00 local` : 'Peak Time'}
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, scores.S8)}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Prime Window Alignment</span>
                    <span className="meter-score-text font-tabular-nums">
                      11:00-14:00 or 18:00-21:00
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">3 AM Goblin Hours Status</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.uploadHourLocal && item.uploadHourLocal >= 1 && item.uploadHourLocal <= 5 ? 'Active Penalty' : 'Clear (No Penalty)'}
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${item.uploadHourLocal && item.uploadHourLocal >= 1 && item.uploadHourLocal <= 5 ? 25 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Schedule uploads during lunch or evening commute hours for immediate algorithm distribution.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 9. Trend Chaser vs. Original Brain */}
        {isTabActive('trend_originality', 'originality') && (
          <div className="diag-pane-3pillar" id="diag-pane-trend-originality">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                PARAM 09 • S9
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scores.S9}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {scores.S9 >= 78 ? 'Original Concept' : 'Standard Format'}
              </span>
              <span className="pane-param-name-label">
                Trend Chaser vs. Original Brain
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  &ldquo;{scoreData.parameters.find((p) => p.id === 9)?.roastOrCompliment}&rdquo;
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Original Audio Bonus</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.isTrendingAudio ? 'Trending Audio (+0)' : 'Original Audio (+15)'}
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${item.isTrendingAudio ? 50 : 100}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Terminology &amp; Phrasing Originality</span>
                    <span className="meter-score-text font-tabular-nums">
                      {item.slangMatchCount ?? 0} matches
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.max(10, Math.min(100, 100 - ((item.slangMatchCount ?? 0) * 20)))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Concept Originality</span>
                    <span className="meter-score-text font-tabular-nums">
                      {llm.conceptOriginality ?? 46} / 60
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(((llm.conceptOriginality ?? 46) / 60) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Use authentic commentary and fresh angles rather than relying on recycled trending audios.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 10. Single-Post Verdict Badge & Archetype */}
        {isTabActive('verdict_badge', 'compliance') && (
          <div className="diag-pane-3pillar" id="diag-pane-verdict-badge">
            <div className="pane-gauge-pillar">
              <span className="pane-param-code">
                OFFICIAL • S10
              </span>
              <div className="pane-big-score font-tabular-nums">
                {scoreData.contentScore}
                <span className="pane-score-denom">/100</span>
              </div>
              <span className="pane-verdict-badge">
                {verdictBadge}
              </span>
              <span className="pane-param-name-label">
                {archetypeTier}
              </span>
            </div>

            <div className="pane-details-pillar">
              <div className="pane-roast-quote-card">
                <span className="quote-eyebrow">AUDIT VERDICT</span>
                <p className="quote-text">
                  Awarded the official ranking of <strong>&ldquo;{verdictBadge}&rdquo;</strong> ({archetypeTier}) with an overall impact score of <strong>{scoreData.contentScore}/100</strong>.
                </p>
              </div>

              <div className="pane-meters-list">
                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Calibrated Content Impact Score (0-100)</span>
                    <span className="meter-score-text font-tabular-nums">
                      {scoreData.contentScore} / 100
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill"
                      style={{ width: `${Math.min(100, Math.round(scoreData.contentScore))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">Visual &amp; Aesthetic Craft Index</span>
                    <span className="meter-score-text font-tabular-nums">
                      {Math.round(0.4 * scoreData.scores.S1 + 0.6 * scoreData.scores.S2)} / 100
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{ width: `${Math.min(100, Math.round(0.4 * scoreData.scores.S1 + 0.6 * scoreData.scores.S2))}%` }}
                    />
                  </div>
                </div>

                <div className="pane-meter-item">
                  <div className="meter-header">
                    <span className="meter-name">
                      {telemetry.trueEngagementRate && telemetry.trueEngagementRate !== '--%'
                        ? 'Observed Engagement Benchmark'
                        : 'Forwardability & Virality Velocity'}
                    </span>
                    <span className="meter-score-text font-tabular-nums">
                      {telemetry.trueEngagementRate && telemetry.trueEngagementRate !== '--%'
                        ? telemetry.trueEngagementRate
                        : `${scoreData.scores.S5} / 100`}
                    </span>
                  </div>
                  <div className="meter-slider-track">
                    <div
                      className="meter-slider-fill green"
                      style={{
                        width: `${
                          telemetry.trueEngagementRate && telemetry.trueEngagementRate !== '--%'
                            ? Math.min(100, Math.round(parseFloat(telemetry.trueEngagementRate) * 14))
                            : Math.min(100, scoreData.scores.S5)
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pane-takeaway-banner">
                <span className="takeaway-tag">HOW TO IMPROVE</span>
                <span className="takeaway-text">
                  Click Export Card in the header to share your verified archetype badge with your community.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
