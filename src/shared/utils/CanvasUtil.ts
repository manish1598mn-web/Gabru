/**
 * GABRU — CANVAS UTILITIES
 * 
 * Reusable HTML5 2D Canvas rendering helpers for social share cards and overlays.
 */

/**
 * Draws a rounded rectangle path on an HTML5 canvas context.
 * Falls back to bezier curves if native roundRect is unsupported.
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const roundRectSupported = typeof (ctx as unknown as { roundRect?: unknown }).roundRect === 'function';
  if (roundRectSupported) {
    ctx.beginPath();
    (ctx as unknown as { roundRect: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Draws an image with object-fit: cover semantics inside target bounds, optionally clipped to a radius.
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number = 0,
  fallbackLabel: string = 'Photo'
): void {
  ctx.save();
  if (r > 0) {
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.clip();
  }

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  if (imgW > 0 && imgH > 0) {
    const targetRatio = w / h;
    const imgRatio = imgW / imgH;

    let sX = 0;
    let sY = 0;
    let sW = imgW;
    let sH = imgH;

    if (imgRatio > targetRatio) {
      sW = imgH * targetRatio;
      sX = (imgW - sW) / 2;
    } else {
      sH = imgW / targetRatio;
      sY = (imgH - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
  } else {
    ctx.fillStyle = '#1c1e28';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 20px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fallbackLabel, x + w / 2, y + h / 2);
  }

  ctx.restore();
}
