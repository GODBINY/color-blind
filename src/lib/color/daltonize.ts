import { applyMat3, clampRGB, type Mat3, type RGB } from "./srgb";
import { simulate, simulateProtan, type VisionType } from "./simulate";

export type DaltonizeVisionType = Exclude<VisionType, "monochromacy">;

// docs/04_Tech.md §4 — redistributes the red-green error onto the blue-yellow axis.
const SHIFT_MATRIX: Mat3 = [
  [0, 0, 0],
  [0.7, 1, 0],
  [0.7, 0, 1],
];

// Transpose of SHIFT_MATRIX — redistributes the blue-yellow error onto red-green.
const SHIFT_MATRIX_TRITAN: Mat3 = [
  [0, 0.7, 0.7],
  [0, 1, 0],
  [0, 0, 1],
];

const luminance709 = ([r, g, b]: RGB): number => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Protan viewers perceive red as darker than it is (L-cone loss reads as
 * luminance loss, not just hue confusion). Lift the result toward the
 * luminance the untranslated photo would have had, scaled by how much
 * luminance this viewer's simulated view actually lost.
 */
const compensateProtanLuminance = (
  original: RGB,
  result: RGB,
  severity: number,
  strength: number,
): RGB => {
  const lost = luminance709(original) - luminance709(simulateProtan(original, severity));
  const boost = 0.5 * strength * lost;
  return [result[0] + boost, result[1] + boost, result[2] + boost];
};

export const daltonize = (
  linearRGB: RGB,
  visionType: DaltonizeVisionType,
  severity: number,
  strength: number,
): RGB => {
  const sim = simulate(linearRGB, visionType, severity);
  const error: RGB = [linearRGB[0] - sim[0], linearRGB[1] - sim[1], linearRGB[2] - sim[2]];
  const shifted = applyMat3(visionType === "tritan" ? SHIFT_MATRIX_TRITAN : SHIFT_MATRIX, error);

  let result: RGB = [
    linearRGB[0] + strength * shifted[0],
    linearRGB[1] + strength * shifted[1],
    linearRGB[2] + strength * shifted[2],
  ];

  if (visionType === "protan") {
    result = compensateProtanLuminance(linearRGB, result, severity, strength);
  }

  return clampRGB(result);
};

/**
 * docs/04_Tech.md §4 — mean per-channel absolute difference between how this
 * viewer would see the original vs. the translated photo. Below-threshold
 * means the translation made no perceptible difference for them.
 */
export const computeDelta = (
  original: RGB,
  translated: RGB,
  visionType: VisionType,
  severity: number,
): number => {
  const simOriginal = simulate(original, visionType, severity);
  const simTranslated = simulate(translated, visionType, severity);
  return (
    (Math.abs(simTranslated[0] - simOriginal[0]) +
      Math.abs(simTranslated[1] - simOriginal[1]) +
      Math.abs(simTranslated[2] - simOriginal[2])) /
    3
  );
};

/**
 * Distance between two colours after they have passed through the same vision
 * model. This is a model-based proxy for "can these adjacent areas be told
 * apart?" — it is deliberately not presented as a clinical measurement.
 */
export const simulatedSeparation = (
  left: RGB,
  right: RGB,
  visionType: VisionType,
  severity: number,
): number => {
  const a = simulate(left, visionType, severity);
  const b = simulate(right, visionType, severity);
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
};

/**
 * Automated regression metric for a meaningful colour pair (for example a
 * rose against nearby leaves). Positive values mean the pair is farther apart
 * in the selected simulated view after translation.
 */
export const computeSeparationGain = (
  originalLeft: RGB,
  originalRight: RGB,
  translatedLeft: RGB,
  translatedRight: RGB,
  visionType: VisionType,
  severity: number,
): number =>
  simulatedSeparation(translatedLeft, translatedRight, visionType, severity) -
  simulatedSeparation(originalLeft, originalRight, visionType, severity);
