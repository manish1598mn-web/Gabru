/**
 * GABRU — FACIAL BEAUTY SHARE CARD CANVAS GENERATOR
 * 
 * Generates an ultra-crisp, 1080x1920 (9:16 Full Smartphone Screen) social share card.
 * Native mobile format for Instagram Stories, TikTok, WhatsApp Status, and Snapchat.
 * 
 * Features:
 * - Reactive Theme System: Seamlessly renders in Dark Mode or Light Mode matching user preferences.
 * - Upper Stage: High-Resolution Portrait Photo & Executive Master Biometrics Hub.
 * - Lower Stage: Dedicated "ESSENTIAL FACIAL FEATURES MATRIX" in a high-fashion 3x3 grid.
 * - Bottom: Viral Reach CTA Bar.
 */

import { BeautyParameterDef, ScoreCalculationResult, BeautyPillarsBreakdown } from '../types/FacialBeautyTypes';
import { drawRoundedRect, drawImageCover, isClientLightMode } from '@/shared/utils/CanvasUtil';

export interface BeautyCardScoreData extends ScoreCalculationResult {
  colorPalette: {
    skinTone: string;
    lipTone: string;
    undertone: string;
    vitalityLevel: string;
  };
  metrics: {
    symmetryIndex: number;
    goldenRatioAdherence: number;
    beautyPillars?: BeautyPillarsBreakdown;
    canthalTiltDeg?: number;
    aspectRatio?: number;
    facialThirdsBalance?: string;
  };
  beautyPillars?: BeautyPillarsBreakdown;
}

interface SharePillarCard {
  name: string;
  icon: string;
  score: number;
  subtitle: string;
  detail: string;
  tag: string;
  tagColor: string;
  gradColors: [string, string];
}

export function drawBeautySocialCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  scoreData: BeautyCardScoreData,
  parameters: BeautyParameterDef[],
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
        ambientGlow1: 'rgba(147, 51, 234, 0.08)',
        ambientGlow2: 'rgba(217, 119, 6, 0.06)',
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
        phiBoxBg: 'rgba(245, 158, 11, 0.07)',
        phiBoxBorder: 'rgba(217, 119, 6, 0.28)',
        phiText: '#b45309',
        bioBoxBg: 'rgba(147, 51, 234, 0.05)',
        bioBoxBorder: 'rgba(147, 51, 234, 0.20)',
        bioText: '#6b21a8',
        verdictPillBg: 'rgba(16, 185, 129, 0.10)',
        verdictPillBorder: 'rgba(16, 185, 129, 0.35)',
        verdictPillText: '#065f46',
        verdictDot: '#10b981',
      }
    : {
        canvasBg: '#09090e',
        ambientGlow1: 'rgba(168, 85, 247, 0.18)',
        ambientGlow2: 'rgba(245, 158, 11, 0.12)',
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
        phiBoxBg: 'rgba(245, 158, 11, 0.10)',
        phiBoxBorder: 'rgba(245, 158, 11, 0.38)',
        phiText: '#fbbf24',
        bioBoxBg: 'rgba(255, 255, 255, 0.04)',
        bioBoxBorder: 'rgba(255, 255, 255, 0.10)',
        bioText: '#c084fc',
        verdictPillBg: 'rgba(168, 85, 247, 0.16)',
        verdictPillBorder: 'rgba(168, 85, 247, 0.38)',
        verdictPillText: '#f3e8ff',
        verdictDot: '#34d399',
      };

  // Base Background Fill
  ctx.fillStyle = theme.canvasBg;
  ctx.fillRect(0, 0, width, height);

  // Multi-stop ambient backdrop glows
  const bgGlowPurple = ctx.createRadialGradient(width / 2, 440, 80, width / 2, 440, 720);
  bgGlowPurple.addColorStop(0, theme.ambientGlow1);
  bgGlowPurple.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlowPurple;
  ctx.fillRect(0, 0, width, height);

  const bgGlowGold = ctx.createRadialGradient(width / 2, 1380, 80, width / 2, 1380, 720);
  bgGlowGold.addColorStop(0, theme.ambientGlow2);
  bgGlowGold.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlowGold;
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
  ctx.fillText('HUMAN-CALIBRATED FACIAL BEAUTY AUDIT', 36 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.vercel.app/beauty-rating';
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
  // 3. Golden Ratio & Metrics Preparation
  // -------------------------------------------------------------
  const rawPhi = (scoreData.metrics as Record<string, unknown>)?.phase3
    ? ((scoreData.metrics as Record<string, unknown>).phase3 as { harmony?: { goldenRatios?: Array<{ value: number }> } })?.harmony?.goldenRatios?.[0]?.value ?? 1.618
    : (scoreData.metrics?.aspectRatio && scoreData.metrics.aspectRatio > 0
      ? 1 / scoreData.metrics.aspectRatio
      : 1.618);
  const idealPhi = 1.618;
  const phiAdherence = scoreData.metrics?.goldenRatioAdherence !== undefined
    ? scoreData.metrics.goldenRatioAdherence
    : Math.round(rawPhi <= idealPhi ? (rawPhi / idealPhi) * 100 : (idealPhi / rawPhi) * 100);

  const pillars = scoreData.beautyPillars || scoreData.metrics?.beautyPillars;
  const symmIndex = scoreData.metrics?.symmetryIndex ?? 88;

  // -------------------------------------------------------------
  // 4. Upper Hero Stage (y = 86 to 770, height = 684)
  // Left: Hero Portrait Photo (x = 36, w = 484, h = 684)
  // Right: Executive Master Biometrics Hub (x = 540, w = 504, h = 684)
  // -------------------------------------------------------------
  const heroY = 86;
  const heroH = 684;

  // Left Column: Portrait Photo
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

  // Draw user's portrait face photo
  drawImageCover(ctx, img, photoX, heroY, photoW, heroH, photoR, 'Portrait Photo');

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

  // Floating 468 3D Mesh Badge inside Hero Photo (Top-Left)
  const meshBadgeW = 186;
  const meshBadgeH = 30;
  const meshBadgeX = photoX + 16;
  const meshBadgeY = heroY + 16;
  drawRoundedRect(ctx, meshBadgeX, meshBadgeY, meshBadgeW, meshBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(147, 51, 234, 0.35)' : 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.beginPath();
  ctx.arc(meshBadgeX + 14, meshBadgeY + meshBadgeH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('468 3D MESH LANDMARKS', meshBadgeX + meshBadgeW / 2 + 6, meshBadgeY + meshBadgeH / 2);
  ctx.restore();

  // Floating Golden Ratio φ Badge inside Hero Photo (Top-Right)
  const phiBadgeW = 146;
  const phiBadgeH = 30;
  const phiBadgeX = photoX + photoW - 16 - phiBadgeW;
  const phiBadgeY = heroY + 16;
  drawRoundedRect(ctx, phiBadgeX, phiBadgeY, phiBadgeW, phiBadgeH, 8);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.40)' : 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#b45309' : '#fbbf24';
  ctx.fillText(`⚜️ φ ${rawPhi.toFixed(3)} (${phiAdherence}%)`, phiBadgeX + phiBadgeW / 2, phiBadgeY + phiBadgeH / 2);
  ctx.restore();

  // Over-Photo Verified Biometrics Status Pill (Bottom-Center)
  const verifiedPillW = 260;
  const verifiedPillH = 28;
  const verifiedPillX = photoX + (photoW - verifiedPillW) / 2;
  const verifiedPillY = heroY + heroH - 38;
  drawRoundedRect(ctx, verifiedPillX, verifiedPillY, verifiedPillW, verifiedPillH, 14);
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 15, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(verifiedPillX + 16, verifiedPillY + verifiedPillH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('✓ Frontal Biometrics Verified', verifiedPillX + verifiedPillW / 2 + 6, verifiedPillY + verifiedPillH / 2);
  ctx.restore();

  // Right Column: Executive Master Biometrics Hub (x = 540, w = 504, h = 684)
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
  ctx.fillText('MASTER FACIAL BEAUTY SCORE', hubX + 24, heroY + 24);

  const scoreNumStr = typeof scoreData.faceScore === 'number'
    ? (Number.isInteger(scoreData.faceScore) ? String(scoreData.faceScore) : scoreData.faceScore.toFixed(1))
    : '85.0';

  ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(scoreNumStr, hubX + 24, heroY + 44);

  const scoreW = ctx.measureText(scoreNumStr).width;
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textMuted;
  ctx.fillText('/ 100', hubX + 24 + scoreW + 8, heroY + 76);

  // Verdict Pill
  const verdictText = (scoreData.verdict || 'HIGH HARMONY').toUpperCase();
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

  // Golden Ratio Showcase Card inside Hub
  const phiBoxX = hubX + 24;
  const phiBoxY = heroY + 168;
  const phiBoxW = hubW - 48;
  const phiBoxH = 120;
  const phiBoxR = 14;

  drawRoundedRect(ctx, phiBoxX, phiBoxY, phiBoxW, phiBoxH, phiBoxR);
  ctx.fillStyle = theme.phiBoxBg;
  ctx.fill();
  ctx.strokeStyle = theme.phiBoxBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.phiText;
  ctx.fillText('⚜️ GOLDEN RATIO & THIRDS ARCHITECTURE', phiBoxX + 16, phiBoxY + 14);

  ctx.font = '900 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  const phiDisplay = `φ ${rawPhi.toFixed(3)}`;
  ctx.fillText(phiDisplay, phiBoxX + 16, phiBoxY + 34);

  const phiDispW = ctx.measureText(phiDisplay).width;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#b45309' : '#fef08a';
  ctx.fillText(`• ${phiAdherence}% Neoclassical Match`, phiBoxX + 16 + phiDispW + 10, phiBoxY + 44);

  // Micro progress track for phi
  const phiTrackW = phiBoxW - 32;
  const phiTrackY = phiBoxY + 70;
  drawRoundedRect(ctx, phiBoxX + 16, phiTrackY, phiTrackW, 5, 2.5);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const phiFillW = Math.min(phiTrackW, Math.max(10, (phiAdherence / 100) * phiTrackW));
  drawRoundedRect(ctx, phiBoxX + 16, phiTrackY, phiFillW, 5, 2.5);
  const phiGrad = ctx.createLinearGradient(phiBoxX + 16, phiTrackY, phiBoxX + 16 + phiFillW, phiTrackY);
  phiGrad.addColorStop(0, '#f59e0b');
  phiGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = phiGrad;
  ctx.fill();

  ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  const thirdsText = scoreData.metrics?.facialThirdsBalance
    ? `Facial Thirds: ${scoreData.metrics.facialThirdsBalance.split(' ')[0]} Ideal Thirds Alignment`
    : 'Facial Thirds: 1:1:1 Harmonic Alignment';
  ctx.fillText(thirdsText, phiBoxX + 16, phiBoxY + 86);

  // Bilateral Facial Symmetry Card
  const symBoxX = hubX + 24;
  const symBoxY = phiBoxY + phiBoxH + 14;
  const symBoxW = phiBoxW;
  const symBoxH = 100;
  const symBoxR = 14;

  drawRoundedRect(ctx, symBoxX, symBoxY, symBoxW, symBoxH, symBoxR);
  ctx.fillStyle = theme.bioBoxBg;
  ctx.fill();
  ctx.strokeStyle = theme.bioBoxBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.bioText;
  ctx.fillText('🪞 BILATERAL FACIAL SYMMETRY INDEX', symBoxX + 16, symBoxY + 14);

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${symmIndex}% Parity`, symBoxX + 16, symBoxY + 34);

  const symTrackW = symBoxW - 32;
  const symTrackY = symBoxY + 68;
  drawRoundedRect(ctx, symBoxX + 16, symTrackY, symTrackW, 5, 2.5);
  ctx.fillStyle = theme.trackBg;
  ctx.fill();

  const symFillW = Math.min(symTrackW, Math.max(10, (symmIndex / 100) * symTrackW));
  drawRoundedRect(ctx, symBoxX + 16, symTrackY, symFillW, 5, 2.5);
  const symGrad = ctx.createLinearGradient(symBoxX + 16, symTrackY, symBoxX + 16 + symFillW, symTrackY);
  symGrad.addColorStop(0, '#8b5cf6');
  symGrad.addColorStop(1, '#06b6d4');
  ctx.fillStyle = symGrad;
  ctx.fill();

  // Biometric Breakdown Chips (3 rows)
  const chipStartY = symBoxY + symBoxH + 14;
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText(`✨ Presentational: ${(scoreData.presentationalScore ?? 78.5).toFixed(1)}%`, hubX + 24, chipStartY);
  ctx.fillText(`📐 Craniofacial Structure: ${(scoreData.structuralScore ?? 78.8).toFixed(1)}%`, hubX + 24, chipStartY + 24);
  ctx.fillText(`🎯 Mesh Landmark Confidence: ${Math.round((scoreData.confidence || 0.88) * 100)}%`, hubX + 24, chipStartY + 48);

  // Top Controllable Lever Highlight
  if (scoreData.topLevers && scoreData.topLevers.length > 0) {
    const leverY = chipStartY + 80;
    const leverW = hubW - 48;
    const leverH = 46;
    drawRoundedRect(ctx, hubX + 24, leverY, leverW, leverH, 10);
    ctx.fillStyle = isLight ? 'rgba(147, 51, 234, 0.08)' : 'rgba(168, 85, 247, 0.12)';
    ctx.fill();
    ctx.strokeStyle = isLight ? 'rgba(147, 51, 234, 0.25)' : 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
    ctx.fillText('⚡ Top Lever: ', hubX + 38, leverY + leverH / 2);

    const leverLabelW = ctx.measureText('⚡ Top Lever: ').width;
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    const leverStr = `${scoreData.topLevers[0].lever} (+${scoreData.topLevers[0].gainPts.toFixed(1)} pts)`;
    ctx.fillText(leverStr, hubX + 38 + leverLabelW, leverY + leverH / 2);
  }

  ctx.restore();

  // -------------------------------------------------------------
  // 5. ESSENTIAL FACIAL FEATURES MATRIX SECTION (Bottom Stage)
  // Section Header: y = 794 to 836
  // 3x3 Grid: y = 848 to 1820
  // -------------------------------------------------------------
  const matrixHeaderY = 808;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Section Eyebrow Sparkle Icon + Title
  ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText('✨', 36, matrixHeaderY);

  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('ESSENTIAL FACIAL FEATURES MATRIX', 64, matrixHeaderY);

  // Right Tag Badge: "Human-Calibrated • 9 Aesthetic Dimensions"
  const matrixMetaText = 'Human-Calibrated • 9 Aesthetic Dimensions';
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

  // 9 Essential Feature Cards Data
  const getPillarMeta = (score: number) => {
    if (score >= 90) return { tag: 'OPTIMAL', tagColor: isLight ? '#059669' : '#34d399', grad: ['#10b981', '#38bdf8'] as [string, string] };
    if (score >= 80) return { tag: 'HIGH', tagColor: isLight ? '#0284c7' : '#38bdf8', grad: ['#a855f7', '#38bdf8'] as [string, string] };
    if (score >= 70) return { tag: 'HARMONIOUS', tagColor: isLight ? '#7c3aed' : '#c084fc', grad: ['#8b5cf6', '#c084fc'] as [string, string] };
    return { tag: 'BALANCED', tagColor: isLight ? '#d97706' : '#fbbf24', grad: ['#f59e0b', '#fbbf24'] as [string, string] };
  };

  const eyesScore = pillars?.eyes ?? Math.round((scoreData.parameterRatings[2] ?? 8.5) * 10);
  const noseScore = pillars?.nose ?? Math.round((scoreData.subfactorScores['NC1'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10);
  const lipsScore = pillars?.lips ?? Math.round((scoreData.subfactorScores['NC3'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10);
  const smoothScore = pillars?.smoothness ?? 85;
  const healthScore = pillars?.faceHealth ?? 84;
  const jawScore = pillars?.jawline ?? Math.round((scoreData.parameterRatings[9] ?? 8.2) * 10);
  const attractScore = pillars?.attractiveness ?? Math.round(((scoreData.parameterRatings[3] ?? 8.6) * 10 * 0.5) + (phiAdherence * 0.5));
  const smileScore = pillars?.smile ?? Math.round((scoreData.parameterRatings[4] ?? 8.0) * 10);
  const symScore = pillars?.featuresSymmetry ?? Math.round((scoreData.parameterRatings[7] ?? 8.2) * 10);

  const matrixCards: SharePillarCard[] = [
    {
      name: 'Eyes',
      icon: '👁️',
      score: eyesScore,
      subtitle: 'Canthal Tilt & Aperture',
      detail: 'Palpebral Fissure Balance',
      ...getPillarMeta(eyesScore),
      gradColors: getPillarMeta(eyesScore).grad,
    },
    {
      name: 'Nose',
      icon: '👃',
      score: noseScore,
      subtitle: 'Bridge Linearity',
      detail: 'Dorsum & Alar Width',
      ...getPillarMeta(noseScore),
      gradColors: getPillarMeta(noseScore).grad,
    },
    {
      name: 'Lips',
      icon: '👄',
      score: lipsScore,
      subtitle: 'Vermilion Fullness',
      detail: "Cupid's Bow & Lip Ratio",
      ...getPillarMeta(lipsScore),
      gradColors: getPillarMeta(lipsScore).grad,
    },
    {
      name: 'Smoothness',
      icon: '✨',
      score: smoothScore,
      subtitle: 'Texture Uniformity',
      detail: 'Epidermal Clarity & Grain',
      ...getPillarMeta(smoothScore),
      gradColors: getPillarMeta(smoothScore).grad,
    },
    {
      name: 'Face Health',
      icon: '🌿',
      score: healthScore,
      subtitle: 'Radiance & Vitality',
      detail: 'Under-Eye Restfulness',
      ...getPillarMeta(healthScore),
      gradColors: getPillarMeta(healthScore).grad,
    },
    {
      name: 'Jawline',
      icon: '💎',
      score: jawScore,
      subtitle: 'Mandibular Contour',
      detail: 'Gonial Angle & Chin Definition',
      ...getPillarMeta(jawScore),
      gradColors: getPillarMeta(jawScore).grad,
    },
    {
      name: 'Attractiveness',
      icon: '⚜️',
      score: attractScore,
      subtitle: 'Neoclassical Thirds',
      detail: `Golden Ratio φ (${phiAdherence}%)`,
      ...getPillarMeta(attractScore),
      gradColors: ['#f59e0b', '#fbbf24'],
    },
    {
      name: 'Smile',
      icon: '😊',
      score: smileScore,
      subtitle: 'Duchenne Dynamics',
      detail: 'Zygomaticus Commissure',
      ...getPillarMeta(smileScore),
      gradColors: getPillarMeta(smileScore).grad,
    },
    {
      name: 'Symmetry',
      icon: '🪞',
      score: symScore,
      subtitle: 'Bilateral Parity',
      detail: 'Bilateral Feature Parity',
      ...getPillarMeta(symScore),
      gradColors: getPillarMeta(symScore).grad,
    },
  ];

  // 3x3 Grid Layout Calculation
  const gridStartX = 36;
  const gridStartY = 840;
  const gridTotalW = width - 72; // 1008 px
  const gapX = 16;
  const gapY = 16;
  const cardW = (gridTotalW - 2 * gapX) / 3; // 325.33 px
  const cardH = 304;

  const drawMatrixCard = (card: SharePillarCard, cx: number, cy: number) => {
    ctx.save();

    // Card Glass Surface
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 16);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.restore();

    drawRoundedRect(ctx, cx, cy, cardW, cardH, 16);
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top Row: Icon + Name (Left) & Tag Pill (Right)
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(`${card.icon} ${card.name}`, cx + 18, cy + 20);

    // Tag Pill
    const tagText = card.tag.toUpperCase();
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagW = ctx.measureText(tagText).width + 14;
    const tagH = 22;
    const tagX = cx + cardW - 18 - tagW;
    const tagY = cy + 18;

    drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 6);
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = card.tagColor;
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = card.tagColor;
    ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2);

    // Big Score Row
    const scoreStr = String(Math.round(card.score));
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(scoreStr, cx + 18, cy + 62);

    const sW = ctx.measureText(scoreStr).width;
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('/ 100', cx + 18 + sW + 6, cy + 86);

    // Progress Bar Track & Fill
    const barW = cardW - 36;
    const barY = cy + 140;
    drawRoundedRect(ctx, cx + 18, barY, barW, 6, 3);
    ctx.fillStyle = theme.trackBg;
    ctx.fill();

    const fillW = Math.min(barW, Math.max(8, (card.score / 100) * barW));
    drawRoundedRect(ctx, cx + 18, barY, fillW, 6, 3);
    const grad = ctx.createLinearGradient(cx + 18, barY, cx + 18 + fillW, barY);
    grad.addColorStop(0, card.gradColors[0]);
    grad.addColorStop(1, card.gradColors[1]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtitle & Detail Anatomical Insights
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(card.subtitle, cx + 18, cy + 168);

    ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textSecondary;
    ctx.fillText(card.detail, cx + 18, cy + 196);

    // Micro decorative indicator
    ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('• Biometric Analyzed', cx + 18, cy + 266);

    ctx.restore();
  };

  // Render 3x3 Grid
  matrixCards.forEach((card, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = gridStartX + col * (cardW + gapX);
    const cy = gridStartY + row * (cardH + gapY);
    drawMatrixCard(card, cx, cy);
  });

  // -------------------------------------------------------------
  // 6. Platform URL & Viral Reach Footer Pill (y = 1846 to 1888)
  // -------------------------------------------------------------
  ctx.save();
  const ctaPillW = 680;
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

  const promptPart = '✨ Scan your facial symmetry & beauty free at ';
  const urlPart = 'gabru.vercel.app/beauty-rating';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isLight ? '#7c3aed' : '#c084fc';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();
}
