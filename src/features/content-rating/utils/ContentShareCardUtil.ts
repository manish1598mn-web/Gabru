/**
 * GABRU — CONTENT RATING SOCIAL SHARE CARD GENERATOR
 * 
 * Generates an informative, ultra-crisp social share card stamped with:
 * - Center Hero Content Stage ($528 \times 1030\text{px}$)
 * - 10 Parameter Scores arranged around the card (5 Left, 5 Right)
 * - Sleek, unified executive glass floating dock displaying the master viral score,
 *   verdict badge, platform attribution, and creator handle.
 * - Ultra-HD 2x super-sampling (2160 x 2700px) for maximum mobile & retina clarity.
 */

import { ContentScoreData } from '../types/ContentRatingTypes';
import { CONTENT_PARAMETERS } from '../constants/ContentRatingConstants';
import { drawRoundedRect, drawImageCover } from '@/shared/utils/CanvasUtil';

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
  scoreData: ContentScoreData
): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = 1350;
  const scale = 2; // Ultra-HD 2x (2160 x 2700)
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

  // 1. Deep Obsidian Studio Canvas Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient backdrop glows
  const grad1 = ctx.createRadialGradient(width / 2, 500, 80, width / 2, 500, 680);
  grad1.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
  grad1.addColorStop(1, 'rgba(10, 10, 15, 0)');
  ctx.fillStyle = grad1;
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
  ctx.fillText('CONTENT INTELLIGENCE AUDIT', 24 + brandWidth + 24, headerY);

  // Right Header: Platform & Creator Handle Pill
  const platform = (scoreData.item?.platform || 'INSTAGRAM').toUpperCase();
  const creator = scoreData.item?.creator?.handle || scoreData.item?.creator?.name || '@creator';
  const handlePillText = `${platform}  •  ${creator}`;
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const pillW = ctx.measureText(handlePillText).width + 28;
  const pillH = 30;
  const pillX = width - 24 - pillW;
  const pillY = headerY - pillH / 2;

  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f3e8ff';
  ctx.fillText(handlePillText, pillX + pillW / 2, headerY);
  ctx.restore();

  // 3. Center Hero Content Stage (x = 276, w = 528, y = 76, h = 1030)
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

  // Load content media thumbnail or fallback blueprint sketch
  const imageSource = scoreData.item?.media?.thumbnailUrl || '/content_rating_sketch.jpg';
  let img = await loadCardImage(imageSource);
  if (!img) {
    img = await loadCardImage('/content_rating_sketch.jpg');
  }

  if (img) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, photoR, 'Content Media Preview');
  }

  // Elegant hairline border around the hero content
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtle bottom gradient vignette over photo so it transitions into the dock
  ctx.save();
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoR);
  ctx.clip();
  const bottomVignette = ctx.createLinearGradient(0, photoY + photoH - 200, 0, photoY + photoH);
  bottomVignette.addColorStop(0, 'rgba(10, 10, 15, 0)');
  bottomVignette.addColorStop(1, 'rgba(10, 10, 15, 0.65)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(photoX, photoY + photoH - 200, photoW, 200);
  ctx.restore();

  // Floating Format Badge Inside Hero Photo (Top-Left)
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
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(formatBadgeX + 16, formatBadgeY + formatBadgeH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  const formatText = scoreData.item?.format ? scoreData.item.format.replace('_', ' ').toUpperCase() : 'SINGLE POST';
  ctx.fillText(formatText, formatBadgeX + formatBadgeW / 2 + 6, formatBadgeY + formatBadgeH / 2);
  ctx.restore();

  // 4. 10 Parameter Scores Around the Card (5 Left, 5 Right)
  const cardW = 236;
  const cardH = 194;
  const cardGap = 15;

  const leftParams = CONTENT_PARAMETERS.slice(0, 5);
  const rightParams = CONTENT_PARAMETERS.slice(5, 10);

  const drawSideCard = (paramDef: typeof CONTENT_PARAMETERS[0], cx: number, cy: number) => {
    const scored = scoreData.parameters.find((p) => p.id === paramDef.id);
    const scoreVal = scored ? Math.round(scored.score) : 85;
    const ratingVal = (scoreVal / 10).toFixed(1);

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

    let shortName = paramDef.name;
    if (shortName === 'Visual Aura & Frame Quality') shortName = 'Visual Aura';
    if (shortName === 'Caption Poetry vs. Cringe') shortName = 'Caption Wit';
    if (shortName === 'Group-Chat Forwardability') shortName = 'Forwardability';
    if (shortName === 'Secret Bookmark Bait') shortName = 'Bookmark Bait';
    if (shortName === 'Comment Chaos Magnetism') shortName = 'Comment Chaos';
    if (shortName === 'Original Brain Energy') shortName = 'Original Brain';
    if (shortName === 'Viral Longevity vs. 24h Rot') shortName = 'Longevity';

    const icon = CONTENT_PARAM_ICONS[paramDef.id] || '✨';
    ctx.fillText(`${icon} ${shortName}`, cx + 14, cy + 18);

    // Rating Pill
    const rText = `R: ${ratingVal}`;
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

    // Middle Score Row
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${scoreVal}`, cx + 14, cy + 50);

    const sW = ctx.measureText(`${scoreVal}`).width;
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('/ 100', cx + 14 + sW + 4, cy + 68);

    // Progress Bar Track & Fill
    const barW = cardW - 28;
    const barY = cy + 112;
    drawRoundedRect(ctx, cx + 14, barY, barW, 4, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    const fillW = Math.min(barW, Math.max(0, (scoreVal / 100) * barW));
    drawRoundedRect(ctx, cx + 14, barY, fillW, 4, 2);
    const grad = ctx.createLinearGradient(cx + 14, barY, cx + 14 + fillW, barY);
    grad.addColorStop(0, '#a855f7');
    grad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = grad;
    ctx.fill();

    // Bottom Subtitle
    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    const statusText = scoreVal >= 90 ? 'Standout Execution' : scoreVal >= 75 ? 'Strong Resonance' : 'Optimization Room';
    ctx.fillText(statusText, cx + 14, cy + 132);

    ctx.font = '500 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillText(`Weight: ${paramDef.weight}%`, cx + 14, cy + 154);

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
  const scoreVal = typeof scoreData.contentScore === 'number'
    ? scoreData.contentScore
    : Math.round(scoreData.rawScore || 86);

  ctx.save();
  // Score Label
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText('CONTENT AUDIT INDEX', dockX + 28, dockY + 22);

  // Big Score Number
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${scoreVal}`, dockX + 28, dockY + 42);

  const scoreW = ctx.measureText(`${scoreVal}`).width;
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('/ 100', dockX + 28 + scoreW + 6, dockY + 66);

  // Verdict Pill (Top Right of Dock)
  const verdictText = (scoreData.verdictBadge || scoreData.verdict || 'GROUP-CHAT HALL OF FAMER').toUpperCase();
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

  // Bottom Line of Dock: Caption Snippet
  const rawCaption = scoreData.item?.title || scoreData.item?.caption || 'Single Post Intelligence Audit';
  const cleanSnippet = rawCaption.length > 95 ? rawCaption.substring(0, 92) + '...' : rawCaption;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '500 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillText(`“${cleanSnippet}”`, dockX + 28, dockY + 134);

  ctx.restore();

  // 6. Platform URL & Viral Reach Footer Pill (y = 1300)
  ctx.save();
  const ctaPillW = 560;
  const ctaPillH = 34;
  const ctaPillX = (width - ctaPillW) / 2;
  const ctaPillY = 1300;

  drawRoundedRect(ctx, ctaPillX, ctaPillY, ctaPillW, ctaPillH, 17);
  ctx.fillStyle = 'rgba(217, 70, 239, 0.14)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(217, 70, 239, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const promptPart = '🚀 Audit your post hook & virality score free at ';
  const urlPart = 'gabru.app/content-rating';
  const fullW = ctx.measureText(promptPart + urlPart).width;
  const startX = (width - fullW) / 2;

  ctx.textAlign = 'left';
  ctx.fillText(promptPart, startX, ctaPillY + ctaPillH / 2);
  const promptW = ctx.measureText(promptPart).width;
  ctx.font = '900 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#f0abfc';
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
