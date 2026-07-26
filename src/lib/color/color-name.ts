export type RGB8 = readonly [number, number, number];

type ColorLanguage = "ko" | "en";

const toHsl = ([red, green, blue]: RGB8) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  return { hue: (hue + 360) % 360, saturation, lightness };
};

const relativeLuminance = ([red, green, blue]: RGB8) => {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
};

const hueName = (hue: number, saturation: number, lightness: number, language: ColorLanguage) => {
  const korean = (hue >= 320 && lightness > 0.42) || (hue >= 345 && lightness > 0.58) || (hue < 15 && lightness > 0.68 && saturation < 0.6) ? "분홍색"
    : hue >= 290 ? "자홍색"
      : hue >= 255 ? "보라색"
        : hue >= 195 && lightness < 0.3 ? "남색"
          : hue >= 195 && lightness > 0.65 ? "하늘색"
            : hue >= 195 ? "파란색"
              : hue >= 165 ? "청록색"
                : hue >= 105 ? "초록색"
                  : hue >= 70 && lightness > 0.45 ? "연두색"
                    : hue >= 40 && hue < 48 && lightness >= 0.25 && lightness <= 0.62 && saturation >= 0.35 && saturation <= 0.95 ? "머스타드색"
                      : hue >= 45 && lightness < 0.42 && saturation < 0.65 ? "올리브색"
                      : hue >= 45 ? "노란색"
                        : hue >= 25 && lightness >= 0.38 && lightness <= 0.58 && saturation >= 0.4 && saturation <= 0.78 ? "황토색"
                          : hue >= 15 && lightness >= 0.45 && lightness < 0.7 && saturation < 0.6 ? "황갈색"
                            : hue >= 15 && lightness < 0.45 ? "갈색"
                          : hue >= 15 && lightness > 0.7 && saturation < 0.7 ? "베이지색"
                            : hue >= 15 ? "주황색"
                              : "빨간색";
  if (language === "ko") return korean;
  return (hue >= 320 && lightness > 0.42) || (hue >= 345 && lightness > 0.58) || (hue < 15 && lightness > 0.68 && saturation < 0.6) ? "pink"
    : hue >= 290 ? "magenta"
      : hue >= 255 ? "purple"
        : hue >= 195 && lightness < 0.3 ? "navy"
          : hue >= 195 && lightness > 0.65 ? "sky blue"
            : hue >= 195 ? "blue"
              : hue >= 165 ? "teal"
                : hue >= 105 ? "green"
                  : hue >= 70 && lightness > 0.45 ? "lime green"
                    : hue >= 40 && hue < 48 && lightness >= 0.25 && lightness <= 0.62 && saturation >= 0.35 && saturation <= 0.95 ? "mustard"
                      : hue >= 45 && lightness < 0.42 && saturation < 0.65 ? "olive"
                      : hue >= 45 ? "yellow"
                        : hue >= 25 && lightness >= 0.38 && lightness <= 0.58 && saturation >= 0.4 && saturation <= 0.78 ? "ochre"
                          : hue >= 15 && lightness >= 0.45 && lightness < 0.7 && saturation < 0.6 ? "tan"
                            : hue >= 15 && lightness < 0.45 ? "brown"
                          : hue >= 15 && lightness > 0.7 && saturation < 0.7 ? "beige"
                            : hue >= 15 ? "orange"
                              : "red";
};

/** A plain-language colour description for image picks — not a standards-based colour name. */
export const describeColor = (rgb: RGB8, locale: string): string => {
  const language: ColorLanguage = locale === "ko" ? "ko" : "en";
  const { hue, saturation, lightness } = toHsl(rgb);

  if (relativeLuminance(rgb) < 0.012) return language === "ko" ? "검은색" : "black";

  if (saturation < 0.1) {
    if (lightness > 0.92) return language === "ko" ? "흰색" : "white";
    if (lightness > 0.72) return language === "ko" ? "밝은 회색" : "light gray";
    if (lightness > 0.3) return language === "ko" ? "회색" : "gray";
    if (lightness > 0.08) return language === "ko" ? "어두운 회색" : "dark gray";
    return language === "ko" ? "검은색" : "black";
  }

  const name = hueName(hue, saturation, lightness, language);
  const alreadySpecific = new Set(language === "ko"
    ? ["분홍색", "자홍색", "갈색", "베이지색", "황토색", "황갈색", "머스타드색", "연두색", "올리브색", "하늘색", "남색"]
    : ["pink", "magenta", "brown", "beige", "ochre", "tan", "mustard", "lime green", "olive", "sky blue", "navy"]);
  const modifier = lightness > 0.72 ? (language === "ko" ? "연한" : "light")
    : lightness < 0.38 ? (language === "ko" ? "진한" : "deep")
      : saturation < 0.38 ? (language === "ko" ? "회색빛" : "muted")
        : "";

  return modifier && !alreadySpecific.has(name) ? `${modifier} ${name}` : name;
};
