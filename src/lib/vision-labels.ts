import type { VisionType } from "@/lib/color";

type ComparableVisionType = Exclude<VisionType, "monochromacy">;

type VisionLabels = {
  chooser: string;
  redGreen: string;
  blueYellow: string;
  fullColor: string;
  types: Record<VisionType, string>;
};

const labels: Record<string, VisionLabels> = {
  ko: {
    chooser: "색각 차이 유형 선택",
    redGreen: "적녹색약 시야",
    blueYellow: "청황색약 시야",
    fullColor: "전색맹 시야",
    types: { protan: "적색약 쪽 (Protan)", deutan: "녹색약 쪽 (Deutan)", tritan: "청황색약 쪽 (Tritan)", monochromacy: "전색맹 (Monochromacy)" },
  },
  ja: {
    chooser: "色覚タイプを選ぶ",
    redGreen: "赤緑色覚異常",
    blueYellow: "青黄色覚異常",
    fullColor: "全色盲",
    types: { protan: "1型色覚（Protan）", deutan: "2型色覚（Deutan）", tritan: "3型色覚（Tritan）", monochromacy: "全色盲（Monochromacy）" },
  },
  "zh-TW": {
    chooser: "選擇色覺類型",
    redGreen: "紅綠色覺異常",
    blueYellow: "藍黃色覺異常",
    fullColor: "全色盲",
    types: { protan: "第一型色覺（Protan）", deutan: "第二型色覺（Deutan）", tritan: "第三型色覺（Tritan）", monochromacy: "全色盲（Monochromacy）" },
  },
  de: {
    chooser: "Farbseh-Typ auswählen",
    redGreen: "Rot-Grün-Sehschwäche",
    blueYellow: "Blau-Gelb-Sehschwäche",
    fullColor: "Vollständige Farbenblindheit",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromasie" },
  },
  es: {
    chooser: "Elige un tipo de visión del color",
    redGreen: "Deficiencia de visión rojo-verde",
    blueYellow: "Deficiencia de visión azul-amarillo",
    fullColor: "Daltonismo completo",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monocromacia" },
  },
  fr: {
    chooser: "Choisir un type de vision des couleurs",
    redGreen: "Déficience rouge-vert",
    blueYellow: "Déficience bleu-jaune",
    fullColor: "Daltonisme total",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromatie" },
  },
  pt: {
    chooser: "Escolha um tipo de visão de cores",
    redGreen: "Deficiência na visão vermelho-verde",
    blueYellow: "Deficiência na visão azul-amarela",
    fullColor: "Daltonismo total",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monocromacia" },
  },
  ru: {
    chooser: "Выберите тип цветового зрения",
    redGreen: "Нарушение красно-зелёного цветовосприятия",
    blueYellow: "Нарушение сине-жёлтого цветовосприятия",
    fullColor: "Полная цветовая слепота",
    types: { protan: "Протан", deutan: "Дейтеран", tritan: "Тритан", monochromacy: "Монохромазия" },
  },
  en: {
    chooser: "Choose a color-vision type",
    redGreen: "Red–green color vision deficiency",
    blueYellow: "Blue–yellow color vision deficiency",
    fullColor: "Complete color blindness",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromacy" },
  },
};

export const getVisionLabels = (locale: string): VisionLabels => labels[locale] ?? labels.en!;

export const redGreenTypes: ComparableVisionType[] = ["protan", "deutan"];
