import {
  applyMat3,
  clamp01,
  clampRGB,
  cross,
  dot,
  invertMat3,
  lerpRGB,
  type Mat3,
  type RGB,
} from "./srgb";
import { MACHADO_DEUTAN, MACHADO_PROTAN } from "./machado-matrices";

export type VisionType = "protan" | "deutan" | "tritan" | "monochromacy";

const lerpMat3 = (a: Mat3, b: Mat3, t: number): Mat3 => [
  [a[0][0] + (b[0][0] - a[0][0]) * t, a[0][1] + (b[0][1] - a[0][1]) * t, a[0][2] + (b[0][2] - a[0][2]) * t],
  [a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t, a[1][2] + (b[1][2] - a[1][2]) * t],
  [a[2][0] + (b[2][0] - a[2][0]) * t, a[2][1] + (b[2][1] - a[2][1]) * t, a[2][2] + (b[2][2] - a[2][2]) * t],
];

const machadoMatrixForSeverity = (table: readonly Mat3[], severity: number): Mat3 => {
  const s = clamp01(severity) * 10;
  const lower = Math.floor(s);
  const upper = Math.min(10, Math.ceil(s));
  const step = table[lower]!;
  return lower === upper ? step : lerpMat3(step, table[upper]!, s - lower);
};

export const simulateProtan = (linearRGB: RGB, severity: number): RGB =>
  clampRGB(applyMat3(machadoMatrixForSeverity(MACHADO_PROTAN, severity), linearRGB));

export const simulateDeutan = (linearRGB: RGB, severity: number): RGB =>
  clampRGB(applyMat3(machadoMatrixForSeverity(MACHADO_DEUTAN, severity), linearRGB));

export const simulateMonochromacy = ([r, g, b]: RGB): RGB => {
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return [y, y, y];
};

/**
 * Tritanopia via Brettel, Viénot & Mollon (1997), the reference algorithm for
 * blue-yellow dichromacy (Machado's tritan matrices are known to be inaccurate —
 * docs/04_Tech.md §3). Constants verified against DaltonLens-Python
 * (LMSModel_sRGB_SmithPokorny75 + Judd-Vos anchor wavelengths 485nm/660nm).
 */

// Hunt-Pointer-Estevez linear-RGB -> LMS (equivalently 100x LMS_from_XYZ(SmithPokorny75) @ XYZ_from_linearRGB(Judd-Vos))
const RGB_TO_LMS: Mat3 = [
  [17.8824, 43.5161, 4.11935],
  [3.4557, 27.1554, 3.86714],
  [0.03, 0.1843, 1.46709],
];
const LMS_TO_RGB: Mat3 = invertMat3(RGB_TO_LMS);

// Smith & Pokorny (1975) XYZ -> LMS, scaled x100 to match RGB_TO_LMS's scale.
const XYZ_TO_LMS_100: Mat3 = [
  [15.514, 54.312, -3.286],
  [-15.514, 45.684, 3.286],
  [0, 0, 1.608],
];

// Judd-Vos corrected CIE anchors for the tritan confusion lines (485nm / 660nm).
const XYZ_485: RGB = [0.05699, 0.16987, 0.5864];
const XYZ_660: RGB = [0.16161, 0.061, 0.00001];

const TRITAN_AXIS: RGB = [0, 0, 1]; // S-cone response is the missing axis

const planeProjectionMatrixTritan = ([n0, n1, n2]: RGB): Mat3 => [
  [1, 0, 0],
  [0, 1, 0],
  [-n0 / n2, -n1 / n2, 0],
];

const lmsWhite = applyMat3(RGB_TO_LMS, [1, 1, 1]);
const lms485 = applyMat3(XYZ_TO_LMS_100, XYZ_485);
const lms660 = applyMat3(XYZ_TO_LMS_100, XYZ_660);
const nSepPlane = cross(lmsWhite, TRITAN_AXIS);

const [wing1, wing2] =
  dot(nSepPlane, lms485) < 0 ? [lms660, lms485] : [lms485, lms660];
const tritanH1 = planeProjectionMatrixTritan(cross(lmsWhite, wing1));
const tritanH2 = planeProjectionMatrixTritan(cross(lmsWhite, wing2));

const simulateTritanDichromat = (linearRGB: RGB): RGB => {
  const lms = applyMat3(RGB_TO_LMS, linearRGB);
  const projected = applyMat3(dot(lms, nSepPlane) < 0 ? tritanH2 : tritanH1, lms);
  return clampRGB(applyMat3(LMS_TO_RGB, projected));
};

export const simulateTritan = (linearRGB: RGB, severity: number): RGB => {
  const s = clamp01(severity);
  const dichromat = simulateTritanDichromat(linearRGB);
  return s >= 1 ? dichromat : clampRGB(lerpRGB(linearRGB, dichromat, s));
};

export const simulate = (linearRGB: RGB, type: VisionType, severity = 1): RGB => {
  switch (type) {
    case "protan":
      return simulateProtan(linearRGB, severity);
    case "deutan":
      return simulateDeutan(linearRGB, severity);
    case "tritan":
      return simulateTritan(linearRGB, severity);
    case "monochromacy":
      return simulateMonochromacy(linearRGB);
  }
};
