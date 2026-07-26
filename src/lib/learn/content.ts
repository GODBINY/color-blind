export type LearnLocale = "ko" | "en";
export type LearnType = "protanopia" | "deuteranopia" | "tritanopia";

export const learnTypes: LearnType[] = ["protanopia", "deuteranopia", "tritanopia"];

const localizedNames: Record<string, Record<LearnType, string>> = {
  ko: { protanopia: "적색약·적색맹 (Protan)", deuteranopia: "녹색약·녹색맹 (Deutan)", tritanopia: "청황색약·청황색맹 (Tritan)" },
  ja: { protanopia: "1型色覚 (Protan)", deuteranopia: "2型色覚 (Deutan)", tritanopia: "3型色覚 (Tritan)" },
  "zh-TW": { protanopia: "紅色盲／紅色弱 (Protan)", deuteranopia: "綠色盲／綠色弱 (Deutan)", tritanopia: "藍黃色盲／藍黃色弱 (Tritan)" },
  de: { protanopia: "Rotblindheit/-schwäche (Protan)", deuteranopia: "Grünblindheit/-schwäche (Deutan)", tritanopia: "Blaublindheit/-schwäche (Tritan)" },
  es: { protanopia: "Ceguera/debilidad al rojo (Protan)", deuteranopia: "Ceguera/debilidad al verde (Deutan)", tritanopia: "Ceguera/debilidad azul-amarilla (Tritan)" },
  fr: { protanopia: "Déficience rouge (Protan)", deuteranopia: "Déficience verte (Deutan)", tritanopia: "Déficience bleu-jaune (Tritan)" },
  pt: { protanopia: "Deficiência vermelha (Protan)", deuteranopia: "Deficiência verde (Deutan)", tritanopia: "Deficiência azul-amarela (Tritan)" },
  ru: { protanopia: "Красная цветовая недостаточность (Protan)", deuteranopia: "Зелёная цветовая недостаточность (Deutan)", tritanopia: "Сине-жёлтая цветовая недостаточность (Tritan)" },
  en: { protanopia: "Protanopia", deuteranopia: "Deuteranopia", tritanopia: "Tritanopia" },
};

export function getLocalizedLearnName(locale: string, type: LearnType) {
  return localizedNames[locale]?.[type] ?? localizedNames.en?.[type] ?? type;
}

type TypeContent = {
  shortName: string;
  family: string;
  title: string;
  intro: string;
  definition: string;
  prevalence: string;
  pairs: string[];
  everyday: string[];
  support: string[];
  photoAlt: string;
};

const content: Record<LearnLocale, Record<LearnType, TypeContent>> = {
  ko: {
    protanopia: {
      shortName: "Protan",
      family: "적록 계열",
      title: "Protan의 시야를 이해해요",
      intro: "빨강 쪽의 밝기와 구분이 달라질 수 있는 색의 시야예요.",
      definition: "Protan은 빨강 계열을 느끼는 방식이 달라, 빨강이 더 어둡게 느껴지거나 초록·갈색과 가까워 보일 수 있어요. 사람마다 차이의 정도도 달라요.",
      prevalence: "색을 다르게 보는 방식은 드물지 않으며, Protan은 그중 한 갈래예요. 숫자보다 중요한 건 같은 장면도 사람마다 조금 다르게 읽힐 수 있다는 점이에요.",
      pairs: ["빨강과 초록", "짙은 빨강과 갈색", "주황과 올리브색"],
      everyday: ["신호등의 위치나 모양처럼 색 외의 단서가 특히 도움이 될 수 있어요.", "익은 과일이나 지도 표시에서 빨강과 초록의 차이가 작게 느껴질 수 있어요.", "빨간 글씨만으로 전달된 안내는 놓치기 쉬울 수 있어요."],
      support: ["색 이름을 함께 말해 주세요.", "중요한 표시는 아이콘, 위치, 패턴으로도 구분해 주세요.", "사진을 전할 때 Iris로 다른 색의 대비를 더해 볼 수 있어요."],
      photoAlt: "Protan 시야와 번역 뒤의 꽃 사진 비교",
    },
    deuteranopia: {
      shortName: "Deutan",
      family: "적록 계열",
      title: "Deutan의 시야를 이해해요",
      intro: "초록 쪽의 구분이 달라질 수 있는, 가장 자주 이야기되는 색의 시야 중 하나예요.",
      definition: "Deutan은 초록 계열을 느끼는 방식이 달라 빨강·초록 사이의 작은 차이가 가까워 보일 수 있어요. 이는 한 가지 모습으로 정해지지 않고, 사람마다 경험이 달라요.",
      prevalence: "Deutan은 색을 다르게 보는 방식 가운데 비교적 흔히 알려져 있어요. 그렇다고 모든 Deutan의 시야가 같다는 뜻은 아니에요.",
      pairs: ["초록과 빨강", "초록과 갈색", "파랑 보라와 회색빛 보라"],
      everyday: ["옷이나 꽃의 미묘한 빨강·초록 대비가 잔잔하게 느껴질 수 있어요.", "그래프의 빨강·초록 선이 범례 없이 놓이면 읽기 어려울 수 있어요.", "익음 정도를 색으로만 표현한 과일이나 표시가 헷갈릴 수 있어요."],
      support: ["‘왼쪽의 짙은 색’처럼 위치도 함께 알려 주세요.", "그래프에는 선 모양이나 라벨을 더해 주세요.", "보여주고 싶은 사진은 그 사람이 구분하기 쉬운 대비로 번역해 볼 수 있어요."],
      photoAlt: "Deutan 시야와 번역 뒤의 꽃 사진 비교",
    },
    tritanopia: {
      shortName: "Tritan",
      family: "청황 계열",
      title: "Tritan의 시야를 이해해요",
      intro: "파랑과 노랑 사이의 구분이 달라질 수 있는 색의 시야예요.",
      definition: "Tritan은 파랑·노랑 계열을 느끼는 방식이 달라, 파랑이 초록이나 회색에 가깝게 보이거나 노랑과 분홍의 구분이 달라질 수 있어요. 경험의 폭은 사람마다 넓어요.",
      prevalence: "Tritan은 적록 계열과는 다른 방향의 색 차이를 다뤄요. 흔한 정도와 관계없이, 한 사람의 실제 경험을 존중하는 것이 먼저예요.",
      pairs: ["파랑과 초록", "노랑과 연분홍", "보라와 회색"],
      everyday: ["파란 안내선과 초록 배경의 대비가 약하게 느껴질 수 있어요.", "노랑·파랑으로만 나눈 지도나 차트는 읽기 어려울 수 있어요.", "하늘과 물의 색감 차이가 다르게 느껴질 수 있어요."],
      support: ["파랑·노랑 구분에는 명도와 패턴을 함께 써 주세요.", "중요한 색 표시는 텍스트 라벨을 곁들여 주세요.", "사진의 분위기를 전하고 싶다면 다른 대비를 더한 버전도 함께 보내 보세요."],
      photoAlt: "Tritan 시야와 번역 뒤의 꽃 사진 비교",
    },
  },
  en: {
    protanopia: {
      shortName: "Protan", family: "Red–green family", title: "Understanding a Protan view", intro: "A way of seeing where red-side brightness and separation can feel different.", definition: "With a Protan view, reds can feel darker and may sit closer to greens or browns. The degree of difference is personal.", prevalence: "Different ways of seeing color are not unusual. Protan is one of them; what matters most is that the same scene can read differently to different people.", pairs: ["red and green", "deep red and brown", "orange and olive"], everyday: ["Position and shape, not only color, can be useful clues in signals.", "Ripe fruit and map markers may be harder to separate when they rely on red and green.", "A note written only in red can be easy to miss."], support: ["Say the color name as well.", "Pair important signals with an icon, position, or pattern.", "Try translating a photo with Iris when you want its contrast to carry further."], photoAlt: "Flower photo comparing a Protan view and translated contrast",
    },
    deuteranopia: {
      shortName: "Deutan", family: "Red–green family", title: "Understanding a Deutan view", intro: "One of the more commonly discussed ways of seeing color, where green-side differences can feel different.", definition: "With a Deutan view, small distinctions between reds and greens can sit closer together. It does not look exactly the same for everyone.", prevalence: "Deutan is often mentioned among different ways of seeing color. That does not mean every Deutan view is alike.", pairs: ["green and red", "green and brown", "blue-purple and grey-purple"], everyday: ["Subtle red and green contrasts in clothes or flowers may feel quieter.", "Charts with only red and green lines can be difficult without labels.", "Fruit ripeness or status indicators based on color alone can be unclear."], support: ["Include location: ‘the darker one on the left.’", "Add line styles or labels to charts.", "Translate a photo into contrast that is easier for them to distinguish."], photoAlt: "Flower photo comparing a Deutan view and translated contrast",
    },
    tritanopia: {
      shortName: "Tritan", family: "Blue–yellow family", title: "Understanding a Tritan view", intro: "A way of seeing where blue and yellow differences can feel different.", definition: "With a Tritan view, blues may sit nearer greens or greys, and yellow–pink distinctions can shift. The experience varies widely from person to person.", prevalence: "Tritan follows a different direction of color difference from red–green views. Frequency matters less than listening to someone’s own experience.", pairs: ["blue and green", "yellow and pale pink", "purple and grey"], everyday: ["A blue route on a green background may have less separation.", "Maps or charts divided only by yellow and blue can be hard to read.", "The color relationship between sky and water can feel different."], support: ["Use brightness and pattern alongside blue and yellow.", "Add text labels to important color signals.", "Send another version of a photo when you want its mood to carry across."], photoAlt: "Flower photo comparing a Tritan view and translated contrast",
    },
  },
};

export function getLearnContent(locale: string, type: LearnType) {
  return content[locale === "ko" ? "ko" : "en"][type];
}

export function getLearnIndex(locale: string) {
  const isKo = locale === "ko";
  return {
    title: isKo ? "색을 다르게 보는 이야기를 읽어봐요" : "Read about the many ways we see color",
    intro: isKo ? "같은 풍경도 서로 다르게 느껴질 수 있어요. 이름보다 경험에 먼저 귀 기울이며, 차이를 함께 살펴봐요." : "The same scene can feel different to different people. Start with experience, then explore the words for those differences.",
    types: learnTypes.map((type) => ({ type, ...getLearnContent(locale, type) })),
  };
}
