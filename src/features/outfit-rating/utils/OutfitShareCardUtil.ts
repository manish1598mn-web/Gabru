/**
 * GABRU — OUTFIT RATING SHARE CARD CANVAS GENERATOR
 * 
 * Generates the high-resolution 1080x1350 (4:5 portrait) social media share card canvas.
 * 
 * Informative Content-First Layout:
 * - Center Hero Outfit Photo ($528 \times 1030\text{px}$) prominently framed with rounded corners
 * - 10 Parameter Scores arranged around the card (5 Left, 5 Right)
 * - Sleek, unified executive glass floating dock displaying the master score, verdict badge,
 *   and sartorial diagnostic highlights.
 */

import { OutfitScoreData, ParameterDef } from '../types/OutfitRatingTypes';
import { drawRoundedRect, drawImageCover } from '@/shared/utils/CanvasUtil';

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
  parameters: ParameterDef[]
): void {
  const width = 1080;
  const height = 1350;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  // 1. Deep Charcoal Obsidian Studio Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  // Ambient backdrop glow
  const bgGlow = ctx.createRadialGradient(width / 2, 500, 80, width / 2, 500, 680);
  bgGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
  bgGlow.addColorStop(1, 'rgba(10, 10, 15, 0)');
  ctx.fillStyle = bgGlow;
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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('SARTORIAL FIT CHECK AUDIT', 24 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.app';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagW = ctx.measureText(platformUrl).width + 36;
  const tagH = 32;
  const tagX = width - 24 - tagW;
  const tagY = headerY - tagH / 2;

  drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 16);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Active glowing green beacon dot
  ctx.beginPath();
  ctx.arc(tagX + 16, headerY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f0f9ff';
  ctx.fillText(platformUrl, tagX + 26, headerY);
  ctx.restore();

  // 3. Center Hero Outfit Photo Stage (x = 276, w = 528, y = 76, h = 1030)
  const photoX = 276;
  const photoY = 76;
  const photoW = 528;
  const photoH = 1030;
  const photoR = 20;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.fillStyle = '#14141c';
  ctx.fill();
  ctx.restore();

  // Draw user's outfit photo
  drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Outfit Photo');

  // Hairline frame border around hero photo
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtle bottom vignette transition into dock
  ctx.save();
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.clip();
  const bottomVignette = ctx.createLinearGradient(0, photoY + photoH - 200, 0, photoY + photoH);
  bottomVignette.addColorStop(0, 'rgba(10, 10, 15, 0)');
  bottomVignette.addColorStop(1, 'rgba(10, 10, 15, 0.65)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(photoX, photoY + photoH - 200, photoW, 200);
  ctx.restore();

  // Floating Format Badge inside Hero Photo (Top-Left)
  const formatBadgeW = 160;
  const formatBadgeH = 32;
  const formatBadgeX = photoX + 18;
  const formatBadgeY = photoY + 18;
  drawRoundedRect(ctx, formatBadgeX, formatBadgeY, formatBadgeW, formatBadgeH, 8);
  ctx.fillStyle = 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(formatBadgeX + 16, formatBadgeY + formatBadgeH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillText('FIT CHECK PASS', formatBadgeX + formatBadgeW / 2 + 6, formatBadgeY + formatBadgeH / 2);
  ctx.restore();

  // 4. 10 Parameter Scores Around the Card (5 Left, 5 Right)
  const cardW = 236;
  const cardH = 194;
  const cardGap = 15;

  const leftParams = parameters.slice(0, 5);
  const rightParams = parameters.slice(5, 10);

  const drawSideCard = (param: ParameterDef, cx: number, cy: number) => {
    const pRatingData = photoScore.parameterRatings[param.id];
    const pRating = pRatingData?.ratingR ?? 9.0;
    const pPoints = pRatingData?.points ?? Math.round(param.maxPts * 0.9);
    const scoreValStr = pPoints.toFixed(1);

    ctx.save();
    // Glass card background
    drawRoundedRect(ctx, cx, cy, cardW, cardH, 14);
    ctx.fillStyle = 'rgba(16, 16, 24, 0.82)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top Row: Icon + Name (Left) & Rating Pill (Right)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#f8fafc';

    let shortName = param.name;
    if (shortName === 'Proportion & Silhouette') shortName = 'Proportion & Cut';
    if (shortName === 'Occasion Appropriateness') shortName = 'Occasion';
    if (shortName === 'Fabric, Texture & Condition') shortName = 'Fabric & Texture';
    if (shortName === 'Accessories & Footwear') shortName = 'Shoes & Accs';
    if (shortName === 'Grooming & Presentation') shortName = 'Grooming & Pose';
    if (shortName === 'Focal Point & Hierarchy') shortName = 'Focal Point';
    if (shortName === 'Originality & Expression') shortName = 'Originality';

    const icon = OUTFIT_PARAM_ICONS[param.id] || '✨';
    ctx.fillText(`${icon} ${shortName}`, cx + 14, cy + 18);

    // Rating Pill
    const rText = `R: ${pRating.toFixed(1)}`;
    ctx.font = 'bold 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const rW = ctx.measureText(rText).width + 12;
    const rH = 20;
    const rX = cx + cardW - 14 - rW;
    const rY = cy + 16;
    drawRoundedRect(ctx, rX, rY, rW, rH, 5);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText(rText, rX + rW / 2, rY + rH / 2);

    // Middle Score Row
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(scoreValStr, cx + 14, cy + 50);

    const sW = ctx.measureText(scoreValStr).width;
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(`/${param.maxPts}`, cx + 14 + sW + 4, cy + 68);

    // Progress Bar Track & Fill
    const barW = cardW - 28;
    const barY = cy + 112;
    drawRoundedRect(ctx, cx + 14, barY, barW, 4, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    const fillW = Math.min(barW, Math.max(0, (pPoints / param.maxPts) * barW));
    drawRoundedRect(ctx, cx + 14, barY, fillW, 4, 2);
    const grad = ctx.createLinearGradient(cx + 14, barY, cx + 14 + fillW, barY);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#a855f7');
    ctx.fillStyle = grad;
    ctx.fill();

    // Bottom Subtitle
    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    const statusText = pRating >= 8.5 ? 'Well Balanced' : pRating >= 7.0 ? 'Acceptable' : 'Refine Detail';
    ctx.fillText(statusText, cx + 14, cy + 132);

    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillText(`Max Points: ${param.maxPts}`, cx + 14, cy + 154);

    ctx.restore();
  };

  // Draw 5 Cards on Left (x = 24)
  leftParams.forEach((param, i) => {
    const cy = photoY + i * (cardH + cardGap);
    drawSideCard(param, 24, cy);
  });

  // Draw 5 Cards on Right (x = 820)
  rightParams.forEach((param, i) => {
    const cy = photoY + i * (cardH + cardGap);
    drawSideCard(param, 820, cy);
  });

  // 5. Unified Executive Glass Dock at Bottom (x = 24, w = 1032, y = 1124, h = 166)
  const dockX = 24;
  const dockY = 1124;
  const dockW = 1032;
  const dockH = 166;
  const dockR = 20;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  drawRoundedRect(ctx, dockX, dockY, dockW, dockH, dockR);
  ctx.fillStyle = 'rgba(16, 16, 24, 0.92)';
  ctx.fill();
  ctx.restore();

  drawRoundedRect(ctx, dockX, dockY, dockW, dockH, dockR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Master Score Calculation
  const scoreNumStr = typeof photoScore.overallScore === 'number'
    ? (Number.isInteger(photoScore.overallScore) ? String(photoScore.overallScore) : photoScore.overallScore.toFixed(1))
    : '88.5';

  ctx.save();
  // Score Label
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('SARTORIAL FIT INDEX', dockX + 28, dockY + 22);

  // Big Score Number
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreNumStr, dockX + 28, dockY + 40);

  const scoreW = ctx.measureText(scoreNumStr).width;
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('/ 100', dockX + 28 + scoreW + 6, dockY + 62);

  // Verdict Pill (Top Right of Dock)
  const verdictText = (photoScore.verdict || 'ELEVATED SARTORIAL').toUpperCase();
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const vPillTextW = ctx.measureText(verdictText).width;
  const vPillW = vPillTextW + 36;
  const vPillH = 36;
  const vPillX = dockX + dockW - 28 - vPillW;
  const vPillY = dockY + 28;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 10);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(vPillX + 18, vPillY + vPillH / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0f9ff';
  ctx.fillText(verdictText, vPillX + 30, vPillY + vPillH / 2);

  // Subtle Hairline Divider Inside Dock
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(dockX + 24, dockY + 104);
  ctx.lineTo(dockX + dockW - 24, dockY + 104);
  ctx.stroke();

  // Bottom Row of Dock: 3 Key Signals & Audit Subtitle
  const p1Rating = photoScore.parameterRatings[1]?.ratingR ?? 9.5;
  const p2Rating = photoScore.parameterRatings[2]?.ratingR ?? 9.8;
  const p4Rating = photoScore.parameterRatings[4]?.ratingR ?? 9.2;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Highlight 1: Fit & Tailoring
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('📐 Fit & Tailoring: ', dockX + 28, dockY + 130);
  const p1PrefixW = ctx.measureText('📐 Fit & Tailoring: ').width;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`${p1Rating.toFixed(1)}/10`, dockX + 28 + p1PrefixW, dockY + 130);

  // Highlight 2: Proportion & Cut
  const col2X = dockX + 330;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('⚖️ Proportion & Cut: ', col2X, dockY + 130);
  const p2PrefixW = ctx.measureText('⚖️ Proportion & Cut: ').width;
  ctx.fillStyle = '#34d399';
  ctx.fillText(`${p2Rating.toFixed(1)}/10`, col2X + p2PrefixW, dockY + 130);

  // Highlight 3: Color & Harmony
  const col3X = dockX + 680;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('🎨 Color Palette: ', col3X, dockY + 130);
  const p4PrefixW = ctx.measureText('🎨 Color Palette: ').width;
  ctx.fillStyle = '#c084fc';
  ctx.fillText(`${p4Rating.toFixed(1)}/10`, col3X + p4PrefixW, dockY + 130);

  ctx.restore();

  // 6. Platform URL & Viral Reach Footer Pill (y = 1300)
  ctx.save();
  const ctaPillW = 540;
  const ctaPillH = 34;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1300;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 17);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const promptPart = '👔 Rate your outfit, silhouette & tailoring free at ';
  const urlPart = 'gabru.app';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();
}
