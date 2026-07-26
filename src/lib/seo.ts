import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export type SeoPage = "home" | "translate" | "simulate" | "colorPick" | "live" | "findMyView" | "learn" | "faq";
export type AppLocale = (typeof routing.locales)[number];

const pagePaths: Record<SeoPage, string> = {
  home: "",
  translate: "/translate",
  simulate: "/simulate",
  colorPick: "/color-pick",
  live: "/live",
  findMyView: "/find-my-view",
  learn: "/learn",
  faq: "/learn/faq",
};

type SeoCopy = Record<SeoPage, { title: string; description: string }>;

const seoCopy: Record<AppLocale, SeoCopy> = {
  ko: {
    home: { title: "색약·색맹 사진 변환 도구 | NUNBIT", description: "색약·색맹 사진 변환, 시야 시뮬레이션, 이미지 색상 추출을 한 곳에서. 사진은 기기 안에서 처리돼 서버에 저장되지 않아요." },
    translate: { title: "색약·색맹 사진 변환 도구 | NUNBIT", description: "사진 속 색의 차이를 더 구분하기 쉬운 새 사진으로 바꿔 보세요. 색약·색맹인을 위한 사진 변환 도구이며, 사진은 이 기기에서 처리돼요." },
    simulate: { title: "색약·색맹 시야 시뮬레이터 | NUNBIT", description: "원본 사진이 적녹색약·청황색약 시야에서 어떻게 보일 수 있는지 비교해 보세요. 원본 사진은 바뀌지 않아요." },
    colorPick: { title: "이미지 색상 추출 도구: RGB·HEX 확인 | NUNBIT", description: "논문 그림, 그래프, 결과 이미지에서 원하는 지점의 색 이름과 RGB·HEX 값을 추출하고 기록하세요." },
    live: { title: "카메라로 색상 확인하기: RGB·HEX 도구 | NUNBIT", description: "라이브 카메라 화면을 탭해 지금 보이는 색의 이름, RGB, HEX 값을 확인하세요. 영상은 기기 밖으로 전송되지 않아요." },
    findMyView: { title: "색약·색맹 시야 유형 알아보기 | NUNBIT", description: "사진 비교를 위한 시야 기준을 찾아보세요. 이 도구는 의료적 확인을 대신하지 않으며, 결과는 참고용이에요." },
    learn: { title: "색약·색맹이 보는 색: 사진으로 비교하기 | NUNBIT", description: "적녹색약과 청황색약에서 색의 차이가 어떻게 다르게 느껴질 수 있는지 사진 예시와 함께 알아보세요." },
    faq: { title: "색약·색맹 사진 변환 도구 FAQ | NUNBIT", description: "색약·색맹 사진 변환, 시야 시뮬레이션, 사진 개인정보 처리, RGB·HEX 색상 추출에 관한 자주 묻는 질문입니다." },
  },
  en: {
    home: { title: "Colorblind Photo Tools | NUNBIT", description: "Translate photos for colorblind viewers, simulate color vision, and extract image colors. Everything runs on your device." },
    translate: { title: "Colorblind Photo Converter | NUNBIT", description: "Create a new photo with color differences that are easier for colorblind people to distinguish. Your photo is processed on this device." },
    simulate: { title: "Color Blindness Simulator | NUNBIT", description: "See how an original photo can appear with protan, deutan, or tritan color vision. The original photo stays unchanged." },
    colorPick: { title: "Image Color Picker: HEX & RGB | NUNBIT", description: "Pick any point in a figure, chart, or result image to record its color name, HEX code, and RGB values." },
    live: { title: "Live Camera Color Identifier | NUNBIT", description: "Tap your camera frame to identify a color and read its name, HEX code, and RGB values. Video stays on your device." },
    findMyView: { title: "Explore a Color Vision Type | NUNBIT", description: "Find a starting color-vision profile for photo comparisons. This is a reference tool, not a medical assessment." },
    learn: { title: "Color Blindness: Photo Comparisons | NUNBIT", description: "Explore how protan, deutan, and tritan color vision can change color differences in everyday photos." },
    faq: { title: "Colorblind Photo Tools FAQ | NUNBIT", description: "Answers about colorblind photo conversion, color vision simulation, on-device photo privacy, and HEX and RGB color extraction." },
  },
  ja: {
    home: { title: "色覚特性向け写真変換・色確認ツール | NUNBIT", description: "色覚特性に合わせた写真変換、見え方のシミュレーション、画像の色抽出をひとつに。写真は端末内で処理されます。" },
    translate: { title: "色覚特性向け写真変換ツール | NUNBIT", description: "色の違いを見分けやすい新しい写真を作成します。写真はこの端末内で処理され、サーバーには保存されません。" },
    simulate: { title: "色覚シミュレーター | NUNBIT", description: "元の写真が赤緑・青黄の色覚特性ではどのように見えるかを比較できます。元写真は変更されません。" },
    colorPick: { title: "画像の色抽出ツール：HEX・RGB | NUNBIT", description: "論文の図、グラフ、結果画像の任意の地点から色名、HEX、RGB値を確認・記録できます。" },
    live: { title: "ライブカメラ色識別ツール | NUNBIT", description: "カメラ画面をタップして、見えている色の名前、HEX、RGB値を確認できます。映像は端末外へ送信されません。" },
    findMyView: { title: "色の見え方の目安を探す | NUNBIT", description: "写真比較のための見え方の目安を探せます。医療的な判定を行うものではありません。" },
    learn: { title: "色覚特性と写真で見る色の違い | NUNBIT", description: "赤緑・青黄の色覚特性で、日常の写真にある色の違いがどう感じられるかを学べます。" },
    faq: { title: "色覚特性向け写真ツール FAQ | NUNBIT", description: "写真変換、色覚シミュレーション、写真のプライバシー、HEX・RGB色抽出についてのよくある質問です。" },
  },
  "zh-TW": {
    home: { title: "色覺差異照片轉換與取色工具 | NUNBIT", description: "提供色覺差異照片轉換、視覺模擬與圖片取色工具；所有照片都在你的裝置上處理。" },
    translate: { title: "色覺差異照片轉換工具 | NUNBIT", description: "建立一張更容易辨識色彩差異的新照片。照片只會在這台裝置上處理，不會儲存在伺服器。" },
    simulate: { title: "色覺差異視覺模擬器 | NUNBIT", description: "比較原始照片在紅綠或藍黃色覺差異下可能呈現的樣子；原始照片不會被修改。" },
    colorPick: { title: "圖片取色工具：HEX 與 RGB | NUNBIT", description: "從論文圖表、圖表或結果圖片中選取任一位置，記錄色名、HEX 色碼與 RGB 數值。" },
    live: { title: "即時相機顏色辨識工具 | NUNBIT", description: "點選相機畫面即可確認色名、HEX 色碼與 RGB 數值；影像不會離開你的裝置。" },
    findMyView: { title: "探索色覺類型 | NUNBIT", description: "為照片比較找出合適的色覺參考。這是參考工具，不能取代醫療評估。" },
    learn: { title: "色覺差異：用照片比較色彩 | NUNBIT", description: "透過照片了解紅綠與藍黃色覺差異，如何讓日常色彩的差別看起來不同。" },
    faq: { title: "色覺差異照片工具 FAQ | NUNBIT", description: "關於照片轉換、色覺模擬、裝置內隱私處理，以及 HEX、RGB 取色的常見問題。" },
  },
  ru: {
    home: { title: "Инструменты для фото при дальтонизме | NUNBIT", description: "Преобразуйте фото для людей с нарушением цветового зрения, имитируйте восприятие цветов и извлекайте цвета из изображений — всё на устройстве." },
    translate: { title: "Преобразователь фото для дальтоников | NUNBIT", description: "Создайте новую версию фото, где различия цветов легче заметить. Фото обрабатывается только на вашем устройстве." },
    simulate: { title: "Симулятор цветового зрения | NUNBIT", description: "Посмотрите, как исходное фото может выглядеть при протан-, деутан- или тритан-типе зрения. Оригинал не изменяется." },
    colorPick: { title: "Пипетка для изображений: HEX и RGB | NUNBIT", description: "Выберите точку на рисунке, графике или изображении результата, чтобы сохранить название цвета, HEX-код и RGB." },
    live: { title: "Определитель цвета через камеру | NUNBIT", description: "Коснитесь кадра камеры, чтобы узнать название цвета, HEX-код и RGB. Видео остаётся на устройстве." },
    findMyView: { title: "Выберите профиль цветового зрения | NUNBIT", description: "Найдите исходный профиль для сравнения фотографий. Это справочный инструмент, а не медицинская оценка." },
    learn: { title: "Дальтонизм: сравнение цветов на фото | NUNBIT", description: "Узнайте на примерах фото, как протан-, деутан- и тритан-тип зрения могут менять различие цветов." },
    faq: { title: "FAQ об инструментах для фото при дальтонизме | NUNBIT", description: "Ответы о преобразовании фото, симуляции цветового зрения, приватности на устройстве и извлечении цветов HEX и RGB." },
  },
  fr: {
    home: { title: "Outils photo pour daltonisme | NUNBIT", description: "Transformez des photos pour le daltonisme, simulez une vision des couleurs et prélevez les couleurs d'une image, directement sur votre appareil." },
    translate: { title: "Convertisseur photo pour daltonisme | NUNBIT", description: "Créez une nouvelle photo où les différences de couleur sont plus faciles à distinguer. La photo est traitée sur cet appareil." },
    simulate: { title: "Simulateur de daltonisme | NUNBIT", description: "Voyez comment une photo originale peut apparaître avec une vision protan, deutan ou tritan. L'original reste inchangé." },
    colorPick: { title: "Pipette d'image : HEX et RGB | NUNBIT", description: "Prélevez une couleur dans une figure, un graphique ou une image de résultat pour relever son nom, son code HEX et ses valeurs RGB." },
    live: { title: "Identificateur de couleur par caméra | NUNBIT", description: "Touchez l'image de la caméra pour connaître le nom, le code HEX et les valeurs RGB d'une couleur. La vidéo reste sur l'appareil." },
    findMyView: { title: "Explorer un profil de vision des couleurs | NUNBIT", description: "Trouvez un profil de départ pour comparer des photos. Cet outil est indicatif et ne remplace pas un avis médical." },
    learn: { title: "Daltonisme : comparer les couleurs en photo | NUNBIT", description: "Découvrez comment les visions protan, deutan et tritan peuvent modifier les différences de couleur dans des photos quotidiennes." },
    faq: { title: "FAQ des outils photo pour daltonisme | NUNBIT", description: "Réponses sur la conversion de photos, la simulation visuelle, la confidentialité des photos et l'extraction de couleurs HEX et RGB." },
  },
  de: {
    home: { title: "Foto-Tools für Farbfehlsichtigkeit | NUNBIT", description: "Fotos für Farbfehlsichtigkeit umwandeln, Farbsehen simulieren und Bildfarben auslesen — alles direkt auf deinem Gerät." },
    translate: { title: "Foto-Konverter für Farbfehlsichtigkeit | NUNBIT", description: "Erstelle ein neues Foto, in dem Farbunterschiede leichter zu unterscheiden sind. Die Verarbeitung bleibt auf deinem Gerät." },
    simulate: { title: "Farbseh-Simulator | NUNBIT", description: "Sieh, wie ein Originalfoto bei Protan-, Deutan- oder Tritan-Farbsehen wirken kann. Das Original bleibt unverändert." },
    colorPick: { title: "Bild-Farbpicker: HEX und RGB | NUNBIT", description: "Wähle einen Punkt in einer Abbildung, Grafik oder Ergebnisdatei und notiere Farbname, HEX-Code und RGB-Werte." },
    live: { title: "Live-Kamera-Farberkennung | NUNBIT", description: "Tippe auf das Kamerabild, um Farbname, HEX-Code und RGB-Werte zu prüfen. Das Video bleibt auf deinem Gerät." },
    findMyView: { title: "Farbsehprofil erkunden | NUNBIT", description: "Finde einen Ausgangspunkt für Fotovergleiche. Dieses Werkzeug ist nur eine Orientierung und keine medizinische Beurteilung." },
    learn: { title: "Farbfehlsichtigkeit: Fotos vergleichen | NUNBIT", description: "Erfahre anhand von Fotos, wie Protan-, Deutan- und Tritan-Farbsehen Farbunterschiede verändern können." },
    faq: { title: "FAQ zu Foto-Tools für Farbfehlsichtigkeit | NUNBIT", description: "Antworten zu Foto-Umwandlung, Farbseh-Simulation, Foto-Datenschutz sowie HEX- und RGB-Farbwerten." },
  },
  es: {
    home: { title: "Herramientas de fotos para daltonismo | NUNBIT", description: "Transforma fotos para personas con daltonismo, simula la visión del color y extrae colores de imágenes. Todo se procesa en tu dispositivo." },
    translate: { title: "Convertidor de fotos para daltonismo | NUNBIT", description: "Crea una foto nueva con diferencias de color más fáciles de distinguir. La foto se procesa solo en este dispositivo." },
    simulate: { title: "Simulador de daltonismo | NUNBIT", description: "Observa cómo puede verse una foto original con visión protan, deutan o tritan. La foto original no cambia." },
    colorPick: { title: "Selector de color de imagen: HEX y RGB | NUNBIT", description: "Elige un punto de una figura, gráfico o imagen de resultados para guardar el nombre del color, el código HEX y los valores RGB." },
    live: { title: "Identificador de color con cámara | NUNBIT", description: "Toca el encuadre de la cámara para ver el nombre del color, el código HEX y los valores RGB. El vídeo se queda en tu dispositivo." },
    findMyView: { title: "Explora un tipo de visión del color | NUNBIT", description: "Encuentra una referencia inicial para comparar fotos. Es una herramienta orientativa, no una evaluación médica." },
    learn: { title: "Daltonismo: comparar colores en fotos | NUNBIT", description: "Explora cómo las visiones protan, deutan y tritan pueden cambiar las diferencias de color en fotos cotidianas." },
    faq: { title: "Preguntas frecuentes de fotos y daltonismo | NUNBIT", description: "Respuestas sobre conversión de fotos, simulación de visión del color, privacidad y extracción de colores HEX y RGB." },
  },
  pt: {
    home: { title: "Ferramentas de foto para daltonismo | NUNBIT", description: "Transforme fotos para pessoas daltônicas, simule a visão de cores e extraia cores de imagens. Tudo é processado no seu dispositivo." },
    translate: { title: "Conversor de fotos para daltonismo | NUNBIT", description: "Crie uma nova foto com diferenças de cor mais fáceis de distinguir. A foto é processada apenas neste dispositivo." },
    simulate: { title: "Simulador de daltonismo | NUNBIT", description: "Veja como uma foto original pode aparecer com visão protan, deutan ou tritan. A foto original não é alterada." },
    colorPick: { title: "Seletor de cor de imagem: HEX e RGB | NUNBIT", description: "Escolha um ponto em uma figura, gráfico ou imagem de resultado para registrar nome da cor, código HEX e valores RGB." },
    live: { title: "Identificador de cor por câmera | NUNBIT", description: "Toque no quadro da câmera para ver nome da cor, código HEX e valores RGB. O vídeo permanece no seu dispositivo." },
    findMyView: { title: "Explore um tipo de visão de cores | NUNBIT", description: "Encontre uma referência inicial para comparar fotos. É uma ferramenta de referência, não uma avaliação médica." },
    learn: { title: "Daltonismo: compare cores em fotos | NUNBIT", description: "Explore como as visões protan, deutan e tritan podem mudar as diferenças de cor em fotos do dia a dia." },
    faq: { title: "Perguntas frequentes sobre fotos e daltonismo | NUNBIT", description: "Respostas sobre conversão de fotos, simulação de visão de cores, privacidade e extração de cores HEX e RGB." },
  },
};

const localeToOpenGraph: Record<AppLocale, string> = {
  ko: "ko_KR", en: "en_US", ja: "ja_JP", "zh-TW": "zh_TW", ru: "ru_RU", fr: "fr_FR", de: "de_DE", es: "es_ES", pt: "pt_BR",
};

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  return new URL(configured ?? vercel ?? "http://localhost:3000");
}

export function localizedPath(locale: AppLocale, page: SeoPage = "home") {
  return `/${locale}${pagePaths[page]}`;
}

export function localizedUrl(locale: AppLocale, page: SeoPage = "home") {
  return new URL(localizedPath(locale, page), siteUrl()).toString();
}

export function seoMetadata(locale: AppLocale, page: SeoPage): Metadata {
  const copy = seoCopy[locale][page];
  const canonical = localizedPath(locale, page);
  const languages = Object.fromEntries(routing.locales.map((item) => [item, localizedPath(item, page)]));

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical, languages: { ...languages, "x-default": localizedPath("en", page) } },
    openGraph: { type: "website", locale: localeToOpenGraph[locale], url: canonical, siteName: "NUNBIT", title: copy.title, description: copy.description },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
    keywords: page === "translate" ? ["colorblind photo converter", "color blindness photo tool", "색약 사진 변환", "색맹 사진 변환"] : undefined,
  };
}

export function appSchema(locale: AppLocale) {
  const copy = seoCopy[locale].home;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NUNBIT",
    url: localizedUrl(locale),
    description: copy.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    inLanguage: locale,
    featureList: locale === "ko"
      ? ["색약·색맹 사진 변환", "색약·색맹 시야 시뮬레이션", "이미지 RGB·HEX 색상 추출"]
      : ["Colorblind photo conversion", "Color vision simulation", "Image HEX and RGB color extraction"],
  };
}

export const seoRoutes = Object.entries(pagePaths) as [SeoPage, string][];
