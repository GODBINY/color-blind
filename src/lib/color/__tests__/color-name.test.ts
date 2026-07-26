import { describe, expect, it } from "vitest";
import { describeColor } from "../color-name";

describe("describeColor", () => {
  it("uses familiar Korean light and deep colour names", () => {
    expect(describeColor([255, 138, 138], "ko")).toBe("연한 빨간색");
    expect(describeColor([140, 21, 21], "ko")).toBe("진한 빨간색");
    expect(describeColor([70, 170, 95], "ko")).toBe("초록색");
  });

  it("distinguishes everyday hue families beyond a simple rainbow", () => {
    const examples: Array<[[number, number, number], string]> = [
      [[235, 51, 51], "빨간색"],
      [[240, 130, 35], "주황색"],
      [[235, 210, 45], "노란색"],
      [[70, 170, 95], "초록색"],
      [[40, 170, 165], "청록색"],
      [[55, 110, 225], "파란색"],
      [[135, 80, 200], "보라색"],
      [[255, 192, 203], "분홍색"],
      [[232, 203, 198], "분홍색"],
      [[255, 0, 255], "자홍색"],
      [[139, 69, 19], "갈색"],
      [[232, 214, 172], "베이지색"],
      [[204, 119, 34], "황토색"],
      [[193, 154, 107], "황갈색"],
      [[212, 160, 23], "머스타드색"],
      [[135, 205, 80], "연두색"],
      [[115, 105, 40], "올리브색"],
      [[135, 206, 235], "하늘색"],
      [[20, 35, 100], "남색"],
    ];

    examples.forEach(([rgb, expected]) => expect(describeColor(rgb, "ko")).toBe(expected));
  });

  it("uses clear names for achromatic colours", () => {
    expect(describeColor([255, 255, 255], "ko")).toBe("흰색");
    expect(describeColor([128, 128, 128], "ko")).toBe("회색");
    expect(describeColor([0, 0, 0], "ko")).toBe("검은색");
    expect(describeColor([1, 7, 6], "ko")).toBe("검은색");
  });

  it("falls back to English descriptions outside Korean", () => {
    expect(describeColor([255, 138, 138], "en")).toBe("light red");
    expect(describeColor([0, 0, 0], "ja")).toBe("black");
  });
});
