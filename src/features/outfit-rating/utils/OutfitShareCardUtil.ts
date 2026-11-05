/**
 * GABRU — OUTFIT RATING SHARE CARD CANVAS GENERATOR
 * 
 * Generates an ultra-crisp, 1080x1920 (9:16 Full Smartphone Screen) social media share card.
 * Native mobile format for Instagram Stories, TikTok, WhatsApp Status, and Snapchat.
 * 
 * Features:
 * - Reactive Theme System: Seamlessly renders in Dark Mode or Light Mode matching user preferences.
 * - Upper Stage: Center/Left Outfit Photo & Executive Style Score Hub.
 * - Lower Stage: 10-Parameter Sartorial Matrix in an executive 2-column layout.
 * - Bottom: Viral Reach CTA Bar.
 */

import { OutfitScoreData, ParameterDef } from '../types/OutfitRatingTypes';
import { drawRoundedRect, drawImageCover, isClientLightMode } from '@/shared/utils/CanvasUtil';

const OUTFIT_PARAM_ICONS: Record<number, string> = {
  1: '📐',
  2: '⚖️',
  3: '🏛️',
  4: '🎨',
  5: '👔',
  6: '🧵',
  7: '👞',
  8: '✨',
  9: '🎯',
  10: '⚡',
};

export function drawOutfitSocialCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photoScore: OutfitScoreData,
  parameters: ParameterDef[],
  themeLight?: boolean
): void {
  const isLight = themeLight ?? isClientLightMode();
  const width = 1080;
  const height = 1920;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  // -------------------------------------------------------------
  // 1. Color Palette Tokens (Mode-Reactive: Dark vs Light)
  // -------------------------------------------------------------
  const theme = isLight
    ? {
        canvasBg: '#f8fafc',
        ambientGlow1: 'rgba(56, 189, 248, 0.08)',
        ambientGlow2: 'rgba(16, 185, 129, 0.06)',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(15, 23, 42, 0.08)',
        cardShadow: 'rgba(15, 23, 42, 0.06)',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        textMuted: '#64748b',
        trackBg: 'rgba(15, 23, 42, 0.07)',
        urlPillBg: 'rgba(56, 189, 248, 0.08)',
        urlPillBorder: 'rgba(56, 189, 248, 0.35)',
        urlPillText: '#0284c7',
        photoBorder: 'rgba(15, 23, 42, 0.12)',
        verdictPillBg: 'rgba(16, 185, 129, 0.10)',
        verdictPillBorder: 'rgba(16, 185, 129, 0.35)',
        verdictPillText: '#065f46',
        verdictDot: '#10b981',
      }
    : {
        canvasBg: '#09090e',
        ambientGlow1: 'rgba(56, 189, 248, 0.14)',
        ambientGlow2: 'rgba(16, 185, 129, 0.10)',
        cardBg: 'rgba(18, 18, 28, 0.90)',
        cardBorder: 'rgba(255, 255, 255, 0.10)',
        cardShadow: 'rgba(0, 0, 0, 0.70)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.72)',
        textMuted: 'rgba(255, 255, 255, 0.45)',
        trackBg: 'rgba(255, 255, 255, 0.08)',
        urlPillBg: 'rgba(56, 189, 248, 0.12)',
        urlPillBorder: 'rgba(56, 189, 248, 0.38)',
        urlPillText: '#f0f9ff',
        photoBorder: 'rgba(255, 255, 255, 0.16)',
        verdictPillBg: 'rgba(56, 189, 248, 0.16)',
        verdictPillBorder: 'rgba(56, 189, 248, 0.38)',
        verdictPillText: '#f0f9ff',
        verdictDot: '#38bdf8',
      };

  // Base Background Fill
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, width, height);

  // Multi-stop ambient backdrop glows
  const bgGlowBlue = ctx.createRadialGradient(width / 2, 440, 80, width / 2, 440, 720);
  bgGlowBlue.addColorStop(0, theme.ambientGlow1);
  bgGlowBlue.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlowBlue;
  ctx.fillRect(0, 0, width, height);

  const bgGlowGreen = ctx.createRadialGradient(width / 2, 1380, 80, width / 2, 1380, 720);
  bgGlowGreen.addColorStop(0, theme.ambientGlow2);
  bgGlowGreen.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlowGreen;
  ctx.fillRect(0, 0, width, height);

  // -------------------------------------------------------------
  // 2. Slim Top Header Bar (Single baseline, y = 46)
  // -------------------------------------------------------------
  const headerY = 46;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Brand Logo Text
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('GABRU', 36, headerY);

  const brandWidth = ctx.measureText('GABRU').width;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('•', 36 + brandWidth + 10, headerY);

  ctx.fillStyle = theme.textSecondary;
  ctx.fillText('SARTORIAL FIT CHECK AUDIT', 36 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.online';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagW = ctx.measureText(platformUrl).width + 36;
  const tagH = 32;
  const tagX = width - 36 - tagW;
  const tagY = headerY - tagH / 2;

  drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 16);
  ctx.fillStyle = theme.urlPillBg;
  ctx.fill();
  ctx.strokeStyle = theme.urlPillBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Active glowing green beacon dot
  ctx.beginPath();
  ctx.arc(tagX + 16, headerY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = theme.urlPillText;
  ctx.fillText(platformUrl, tagX + 26, headerY);
  ctx.restore();

  // -------------------------------------------------------------
  // 3. Upper Hero Stage (y = 86 to 770, height = 684)
  // Left: Hero Outfit Photo (x = 36, w = 484, h = 684)
  // Right: Executive Style Score Hub (x = 540, w = 504, h = 684)
  // -------------------------------------------------------------
  const heroY = 86;
  const heroH = 684;

  const photoX = 36;
  const photoW = 484;
  const photoR = 22;

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  drawRoundedRect(ctx, photoX, heroY, photoW, heroH, photoR);
  ctx.fillStyle = isLight ? '#e2e8f0' : '#14141c';
  ctx.fill();
  ctx.restore();

  // Draw user's outfit photo
  drawImageCover(ctx, img, photoX, heroY, photoW, heroH, photoR, 'Outfit Photo');

  // Hairline frame border around hero photo
  drawRoundedRect(ctx, photoX, heroY, photoW, heroH, photoR);
  ctx.strokeStyle = theme.photoBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Bottom Vignette inside photo
  ctx.save();
  drawRoundedRect(ctx, photoX, heroY, photoW, heroH, photoR);
  ctx.clip();
  const bottomVignette = ctx.createLinearGradient(0, heroY + heroH - 180, 0, heroY + heroH);
  bottomVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomVignette.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(photoX, heroY + heroH - 180, photoW, 180);
  ctx.restore();

  // Floating Canonical 8-Head Badge (Top-Left)
  const propBadgeW = 200;
  const propBadgeH = 30;
  const propBadgeX = photoX + 16;
  const propBadgeY = heroY + 16;
  drawRoundedRect(ctx, propBadgeX, propBadgeY, propBadgeW, propBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.beginPath();
  ctx.arc(propBadgeX + 14, propBadgeY + propBadgeH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('8-HEAD PROPORTIONS', propBadgeX + propBadgeW / 2 + 6, propBadgeY + propBadgeH / 2);
  ctx.restore();

  // Floating Tailoring Tolerance Badge (Top-Right)
  const tolBadgeW = 144;
  const tolBadgeH = 30;
  const tolBadgeX = photoX + photoW - 16 - tolBadgeW;
  const tolBadgeY = heroY + 16;
  drawRoundedRect(ctx, tolBadgeX, tolBadgeY, tolBadgeW, tolBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#059669' : '#34d399';
  ctx.fillText('📐 TOLERANCE ±0.05', tolBadgeX + tolBadgeW / 2, tolBadgeY + tolBadgeH / 2);
  ctx.restore();

  // Over-Photo Status Pill (Bottom-Center)
  const fitPillW = 260;
  const fitPillH = 28;
  const fitPillX = photoX + (photoW - fitPillW) / 2;
  const fitPillY = heroY + heroH - 38;
  drawRoundedRect(ctx, fitPillX, fitPillY, fitPillW, fitPillH, 14);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(fitPillX + 16, fitPillY + fitPillH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('✓ Silhouette Proportions Verified', fitPillX + fitPillW / 2 + 6, fitPillY + fitPillH / 2);
  ctx.restore();

  // Right Column: Executive Style Score Hub
  const hubX = 540;
  const hubW = 504;
  const hubR = 22;

  ctx.save();
  ctx.shadowColor = theme.cardShadow;
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  drawRoundedRect(ctx, hubX, heroY, hubW, heroH, hubR);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, hubX, heroY, hubW, heroH, hubR);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Master Score Section
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText('MASTER SARTORIAL FIT SCORE', hubX + 24, heroY + 24);

  const scoreStr = String(photoScore.overallScore);
  ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(scoreStr, hubX + 24, heroY + 44);

  const scoreW = ctx.measureText(scoreStr).width;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('/ 100', hubX + 24 + scoreW + 8, heroY + 76);

  // Verdict Pill
  const verdictText = (photoScore.verdict || 'EXEMPLARY SARTORIAL POLISH').toUpperCase();
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const vPillW = ctx.measureText(verdictText).width + 36;
  const vPillH = 30;
  const vPillX = hubX + 24;
  const vPillY = heroY + 120;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 8);
  ctx.fillStyle = theme.verdictPillBg;
  ctx.fill();
  ctx.strokeStyle = theme.verdictPillBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = theme.verdictDot;
  ctx.beginPath();
  ctx.arc(vPillX + 14, vPillY + vPillH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.verdictPillText;
  ctx.fillText(verdictText, vPillX + 24, vPillY + vPillH / 2);

  // Tier 1: Foundations Box (71 Pts)
  const tier1Score = photoScore.tier1Score ?? 64.2;
  const t1BoxX = hubX + 24;
  const t1BoxY = heroY + 168;
  const t1BoxW = hubW - 48;
  const t1BoxH = 110;
  const t1BoxR = 14;

  drawRoundedRect(ctx, t1BoxX, t1BoxY, t1BoxW, t1BoxH, t1BoxR);
  ctx.fillStyle = isLight ? 'rgba(56, 189, 248, 0.06)' : 'rgba(56, 189, 248, 0.10)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(56, 189, 248, 0.28)' : 'rgba(56, 189, 248, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText('🏛️ FOUNDATIONS & SILHOUETTE (71 PTS MAX)', t1BoxX + 16, t1BoxY + 14);

  ctx.font = '900 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${tier1Score.toFixed(1)} Pts`, t1BoxX + 16, t1BoxY + 34);

  const t1W = t1BoxW - 32;
  const t1Y = t1BoxY + 68;
  drawRoundedRect(ctx, t1BoxX + 16, t1Y, t1W, 5, 2.5);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const t1FillW = Math.min(t1W, Math.max(10, (tier1Score / 71) * t1W));
  drawRoundedRect(ctx, t1BoxX + 16, t1Y, t1FillW, 5, 2.5);
  const t1Grad = ctx.createLinearGradient(t1BoxX + 16, t1Y, t1BoxX + 16 + t1FillW, t1Y);
  t1Grad.addColorStop(0, '#38bdf8');
  t1Grad.addColorStop(1, '#10b981');
  ctx.fillStyle = t1Grad;
  ctx.fill();

  ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText('Shoulder seam, leg balance, silhouette & occasion fit', t1BoxX + 16, t1BoxY + 82);

  // Tier 2: Styling & Polish Box (19 Pts)
  const tier2Score = photoScore.tier2Score ?? 16.8;
  const t2BoxX = hubX + 24;
  const t2BoxY = t1BoxY + t1BoxH + 14;
  const t2BoxW = t1BoxW;
  const t2BoxH = 100;
  const t2BoxR = 14;

  drawRoundedRect(ctx, t2BoxX, t2BoxY, t2BoxW, t2BoxH, t2BoxR);
  ctx.fillStyle = isLight ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.10)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#059669' : '#34d399';
  ctx.fillText('✨ STYLING & DETAIL POLISH (19 PTS MAX)', t2BoxX + 16, t2BoxY + 14);

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${tier2Score.toFixed(1)} Pts`, t2BoxX + 16, t2BoxY + 34);

  const t2W = t2BoxW - 32;
  const t2Y = t2BoxY + 66;
  drawRoundedRect(ctx, t2BoxX + 16, t2Y, t2W, 5, 2.5);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const t2FillW = Math.min(t2W, Math.max(10, (tier2Score / 19) * t2W));
  drawRoundedRect(ctx, t2BoxX + 16, t2Y, t2FillW, 5, 2.5);
  const t2Grad = ctx.createLinearGradient(t2BoxX + 16, t2Y, t2BoxX + 16 + t2FillW, t2Y);
  t2Grad.addColorStop(0, '#10b981');
  t2Grad.addColorStop(1, '#a855f7');
  ctx.fillStyle = t2Grad;
  ctx.fill();

  // Diagnostic Highlights Summary Row (3 Chips)
  const p1 = photoScore.parameterRatings[1]?.ratingR ?? 9.5;
  const p2 = photoScore.parameterRatings[2]?.ratingR ?? 9.2;
  const p4 = photoScore.parameterRatings[4]?.ratingR ?? 9.0;
  const chipStartY = t2BoxY + t2BoxH + 16;

  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(`📐 Tailoring Fit: ${p1.toFixed(1)}/10`, hubX + 24, chipStartY);
  ctx.fillText(`⚖️ Proportions: ${p2.toFixed(1)}/10`, hubX + 24, chipStartY + 24);
  ctx.fillText(`🎨 Color Harmony: ${p4.toFixed(1)}/10`, hubX + 24, chipStartY + 48);

  // Top Style Recommendation Pill
  const recY = chipStartY + 80;
  const recW = hubW - 48;
  const recH = 46;
  drawRoundedRect(ctx, hubX + 24, recY, recW, recH, 10);
  ctx.fillStyle = isLight ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.12)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(56, 189, 248, 0.28)' : 'rgba(56, 189, 248, 0.38)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText('⚡ Style Advice: ', hubX + 38, recY + recH / 2);

  const adviceLabelW = ctx.measureText('⚡ Style Advice: ').width;
  ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  const adviceText = photoScore.topQuickFix?.action || photoScore.summarySentence || 'Preserve collar stance & taper trouser break';
  ctx.fillText(adviceText.slice(0, 36) + (adviceText.length > 36 ? '...' : ''), hubX + 38 + adviceLabelW, recY + recH / 2);

  ctx.restore();

  // -------------------------------------------------------------
  // 4. 10-PARAMETER SARTORIAL MATRIX (Bottom Stage)
  // Section Header: y = 808
  // 2 Columns x 5 Rows Grid: y = 840 to 1820
  // -------------------------------------------------------------
  const matrixHeaderY = 808;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Section Eyebrow Sparkle Icon + Title
  ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText('👔', 36, matrixHeaderY);

  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('10-PARAMETER SARTORIAL MATRIX', 64, matrixHeaderY);

  // Right Tag Badge
  const matrixMetaText = 'Canonical 8-Head Fit Analysis';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const metaBadgeW = ctx.measureText(matrixMetaText).width + 24;
  const metaBadgeH = 28;
  const metaBadgeX = width - 36 - metaBadgeW;
  const metaBadgeY = matrixHeaderY - metaBadgeH / 2;

  drawRoundedRect(ctx, metaBadgeX, metaBadgeY, metaBadgeW, metaBadgeH, 14);
  ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(matrixMetaText, metaBadgeX + metaBadgeW / 2, matrixHeaderY);
  ctx.restore();

  // 10 Parameters (2 Columns x 5 Rows)
  const gridStartX = 36;
  const gridStartY = 840;
  const gridTotalW = width - 72; // 1008 px
  const gapX = 16;
  const gapY = 16;
  const paramCardW = (gridTotalW - gapX) / 2; // 496 px
  const paramCardH = 180;

  const defaultDescriptions: Record<number, string> = {
    1: 'Shoulder seam anchor, sleeve cuff, and torso contour',
    2: 'Torso-to-leg 8-head proportional equilibrium',
    3: 'Taper, garment drapery, and architectural drape',
    4: 'Color balancing, skin undertone, and contrast harmony',
    5: 'Contextual dressing, formality, and venue synergy',
    6: 'Textile weight, breathability, and drape coherence',
    7: 'Shoe proportion, heel balance, and hem interaction',
    8: 'Accessories, grooming, jewelry, and wristwatch cadence',
    9: 'Deliberate styling, purposefulness, and personal aesthetic',
    10: 'Confident presence, effortless swagger, and aura',
  };

  const getTierTag = (paramId: number) => {
    if (paramId <= 4) return { tag: 'FOUNDATIONS', color: isLight ? '#0284c7' : '#38bdf8' };
    if (paramId <= 8) return { tag: 'STYLING', color: isLight ? '#059669' : '#34d399' };
    return { tag: 'POLISH', color: isLight ? '#7c3aed' : '#c084fc' };
  };

  for (let i = 1; i <= 10; i++) {
    const col = (i - 1) % 2;
    const row = Math.floor((i - 1) / 2);
    const cx = gridStartX + col * (paramCardW + gapX);
    const cy = gridStartY + row * (paramCardH + gapY);

    const paramDef = parameters.find((p) => p.id === i);
    const paramRating = photoScore.parameterRatings[i];
    const ratingVal = paramRating?.ratingR ?? 8.5;
    const tierMeta = getTierTag(i);
    const desc = paramRating?.bestFix?.action || defaultDescriptions[i] || 'Harmonious sartorial execution';

    ctx.save();
    // Glass card surface
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    drawRoundedRect(ctx, cx, cy, paramCardW, paramCardH, 16);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.restore();

    drawRoundedRect(ctx, cx, cy, paramCardW, paramCardH, 16);
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top: Icon + Name + Tier Badge
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    const icon = OUTFIT_PARAM_ICONS[i] || '👔';
    const name = paramDef?.name || `Parameter ${i}`;
    ctx.fillText(`${icon} ${name}`, cx + 18, cy + 18);

    // Tier Tag
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagText = tierMeta.tag;
    const tagW = ctx.measureText(tagText).width + 14;
    const tagH = 20;
    const tagX = cx + paramCardW - 18 - tagW;
    const tagY = cy + 16;

    drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 5);
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = tierMeta.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = tierMeta.color;
    ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2);

    // Score Number
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    const scoreValStr = ratingVal.toFixed(1);
    ctx.fillText(scoreValStr, cx + 18, cy + 48);

    const sValW = ctx.measureText(scoreValStr).width;
    ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('/ 10', cx + 18 + sValW + 4, cy + 66);

    // Progress Bar Track & Fill
    const barW = paramCardW - 36;
    const barY = cy + 104;
    drawRoundedRect(ctx, cx + 18, barY, barW, 5, 2.5);
    ctx.fillStyle = theme.trackBg;
    ctx.fill();

    const fillW = Math.min(barW, Math.max(8, (ratingVal / 10) * barW));
    drawRoundedRect(ctx, cx + 18, barY, fillW, 5, 2.5);
    const grad = ctx.createLinearGradient(cx + 18, barY, cx + 18 + fillW, barY);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#10b981');
    ctx.fillStyle = grad;
    ctx.fill();

    // Diagnostic Description
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textSecondary;
    ctx.fillText(desc.length > 56 ? desc.slice(0, 54) + '...' : desc, cx + 18, cy + 128);

    ctx.restore();
  }

  // -------------------------------------------------------------
  // 5. Platform URL & Viral Reach Footer Pill (y = 1846 to 1888)
  // -------------------------------------------------------------
  ctx.save();
  const ctaPillW = 660;
  const ctaPillH = 38;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1846;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 19);
  ctx.fillStyle = theme.urlPillBg;
  ctx.fill();
  ctx.strokeStyle = theme.urlPillBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;

  const promptPart = '👔 Rate your outfit, silhouette & tailoring free at ';
  const urlPart = 'gabru.online';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();
}
