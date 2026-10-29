/**
 * ContentShareCardUtil
 * Generates an ultra-premium 1080x1350 (4:5 vertical portrait) social share card
 * for Gabru Social Media Content Rating audits using HTML5 Canvas.
 */

import { ContentScoreData } from '../types/ContentRatingTypes';

export async function generateContentShareCard(
  scoreData: ContentScoreData
): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create canvas 2D rendering context');
  }

  // 1. Deep Obsidian Background
  ctx.fillStyle = '#09090d';
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Gradient Glows
  const grad1 = ctx.createRadialGradient(900, 200, 50, 900, 200, 600);
  grad1.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
  grad1.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, width, height);

  const grad2 = ctx.createRadialGradient(200, 1100, 50, 200, 1100, 650);
  grad2.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
  grad2.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, width, height);

  // Subtle border frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 30, 30, width - 60, height - 60, 28);
  ctx.stroke();

  // 3. Header Section
  ctx.save();
  // Brand Logo Text
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GABRU', 70, 95);

  // Dot Accent
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(205, 90, 6, 0, Math.PI * 2);
  ctx.fill();

  // Sub-header title
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('CONTENT INTELLIGENCE AUDIT', 225, 93);

  // Verified Pill
  const pillX = width - 330;
  ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, 64, 260, 42, 21);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(pillX + 22, 85, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('VERIFIED CRAFT RUBRIC v1.0', pillX + 38, 90);
  ctx.restore();

  // 4. Content Metadata Card
  ctx.save();
  ctx.fillStyle = 'rgba(18, 18, 26, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 70, 135, width - 140, 120, 20);
  ctx.fill();
  ctx.stroke();

  // Platform Tag
  const platform = scoreData.item.platform.toUpperCase();
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.fillText(`${platform} • ${scoreData.item.format.replace('_', ' ').toUpperCase()}`, 100, 172);

  // Title
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  const cleanTitle = scoreData.item.title || scoreData.item.caption || 'Social Media Video Audit';
  const truncatedTitle = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle;
  ctx.fillText(truncatedTitle, 100, 206);

  // Creator & Specs
  ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  const creator = scoreData.item.creator.handle || scoreData.item.creator.name || '@creator';
  const duration = scoreData.item.media.durationSec ? `${scoreData.item.media.durationSec}s` : 'Video';
  const res = `${scoreData.item.media.width}x${scoreData.item.media.height}`;
  ctx.fillText(`${creator}  •  ${duration}  •  ${res}  •  Public Audio & Keyframe Inspection`, 100, 234);
  ctx.restore();

  // 5. Central Score Dial Area (Y: 280 to 520)
  ctx.save();
  const dialCenterX = 240;
  const dialCenterY = 410;
  const dialRadius = 95;

  // Background ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(dialCenterX, dialCenterY, dialRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Glowing Progress Arc
  const scorePct = Math.min(Math.max(scoreData.contentScore, 0), 100) / 100;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + scorePct * Math.PI * 2;

  const arcGrad = ctx.createLinearGradient(dialCenterX - dialRadius, dialCenterY, dialCenterX + dialRadius, dialCenterY);
  arcGrad.addColorStop(0, '#8b5cf6');
  arcGrad.addColorStop(1, '#06b6d4');
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(dialCenterX, dialCenterY, dialRadius, startAngle, endAngle);
  ctx.stroke();

  // Score Number
  ctx.textAlign = 'center';
  ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreData.contentScore.toFixed(1), dialCenterX, dialCenterY + 14);

  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('OUT OF 100', dialCenterX, dialCenterY + 40);

  // Verdict Pill under dial
  const verdict = scoreData.verdict.toUpperCase();
  ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
  ctx.lineWidth = 1;
  roundRect(ctx, dialCenterX - 65, dialCenterY + 60, 130, 32, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText(verdict, dialCenterX, dialCenterY + 81);
  ctx.textAlign = 'left';

  // Right Side of Dial: Score breakdown & Confidence
  const infoX = 390;
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Executive Rating Breakdown', infoX, 335);

  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('Deterministic blend of intrinsic craft quality and creator baseline reach.', infoX, 362);

  // Mini stat cards
  drawMetricBlock(ctx, infoX, 385, 180, 75, 'Craft Quality (70%)', `${scoreData.qualityScore.toFixed(1)}/100`, '#a855f7');
  const perfVal = scoreData.performanceScore !== null ? `${scoreData.performanceScore.toFixed(1)}/100` : 'Provisional';
  drawMetricBlock(ctx, infoX + 200, 385, 180, 75, 'Reach Benchmark (30%)', perfVal, '#06b6d4');
  drawMetricBlock(ctx, infoX + 400, 385, 180, 75, 'Confidence Level', `${Math.round(scoreData.confidenceScore * 100)}% (${scoreData.confidence})`, '#10b981');
  ctx.restore();

  // 6. 10-Parameter Performance Matrix (Y: 535 to 975)
  ctx.save();
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('10-PARAMETER CRAFT RUBRIC', 70, 560);

  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('Weighted evaluation normalized across all observable features', 370, 560);

  // 2 Columns of 5 parameters
  const col1X = 70;
  const col2X = 555;
  const rowHeight = 72;
  const startY = 580;

  scoreData.qualityBreakdown.parameters.forEach((param, pIdx) => {
    const isCol2 = pIdx >= 5;
    const px = isCol2 ? col2X : col1X;
    const py = startY + (pIdx % 5) * rowHeight;
    const pWidth = 455;

    // Background card
    ctx.fillStyle = 'rgba(24, 24, 32, 0.6)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    roundRect(ctx, px, py, pWidth, 62, 12);
    ctx.fill();
    ctx.stroke();

    // Param Name & Weight
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(param.name, px + 18, py + 26);

    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`${param.weight}% wt`, px + 18, py + 46);

    // Score Text
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = param.rating >= 8.0 ? '#10b981' : param.rating >= 6.0 ? '#fbbf24' : '#f43f5e';
    ctx.textAlign = 'right';
    ctx.fillText(`${param.rating.toFixed(1)} / 10`, px + pWidth - 18, py + 27);
    ctx.textAlign = 'left';

    // Mini Progress Bar
    const barX = px + 130;
    const barY = py + 38;
    const barW = pWidth - 150;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, barX, barY, barW, 8, 4);
    ctx.fill();

    const fillW = Math.max(0, Math.min(barW, (param.rating / 10) * barW));
    ctx.fillStyle = param.rating >= 8.0 ? '#10b981' : param.rating >= 6.0 ? '#fbbf24' : '#f43f5e';
    roundRect(ctx, barX, barY, fillW, 8, 4);
    ctx.fill();
  });
  ctx.restore();

  // 7. Top Ranked Growth Suggestions (Y: 990 to 1210)
  ctx.save();
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('HIGH-LEVERAGE OPTIMIZATIONS', 70, 1000);

  const topSuggestions = scoreData.suggestions.slice(0, 2);
  topSuggestions.forEach((sug, sIdx) => {
    const sy = 1020 + sIdx * 90;
    ctx.fillStyle = 'rgba(22, 22, 32, 0.8)';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.lineWidth = 1;
    roundRect(ctx, 70, sy, width - 140, 78, 14);
    ctx.fill();
    ctx.stroke();

    // Gain Pill
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    roundRect(ctx, 90, sy + 18, 110, 42, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText(`+${sug.estimatedGain.toFixed(1)} pts`, 145, sy + 38);
    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('&Delta;Gain', 145, sy + 51);
    ctx.textAlign = 'left';

    // Title and description
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(sug.title, 220, sy + 35);

    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    const cleanDesc = sug.description.length > 80 ? sug.description.substring(0, 77) + '...' : sug.description;
    ctx.fillText(cleanDesc, 220, sy + 58);
  });
  ctx.restore();

  // 8. Footer Watermark & Privacy Guarantee (Y: 1240 to 1310)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 1240);
  ctx.lineTo(width - 70, 1240);
  ctx.stroke();

  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('Deterministic Content Intelligence • 100% Client-Side Private • No server storage of media', 70, 1280);

  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.textAlign = 'right';
  ctx.fillText('GABRU.AI', width - 70, 1280);
  ctx.restore();

  return canvas;
}

function drawMetricBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  val: string,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(24, 24, 32, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.stroke();

  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText(title, x + 16, y + 26);

  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText(val, x + 16, y + 54);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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

