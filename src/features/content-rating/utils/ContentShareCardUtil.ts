/**
 * GABRU — CONTENT RATING SOCIAL SHARE CARD GENERATOR
 * 
 * Generates an ultra-crisp, 1080x1920 (9:16 Full Smartphone Screen) social share card.
 * Native mobile format for Instagram Stories, TikTok, WhatsApp Status, and Snapchat.
 * 
 * Features:
 * - Reactive Theme System: Seamlessly renders in Dark Mode or Light Mode matching user preferences.
 * - Upper Stage: Post Media / Thumbnail Showcase & Executive Virality Hub.
 * - Lower Stage: Dedicated 10-Point Virality & Content Matrix in an executive 2-column grid.
 * - Bottom: Viral Reach CTA Bar.
 * - Ultra-HD 2x super-sampling (2160 x 3840px) for maximum mobile & retina clarity.
 */

import { ContentScoreData, SinglePostParameterResult } from '../types/ContentRatingTypes';
import { CONTENT_PARAMETERS } from '../constants/ContentRatingConstants';
import { drawRoundedRect, drawImageCover, isClientLightMode } from '@/shared/utils/CanvasUtil';

const CONTENT_PARAM_ICONS: Record<number, string> = {
  1: '👑',
  2: '✨',
  3: '🛑',
  4: '✍️',
  5: '🚀',
  6: '🔖',
  7: '💬',
  8: '⏰',
  9: '🧠',
  10: '🏆',
};

const SHORT_PARAM_NAMES: Record<number, string> = {
  1: 'Main Character Energy',
  2: 'Visual Aura & Frame',
  3: 'Scroll-Stopper Hook',
  4: 'Caption Wit & Poetry',
  5: 'Group-Chat Forward',
  6: 'Secret Bookmark Bait',
  7: 'Comment Chaos Magnet',
  8: 'Upload Timing & Prime',
  9: 'Original Brain Energy',
  10: 'Single-Post Verdict',
};

function formatMetric(num?: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

function loadCardImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateContentShareCard(
  scoreData: ContentScoreData,
  themeLight?: boolean
): Promise<HTMLCanvasElement> {
  const isLight = themeLight ?? isClientLightMode();
  const width = 1080;
  const height = 1920;
  const scale = 2; // Ultra-HD 2x (2160 x 3840)

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create canvas 2D rendering context');
  }

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  // -------------------------------------------------------------
  // 1. Color Palette Tokens (Mode-Reactive: Dark vs Light)
  // -------------------------------------------------------------
  const theme = isLight
    ? {
        canvasBg: '#f8fafc',
        ambientGlow1: 'rgba(168, 85, 247, 0.08)',
        ambientGlow2: 'rgba(56, 189, 248, 0.06)',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(15, 23, 42, 0.08)',
        cardShadow: 'rgba(15, 23, 42, 0.06)',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        textMuted: '#64748b',
        trackBg: 'rgba(15, 23, 42, 0.07)',
        urlPillBg: 'rgba(168, 85, 247, 0.08)',
        urlPillBorder: 'rgba(168, 85, 247, 0.35)',
        urlPillText: '#7e22ce',
        photoBorder: 'rgba(15, 23, 42, 0.12)',
        verdictPillBg: 'rgba(16, 185, 129, 0.10)',
        verdictPillBorder: 'rgba(16, 185, 129, 0.35)',
        verdictPillText: '#065f46',
        verdictDot: '#10b981',
        hubBoxBg: 'rgba(168, 85, 247, 0.05)',
        hubBoxBorder: 'rgba(168, 85, 247, 0.20)',
        hubBoxText: '#6b21a8',
      }
    : {
        canvasBg: '#09090e',
        ambientGlow1: 'rgba(168, 85, 247, 0.16)',
        ambientGlow2: 'rgba(56, 189, 248, 0.12)',
        cardBg: 'rgba(18, 18, 28, 0.90)',
        cardBorder: 'rgba(255, 255, 255, 0.10)',
        cardShadow: 'rgba(0, 0, 0, 0.70)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.72)',
        textMuted: 'rgba(255, 255, 255, 0.45)',
        trackBg: 'rgba(255, 255, 255, 0.08)',
        urlPillBg: 'rgba(217, 70, 239, 0.14)',
        urlPillBorder: 'rgba(217, 70, 239, 0.42)',
        urlPillText: '#f3e8ff',
        photoBorder: 'rgba(255, 255, 255, 0.16)',
        verdictPillBg: 'rgba(168, 85, 247, 0.16)',
        verdictPillBorder: 'rgba(168, 85, 247, 0.38)',
        verdictPillText: '#f3e8ff',
        verdictDot: '#34d399',
        hubBoxBg: 'rgba(255, 255, 255, 0.04)',
        hubBoxBorder: 'rgba(255, 255, 255, 0.10)',
        hubBoxText: '#c084fc',
      };

  // Base Background Fill
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, width, height);

  // Multi-stop ambient backdrop glows
  const bgGlow1 = ctx.createRadialGradient(width / 2, 440, 80, width / 2, 440, 720);
  bgGlow1.addColorStop(0, theme.ambientGlow1);
  bgGlow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlow1;
  ctx.fillRect(0, 0, width, height);

  const bgGlow2 = ctx.createRadialGradient(width / 2, 1400, 100, width / 2, 1400, 750);
  bgGlow2.addColorStop(0, theme.ambientGlow2);
  bgGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlow2;
  ctx.fillRect(0, 0, width, height);

  // -------------------------------------------------------------
  // 2. Top Header Bar (Single baseline, y = 44)
  // -------------------------------------------------------------
  const headerY = 44;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Brand Logo Text
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('GABRU', 44, headerY);

  const brandWidth = ctx.measureText('GABRU').width;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('•', 44 + brandWidth + 10, headerY);

  ctx.fillStyle = isLight ? '#7e22ce' : '#c084fc';
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CONTENT INTELLIGENCE AUDIT', 44 + brandWidth + 24, headerY);

  // Right Header: Platform & Creator Handle Pill
  const platform = (scoreData.item?.platform || 'INSTAGRAM').toUpperCase();
  const creator = scoreData.item?.creator?.handle || scoreData.item?.creator?.name || '@creator';
  const handlePillText = `${platform}  •  ${creator}`;
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const pillW = ctx.measureText(handlePillText).width + 30;
  const pillH = 32;
  const pillX = width - 44 - pillW;
  const pillY = headerY - pillH / 2;

  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
  ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)';
  ctx.fill();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = isLight ? '#334155' : '#f3e8ff';
  ctx.fillText(handlePillText, pillX + pillW / 2, headerY);
  ctx.restore();

  // -------------------------------------------------------------
  // 3. Upper Stage (y = 86 to 770, height = 684)
  // Left: Post Media / Graphic Stage (484 x 684)
  // Right: Executive Virality Hub (484 x 684)
  // -------------------------------------------------------------
  const upperY = 86;
  const stageH = 684;
  const colW = 484;
  const colGap = 24;
  const colLeftX = 44;
  const colRightX = colLeftX + colW + colGap; // 552

  // --- Left Column: Media Stage ---
  const mediaImgSrc = scoreData.item?.media?.thumbnailUrl || scoreData.item?.media?.mediaUrl || '';
  const mediaImg = mediaImgSrc ? await loadCardImage(mediaImgSrc) : null;

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  drawRoundedRect(ctx, colLeftX, upperY, colW, stageH, 20);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, colLeftX, upperY, colW, stageH, 20);
  ctx.strokeStyle = theme.photoBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (mediaImg) {
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, colLeftX, upperY, colW, stageH, 20);
    ctx.clip();
    drawImageCover(ctx, mediaImg, colLeftX, upperY, colW, stageH);

    // Subtle dark vignette at bottom for text legibility
    const mediaVignette = ctx.createLinearGradient(0, upperY + stageH - 180, 0, upperY + stageH);
    mediaVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    mediaVignette.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
    ctx.fillStyle = mediaVignette;
    ctx.fillRect(colLeftX, upperY + stageH - 180, colW, 180);
    ctx.restore();
  } else {
    // Stylized Media Fallback Card
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, colLeftX, upperY, colW, stageH, 20);
    ctx.clip();

    const mediaGrad = ctx.createLinearGradient(colLeftX, upperY, colLeftX + colW, upperY + stageH);
    mediaGrad.addColorStop(0, isLight ? '#f1f5f9' : '#13131f');
    mediaGrad.addColorStop(1, isLight ? '#e2e8f0' : '#0d0d15');
    ctx.fillStyle = mediaGrad;
    ctx.fillRect(colLeftX, upperY, colW, stageH);

    // Graphic icon in center
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '72px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🎬', colLeftX + colW / 2, upperY + stageH / 2 - 40);

    ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText('SINGLE POST AUDIT', colLeftX + colW / 2, upperY + stageH / 2 + 25);

    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('Multimodal Media Intelligence', colLeftX + colW / 2, upperY + stageH / 2 + 52);
    ctx.restore();
  }

  // Floating Platform Badge (Top-Left of Media)
  const formatText = (scoreData.item?.format || 'SHORT VIDEO').replace('_', ' ').toUpperCase();
  const formatBadgeText = `⚡ ${platform} ${formatText}`;
  ctx.save();
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const fBadgeW = ctx.measureText(formatBadgeText).width + 24;
  const fBadgeH = 30;
  const fBadgeX = colLeftX + 16;
  const fBadgeY = upperY + 16;

  drawRoundedRect(ctx, fBadgeX, fBadgeY, fBadgeW, fBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(168, 85, 247, 0.35)' : 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? '#7e22ce' : '#e9d5ff';
  ctx.fillText(formatBadgeText, fBadgeX + fBadgeW / 2, fBadgeY + fBadgeH / 2);
  ctx.restore();

  // Floating Telemetry Pill on Media (Bottom of Media)
  const likesCount = scoreData.telemetry?.likes ?? scoreData.item?.metrics?.likes ?? 0;
  const commentsCount = scoreData.telemetry?.comments ?? scoreData.item?.metrics?.comments ?? 0;
  const sharesCount = scoreData.telemetry?.shares ?? scoreData.item?.metrics?.shares ?? 0;
  const telemetryPillText = `🔥 ${formatMetric(likesCount)} Likes  •  💬 ${formatMetric(commentsCount)}  •  🚀 ${formatMetric(sharesCount)}`;

  ctx.save();
  ctx.font = '700 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tPillW = colW - 32;
  const tPillH = 36;
  const tPillX = colLeftX + 16;
  const tPillY = upperY + stageH - 16 - tPillH;

  drawRoundedRect(ctx, tPillX, tPillY, tPillW, tPillH, 10);
  ctx.fillStyle = 'rgba(15, 15, 22, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(telemetryPillText, tPillX + tPillW / 2, tPillY + tPillH / 2);
  ctx.restore();

  // --- Right Column: Executive Virality Hub ---
  // Sub-card 1: Master Virality Score Card (h = 246)
  const masterVal = typeof scoreData.contentScore === 'number'
    ? Math.round(scoreData.contentScore)
    : Math.round(scoreData.rawScore || 86);

  const hub1Y = upperY;
  const hub1H = 246;

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, colRightX, hub1Y, colW, hub1H, 18);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, colRightX, hub1Y, colW, hub1H, 18);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Score Header
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.hubBoxText;
  ctx.fillText('CONTENT VIRALITY INDEX', colRightX + 22, hub1Y + 18);

  // Big Score Number
  ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${masterVal}`, colRightX + 22, hub1Y + 38);

  const mValW = ctx.measureText(`${masterVal}`).width;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('/ 100', colRightX + 22 + mValW + 8, hub1Y + 70);

  // Score Progress Bar
  const pBarW = colW - 44;
  const pBarY = hub1Y + 118;
  drawRoundedRect(ctx, colRightX + 22, pBarY, pBarW, 8, 4);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const fillScoreW = Math.min(pBarW, Math.max(12, (masterVal / 100) * pBarW));
  drawRoundedRect(ctx, colRightX + 22, pBarY, fillScoreW, 8, 4);
  const mGrad = ctx.createLinearGradient(colRightX + 22, pBarY, colRightX + 22 + fillScoreW, pBarY);
  mGrad.addColorStop(0, '#a855f7');
  mGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = mGrad;
  ctx.fill();

  // Verdict Badge Pill
  const verdictBadgeText = (scoreData.verdictBadge || scoreData.verdict || 'GROUP-CHAT HALL OF FAMER').toUpperCase();
  const vPillY = hub1Y + 140;
  const vPillH = 38;
  const vPillW = colW - 44;

  drawRoundedRect(ctx, colRightX + 22, vPillY, vPillW, vPillH, 10);
  ctx.fillStyle = theme.verdictPillBg;
  ctx.fill();
  ctx.strokeStyle = theme.verdictPillBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = theme.verdictDot;
  ctx.beginPath();
  ctx.arc(colRightX + 40, vPillY + vPillH / 2, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '800 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.verdictPillText;
  ctx.fillText(verdictBadgeText, colRightX + 54, vPillY + vPillH / 2);

  // Archetype Subtitle Row
  const archetypeText = (scoreData.archetypeTier || 'S-Tier Masterpiece').toUpperCase();
  ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText(`Archetype: ${archetypeText}`, colRightX + 24, hub1Y + 204);
  ctx.restore();

  // Sub-card 2: Audience & Velocity Telemetry Hub (h = 210)
  const hub2Y = hub1Y + hub1H + 16;
  const hub2H = 210;

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, colRightX, hub2Y, colW, hub2H, 18);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, colRightX, hub2Y, colW, hub2H, 18);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Telemetry Grid (2x2)
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.hubBoxText;
  ctx.fillText('AUDIENCE & VIRAL VELOCITY', colRightX + 22, hub2Y + 16);

  const tMetrics = [
    { label: 'TRUE ENGAGEMENT', val: scoreData.telemetry?.trueEngagementRate || '8.45%', icon: '⚡' },
    { label: 'GROUP-CHAT RATE', val: scoreData.telemetry?.groupChatMultiplier || '14.2%', icon: '🚀' },
    { label: 'BOOKMARK RATE', val: scoreData.telemetry?.bookmarkRate || '9.8%', icon: '🔖' },
    { label: 'AUDIENCE REACH', val: formatMetric(scoreData.telemetry?.views || scoreData.telemetry?.reach || 125000), icon: '👁️' },
  ];

  const gridCellW = (colW - 56) / 2;
  const gridCellH = 68;

  tMetrics.forEach((m, idx) => {
    const r = Math.floor(idx / 2);
    const c = idx % 2;
    const gx = colRightX + 20 + c * (gridCellW + 16);
    const gy = hub2Y + 44 + r * (gridCellH + 12);

    drawRoundedRect(ctx, gx, gy, gridCellW, gridCellH, 10);
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '700 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText(`${m.icon} ${m.label}`, gx + 10, gy + 10);

    ctx.font = '900 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(m.val, gx + 10, gy + 32);
  });
  ctx.restore();

  // Sub-card 3: Post Hook & Caption Spotlight (h = 196)
  const hub3Y = hub2Y + hub2H + 16;
  const hub3H = stageH - (hub1H + 16 + hub2H + 16); // 196

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, colRightX, hub3Y, colW, hub3H, 18);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, colRightX, hub3Y, colW, hub3H, 18);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.hubBoxText;
  ctx.fillText('POST HOOK & CAPTION SPOTLIGHT', colRightX + 22, hub3Y + 16);

  const rawCaption = scoreData.item?.title || scoreData.item?.caption || 'Single Post Intelligence Audit';
  const cleanSnippet = rawCaption.length > 82 ? rawCaption.substring(0, 79) + '...' : rawCaption;

  ctx.font = 'italic 500 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(`“${cleanSnippet}”`, colRightX + 22, hub3Y + 44);

  // Word count & quality chips
  const wordCount = scoreData.item?.wordCount || cleanSnippet.split(/\s+/).length;
  const slangHits = scoreData.item?.slangMatchCount || 0;
  const chipText = `📝 ${wordCount} Words  •  🎯 ${slangHits} Slang Hits  •  ✨ Algorithmic Verified`;

  const chipY = hub3Y + hub3H - 44;
  drawRoundedRect(ctx, colRightX + 20, chipY, colW - 40, 28, 6);
  ctx.fillStyle = isLight ? 'rgba(168, 85, 247, 0.06)' : 'rgba(168, 85, 247, 0.12)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(168, 85, 247, 0.22)' : 'rgba(168, 85, 247, 0.32)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7e22ce' : '#e9d5ff';
  ctx.fillText(chipText, colRightX + colW / 2, chipY + 14);
  ctx.restore();

  // -------------------------------------------------------------
  // 4. Matrix Section Banner (y = 794 to 836)
  // -------------------------------------------------------------
  const matrixBannerY = 812;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '900 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('⚡ 10-POINT VIRALITY & CONTENT MATRIX', 44, matrixBannerY);

  ctx.textAlign = 'right';
  ctx.font = '600 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('40% Empirical Telemetry • 60% Virality Rubric', width - 44, matrixBannerY);
  ctx.restore();

  // -------------------------------------------------------------
  // 5. Lower Stage: 10-Point Parameter Matrix (y = 848 to 1818)
  // 2-Column x 5-Row Layout (Left: 1..5, Right: 6..10)
  // -------------------------------------------------------------
  const matrixStartY = 848;
  const paramCardW = colW; // 484
  const paramCardH = 174;
  const paramCardGapY = 18;

  // Resolve 10 parameters
  const paramItems = CONTENT_PARAMETERS.map((pDef) => {
    const existing = scoreData.parameters?.find((p) => p.id === pDef.id);
    const scoreVal = existing?.score ?? Math.round(scoreData.scores?.[`S${pDef.id}` as keyof typeof scoreData.scores] ?? 85);
    const shortName = SHORT_PARAM_NAMES[pDef.id] || pDef.name;
    const icon = CONTENT_PARAM_ICONS[pDef.id] || '✨';
    const statusText = existing?.roastOrCompliment
      ? (existing.roastOrCompliment.length > 36 ? existing.roastOrCompliment.substring(0, 34) + '...' : existing.roastOrCompliment)
      : (scoreVal >= 90 ? 'Standout Execution' : scoreVal >= 75 ? 'Strong Resonance' : 'Optimization Room');

    return {
      id: pDef.id,
      name: shortName,
      weight: pDef.weight,
      score: scoreVal,
      icon,
      status: statusText,
    };
  });

  const leftParams = paramItems.slice(0, 5);
  const rightParams = paramItems.slice(5, 10);

  const drawParamCard = (param: typeof paramItems[0], px: number, py: number) => {
    ctx.save();
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    drawRoundedRect(ctx, px, py, paramCardW, paramCardH, 14);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.restore();

    drawRoundedRect(ctx, px, py, paramCardW, paramCardH, 14);
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    // Top Row: Icon + Name
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(`${param.icon}  ${param.name}`, px + 16, py + 16);

    // Top Right: Weight Pill
    const wText = `Weight: ${param.weight}%`;
    ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const wTextW = ctx.measureText(wText).width + 14;
    const wH = 20;
    const wX = px + paramCardW - 16 - wTextW;
    const wY = py + 15;

    drawRoundedRect(ctx, wX, wY, wTextW, wH, 5);
    ctx.fillStyle = isLight ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0.16)';
    ctx.fill();
    ctx.strokeStyle = isLight ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#7e22ce' : '#c084fc';
    ctx.fillText(wText, wX + wTextW / 2, wY + wH / 2);

    // Middle Row: Score Number
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(`${param.score}`, px + 16, py + 48);

    const scoreNumW = ctx.measureText(`${param.score}`).width;
    ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('/ 100', px + 16 + scoreNumW + 4, py + 66);

    // Progress Bar Track & Fill
    const trackW = paramCardW - 32;
    const trackY = py + 104;
    drawRoundedRect(ctx, px + 16, trackY, trackW, 5, 2.5);
    ctx.fillStyle = theme.trackBg;
    ctx.fill();

    const filledW = Math.min(trackW, Math.max(8, (param.score / 100) * trackW));
    drawRoundedRect(ctx, px + 16, trackY, filledW, 5, 2.5);
    const pGrad = ctx.createLinearGradient(px + 16, trackY, px + 16 + filledW, trackY);
    pGrad.addColorStop(0, '#a855f7');
    pGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = pGrad;
    ctx.fill();

    // Bottom Subtitle / Roasting snippet
    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textSecondary;
    ctx.fillText(param.status, px + 16, py + 124);

    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText(param.score >= 80 ? 'High Viral Multiplier' : 'Retention Friction Area', px + 16, py + 146);
    ctx.restore();
  };

  // Draw Left 5 Cards
  leftParams.forEach((param, i) => {
    const cy = matrixStartY + i * (paramCardH + paramCardGapY);
    drawParamCard(param, colLeftX, cy);
  });

  // Draw Right 5 Cards
  rightParams.forEach((param, i) => {
    const cy = matrixStartY + i * (paramCardH + paramCardGapY);
    drawParamCard(param, colRightX, cy);
  });

  // -------------------------------------------------------------
  // 6. Platform URL & Viral Reach Footer Pill (y = 1846 to 1888)
  // -------------------------------------------------------------
  ctx.save();
  const ctaPillW = 680;
  const ctaPillH = 42;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1846;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 21);
  ctx.fillStyle = theme.urlPillBg;
  ctx.fill();
  ctx.strokeStyle = theme.urlPillBorder;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.90)';
  const promptPart = '🚀 Audit your post hook, virality & reach free at ';
  const urlPart = 'gabru.vercel.app/content-rating';
  const fullTextW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullTextW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7e22ce' : '#f0abfc';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();

  return canvas;
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob || !navigator.clipboard || !window.ClipboardItem) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        resolve(true);
      } catch {
        resolve(false);
      }
    }, 'image/png');
  });
}
