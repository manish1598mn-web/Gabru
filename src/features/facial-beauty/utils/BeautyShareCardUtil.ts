/**
 * GABRU — FACIAL BEAUTY SHARE CARD CANVAS GENERATOR
 * 
 * Generates the high-resolution 1080x1350 (4:5 portrait) social media share card canvas
 * for the 10-parameter facial attractiveness breakdown (v2 Framework).
 */

import { BeautyParameterDef, ScoreCalculationResult } from '../types/FacialBeautyTypes';
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
    canthalTiltDeg?: number;
    aspectRatio?: number;
  };
}

export function drawBeautySocialCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  scoreData: BeautyCardScoreData,
  parameters: BeautyParameterDef[]
): void {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, 1080, 1350);

  // App Theme Background (#18181b charcoal matte)
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 1080, 1350);

  // Slim Top Header (Single baseline)
  const headerY = 34;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '900 26px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GABRU', 18, headerY);

  const brandWidth = ctx.measureText('GABRU').width;
  ctx.font = '700 13px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText('•', 18 + brandWidth + 8, headerY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('FACIAL BEAUTY AUDIT (10-PARAM)', 18 + brandWidth + 20, headerY);

  // Right: Master Score & Verdict
  const rightX = 1062;
  const scoreNumStr = Number.isInteger(scoreData.faceScore) ? String(scoreData.faceScore) : scoreData.faceScore.toFixed(1);

  // Verdict pill
  const verdictStr = (scoreData.verdict || 'ELEVATED').toUpperCase();
  ctx.font = '700 11.5px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  const vTextW = ctx.measureText(verdictStr).width;
  const vPillW = vTextW + 20;
  const vPillH = 26;
  const vPillX = rightX - vPillW;
  const vPillY = headerY - vPillH / 2;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(verdictStr, vPillX + vPillW / 2, headerY);

  // Score
  const scoreEndX = vPillX - 16;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  ctx.font = '700 15px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillText('/100', scoreEndX, headerY);

  const denomW = ctx.measureText('/100').width;
  ctx.font = '900 32px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreNumStr, scoreEndX - denomW - 4, headerY);

  // Full Fit Content Area (y = 58 to y = 1310, height = 1252)
  const contentY = 58;
  const contentH = 1252;

  // Center Hero Face Photo
  const photoX = 276;
  const photoY = contentY;
  const photoW = 528;
  const photoH = contentH;
  const photoR = 14;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.fillStyle = '#1e1e22';
  ctx.fill();
  ctx.restore();

  drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Portrait Photo');

  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Top Floating Badge: Changeable vs Structural Breakdown
  const topBadgeW = 464;
  const topBadgeH = 34;
  const topBadgeX = photoX + (photoW - topBadgeW) / 2;
  const topBadgeY = photoY + 18;
  const topBadgeR = 8;

  drawRoundedRect(ctx, topBadgeX, topBadgeY, topBadgeW, topBadgeH, topBadgeR);
  ctx.fillStyle = 'rgba(18, 18, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
  const presStr = `CHANGEABLE ${scoreData.presentationalScore ?? 78.5}%`;
  const structStr = `FIXED ${scoreData.structuralScore ?? 78.8}%`;
  const confStr = `CONF ${Math.round((scoreData.confidence || 0.88) * 100)}%`;
  ctx.fillText(`${presStr}   •   ${structStr}   •   ${confStr}`, topBadgeX + topBadgeW / 2, topBadgeY + topBadgeH / 2);

  // Biometric Intelligence Floating Overlay Badge inside Hero Photo
  const badgeW = 464;
  const badgeH = 40;
  const badgeX = photoX + (photoW - badgeW) / 2;
  const badgeY = photoY + photoH - badgeH - 18;
  const badgeR = 8;

  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeR);
  ctx.fillStyle = 'rgba(18, 18, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';

  const indexStr = `INDEX ${scoreData.faceIndex.toFixed(1)}/10`;
  const symmStr = `SYMMETRY ${scoreData.metrics.symmetryIndex}%`;
  const phiStr = `φ HARMONY ${scoreData.metrics.goldenRatioAdherence}%`;
  const badgeText = `${indexStr}   •   ${symmStr}   •   ${phiStr}`;
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);

  // 10 Parameters: 5 on Left, 5 on Right
  const leftParams = parameters.slice(0, 5);
  const rightParams = parameters.slice(5, 10);

  const cardW = 244;
  const cardH = 236;
  const cardGap = 18;

  const drawParamCard = (param: BeautyParameterDef, cx: number, cy: number) => {
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 12);
    ctx.fillStyle = '#222226';
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const pPoints = scoreData.parameterScores[param.id] ?? 0;
    const pRating = scoreData.parameterRatings[param.id] ?? 0;

    const num = param.id < 10 ? `0${param.id}` : `${param.id}`;
    let displayName = param.name;
    if (displayName === 'Facial Harmony & Proportions') displayName = 'Harmony & φ';
    if (displayName === 'Expression, Smile & Gaze') displayName = 'Expression & Gaze';
    if (displayName === 'Nose, Cheeks, Lips & Philtrum') displayName = 'Central Features';
    if (displayName === 'Jaw, Chin & Gender-Typical Cues') displayName = 'Jaw, Chin & Cues';
    if (displayName === 'Neck, Ears & Head Carriage') displayName = 'Neck & Posture';

    // Title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '700 14px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${num} • ${displayName}`, cx + 16, cy + 18);

    // Score Value
    const scoreValStr = Number.isInteger(pPoints) ? String(pPoints) : pPoints.toFixed(1);
    ctx.font = '900 36px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(scoreValStr, cx + 16, cy + 50);

    const sValLen = ctx.measureText(scoreValStr).width;
    ctx.font = '700 15px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(` / ${param.weight}`, cx + 16 + sValLen + 4, cy + 68);

    // Rating Pill
    const rText = `RATING ${pRating.toFixed(1)} / 10`;
    ctx.font = '700 11.5px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    const rWidth = ctx.measureText(rText).width + 16;
    const rHeight = 24;
    const rPillX = cx + 16;
    const rPillY = cy + 118;

    drawRoundedRect(ctx, rPillX, rPillY, rWidth, rHeight, 6);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2589ff';
    ctx.fillText(rText, rPillX + rWidth / 2, rPillY + rHeight / 2);

    // Progress Bar
    const barX = cx + 16;
    const barY = cy + 172;
    const barW = cardW - 32;
    const barH = 4;

    drawRoundedRect(ctx, barX, barY, barW, barH, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    const pct = Math.min(1, Math.max(0.08, pPoints / param.weight));
    drawRoundedRect(ctx, barX, barY, barW * pct, barH, 2);
    ctx.fillStyle = '#2589ff';
    ctx.fill();

    // Evidence & Changeability tag
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
    ctx.fillText(`${param.evidence} • ${param.changeability}`, cx + 16, cy + 192);
  };

  leftParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 18, cy);
  });

  rightParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 818, cy);
  });

  // Footer Watermark
  const footerY = 1330;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('GABRU FACIAL BEAUTY INTELLIGENCE', 18, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
  ctx.font = '700 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('WWW.GABRU.AI', 1062, footerY);
}
