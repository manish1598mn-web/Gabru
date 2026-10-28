/**
 * GABRU — OUTFIT RATING SHARE CARD CANVAS GENERATOR
 * 
 * Generates the high-resolution 1080x1350 (4:5 portrait) social media share card canvas.
 */

import { OutfitScoreData, ParameterDef } from '../types/OutfitRatingTypes';
import { drawRoundedRect, drawImageCover } from '@/shared/utils/CanvasUtil';

export function drawOutfitSocialCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photoScore: OutfitScoreData,
  parameters: ParameterDef[]
): void {
  // Canvas format: 1080 x 1350 (4:5 Instagram Portrait / WhatsApp Status / High-Res Share)
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, 1080, 1350);

  // 1. APP THEME BACKGROUND (Clean Charcoal #18181b)
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 1080, 1350);

  // 2. REDUCED COMPACT TOP HEADER
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
  ctx.fillText('SARTORIAL AUDIT', 18 + brandWidth + 20, headerY);

  // Right: Master Score & Verdict Badge
  const rightX = 1062;

  const scoreNumStr = typeof photoScore.overallScore === 'number'
    ? (Number.isInteger(photoScore.overallScore) ? String(photoScore.overallScore) : photoScore.overallScore.toFixed(1))
    : '0';

  // Verdict pill
  const verdictStr = (photoScore.verdict || 'ELEVATED').toUpperCase();
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

  // Overall Score to the left of verdict pill
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

  // 3. FULL FIT CONTENT SECTION
  const contentY = 58;
  const contentH = 1252;

  // Center Hero Outfit Photo
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

  // Draw user's outfit photo
  drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Outfit Photo');

  // Clean hairline border
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. 10 PARAMETERS SCORE (5 Left, 5 Right)
  const leftParams = parameters.slice(0, 5);
  const rightParams = parameters.slice(5, 10);

  const cardW = 244;
  const cardH = 234;
  const cardGap = 20.5;

  const drawParamCard = (param: ParameterDef, cx: number, cy: number) => {
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 14);
    ctx.fillStyle = '#222226';
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const pScore = photoScore.parameterScores[param.id] ?? 0;
    const pRating = photoScore.parameterRatings[param.id]?.ratingR ?? 0;

    const num = param.id < 10 ? `0${param.id}` : `${param.id}`;
    let displayName = param.name;
    if (displayName === 'Occasion Appropriateness') displayName = 'Occasion Fit';
    if (displayName === 'Proportion & Silhouette') displayName = 'Proportion & Cut';
    if (displayName === 'Fabric, Texture & Condition') displayName = 'Fabric & Texture';
    if (displayName === 'Accessories & Footwear') displayName = 'Accessories';
    if (displayName === 'Grooming & Presentation') displayName = 'Grooming';
    if (displayName === 'Focal Point & Hierarchy') displayName = 'Focal Point';
    if (displayName === 'Originality & Expression') displayName = 'Originality';

    // 1. Parameter Title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '700 17px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${num} • ${displayName}`, cx + 18, cy + 20);

    // 2. Score Value
    const scoreValStr = typeof pScore === 'number'
      ? (Number.isInteger(pScore) ? String(pScore) : pScore.toFixed(1))
      : '0';

    ctx.font = '900 46px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(scoreValStr, cx + 18, cy + 52);

    const sValLen = ctx.measureText(scoreValStr).width;
    ctx.font = '700 18px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(` / ${param.maxPts}`, cx + 18 + sValLen + 6, cy + 72);

    // 3. Rating Pill
    const rText = pRating > 0 ? `RATING ${pRating.toFixed(1)} / 10` : 'RATING 8.5 / 10';
    ctx.font = '700 12.5px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
    const rWidth = ctx.measureText(rText).width + 18;
    const rHeight = 26;
    const rPillX = cx + 18;
    const rPillY = cy + 128;

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

    // 4. Progress Bar
    const barX = cx + 18;
    const barY = cy + 182;
    const barW = cardW - 36;
    const barH = 5;

    // Track
    drawRoundedRect(ctx, barX, barY, barW, barH, 2.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Fill
    const pct = Math.min(1, Math.max(0.08, pScore / param.maxPts));
    drawRoundedRect(ctx, barX, barY, barW * pct, barH, 2.5);
    ctx.fillStyle = '#2589ff';
    ctx.fill();
  };

  leftParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 18, cy);
  });

  rightParams.forEach((param, idx) => {
    const cy = contentY + idx * (cardH + cardGap);
    drawParamCard(param, 818, cy);
  });

  // 5. REDUCED COMPACT FOOTER
  const footerY = 1330;
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('GABRU SARTORIAL INTELLIGENCE', 18, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
  ctx.font = '700 12px "Plus Jakarta Sans", "Inter", -apple-system, sans-serif';
  ctx.fillText('WWW.GABRU.AI', 1062, footerY);
}

