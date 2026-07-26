import { describe, expect, it } from "vitest";
import { computeDelta, computeSeparationGain, daltonize } from "../daltonize";
import type { RGB } from "../srgb";

const ROSE_RED: RGB = [0.75, 0.15, 0.2];
const LEAF_GREEN: RGB = [0.25, 0.45, 0.15];

describe("daltonize", () => {
  it("is the identity at strength=0 for every vision type", () => {
    for (const type of ["protan", "deutan", "tritan"] as const) {
      const result = daltonize(ROSE_RED, type, 1, 0);
      result.forEach((v, i) => expect(v).toBeCloseTo(ROSE_RED[i]!, 6));
    }
  });

  it("stays within gamut", () => {
    for (const type of ["protan", "deutan", "tritan"] as const) {
      const result = daltonize(ROSE_RED, type, 1, 1);
      result.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    }
  });

  it("moves the color away from the untranslated original as strength rises", () => {
    for (const type of ["protan", "deutan", "tritan"] as const) {
      const low = daltonize(ROSE_RED, type, 1, 0.2);
      const high = daltonize(ROSE_RED, type, 1, 0.9);
      const distLow = Math.hypot(...low.map((v, i) => v - ROSE_RED[i]!));
      const distHigh = Math.hypot(...high.map((v, i) => v - ROSE_RED[i]!));
      expect(distHigh).toBeGreaterThan(distLow);
    }
  });
});

describe("computeDelta", () => {
  it("is ~0 when comparing a color to itself", () => {
    expect(computeDelta(ROSE_RED, ROSE_RED, "deutan", 1)).toBeCloseTo(0, 6);
  });

  it("shrinks after translation — the whole point of daltonize (docs/04_Tech.md §4)", () => {
    // A rose lost in leaf-green foliage: a deutan viewer sees them as near-identical.
    const deltaBefore = computeDelta(ROSE_RED, LEAF_GREEN, "deutan", 1);
    const translated = daltonize(ROSE_RED, "deutan", 1, 0.8);
    const deltaAfter = computeDelta(translated, LEAF_GREEN, "deutan", 1);
    expect(deltaAfter).toBeGreaterThan(deltaBefore);
  });
});

describe("computeSeparationGain", () => {
  it("reports a positive modelled gain for a rose translated against a leaf", () => {
    const translatedRose = daltonize(ROSE_RED, "deutan", 1, 0.8);
    expect(
      computeSeparationGain(
        ROSE_RED,
        LEAF_GREEN,
        translatedRose,
        LEAF_GREEN,
        "deutan",
        1,
      ),
    ).toBeGreaterThan(0);
  });

  it("is zero when neither side changes", () => {
    expect(
      computeSeparationGain(ROSE_RED, LEAF_GREEN, ROSE_RED, LEAF_GREEN, "deutan", 1),
    ).toBeCloseTo(0, 8);
  });

  it("improves the modeled separation for a red-green flower/leaf pair", () => {
    const fixtures: Array<{
      type: "protan" | "deutan" | "tritan";
      left: RGB;
      right: RGB;
    }> = [
      // flowers against leaves: the common red-green case
      { type: "protan", left: [0.76, 0.14, 0.18], right: [0.24, 0.43, 0.14] },
      { type: "deutan", left: [0.76, 0.14, 0.18], right: [0.24, 0.43, 0.14] },
    ];

    for (const { type, left, right } of fixtures) {
      const translatedLeft = daltonize(left, type, 1, 0.8);
      const translatedRight = daltonize(right, type, 1, 0.8);
      expect(
        computeSeparationGain(left, right, translatedLeft, translatedRight, type, 1),
      ).toBeGreaterThan(0);
    }
  });
});
