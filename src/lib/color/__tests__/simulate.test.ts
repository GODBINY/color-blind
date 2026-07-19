import { describe, expect, it } from "vitest";
import {
  simulateProtan,
  simulateDeutan,
  simulateTritan,
  simulateMonochromacy,
} from "../simulate";
import { MACHADO_DEUTAN, MACHADO_PROTAN } from "../machado-matrices";
import type { RGB } from "../srgb";

describe("Machado protan/deutan simulation", () => {
  it("matches the published severity=1.0 matrix on the primaries", () => {
    const red: RGB = [1, 0, 0];
    const result = simulateProtan(red, 1);
    expect(result[0]).toBeCloseTo(MACHADO_PROTAN[10]![0][0], 5);
    expect(result[1]).toBeCloseTo(MACHADO_PROTAN[10]![1][0], 5);
    // matrix gives a slightly negative blue channel here; simulate() clamps to gamut
    expect(result[2]).toBeCloseTo(0, 5);
  });

  it("severity=0 is the identity transform", () => {
    const color: RGB = [0.7, 0.3, 0.5];
    expect(simulateProtan(color, 0)).toEqual(color);
    expect(simulateDeutan(color, 0)).toEqual(color);
  });

  it("interpolates monotonically between adjacent severity steps", () => {
    const color: RGB = [0.9, 0.1, 0.1];
    const s02 = simulateDeutan(color, 0.25);
    const s05 = simulateDeutan(color, 0.5);
    const s08 = simulateDeutan(color, 0.75);
    // the green channel should rise steadily toward the deuteranopic reading of a red swatch
    expect(s05[1]).toBeGreaterThan(s02[1]);
    expect(s08[1]).toBeGreaterThan(s05[1]);
  });

  it("severity=1 deutan matches the published matrix on green", () => {
    const green: RGB = [0, 1, 0];
    const result = simulateDeutan(green, 1);
    expect(result[0]).toBeCloseTo(MACHADO_DEUTAN[10]![0][1], 5);
    expect(result[1]).toBeCloseTo(MACHADO_DEUTAN[10]![1][1], 5);
    expect(result[2]).toBeCloseTo(MACHADO_DEUTAN[10]![2][1], 5);
  });
});

describe("Brettel tritan simulation", () => {
  it("severity=0 is the identity transform", () => {
    const color: RGB = [0.2, 0.4, 0.9];
    expect(simulateTritan(color, 0)).toEqual(color);
  });

  it("leaves the achromatic (gray) axis unchanged", () => {
    // Brettel's two half-planes both contain the neutral point by construction
    // (their normals are cross(neutral, anchor)), so gray must be a fixed point.
    const gray: RGB = [0.5, 0.5, 0.5];
    const result = simulateTritan(gray, 1);
    result.forEach((v, i) => expect(v).toBeCloseTo(gray[i]!, 4));
  });

  it("is idempotent — projecting an already-projected color leaves it in place", () => {
    const color: RGB = [0.3, 0.5, 0.4];
    const once = simulateTritan(color, 1);
    const twice = simulateTritan(once, 1);
    once.forEach((v, i) => expect(twice[i]).toBeCloseTo(v, 4));
  });

  it("blends toward the dichromat result as severity rises", () => {
    const color: RGB = [0.1, 0.1, 0.9];
    const full = simulateTritan(color, 1);
    const half = simulateTritan(color, 0.5);
    const distFull = Math.abs(full[2] - color[2]);
    const distHalf = Math.abs(half[2] - color[2]);
    expect(distHalf).toBeLessThan(distFull);
    expect(distHalf).toBeGreaterThan(0);
  });
});

describe("monochromacy simulation", () => {
  it("collapses to a single Rec.709 luminance value", () => {
    const [r, g, b] = simulateMonochromacy([0.8, 0.4, 0.2]);
    expect(r).toBe(g);
    expect(g).toBe(b);
    expect(r).toBeCloseTo(0.2126 * 0.8 + 0.7152 * 0.4 + 0.0722 * 0.2, 6);
  });
});
