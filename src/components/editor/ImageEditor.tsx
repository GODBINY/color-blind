"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { takePendingImage } from "@/lib/pending-image";
import {
  clamp01,
  daltonize,
  linearToRGB,
  rgbToLinear,
  simulate,
  type DaltonizeVisionType,
  type VisionType,
} from "@/lib/color";

type EditorMode = "translate" | "simulate";
type ViewMode = "mine" | "theirs";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_DIMENSION = 4096;

const copy = {
  ko: {
    translateTitle: "그 사람의 색으로 번역하기",
    translateIntro: "보여주고 싶었던 사진으로 시작해 보세요.",
    simulateTitle: "그 사람의 시야로 보기",
    simulateIntro: "같은 장면이 어떻게 다르게 보이는지 살펴봐요.",
    drop: "여기에 사진을 놓아주세요",
    select: "사진 선택",
    camera: "카메라로 찍기",
    paste: "붙여넣기도 가능해요",
    privacy: "사진은 서버로 전송되지 않아요. 모든 변환은 이 기기 안에서 일어나요.",
    typeQuestion: "누구의 시야로 볼까요?",
    strength: "번역 강도",
    severity: "시야 강도",
    mine: "내 눈으로 보기",
    theirs: "그 사람의 눈으로 보기",
    viewing: (type: string) => `지금 ${type}의 시야로 보고 있어요`,
    original: "원본",
    translated: "번역한 뒤",
    before: "번역 전 시야",
    after: "번역 후 시야",
    simulated: "그 사람의 시야",
    download: "저장하기",
    replace: "다른 사진 고르기",
    processingTranslate: "그 사람이 볼 수 있는 색으로 번역하는 중...",
    processingSimulate: "그 사람의 시선으로 바꾸는 중...",
    invalid: "앗, 이 파일은 읽을 수 없었어요. JPG, PNG, WebP로 다시 시도해 볼까요?",
    tooLarge: "사진은 20MB 이하로 올려 주세요.",
    resized: "큰 사진은 이 기기에서 편하게 다룰 수 있도록 크기를 조절했어요.",
    compareHint: "가운데 선을 드래그하거나 키보드의 좌우 화살표로 비교해 보세요.",
    translateCta: "이 사진, 잘 보이게 번역해 볼까요?",
    unknownType: "유형을 모르겠다면 Find My View에서 함께 알아볼 수 있어요.",
  },
  en: {
    translateTitle: "Translate for them",
    translateIntro: "Begin with a photo you wanted to share.",
    simulateTitle: "See through their eyes",
    simulateIntro: "Notice how the same scene can look different.",
    drop: "Drop a photo here",
    select: "Choose a photo",
    camera: "Take a photo",
    paste: "You can paste an image here, too.",
    privacy: "Your photo never leaves this device. Every transformation happens here.",
    typeQuestion: "Whose view are you exploring?",
    strength: "Translation strength",
    severity: "View strength",
    mine: "My eyes",
    theirs: "Their eyes",
    viewing: (type: string) => `You are viewing through ${type} eyes`,
    original: "Original",
    translated: "Translated",
    before: "Before translation",
    after: "After translation",
    simulated: "Their view",
    download: "Save image",
    replace: "Choose another photo",
    processingTranslate: "Translating into colors they can see...",
    processingSimulate: "Changing to their view...",
    invalid: "We couldn’t read that file. Try a JPG, PNG, or WebP image.",
    tooLarge: "Please choose a photo under 20MB.",
    resized: "We resized this large photo so it stays comfortable to use here.",
    compareHint: "Drag the center line, or use the left and right arrow keys to compare.",
    translateCta: "Make this photo easier for them to see",
    unknownType: "Not sure of their type? You can explore it together in Find My View.",
  },
} as const;

const typeLabels: Record<VisionType, string> = {
  protan: "Protan",
  deutan: "Deutan",
  tritan: "Tritan",
  monochromacy: "Mono",
};

const toDataUrl = (canvas: HTMLCanvasElement) => canvas.toDataURL("image/png");

export function ImageEditor({ mode, locale }: { mode: EditorMode; locale: string }) {
  const text = locale === "ko" ? copy.ko : copy.en;
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<ImageBitmap | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [visionType, setVisionType] = useState<VisionType>("deutan");
  const [amount, setAmount] = useState(mode === "translate" ? 0.8 : 1);
  const [view, setView] = useState<ViewMode>("mine");
  const [divider, setDivider] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 4, height: 3 });

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setNotice(text.invalid);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice(text.tooLarge);
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      setNotice(null);
      setDimensions({ width: bitmap.width, height: bitmap.height });
      if (Math.max(bitmap.width, bitmap.height) > MAX_DIMENSION) setNotice(text.resized);
      setSource(bitmap);
      setDivider(50);
    } catch {
      setNotice(text.invalid);
    }
  }, [text.invalid, text.resized, text.tooLarge]);

  useEffect(() => {
    void takePendingImage()
      .then((file) => file && loadFile(file))
      .catch(() => setNotice(text.invalid));
  }, [loadFile, text.invalid]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((entry) => entry.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        event.preventDefault();
        void loadFile(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  useEffect(() => {
    if (!source) return;
    let cancelled = false;

    const process = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
      const width = Math.max(1, Math.round(source.width * scale));
      const height = Math.max(1, Math.round(source.height * scale));
      const original = document.createElement("canvas");
      const output = document.createElement("canvas");
      original.width = output.width = width;
      original.height = output.height = height;
      const originalContext = original.getContext("2d", { willReadFrequently: true });
      const outputContext = output.getContext("2d");
      if (!originalContext || !outputContext) throw new Error("Canvas is unavailable");
      originalContext.drawImage(source, 0, 0, width, height);
      const input = originalContext.getImageData(0, 0, width, height);
      const result = new ImageData(width, height);

      for (let index = 0; index < input.data.length; index += 4) {
        const linear = rgbToLinear([
          input.data[index]! / 255,
          input.data[index + 1]! / 255,
          input.data[index + 2]! / 255,
        ]);
        const transformed = mode === "translate"
          ? daltonize(linear, visionType as DaltonizeVisionType, 1, amount)
          : simulate(linear, visionType, amount);
        const [red, green, blue] = linearToRGB(transformed);
        result.data[index] = Math.round(clamp01(red) * 255);
        result.data[index + 1] = Math.round(clamp01(green) * 255);
        result.data[index + 2] = Math.round(clamp01(blue) * 255);
        result.data[index + 3] = input.data[index + 3]!;
      }
      outputContext.putImageData(result, 0, 0);
      if (!cancelled) {
        setOriginalUrl(toDataUrl(original));
        setResultUrl(toDataUrl(output));
        setDimensions({ width, height });
        setIsProcessing(false);
      }
    };

    const timer = window.setTimeout(() => {
      setIsProcessing(true);
      try {
        process();
      } catch {
        if (!cancelled) {
          setNotice(text.invalid);
          setIsProcessing(false);
        }
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [amount, mode, source, text.invalid, visionType]);

  const updateDivider = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setDivider(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  const activeResult = mode === "translate" && view === "theirs" ? resultUrl : resultUrl;
  const leftImage = mode === "translate" && view === "theirs" ? originalUrl : originalUrl;
  const rightImage = mode === "translate" && view === "theirs" ? resultUrl : activeResult;
  const leftLabel = mode === "translate" && view === "theirs" ? text.before : text.original;
  const rightLabel = mode === "translate" && view === "theirs" ? text.after : mode === "translate" ? text.translated : text.simulated;
  // In their-eyes mode both sides must be simulated; the processing pass above creates the translated image.
  // A small second pass is rendered below whenever this view is selected.
  const [theirBeforeUrl, setTheirBeforeUrl] = useState<string | null>(null);
  const [theirAfterUrl, setTheirAfterUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source || mode !== "translate" || view !== "theirs") return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
      canvas.width = Math.max(1, Math.round(source.width * scale));
      canvas.height = Math.max(1, Math.round(source.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const input = context.getImageData(0, 0, canvas.width, canvas.height);
      const before = new ImageData(canvas.width, canvas.height);
      const after = new ImageData(canvas.width, canvas.height);
      for (let index = 0; index < input.data.length; index += 4) {
        const linear = rgbToLinear([input.data[index]! / 255, input.data[index + 1]! / 255, input.data[index + 2]! / 255]);
        const translated = daltonize(linear, visionType as DaltonizeVisionType, 1, amount);
        const originalSimulated = linearToRGB(simulate(linear, visionType, 1));
        const translatedSimulated = linearToRGB(simulate(translated, visionType, 1));
        for (const [target, color] of [[before, originalSimulated], [after, translatedSimulated]] as const) {
          target.data[index] = Math.round(clamp01(color[0]) * 255);
          target.data[index + 1] = Math.round(clamp01(color[1]) * 255);
          target.data[index + 2] = Math.round(clamp01(color[2]) * 255);
          target.data[index + 3] = input.data[index + 3]!;
        }
      }
      const afterCanvas = document.createElement("canvas");
      afterCanvas.width = canvas.width;
      afterCanvas.height = canvas.height;
      context.putImageData(before, 0, 0);
      afterCanvas.getContext("2d")?.putImageData(after, 0, 0);
      if (!cancelled) {
        setTheirBeforeUrl(toDataUrl(canvas));
        setTheirAfterUrl(toDataUrl(afterCanvas));
      }
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [amount, mode, source, view, visionType]);

  const compareLeft = mode === "translate" && view === "theirs" ? theirBeforeUrl : leftImage;
  const compareRight = mode === "translate" && view === "theirs" ? theirAfterUrl : rightImage;

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = resultUrl;
    link.download = `iris-for-${visionType}-${date}.png`;
    link.click();
  };

  const availableTypes: VisionType[] = mode === "translate"
    ? ["protan", "deutan", "tritan"]
    : ["protan", "deutan", "tritan", "monochromacy"];

  return (
    <main className="mx-auto w-full max-w-[1184px] px-5 pb-12 pt-7 md:px-8 md:pt-10">
      <div className="mb-7 max-w-[620px]">
        <p className="mb-2 text-[13px] font-medium tracking-[0.08em] text-[var(--color-text-sub)]">IRIS / {mode.toUpperCase()}</p>
        <h1 className="text-[28px] font-semibold leading-9 tracking-[-0.035em] md:text-[32px] md:leading-10">
          {mode === "translate" ? text.translateTitle : text.simulateTitle}
        </h1>
        <p className="mt-3 text-[16px] leading-[26px] text-[var(--color-text-sub)]">
          {mode === "translate" ? text.translateIntro : text.simulateIntro}
        </p>
      </div>

      {!source ? (
        <section
          onDragEnter={(event) => { event.preventDefault(); setIsDraggingFile(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(event) => { event.preventDefault(); setIsDraggingFile(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}
          className={`grid min-h-[390px] place-items-center rounded-[var(--radius-l)] border border-dashed p-6 text-center transition-all duration-[var(--duration-fast)] ${isDraggingFile ? "scale-[1.01] border-[var(--color-accent)] bg-[#f5e7d8]" : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-m)]"}`}
        >
          <div className="max-w-sm">
            <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--color-bg)] text-xl">⌁</span>
            <h2 className="mt-5 text-[22px] font-semibold leading-[30px]">{text.drop}</h2>
            <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.paste}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => fileInput.current?.click()} className="h-12 rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[16px] font-medium text-white transition-colors hover:bg-[#3a4b5e] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3">{text.select}</button>
              <button type="button" onClick={() => cameraInput.current?.click()} className="h-12 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-5 text-[16px] font-medium transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3">{text.camera}</button>
            </div>
            <p className="mt-7 text-[13px] leading-5 text-[var(--color-text-sub)]">⌁ {text.privacy}</p>
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
          <input ref={cameraInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            {mode === "translate" && (
              <div className="mb-5 flex w-full rounded-full border border-[var(--color-border)] bg-white p-1 shadow-[var(--shadow-s)] sm:w-fit" role="group" aria-label={text.translateTitle}>
                {(["mine", "theirs"] as const).map((item) => (
                  <button key={item} type="button" onClick={() => setView(item)} aria-pressed={view === item} className={`min-h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${view === item ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-sub)] hover:bg-[var(--color-bg)]"}`}>
                    {item === "mine" ? text.mine : text.theirs}
                  </button>
                ))}
              </div>
            )}
            {mode === "translate" && view === "theirs" && <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f5e7d8] px-3 py-2 text-[13px] font-medium"><span aria-hidden="true">◉</span>{text.viewing(typeLabels[visionType])}</p>}
            <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-[var(--color-text-sub)]"><span>{leftLabel}</span><span>{rightLabel}</span></div>
            <div
              role="slider"
              tabIndex={0}
              aria-label={text.compareHint}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(divider)}
              className="relative cursor-ew-resize touch-none select-none overflow-hidden rounded-[var(--radius-l)] bg-[var(--color-primary)] shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3"
              style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}
              onPointerDown={(event) => { event.preventDefault(); setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateDivider(event.clientX, event.currentTarget); }}
              onPointerMove={(event) => { if (dragging) { event.preventDefault(); updateDivider(event.clientX, event.currentTarget); } }}
              onPointerUp={(event) => { setDragging(false); event.currentTarget.releasePointerCapture(event.pointerId); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setDivider((value) => Math.max(0, value - 5)); }
                if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setDivider((value) => Math.min(100, value + 5)); }
                if (event.key === "Home") { event.preventDefault(); setDivider(0); }
                if (event.key === "End") { event.preventDefault(); setDivider(100); }
              }}
            >
              {compareLeft && <img src={compareLeft} alt={leftLabel} draggable={false} className="pointer-events-none absolute inset-0 size-full object-contain" />}
              {compareRight && <img src={compareRight} alt={rightLabel} draggable={false} className="pointer-events-none absolute inset-0 size-full object-contain" style={{ clipPath: `inset(0 0 0 ${divider}%)` }} />}
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(36,52,71,0.2)]" style={{ left: `${divider}%` }}>
                <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-[var(--shadow-m)]">↔</span>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.compareHint}</p>
            <p className="mt-6 flex items-center gap-2 text-[13px] leading-5 text-[var(--color-text-sub)]"><span aria-hidden="true">⌁</span>{text.privacy}</p>
          </section>

          <aside className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-m)]">
            <fieldset>
              <legend className="text-[16px] font-semibold">{text.typeQuestion}</legend>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {availableTypes.map((type) => <button key={type} type="button" onClick={() => setVisionType(type)} aria-pressed={visionType === type} className={`min-h-11 rounded-[var(--radius-s)] border px-3 text-left text-[14px] font-medium transition-colors ${visionType === type ? "border-[var(--color-primary)] bg-[var(--color-bg)] shadow-[inset_0_-2px_0_var(--color-accent)]" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"}`}>{visionType === type ? "✓ " : ""}{typeLabels[type]}</button>)}
              </div>
            </fieldset>
            <div className="mt-7 border-t border-[var(--color-border)] pt-6">
              <label htmlFor={`${mode}-amount`} className="flex items-center justify-between text-[16px] font-semibold"><span>{mode === "translate" ? text.strength : text.severity}</span><output className="tabular-nums text-[14px] font-medium text-[var(--color-text-sub)]">{Math.round(amount * 100)}%</output></label>
              <input id={`${mode}-amount`} className="mt-4 w-full accent-[var(--color-primary)]" type="range" min="0" max="1" step="0.05" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
            </div>
            {mode === "translate" && <p className="mt-5 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.unknownType}</p>}
            <div className="mt-7 grid gap-3">
              <button type="button" onClick={download} disabled={!resultUrl || isProcessing} className="h-12 rounded-[var(--radius-m)] bg-[var(--color-primary)] px-4 text-[16px] font-medium text-white transition-colors hover:bg-[#3a4b5e] disabled:cursor-not-allowed disabled:opacity-50">{isProcessing ? (mode === "translate" ? text.processingTranslate : text.processingSimulate) : text.download}</button>
              <button type="button" onClick={() => fileInput.current?.click()} className="h-12 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-4 text-[16px] font-medium hover:bg-[var(--color-bg)]">{text.replace}</button>
              {mode === "simulate" && <Link href="/translate" className="rounded-[var(--radius-m)] px-1 py-2 text-center text-[14px] font-medium underline underline-offset-4">{text.translateCta} →</Link>}
            </div>
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
          </aside>
        </div>
      )}
      {notice && <p role="status" className="fixed bottom-5 left-1/2 z-30 max-w-[calc(100%-2.5rem)] -translate-x-1/2 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-4 py-3 text-center text-[13px] leading-5 shadow-[var(--shadow-l)]"><span aria-hidden="true">ⓘ </span>{notice}</p>}
    </main>
  );
}
