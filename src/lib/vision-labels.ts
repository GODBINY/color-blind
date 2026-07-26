import type { VisionType } from "@/lib/color";

type ComparableVisionType = Exclude<VisionType, "monochromacy">;

type VisionLabels = {
  chooser: string;
  redGreen: string;
  redGreenHelp: string;
  redGreenHelpLabel: string;
  blueYellow: string;
  fullColor: string;
  types: Record<VisionType, string>;
};

const labels: Record<string, VisionLabels> = {
  ko: {
    chooser: "색각 차이 유형 선택",
    redGreen: "적녹색약 시야",
    redGreenHelp: "적색약과 녹색약은 빨강과 초록을 구분하는 양상이 비슷할 수 있어, 두 경우를 함께 ‘적녹색약’이라고 부르기도 해요. 사람마다 구분되는 정도와 실제 느낌은 달라요.",
    redGreenHelpLabel: "적녹색약 설명 보기",
    blueYellow: "청황색약 시야",
    fullColor: "전색맹 시야",
    types: { protan: "적색약 쪽 (Protan)", deutan: "녹색약 쪽 (Deutan)", tritan: "청황색약 쪽 (Tritan)", monochromacy: "전색맹 (Monochromacy)" },
  },
  ja: {
    chooser: "色覚タイプを選ぶ",
    redGreen: "赤緑色覚異常",
    redGreenHelp: "赤と緑を見分けにくい現れ方が似ているため、1型色覚と2型色覚をまとめて赤緑色覚異常と呼ぶことがあります。感じ方や見分けやすさには個人差があります。",
    redGreenHelpLabel: "赤緑色覚異常の説明を見る",
    blueYellow: "青黄色覚異常",
    fullColor: "全色盲",
    types: { protan: "1型色覚（Protan）", deutan: "2型色覚（Deutan）", tritan: "3型色覚（Tritan）", monochromacy: "全色盲（Monochromacy）" },
  },
  "zh-TW": {
    chooser: "選擇色覺類型",
    redGreen: "紅綠色覺異常",
    redGreenHelp: "第一型與第二型色覺在分辨紅綠色時的表現可能相近，因此有時會統稱為紅綠色覺異常。每個人實際感受到的差異與程度都不同。",
    redGreenHelpLabel: "查看紅綠色覺異常說明",
    blueYellow: "藍黃色覺異常",
    fullColor: "全色盲",
    types: { protan: "第一型色覺（Protan）", deutan: "第二型色覺（Deutan）", tritan: "第三型色覺（Tritan）", monochromacy: "全色盲（Monochromacy）" },
  },
  de: {
    chooser: "Farbseh-Typ auswählen",
    redGreen: "Rot-Grün-Sehschwäche",
    redGreenHelp: "Protan- und Deutan-Sehen können sich beim Unterscheiden von Rot und Grün ähneln. Deshalb werden beide Formen manchmal gemeinsam als Rot-Grün-Sehschwäche bezeichnet. Das Erleben ist individuell verschieden.",
    redGreenHelpLabel: "Erklärung zur Rot-Grün-Sehschwäche",
    blueYellow: "Blau-Gelb-Sehschwäche",
    fullColor: "Vollständige Farbenblindheit",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromasie" },
  },
  es: {
    chooser: "Elige un tipo de visión del color",
    redGreen: "Deficiencia de visión rojo-verde",
    redGreenHelp: "La forma de distinguir rojos y verdes puede ser parecida en Protan y Deutan, por eso a veces se agrupan como deficiencia rojo-verde. La experiencia y el grado de diferencia varían en cada persona.",
    redGreenHelpLabel: "Explicación sobre la deficiencia rojo-verde",
    blueYellow: "Deficiencia de visión azul-amarillo",
    fullColor: "Daltonismo completo",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monocromacia" },
  },
  fr: {
    chooser: "Choisir un type de vision des couleurs",
    redGreen: "Déficience rouge-vert",
    redGreenHelp: "La façon de distinguer le rouge et le vert peut se ressembler pour Protan et Deutan ; on les regroupe donc parfois sous le terme de déficience rouge-vert. Le ressenti et le degré de distinction diffèrent selon les personnes.",
    redGreenHelpLabel: "Explication de la déficience rouge-vert",
    blueYellow: "Déficience bleu-jaune",
    fullColor: "Daltonisme total",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromatie" },
  },
  pt: {
    chooser: "Escolha um tipo de visão de cores",
    redGreen: "Deficiência na visão vermelho-verde",
    redGreenHelp: "A forma de distinguir vermelho e verde pode ser parecida em Protan e Deutan, por isso os dois casos às vezes são reunidos como deficiência vermelho-verde. A experiência e o grau de diferença variam de pessoa para pessoa.",
    redGreenHelpLabel: "Explicação sobre a deficiência vermelho-verde",
    blueYellow: "Deficiência na visão azul-amarela",
    fullColor: "Daltonismo total",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monocromacia" },
  },
  ru: {
    chooser: "Выберите тип цветового зрения",
    redGreen: "Нарушение красно-зелёного цветовосприятия",
    redGreenHelp: "При протан- и дейтеран-типе различение красного и зелёного может проявляться похоже, поэтому их иногда объединяют как нарушение красно-зелёного цветовосприятия. Ощущение и выраженность различий у каждого свои.",
    redGreenHelpLabel: "Объяснение нарушения красно-зелёного цветовосприятия",
    blueYellow: "Нарушение сине-жёлтого цветовосприятия",
    fullColor: "Полная цветовая слепота",
    types: { protan: "Протан", deutan: "Дейтеран", tritan: "Тритан", monochromacy: "Монохромазия" },
  },
  en: {
    chooser: "Choose a color-vision type",
    redGreen: "Red–green color vision deficiency",
    redGreenHelp: "Protan and Deutan can involve similar patterns when distinguishing reds and greens, so they are sometimes grouped as red–green color vision deficiency. The degree and lived experience vary from person to person.",
    redGreenHelpLabel: "About red–green color vision deficiency",
    blueYellow: "Blue–yellow color vision deficiency",
    fullColor: "Complete color blindness",
    types: { protan: "Protan", deutan: "Deutan", tritan: "Tritan", monochromacy: "Monochromacy" },
  },
};

export const getVisionLabels = (locale: string): VisionLabels => labels[locale] ?? labels.en!;

export const redGreenTypes: ComparableVisionType[] = ["protan", "deutan"];
