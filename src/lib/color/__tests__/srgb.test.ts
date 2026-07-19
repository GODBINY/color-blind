import { describe, expect, it } from "vitest";
import { toLinear, toSRGB, rgbToLinear, linearToRGB, invertMat3, applyMat3 } from "../srgb";

describe("sRGB <-> linear", () => {
  it("round-trips across the full 0..1 range", () => {
    for (let i = 0; i <= 20; i++) {
      const c = i / 20;
      expect(toSRGB(toLinear(c))).toBeCloseTo(c, 6);
    }
  });

  it("maps the boundary values correctly", () => {
    expect(toLinear(0)).toBe(0);
    expect(toLinear(1)).toBeCloseTo(1, 6);
    expect(toSRGB(0)).toBe(0);
    expect(toSRGB(1)).toBeCloseTo(1, 6);
  });

  it("round-trips full RGB triples", () => {
    const rgb = [0.8, 0.2, 0.5] as const;
    const result = linearToRGB(rgbToLinear(rgb));
    result.forEach((v, i) => expect(v).toBeCloseTo(rgb[i]!, 6));
  });
});

describe("mat3 inversion", () => {
  it("A * inverse(A) is the identity", () => {
    const m = [
      [17.8824, 43.5161, 4.11935],
      [3.4557, 27.1554, 3.86714],
      [0.03, 0.1843, 1.46709],
    ] as const;
    const inv = invertMat3(m);
    const identityCol0 = applyMat3(m, applyMat3(inv, [1, 0, 0]));
    expect(identityCol0[0]).toBeCloseTo(1, 6);
    expect(identityCol0[1]).toBeCloseTo(0, 6);
    expect(identityCol0[2]).toBeCloseTo(0, 6);
  });
});
