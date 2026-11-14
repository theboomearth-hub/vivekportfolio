/**
 * Colour maths for the perceptual-ramp lab: HSL and OKLCH to sRGB, OKLab lightness, WCAG 2 contrast.
 * OKLab matrices from Björn Ottosson, "A perceptual color space for image processing" (2020).
 */

export type RGB = [number, number, number]; // 0–1, gamma-encoded sRGB

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hslToRgb(h: number, s: number, l: number): RGB {
  // h in degrees, s and l in 0–1
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

export function rgbToOklab([r, g, b]: RGB) {
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToLinear(L: number, a: number, b: number): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (c: RGB) => c.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLCH to sRGB. Out-of-gamut colours keep their lightness and hue and lose chroma until they fit. */
export function oklchToRgb(L: number, C: number, h: number): RGB {
  const rad = (h * Math.PI) / 180;
  let lo = 0;
  let hi = C;
  let lin = oklabToLinear(L, C * Math.cos(rad), C * Math.sin(rad));
  if (!inGamut(lin)) {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const t = oklabToLinear(L, mid * Math.cos(rad), mid * Math.sin(rad));
      if (inGamut(t)) lo = mid;
      else hi = mid;
    }
    lin = oklabToLinear(L, lo * Math.cos(rad), lo * Math.sin(rad));
  }
  return lin.map((v) => toGamma(Math.min(1, Math.max(0, v)))) as RGB;
}

/** WCAG 2 relative luminance. */
export function luminance([r, g, b]: RGB) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrast(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const toHex = (c: RGB) => `#${c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;

export const WHITE: RGB = [1, 1, 1];
export const INK: RGB = [15 / 255, 15 / 255, 16 / 255];
