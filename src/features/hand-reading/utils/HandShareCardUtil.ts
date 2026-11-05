/**
 * GABRU — HAND READING HIGH-RESOLUTION 1080x1920 (9:16) SHARE CARD CANVAS
 * 
 * Generates an ultra-crisp, 1080x1920 (9:16 Full Smartphone Screen) social media share card.
 * Native mobile format for Instagram Stories, TikTok, WhatsApp Status, and Snapchat.
 * 
 * Features:
 * - Reactive Theme System: Seamlessly renders in Dark Mode or Light Mode matching user preferences.
 * - Upper Stage: Palm Photo & Executive Prominence Index Hub.
 * - Lower Stage: 10 Palm Parameters (Creases & Mounts) in an executive 2-column layout.
 * - Bottom: Viral Reach CTA Bar.
 */

import { HandReadingResult } from '../types/HandReadingTypes';
import { HAND_PARAMETERS } from '../constants/HandReadingConstants';
import { drawRoundedRect, drawImageCover, isClientLightMode } from '@/shared/utils/CanvasUtil';

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

export async function generateHandShareCardCanvas(
  result: HandReadingResult,
  userImageUri?: string,
  themeLight?: boolean
): Promise<string> {
  const isLight = themeLight ?? isClientLightMode();
  const width = 1080;
  const height = 1920;
  const scale = 2; // Ultra-HD 2x (2160 x 3840)
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // -------------------------------------------------------------
  // 1. Color Palette Tokens (Mode-Reactive: Dark vs Light)
  // -------------------------------------------------------------
  const theme = isLight
    ? {
        canvasBg: '#f8fafc',
        ambientGlow1: 'rgba(147, 51, 234, 0.08)',
        ambientGlow2: 'rgba(16, 185, 129, 0.06)',
        cardBg: 'rgba(255, 255, 255, 0.96)',
        cardBorder: 'rgba(15, 23, 42, 0.08)',
        cardShadow: 'rgba(15, 23, 42, 0.06)',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        textMuted: '#64748b',
        trackBg: 'rgba(15, 23, 42, 0.07)',
        urlPillBg: 'rgba(147, 51, 234, 0.08)',
        urlPillBorder: 'rgba(147, 51, 234, 0.35)',
        urlPillText: '#7e22ce',
        photoBorder: 'rgba(15, 23, 42, 0.12)',
        verdictPillBg: 'rgba(16, 185, 129, 0.10)',
        verdictPillBorder: 'rgba(16, 185, 129, 0.35)',
        verdictPillText: '#065f46',
        verdictDot: '#10b981',
      }
    : {
        canvasBg: '#09090e',
        ambientGlow1: 'rgba(168, 85, 247, 0.16)',
        ambientGlow2: 'rgba(16, 185, 129, 0.10)',
        cardBg: 'rgba(18, 18, 28, 0.90)',
        cardBorder: 'rgba(255, 255, 255, 0.10)',
        cardShadow: 'rgba(0, 0, 0, 0.70)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.72)',
        textMuted: 'rgba(255, 255, 255, 0.45)',
        trackBg: 'rgba(255, 255, 255, 0.08)',
        urlPillBg: 'rgba(168, 85, 247, 0.14)',
        urlPillBorder: 'rgba(168, 85, 247, 0.42)',
        urlPillText: '#f3e8ff',
        photoBorder: 'rgba(255, 255, 255, 0.16)',
        verdictPillBg: 'rgba(168, 85, 247, 0.16)',
        verdictPillBorder: 'rgba(168, 85, 247, 0.38)',
        verdictPillText: '#f3e8ff',
        verdictDot: '#34d399',
      };

  // Base Background Fill
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, width, height);

  // Ambient backdrop glows
  const bgGlow = ctx.createRadialGradient(width / 2, 440, 80, width / 2, 440, 720);
  bgGlow.addColorStop(0, theme.ambientGlow1);
  bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlow;
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
  ctx.fillText('PALMISTRY & SAMUDRIKA SHASTRA', 36 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.online/hand-reading';
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
  // Left: Hero Palm Photo (x = 36, w = 484, h = 684)
  // Right: Executive Prominence Hub (x = 540, w = 504, h = 684)
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

  // Load palm photo or fallback to blueprint
  const imageSource = userImageUri || '/hand_reading_sketch.jpg';
  let img = await loadCardImage(imageSource);
  if (!img) {
    img = await loadCardImage('/hand_reading_sketch.jpg');
  }

  if (img) {
    drawImageCover(ctx, img, photoX, heroY, photoW, heroH, photoR, 'Palm Photo');
  }

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

  // Floating Constitutional Archetype Badge inside Hero Photo
  const archText = `ARCHETYPE: ${result.handTypeLabel.toUpperCase()}`;
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const archBadgeW = ctx.measureText(archText).width + 36;
  const archBadgeH = 30;
  const archBadgeX = photoX + 16;
  const archBadgeY = heroY + 16;
  drawRoundedRect(ctx, archBadgeX, archBadgeY, archBadgeW, archBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(147, 51, 234, 0.35)' : 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.beginPath();
  ctx.arc(archBadgeX + 14, archBadgeY + archBadgeH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(archText, archBadgeX + archBadgeW / 2 + 6, archBadgeY + archBadgeH / 2);
  ctx.restore();

  // Over-Photo Status Pill (Bottom-Center)
  const palmPillW = 260;
  const palmPillH = 28;
  const palmPillX = photoX + (photoW - palmPillW) / 2;
  const palmPillY = heroY + heroH - 38;
  drawRoundedRect(ctx, palmPillX, palmPillY, palmPillW, palmPillH, 14);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(147, 51, 234, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.beginPath();
  ctx.arc(palmPillX + 16, palmPillY + palmPillH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('✓ Quadrilateral Palm Geometry', palmPillX + palmPillW / 2 + 6, palmPillY + palmPillH / 2);
  ctx.restore();

  // Right Column: Executive Prominence Hub
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
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText('PROMINENCE INDEX SCORE', hubX + 24, heroY + 24);

  const scoreNumStr = result.overallProminenceIndex.toFixed(1);
  ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(scoreNumStr, hubX + 24, heroY + 44);

  const scoreW = ctx.measureText(scoreNumStr).width;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('/ 100', hubX + 24 + scoreW + 8, heroY + 76);

  // Verdict Pill
  const verdictText = result.overallBandLabel.toUpperCase();
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

  // Samudrika Vedic Shastra Card inside Hub
  const samBoxX = hubX + 24;
  const samBoxY = heroY + 168;
  const samBoxW = hubW - 48;
  const samBoxH = 110;
  const samBoxR = 14;

  drawRoundedRect(ctx, samBoxX, samBoxY, samBoxW, samBoxH, samBoxR);
  ctx.fillStyle = isLight ? 'rgba(147, 51, 234, 0.06)' : 'rgba(168, 85, 247, 0.10)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(147, 51, 234, 0.28)' : 'rgba(168, 85, 247, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText('☸️ SAMUDRIKA SHASTRA TRADITION', samBoxX + 16, samBoxY + 14);

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${result.handTypeLabel} Constitution`, samBoxX + 16, samBoxY + 34);

  const qVal = result.qualityGate?.q ? result.qualityGate.q.toFixed(2) : '1.00';
  const trackW = samBoxW - 32;
  const trackY = samBoxY + 66;
  drawRoundedRect(ctx, samBoxX + 16, trackY, trackW, 5, 2.5);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const fillW = Math.min(trackW, Math.max(10, (result.overallProminenceIndex / 100) * trackW));
  drawRoundedRect(ctx, samBoxX + 16, trackY, fillW, 5, 2.5);
  const grad = ctx.createLinearGradient(samBoxX + 16, trackY, samBoxX + 16 + fillW, trackY);
  grad.addColorStop(0, '#a855f7');
  grad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(`Quality factor q=${qVal} • Confidence: ${result.confidenceTier}`, samBoxX + 16, samBoxY + 80);

  // Traditional Insights Summary Row
  const lifeLineParam = result.parameters.find(p => p.key === 'life_line');
  const headLineParam = result.parameters.find(p => p.key === 'head_line');
  const samReading = lifeLineParam?.readingSentence || 'Traditionally associated with steady vitality, focus, and purposeful resolve.';
  const westReading = headLineParam?.readingSentence || 'Features balanced major creases and strong foundational mounts.';
  const insightStartY = samBoxY + samBoxH + 18;

  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText('🌿 Vedic Prana / Vitality:', hubX + 24, insightStartY);
  ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(samReading.length > 52 ? samReading.slice(0, 50) + '...' : samReading, hubX + 24, insightStartY + 20);

  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText('🏛️ Western Chiromancy:', hubX + 24, insightStartY + 50);
  ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(westReading.length > 52 ? westReading.slice(0, 50) + '...' : westReading, hubX + 24, insightStartY + 70);

  // Subtle Footer Note inside Hub
  ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('Entertainment & Cultural Palmistry Analysis', hubX + 24, heroY + heroH - 30);

  ctx.restore();

  // -------------------------------------------------------------
  // 4. 10 PALM CREASES & MOUNTS MATRIX (Bottom Stage)
  // Section Header: y = 808
  // 2 Columns x 5 Rows Grid: y = 840 to 1820
  // -------------------------------------------------------------
  const matrixHeaderY = 808;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText('✋', 36, matrixHeaderY);

  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('10 PALM CREASES & PLANETARY MOUNTS MATRIX', 64, matrixHeaderY);

  const matrixMetaText = '108 Vedic Lakshanas • Chiromancy';
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

  // 10 Parameters Grid (2 Columns x 5 Rows)
  const gridStartX = 36;
  const gridStartY = 840;
  const gridTotalW = width - 72; // 1008 px
  const gapX = 16;
  const gapY = 16;
  const paramCardW = (gridTotalW - gapX) / 2; // 496 px
  const paramCardH = 180;

  for (let i = 0; i < 10; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridStartX + col * (paramCardW + gapX);
    const cy = gridStartY + row * (paramCardH + gapY);

    const paramDef = HAND_PARAMETERS[i];
    const scored = result.parameters.find((p) => p.key === paramDef.key || p.id === paramDef.id);
    const isAbsent = scored?.isAbsent ?? false;
    const isReadable = scored?.isReadable ?? true;
    const scoreVal = scored ? scored.score : 0;
    const bandLabel = scored?.bandLabel || 'Measured';

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

    // Top: Icon + Name + Band Label Pill
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(`${paramDef.icon} ${paramDef.name}`, cx + 18, cy + 18);

    // Band Tag Pill
    const tagText = isAbsent ? 'ABSENT' : bandLabel.toUpperCase();
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagW = ctx.measureText(tagText).width + 14;
    const tagH = 20;
    const tagX = cx + paramCardW - 18 - tagW;
    const tagY = cy + 16;

    drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 5);
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    const tagColor = isAbsent ? theme.textMuted : (isLight ? '#7c3aed' : '#c084fc');
    ctx.strokeStyle = tagColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = tagColor;
    ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2);

    // Score Number
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (isAbsent) {
      ctx.font = '800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = theme.textMuted;
      ctx.fillText('Absent', cx + 18, cy + 54);
    } else if (!isReadable) {
      ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = isLight ? '#d97706' : '#fbbf24';
      ctx.fillText('Low Contrast', cx + 18, cy + 54);
    } else {
      ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = theme.textPrimary;
      const scoreStr = scoreVal.toFixed(1);
      ctx.fillText(scoreStr, cx + 18, cy + 48);

      const sW = ctx.measureText(scoreStr).width;
      ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = theme.textMuted;
      ctx.fillText('/ 100', cx + 18 + sW + 4, cy + 66);
    }

    // Progress Bar Track & Fill
    const barW = paramCardW - 36;
    const barY = cy + 104;
    drawRoundedRect(ctx, cx + 18, barY, barW, 5, 2.5);
    ctx.fillStyle = theme.trackBg;
    ctx.fill();

    if (!isAbsent && isReadable) {
      const fillW = Math.min(barW, Math.max(8, (scoreVal / 100) * barW));
      drawRoundedRect(ctx, cx + 18, barY, fillW, 5, 2.5);
      const grad = ctx.createLinearGradient(cx + 18, barY, cx + 18 + fillW, barY);
      grad.addColorStop(0, '#a855f7');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Diagnostic Description
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textSecondary;
    const desc = paramDef.traditionalAssociation || paramDef.whatAiMeasures || 'Measured ridge morphology';
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

  const promptPart = '🖐️ Read your palm lines & mounts free at ';
  const urlPart = 'gabru.online/hand-reading';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
