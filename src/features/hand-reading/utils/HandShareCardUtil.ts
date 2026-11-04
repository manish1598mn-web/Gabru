/**
 * GABRU — HAND READING HIGH-RESOLUTION 1080x1350 SHARE CARD CANVAS
 * 
 * Generates an informative, ultra-crisp social share card stamped with:
 * - Center Hero Palm Photo / Blueprint ($528 \times 1030\text{px}$)
 * - 10 Parameter Scores arranged around the card (5 Left, 5 Right)
 * - Sleek, unified executive glass floating dock displaying the master prominence score,
 *   hand archetype, tradition attribution, and quality confidence.
 * - Ultra-HD 2x super-sampling (2160 x 2700px) for maximum retina and mobile clarity.
 */

import { HandReadingResult } from '../types/HandReadingTypes';
import { HAND_PARAMETERS } from '../constants/HandReadingConstants';
import { drawRoundedRect, drawImageCover } from '@/shared/utils/CanvasUtil';

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
  userImageUri?: string
): Promise<string> {
  const width = 1080;
  const height = 1350;
  const scale = 2; // Ultra-HD 2x (2160 x 2700)
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Dark Obsidian Canvas Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient purple glow
  const bgGlow = ctx.createRadialGradient(width / 2, 500, 80, width / 2, 500, 680);
  bgGlow.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
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
  ctx.fillText('PALMISTRY & SAMUDRIKA SHASTRA', 24 + brandWidth + 24, headerY);

  // Right Header: Official Platform URL Pill
  const platformUrl = 'gabru.vercel.app/hand-reading';
  ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagW = ctx.measureText(platformUrl).width + 36;
  const tagH = 32;
  const tagX = width - 24 - tagW;
  const tagY = headerY - tagH / 2;

  drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 16);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
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

  // 3. Center Hero Palm Photo Stage (x = 276, w = 528, y = 76, h = 1030)
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

  // Load palm photo or fallback to architectural blueprint
  const imageSource = userImageUri || '/hand_reading_sketch.jpg';
  let img = await loadCardImage(imageSource);
  if (!img) {
    img = await loadCardImage('/hand_reading_sketch.jpg');
  }

  if (img) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Palm Photo');
  }

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

  // Floating Constitutional Archetype Badge inside Hero Photo (Top-Left)
  const archText = `ARCHETYPE: ${result.handTypeLabel.toUpperCase()}`;
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const archBadgeW = ctx.measureText(archText).width + 36;
  const archBadgeH = 32;
  const archBadgeX = photoX + 18;
  const archBadgeY = photoY + 18;
  drawRoundedRect(ctx, archBadgeX, archBadgeY, archBadgeW, archBadgeH, 8);
  ctx.fillStyle = 'rgba(15, 15, 22, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c084fc';
  ctx.beginPath();
  ctx.arc(archBadgeX + 16, archBadgeY + archBadgeH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(archText, archBadgeX + archBadgeW / 2 + 6, archBadgeY + archBadgeH / 2);
  ctx.restore();

  // 4. 10 Parameter Scores Around the Card (5 Left, 5 Right)
  const cardW = 236;
  const cardH = 194;
  const cardGap = 15;

  const leftParams = HAND_PARAMETERS.slice(0, 5);
  const rightParams = HAND_PARAMETERS.slice(5, 10);

  const drawSideCard = (paramDef: typeof HAND_PARAMETERS[0], cx: number, cy: number) => {
    const scored = result.parameters.find((p) => p.key === paramDef.key || p.id === paramDef.id);
    const scoreVal = scored ? (scored.isAbsent ? 'Absent' : scored.score.toFixed(1)) : '--';
    const isAbsent = scored?.isAbsent ?? false;
    const isReadable = scored?.isReadable ?? true;
    const bandLabel = scored?.bandLabel || 'Measured';

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
    
    // Truncate name cleanly if long
    let shortName = paramDef.name;
    if (shortName === 'Relationship Lines') shortName = 'Relationships';
    if (shortName === 'Hand Shape & Fingers') shortName = 'Hand & Fingers';
    if (shortName === 'Mounts (7 Regions)') shortName = 'Mount Reliefs';
    ctx.fillText(`${paramDef.icon} ${shortName}`, cx + 14, cy + 18);

    // Rating Pill
    if (scored && isReadable && !isAbsent) {
      const rText = `R: ${(scored.score / 10).toFixed(1)}`;
      ctx.font = 'bold 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const rW = ctx.measureText(rText).width + 12;
      const rH = 20;
      const rX = cx + cardW - 14 - rW;
      const rY = cy + 16;
      drawRoundedRect(ctx, rX, rY, rW, rH, 5);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(rText, rX + rW / 2, rY + rH / 2);
    } else if (isAbsent) {
      const rText = 'Absent';
      ctx.font = 'bold 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const rW = ctx.measureText(rText).width + 12;
      const rH = 20;
      const rX = cx + cardW - 14 - rW;
      const rY = cy + 16;
      drawRoundedRect(ctx, rX, rY, rW, rH, 5);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rText, rX + rW / 2, rY + rH / 2);
    }

    // Middle Score Row
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (isAbsent) {
      ctx.font = '800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Absent', cx + 14, cy + 54);
    } else if (!isReadable) {
      ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Unreadable', cx + 14, cy + 56);
    } else {
      ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(scoreVal, cx + 14, cy + 50);

      const sW = ctx.measureText(scoreVal).width;
      ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('/ 100', cx + 14 + sW + 4, cy + 68);
    }

    // Progress Bar Track & Fill
    const barW = cardW - 28;
    const barY = cy + 112;
    drawRoundedRect(ctx, cx + 14, barY, barW, 4, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    if (scored && isReadable && !isAbsent) {
      const fillW = Math.min(barW, Math.max(0, (scored.score / 100) * barW));
      drawRoundedRect(ctx, cx + 14, barY, fillW, 4, 2);
      const grad = ctx.createLinearGradient(cx + 14, barY, cx + 14 + fillW, barY);
      grad.addColorStop(0, '#a855f7');
      grad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Bottom Subtitle / Band Label
    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(bandLabel, cx + 14, cy + 132);

    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillText(paramDef.sanskritName, cx + 14, cy + 154);

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

  // Master Prominence Score
  const scoreNumStr = result.overallProminenceIndex.toFixed(1);

  ctx.save();
  // Score Label
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText('PALM PROMINENCE INDEX', dockX + 28, dockY + 22);

  // Big Score Number
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreNumStr, dockX + 28, dockY + 42);

  const scoreW = ctx.measureText(scoreNumStr).width;
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('/ 100', dockX + 28 + scoreW + 6, dockY + 66);

  // Verdict Pill (Top Right of Dock)
  const verdictText = result.overallBandLabel.toUpperCase();
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const vPillTextW = ctx.measureText(verdictText).width;
  const vPillW = vPillTextW + 36;
  const vPillH = 38;
  const vPillX = dockX + dockW - 28 - vPillW;
  const vPillY = dockY + 36;

  drawRoundedRect(ctx, vPillX, vPillY, vPillW, vPillH, 10);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(vPillX + 18, vPillY + vPillH / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f3e8ff';
  ctx.fillText(verdictText, vPillX + 30, vPillY + vPillH / 2);

  // Subtle Hairline Divider Inside Dock
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(dockX + 24, dockY + 104);
  ctx.lineTo(dockX + dockW - 24, dockY + 104);
  ctx.stroke();

  // Bottom Line of Dock: Quality Factor & Entertainment Notice
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  const qVal = result.qualityGate?.q ? result.qualityGate.q.toFixed(2) : '1.00';
  ctx.fillText(`Quality Factor q=${qVal} (${result.confidenceTier} Conf.)  •  10-Parameter Ridge & Mount Telemetry  •  Entertainment-Only Traditional Chiromancy`, dockX + 28, dockY + 134);

  ctx.restore();

  // 6. Platform URL & Viral Reach Footer Pill (y = 1300)
  ctx.save();
  const ctaPillW = 560;
  const ctaPillH = 34;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1300;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 17);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const promptPart = '🖐️ Read your palm lines & mounts free at ';
  const urlPart = 'gabru.vercel.app/hand-reading';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText(urlPart, startX + promptW, ctaPillY + ctaPillH / 2);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
