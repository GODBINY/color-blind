export type RGB = readonly [number, number, number];
export type Mat3 = readonly [RGB, RGB, RGB];

export const toLinear = (c: number): number =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

export const toSRGB = (c: number): number =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export const rgbToLinear = ([r, g, b]: RGB): RGB => [
  toLinear(r),
  toLinear(g),
  toLinear(b),
];

export const linearToRGB = ([r, g, b]: RGB): RGB => [
  toSRGB(r),
  toSRGB(g),
  toSRGB(b),
];

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const clampRGB = ([r, g, b]: RGB): RGB => [
  clamp01(r),
  clamp01(g),
  clamp01(b),
];

export const applyMat3 = (m: Mat3, [x, y, z]: RGB): RGB => [
  m[0][0] * x + m[0][1] * y + m[0][2] * z,
  m[1][0] * x + m[1][1] * y + m[1][2] * z,
  m[2][0] * x + m[2][1] * y + m[2][2] * z,
];

export const invertMat3 = (m: Mat3): Mat3 => {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;
  const det = a * A + b * B + c * C;
  return [
    [A / det, D / det, G / det],
    [B / det, E / det, H / det],
    [C / det, F / det, I / det],
  ];
};

export const cross = ([a0, a1, a2]: RGB, [b0, b1, b2]: RGB): RGB => [
  a1 * b2 - a2 * b1,
  a2 * b0 - a0 * b2,
  a0 * b1 - a1 * b0,
];

export const dot = ([a0, a1, a2]: RGB, [b0, b1, b2]: RGB): number =>
  a0 * b0 + a1 * b1 + a2 * b2;

export const lerpRGB = ([a0, a1, a2]: RGB, [b0, b1, b2]: RGB, t: number): RGB => [
  a0 + (b0 - a0) * t,
  a1 + (b1 - a1) * t,
  a2 + (b2 - a2) * t,
];
