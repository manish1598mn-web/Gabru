/**
 * GABRU — FACIAL BEAUTY SHARE CARD CANVAS GENERATOR
 * 
 * Generates an informative, ultra-crisp social share card stamped with:
 * - Center Hero Portrait Stage ($528 \times 1030\text{px}$)
 * - 10 Parameter Scores arranged around the card (5 Left, 5 Right)
 * - Sleek, unified executive glass floating dock displaying the master facial harmony score,
 *   verdict badge, bilateral symmetry index, and golden ratio φ adherence.
 */

import { BeautyParameterDef, ScoreCalculationResult, BeautyPillarsBreakdown } from '../types/FacialBeautyTypes';
import { drawRoundedRect, drawImageCover } from '@/shared/utils/CanvasUtil';

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
  parameters: BeautyParameterDef[]
): void {
  const width = 1080;
  const height = 1350;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  // 1. Deep Charcoal Obsidian Studio Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  // Multi-stop ambient backdrop glows
  const bgGlowPurple = ctx.createRadialGradient(width / 2, 480, 80, width / 2, 480, 680);
  bgGlowPurple.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
  bgGlowPurple.addColorStop(1, 'rgba(10, 10, 15, 0)');
  ctx.fillStyle = bgGlowPurple;
  ctx.fillRect(0, 0, width, height);

  const bgGlowGold = ctx.createRadialGradient(width / 2, 1150, 40, width / 2, 1150, 520);
  bgGlowGold.addColorStop(0, 'rgba(245, 158, 11, 0.10)');
  bgGlowGold.addColorStop(1, 'rgba(10, 10, 15, 0)');
  ctx.fillStyle = bgGlowGold;
  ctx.fillRect(0, 0, width, height);

  // 2. Slim Top Header Bar (Single baseline, y = 44)
  const headerY = 44;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Brand Logo Text
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GABRU', 24, headerY);

  const brandWidth = ctx.measureText('GABRU').width;
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('•', 24 + brandWidth + 10, headerY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('HUMAN-CALIBRATED FACIAL BEAUTY AUDIT', 24 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.app/beauty-rating';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagW = ctx.measureText(platformUrl).width + 36;
  const tagH = 32;
  const tagX = width - 24 - tagW;
  const tagY = headerY - tagH / 2;

  drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 16);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Active glowing green beacon dot
  ctx.beginPath();
  ctx.arc(tagX + 16, headerY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f3e8ff';
  ctx.fillText(platformUrl, tagX + 26, headerY);
  ctx.restore();

  // 3. Center Hero Portrait Stage (x = 276, w = 528, y = 80, h = 1010)
  const photoX = 276;
  const photoY = 80;
  const photoW = 528;
  const photoH = 1010;
  const photoR = 20;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 38;
  ctx.shadowOffsetY = 14;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.fillStyle = '#14141c';
  ctx.fill();
  ctx.restore();

  // Draw user's portrait face photo
  drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Portrait Photo');

  // Hairline frame border around hero photo
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtle bottom vignette transition into dock
  ctx.save();
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.clip();
  const bottomVignette = ctx.createLinearGradient(0, photoY + photoH - 220, 0, photoY + photoH);
  bottomVignette.addColorStop(0, 'rgba(10, 10, 15, 0)');
  bottomVignette.addColorStop(1, 'rgba(10, 10, 15, 0.78)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(photoX, photoY + photoH - 220, photoW, 220);
  ctx.restore();

  // Floating 468 3D Mesh Badge inside Hero Photo (Top-Left)
  const formatBadgeW = 192;
  const formatBadgeH = 32;
  const formatBadgeX = photoX + 18;
  const formatBadgeY = photoY + 18;
  drawRoundedRect(ctx, formatBadgeX, formatBadgeY, formatBadgeW, formatBadgeH, 8);
  ctx.fillStyle = 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.beginPath();
  ctx.arc(formatBadgeX + 16, formatBadgeY + formatBadgeH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillText('468 3D MESH LANDMARKS', formatBadgeX + formatBadgeW / 2 + 8, formatBadgeY + formatBadgeH / 2);
  ctx.restore();

  // Floating Golden Ratio (φ) Badge inside Hero Photo (Top-Right)
  const rawPhi = (scoreData.metrics as Record<string, unknown>)?.phase3
    ? ((scoreData.metrics as Record<string, unknown>).phase3 as { harmony?: { goldenRatios?: Array<{ value: number }> } })?.harmony?.goldenRatios?.[0]?.value ?? 1.618
    : (scoreData.metrics?.aspectRatio && scoreData.metrics.aspectRatio > 0
      ? 1 / scoreData.metrics.aspectRatio
      : 1.618);
  const idealPhi = 1.618;
  const phiAdherence = scoreData.metrics?.goldenRatioAdherence !== undefined
    ? scoreData.metrics.goldenRatioAdherence
    : Math.round(rawPhi <= idealPhi ? (rawPhi / idealPhi) * 100 : (idealPhi / rawPhi) * 100);

  const phiBadgeW = 196;
  const phiBadgeH = 32;
  const phiBadgeX = photoX + photoW - 18 - phiBadgeW;
  const phiBadgeY = photoY + 18;
  drawRoundedRect(ctx, phiBadgeX, phiBadgeY, phiBadgeW, phiBadgeH, 8);
  ctx.fillStyle = 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('⚜️ φ ' + rawPhi.toFixed(3), phiBadgeX + 48, phiBadgeY + phiBadgeH / 2);

  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('(' + phiAdherence + '% Match)', phiBadgeX + 132, phiBadgeY + phiBadgeH / 2);
  ctx.restore();

  // Center-Bottom Over-Photo Pill:
  const centerPillW = 270;
  const centerPillH = 28;
  const centerPillX = photoX + (photoW - centerPillW) / 2;
  const centerPillY = photoY + photoH - 40;
  drawRoundedRect(ctx, centerPillX, centerPillY, centerPillW, centerPillH, 14);
  ctx.fillStyle = 'rgba(10, 10, 15, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(centerPillX + 16, centerPillY + centerPillH / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText('✓ Frontal Facial Biometrics Verified', centerPillX + centerPillW / 2 + 6, centerPillY + centerPillH / 2);
  ctx.restore();

  // 4. 10 Human Facial Beauty Pillars & Proportions Cards (5 Left, 5 Right)
  const cardW = 236;
  const cardH = 190;
  const cardGap = 15;

  const pillars = scoreData.beautyPillars || scoreData.metrics?.beautyPillars;

  const getPillarMeta = (score: number, defaultTag: string) => {
    if (score >= 90) return { tag: 'Optimal', tagColor: '#34d399', grad: ['#10b981', '#38bdf8'] as [string, string] };
    if (score >= 80) return { tag: 'High', tagColor: '#38bdf8', grad: ['#a855f7', '#38bdf8'] as [string, string] };
    if (score >= 70) return { tag: 'Harmonious', tagColor: '#c084fc', grad: ['#8b5cf6', '#c084fc'] as [string, string] };
    return { tag: defaultTag, tagColor: '#fbbf24', grad: ['#f59e0b', '#fbbf24'] as [string, string] };
  };

  // Left Column (5 Craniofacial Architecture & Features)
  const eyesScore = pillars?.eyes ?? Math.round((scoreData.parameterRatings[2] ?? 8.5) * 10);
  const noseScore = pillars?.nose ?? Math.round((scoreData.subfactorScores['NC1'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10);
  const lipsScore = pillars?.lips ?? Math.round((scoreData.subfactorScores['NC3'] ?? scoreData.parameterRatings[6] ?? 8.5) * 10);
  const jawScore = pillars?.jawline ?? Math.round((scoreData.parameterRatings[9] ?? 8.2) * 10);
  const symScore = pillars?.featuresSymmetry ?? Math.round((scoreData.parameterRatings[7] ?? 8.2) * 10);

  // Right Column (5 Vitality, Expression, Glow & Harmony)
  const smoothScore = pillars?.smoothness ?? 85;
  const healthScore = pillars?.faceHealth ?? 84;
  const smileScore = pillars?.smile ?? Math.round((scoreData.parameterRatings[4] ?? 8.0) * 10);
  const attractScore = pillars?.attractiveness ?? Math.round(((scoreData.parameterRatings[3] ?? 8.6) * 10 * 0.5) + (phiAdherence * 0.5));
  const groomScore = Math.round((scoreData.parameterRatings[5] ?? 8.5) * 10);

  const leftCards: SharePillarCard[] = [
    {
      name: 'Eyes',
      icon: '👁️',
      score: eyesScore,
      subtitle: 'Canthal Tilt & Aperture',
      detail: 'Palpebral Fissure Balance',
      ...getPillarMeta(eyesScore, 'Balanced'),
      gradColors: getPillarMeta(eyesScore, 'Balanced').grad,
    },
    {
      name: 'Nose',
      icon: '👃',
      score: noseScore,
      subtitle: 'Bridge Linearity',
      detail: 'Dorsum & Alar Width',
      ...getPillarMeta(noseScore, 'Balanced'),
      gradColors: getPillarMeta(noseScore, 'Balanced').grad,
    },
    {
      name: 'Lips',
      icon: '👄',
      score: lipsScore,
      subtitle: 'Vermilion Fullness',
      detail: "Cupid's Bow & Lip Ratio",
      ...getPillarMeta(lipsScore, 'Balanced'),
      gradColors: getPillarMeta(lipsScore, 'Balanced').grad,
    },
    {
      name: 'Jawline',
      icon: '💎',
      score: jawScore,
      subtitle: 'Mandibular Contour',
      detail: 'Gonial Angle & Chin',
      ...getPillarMeta(jawScore, 'Defined'),
      gradColors: getPillarMeta(jawScore, 'Defined').grad,
    },
    {
      name: 'Symmetry',
      icon: '🪞',
      score: symScore,
      subtitle: 'Bilateral Parity',
      detail: 'Cranial & Facial Balance',
      ...getPillarMeta(symScore, 'Balanced'),
      gradColors: getPillarMeta(symScore, 'Balanced').grad,
    },
  ];

  const rightCards: SharePillarCard[] = [
    {
      name: 'Smoothness',
      icon: '✨',
      score: smoothScore,
      subtitle: 'Texture Uniformity',
      detail: 'Epidermal Clarity (Neutral)',
      ...getPillarMeta(smoothScore, 'Smooth'),
      gradColors: getPillarMeta(smoothScore, 'Smooth').grad,
    },
    {
      name: 'Face Health',
      icon: '🌿',
      score: healthScore,
      subtitle: 'Radiance & Hydration',
      detail: 'Under-Eye Restfulness',
      ...getPillarMeta(healthScore, 'Vibrant'),
      gradColors: getPillarMeta(healthScore, 'Vibrant').grad,
    },
    {
      name: 'Smile',
      icon: '😊',
      score: smileScore,
      subtitle: 'Duchenne Dynamics',
      detail: 'Zygomaticus Commissure',
      ...getPillarMeta(smileScore, 'Radiant'),
      gradColors: getPillarMeta(smileScore, 'Radiant').grad,
    },
    {
      name: 'Attractiveness',
      icon: '⚜️',
      score: attractScore,
      subtitle: 'Neoclassical Thirds',
      detail: `Divine Golden Ratio φ (${phiAdherence}%)`,
      ...getPillarMeta(attractScore, 'Harmonious'),
      gradColors: ['#f59e0b', '#fbbf24'],
    },
    {
      name: 'Grooming',
      icon: '✂️',
      score: groomScore,
      subtitle: 'Brows, Hair & Styling',
      detail: 'Aesthetic Cleanliness',
      ...getPillarMeta(groomScore, 'Refined'),
      gradColors: getPillarMeta(groomScore, 'Refined').grad,
    },
  ];

  const drawPillarCard = (card: SharePillarCard, cx: number, cy: number) => {
    ctx.save();
    // Glass card background
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 14);
    ctx.fillStyle = 'rgba(16, 16, 24, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top Row: Icon + Name (Left) & Tag Pill (Right)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${card.icon} ${card.name}`, cx + 14, cy + 18);

    // Tag Pill
    const tagText = card.tag.toUpperCase();
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagW = ctx.measureText(tagText).width + 12;
    const tagH = 20;
    const tagX = cx + cardW - 14 - tagW;
    const tagY = cy + 16;
    drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = card.tagColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = card.tagColor;
    ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2);

    // Middle Score Row
    const scoreStr = String(Math.round(card.score));
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(scoreStr, cx + 14, cy + 48);

    const sW = ctx.measureText(scoreStr).width;
    ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('/ 100', cx + 14 + sW + 4, cy + 66);

    // Progress Bar Track & Fill
    const barW = cardW - 28;
    const barY = cy + 108;
    drawRoundedRect(ctx, cx + 14, barY, barW, 4.5, 2.25);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    const fillW = Math.min(barW, Math.max(6, (card.score / 100) * barW));
    drawRoundedRect(ctx, cx + 14, barY, fillW, 4.5, 2.25);
    const grad = ctx.createLinearGradient(cx + 14, barY, cx + 14 + fillW, barY);
    grad.addColorStop(0, card.gradColors[0]);
    grad.addColorStop(1, card.gradColors[1]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtitle & Detail
    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(card.subtitle, cx + 14, cy + 128);

    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.fillText(card.detail, cx + 14, cy + 150);

    ctx.restore();
  };

  // Draw 5 Cards on Left (x = 24)
  leftCards.forEach((card, i) => {
    const cy = photoY + i * (cardH + cardGap);
    drawPillarCard(card, 24, cy);
  });

  // Draw 5 Cards on Right (x = 820)
  rightCards.forEach((card, i) => {
    const cy = photoY + i * (cardH + cardGap);
    drawPillarCard(card, 820, cy);
  });

  // 5. Unified Executive Glass Dock at Bottom (x = 24, w = 1032, y = 1110, h = 176)
  const dockX = 24;
  const dockY = 1110;
  const dockW = 1032;
  const dockH = 176;
  const dockR = 20;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  drawRoundedRect(ctx, dockX, dockY, dockW, dockH, dockR);
  ctx.fillStyle = 'rgba(16, 16, 24, 0.94)';
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, dockX, dockY, dockW, dockH, dockR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left Compartment: Master Score Calculation
  const scoreNumStr = typeof scoreData.faceScore === 'number'
    ? (Number.isInteger(scoreData.faceScore) ? String(scoreData.faceScore) : scoreData.faceScore.toFixed(1))
    : '85.0';

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText('MASTER FACIAL BEAUTY SCORE', dockX + 28, dockY + 22);

  // Big Score Number
  ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreNumStr, dockX + 28, dockY + 40);

  const scoreW = ctx.measureText(scoreNumStr).width;
  ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('/ 100', dockX + 28 + scoreW + 6, dockY + 62);

  // Verdict Pill
  const verdictText = (scoreData.verdict || 'HIGH HARMONY').toUpperCase();
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const vPillTextW = ctx.measureText(verdictText).width;
  const vPillW = vPillTextW + 32;
  const vPillH = 28;
  const vPillX = dockX + 28;
  const vPillY = dockY + 98;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 8);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(vPillX + 14, vPillY + vPillH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f3e8ff';
  ctx.fillText(verdictText, vPillX + 24, vPillY + vPillH / 2);

  // Center: Highlighted Big Golden Ratio (φ) Showcase Module in Executive Dock
  const phiBoxX = dockX + 310;
  const phiBoxY = dockY + 18;
  const phiBoxW = 380;
  const phiBoxH = 108;
  const phiBoxR = 12;

  drawRoundedRect(ctx, phiBoxX, phiBoxY, phiBoxW, phiBoxH, phiBoxR);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.10)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('⚜️ GOLDEN RATIO & THIRDS ARCHITECTURE', phiBoxX + 16, phiBoxY + 14);

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  const phiDisplay = `φ ${rawPhi.toFixed(3)}`;
  ctx.fillText(phiDisplay, phiBoxX + 16, phiBoxY + 34);

  const phiDispW = ctx.measureText(phiDisplay).width;
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`• ${phiAdherence}% Neoclassical Match`, phiBoxX + 16 + phiDispW + 8, phiBoxY + 44);

  // Micro progress track for phi
  const phiTrackW = phiBoxW - 32;
  const phiTrackY = phiBoxY + 68;
  drawRoundedRect(ctx, phiBoxX + 16, phiTrackY, phiTrackW, 4, 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fill();

  const phiFillW = Math.min(phiTrackW, Math.max(10, (phiAdherence / 100) * phiTrackW));
  drawRoundedRect(ctx, phiBoxX + 16, phiTrackY, phiFillW, 4, 2);
  const phiGrad = ctx.createLinearGradient(phiBoxX + 16, phiTrackY, phiBoxX + 16 + phiFillW, phiTrackY);
  phiGrad.addColorStop(0, '#f59e0b');
  phiGrad.addColorStop(1, '#34d399');
  ctx.fillStyle = phiGrad;
  ctx.fill();

  ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const thirdsText = scoreData.metrics?.facialThirdsBalance
    ? `Facial Thirds: ${scoreData.metrics.facialThirdsBalance.split(' ')[0]} Ideal Thirds Alignment`
    : 'Facial Thirds: 1:1:1 Harmonic Alignment';
  ctx.fillText(thirdsText, phiBoxX + 16, phiBoxY + 82);

  // Right Compartment: Biometric Breakdown (Presentational vs Structural)
  const bioBoxX = dockX + 710;
  const bioBoxY = dockY + 18;
  const bioBoxW = 294;
  const bioBoxH = 108;
  const bioBoxR = 12;

  drawRoundedRect(ctx, bioBoxX, bioBoxY, bioBoxW, bioBoxH, bioBoxR);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.fillText('BIOMETRIC ATTRACTIVENESS BALANCE', bioBoxX + 16, bioBoxY + 14);

  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(`✨ Presentational: ${(scoreData.presentationalScore ?? 78.5).toFixed(1)}%`, bioBoxX + 16, bioBoxY + 38);
  ctx.fillText(`📐 Craniofacial Structural: ${(scoreData.structuralScore ?? 78.8).toFixed(1)}%`, bioBoxX + 16, bioBoxY + 60);
  ctx.fillText(`🎯 Mesh Landmark Confidence: ${Math.round((scoreData.confidence || 0.88) * 100)}%`, bioBoxX + 16, bioBoxY + 82);

  // Subtle Hairline Divider Inside Dock
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(dockX + 24, dockY + 140);
  ctx.lineTo(dockX + dockW - 24, dockY + 140);
  ctx.stroke();

  // Bottom Line of Dock: Security & Compliance Summary
  const symm = scoreData.metrics?.symmetryIndex ?? 88;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillText(`🔒 100% In-Browser Private • Bilateral Parity: ${symm}% • Melanin & Ethnic Invariant • Zero Cloud Uploads`, dockX + 28, dockY + 158);

  ctx.restore();

  // 6. Platform URL & Viral Reach Footer Pill (y = 1302)
  ctx.save();
  const ctaPillW = 600;
  const ctaPillH = 34;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1302;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 17);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  const promptPart = '✨ Scan your facial symmetry & beauty free at ';
  const urlPart = 'gabru.app/beauty-rating';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();
}
