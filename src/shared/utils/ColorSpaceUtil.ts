/**
 * GABRU — COLOR SPACE UTILITIES
 * 
 * Provides color space conversions:
 *   - RGB <-> HSL
 *   - RGB <-> CIELAB (D65 standard illuminant)
 *   - CIE Delta E 2000 (standard international color difference equation)
 */

export interface LabColor {
  L: number; // 0 to 100
  a: number; // -128 to 127 (Green to Red)
  b: number; // -128 to 127 (Blue to Yellow)
}

/**
 * Converts RGB (0-255) to HSL (H: 0-360, S: 0-1, L: 0-1)
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case normR:
        h = (normG - normB) / d + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / d + 2;
        break;
      case normB:
        h = (normR - normG) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100) / 100, Math.round(l * 100) / 100];
}

/**
 * Converts sRGB (0-255) to CIELAB under standard D65 illuminant
 */
export function rgbToLab(r: number, g: number, b: number): LabColor {
  const fR = r / 255.0;
  const fG = g / 255.0;
  const fB = b / 255.0;

  const rl = fR > 0.04045 ? Math.pow((fR + 0.055) / 1.055, 2.4) : fR / 12.92;
  const gl = fG > 0.04045 ? Math.pow((fG + 0.055) / 1.055, 2.4) : fG / 12.92;
  const bl = fB > 0.04045 ? Math.pow((fB + 0.055) / 1.055, 2.4) : fB / 12.92;

  // D65 reference white
  const X = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
  const Y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / 1.00000;
  const Z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883;

  const fXYZ = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = fXYZ(X);
  const fy = fXYZ(Y);
  const fz = fXYZ(Z);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Calculates CIE Delta E 2000 color difference between two CIELAB colors
 */
export function deltaE2000(lab1: LabColor, lab2: LabColor): number {
  const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;
  const avg_L = (L1 + L2) / 2.0;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const avg_C = (C1 + C2) / 2.0;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avg_C, 7) / (Math.pow(avg_C, 7) + Math.pow(25, 7))));
  const a1_prime = (1 + G) * a1;
  const a2_prime = (1 + G) * a2;
  const C1_prime = Math.hypot(a1_prime, b1);
  const C2_prime = Math.hypot(a2_prime, b2);
  const avg_C_prime = (C1_prime + C2_prime) / 2.0;

  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let h1_prime = toDeg(Math.atan2(b1, a1_prime)) % 360;
  if (h1_prime < 0) h1_prime += 360;
  let h2_prime = toDeg(Math.atan2(b2, a2_prime)) % 360;
  if (h2_prime < 0) h2_prime += 360;

  let h_bar_prime = 0;
  if (Math.abs(h1_prime - h2_prime) > 180) {
    h_bar_prime = (h1_prime + h2_prime + 360) / 2.0;
  } else {
    h_bar_prime = (h1_prime + h2_prime) / 2.0;
  }

  const T =
    1 -
    0.17 * Math.cos(toRad(h_bar_prime - 30)) +
    0.24 * Math.cos(toRad(2 * h_bar_prime)) +
    0.32 * Math.cos(toRad(3 * h_bar_prime + 6)) -
    0.20 * Math.cos(toRad(4 * h_bar_prime - 63));

  let deltah_prime = 0;
  if (Math.abs(h2_prime - h1_prime) <= 180) {
    deltah_prime = h2_prime - h1_prime;
  } else if (h2_prime <= h1_prime) {
    deltah_prime = h2_prime - h1_prime + 360;
  } else {
    deltah_prime = h2_prime - h1_prime - 360;
  }

  const deltaL_prime = L2 - L1;
  const deltaC_prime = C2_prime - C1_prime;
  const deltaH_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin(toRad(deltah_prime / 2.0));

  const SL = 1 + (0.015 * Math.pow(avg_L - 50, 2)) / Math.sqrt(20 + Math.pow(avg_L - 50, 2));
  const SC = 1 + 0.045 * avg_C_prime;
  const SH = 1 + 0.015 * avg_C_prime * T;

  const delta_theta = 30 * Math.exp(-Math.pow((h_bar_prime - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(avg_C_prime, 7) / (Math.pow(avg_C_prime, 7) + Math.pow(25, 7)));
  const RT = -Math.sin(toRad(2 * delta_theta)) * RC;

  const kL = 1.0;
  const kC = 1.0;
  const kH = 1.0;

  const vL = deltaL_prime / (kL * SL);
  const vC = deltaC_prime / (kC * SC);
  const vH = deltaH_prime / (kH * SH);

  return Math.sqrt(vL * vL + vC * vC + vH * vH + RT * vC * vH);
}

