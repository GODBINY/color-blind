import { describe, expect, it } from "vitest";
import { scoreVisionResponses } from "@/lib/vision-score";

const plates = [
  { id: "1", answer: "12" },
  { id: "2", answer: "8" },
  { id: "3", answer: "6" },
] as const;

describe("scoreVisionResponses", () => {
  it("separates matched and different answers", () => {
    const score = scoreVisionResponses(plates, ["12", "3", "?"]);

    expect(score.matched).toBe(1);
    expect(score.incorrect).toEqual([
      { id: "2", answer: "8", response: "3", isMatch: false },
      { id: "3", answer: "6", response: "?", isMatch: false },
    ]);
  });
});
