"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { takePendingImage } from "@/lib/pending-image";
import { getVisionLabels, redGreenTypes } from "@/lib/vision-labels";
import { readVisionProfile } from "@/lib/vision-profile";
import {
  clamp01,
  daltonize,
  linearToRGB,
  rgbToLinear,
  type DaltonizeVisionType,
  type VisionType,
} from "@/lib/color";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_DIMENSION = 4096;
const PROCESSING_FRAME_BUDGET_MS = 12;

const copy = {
  ko: {
    translateTitle: "사진 번역하기",
    translateIntro: "색약·색맹인이 사진 속 색의 차이를 더 구분하기 쉽게, 새 사진을 만들어요.",
    drop: "여기에 사진을 놓아주세요",
    select: "사진 선택",
    camera: "카메라로 찍기",
    paste: "붙여넣기도 가능해요",
    privacy: "사진을 업로드해도 별도 서버에 저장되지 않아요. 모든 변환은 이 기기에서 이뤄져요.",
    typeQuestion: "어떤 시야를 기준으로 할까요?",
    strength: "번역 강도",
    severity: "시야 강도",
    mine: "내가 전할 장면",
    theirs: "그 사람에게 전해질 모습",
    viewing: (type: string) => `${type}에 맞춰 만든 사진이에요`,
    theirResultTitle: "그 사람에게 전해질 장면",
    theirResultIntro: (type: string) => `${type}에서 색의 차이를 더 구분하기 쉽게 만든 완성 사진이에요.`,
    theirResultNote: "오른쪽 ‘번역한 뒤’와 같은 파일이에요. 이 사진을 그대로 저장해 전할 수 있어요.",
    showBefore: "원본과 나란히 비교하기",
    hideBefore: "완성된 사진만 보기",
    original: "원본",
    translated: "번역한 뒤",
    before: "번역 전 시야",
    after: "번역 후 시야",
    simulated: "그 사람의 시야",
    download: "저장하기",
    replace: "다른 사진 고르기",
    processingTranslate: "사진 속 색의 차이를 옮기는 중...",
    processingSimulate: "그 사람의 시선으로 바꾸는 중...",
    processingDetail: "사진 크기에 따라 잠시 걸릴 수 있어요.",
    invalid: "앗, 이 파일은 읽을 수 없었어요. JPG, PNG, WebP로 다시 시도해 볼까요?",
    tooLarge: "사진은 20MB 이하로 올려 주세요.",
    resized: "큰 사진은 이 기기에서 편하게 다룰 수 있도록 크기를 조절했어요.",
    compareHint: "가운데 선을 드래그하거나 키보드의 좌우 화살표로 비교해 보세요.",
    translateCta: "이 장면을 그 사람의 색으로 옮겨 볼까요?",
    unknownType: "유형을 모르겠다면 Find My View에서 함께 알아볼 수 있어요.",
  },
  en: {
    translateTitle: "Translate a photo",
    translateIntro: "Create a new photo that makes color differences easier for color-blind people to distinguish.",
    drop: "Drop a photo here",
    select: "Choose a photo",
    camera: "Take a photo",
    paste: "You can paste an image here, too.",
    privacy: "Your photo never leaves this device. Every transformation happens here.",
    typeQuestion: "Which view should guide it?",
    strength: "Translation strength",
    severity: "View strength",
    mine: "The scene I share",
    theirs: "How it reaches them",
    viewing: (type: string) => `Made for a ${type} view`,
    theirResultTitle: "What reaches them",
    theirResultIntro: (type: string) => `The finished photo, made to make colour differences easier to distinguish in a ${type} view.`,
    theirResultNote: "This is the same file as “Translated” on the right. Save this photo to share it.",
    showBefore: "Compare it with the original",
    hideBefore: "Show the finished photo only",
    original: "Original",
    translated: "Translated",
    before: "Before translation",
    after: "After translation",
    simulated: "Their view",
    download: "Save image",
    replace: "Choose another photo",
    processingTranslate: "Translating into colors they can see...",
    processingSimulate: "Changing to their view...",
    processingDetail: "This can take a moment for larger photos.",
    invalid: "We couldn’t read that file. Try a JPG, PNG, or WebP image.",
    tooLarge: "Please choose a photo under 20MB.",
    resized: "We resized this large photo so it stays comfortable to use here.",
    compareHint: "Drag the center line, or use the left and right arrow keys to compare.",
    translateCta: "Make this photo easier for them to see",
    unknownType: "Not sure of their type? You can explore it together in Find My View.",
  },
} as const;

const toDataUrl = (canvas: HTMLCanvasElement) => canvas.toDataURL("image/png");

function ProcessingOverlay({ label, detail, progress }: { label: string; detail: string; progress: number }) {
  return <div role="status" aria-live="polite" className="absolute inset-0 z-20 grid place-items-center bg-[color-mix(in_srgb,var(--color-primary)_72%,transparent)] p-6 text-center text-white backdrop-blur-[2px]">
    <div className="w-full max-w-60">
      <p className="text-[16px] font-semibold">{label} <span className="tabular-nums">{progress}%</span></p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/30"><div className="h-full rounded-full bg-white transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
      <p className="mt-3 text-[13px] leading-5 text-white/80">{detail}</p>
    </div>
  </div>;
}

export function ImageEditor({ locale }: { locale: string }) {
  const text = locale === "ko" ? copy.ko : copy.en;
  const visionLabels = getVisionLabels(locale);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<ImageBitmap | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [visionType, setVisionType] = useState<VisionType>(() => readVisionProfile()?.visionType ?? "deutan");
  const [amount, setAmount] = useState(0.8);
  const [divider, setDivider] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
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
      setOriginalUrl(null);
      setResultUrl(null);
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
    let frameId: number | null = null;
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
      let index = 0;

      const processChunk = () => {
        const startedAt = performance.now();
        while (index < input.data.length && performance.now() - startedAt < PROCESSING_FRAME_BUDGET_MS) {
          const linear = rgbToLinear([
            input.data[index]! / 255,
            input.data[index + 1]! / 255,
            input.data[index + 2]! / 255,
          ]);
          const transformed = daltonize(linear, visionType as DaltonizeVisionType, 1, amount);
          const [red, green, blue] = linearToRGB(transformed);
          result.data[index] = Math.round(clamp01(red) * 255);
          result.data[index + 1] = Math.round(clamp01(green) * 255);
          result.data[index + 2] = Math.round(clamp01(blue) * 255);
          result.data[index + 3] = input.data[index + 3]!;
          index += 4;
        }

        if (cancelled) return;
        setProcessingProgress(Math.round((index / input.data.length) * 100));
        if (index < input.data.length) {
          frameId = window.requestAnimationFrame(processChunk);
          return;
        }

        outputContext.putImageData(result, 0, 0);
        setOriginalUrl(toDataUrl(original));
        setResultUrl(toDataUrl(output));
        setDimensions({ width, height });
        setIsProcessing(false);
      };

      frameId = window.requestAnimationFrame(processChunk);
    };

    frameId = window.requestAnimationFrame(() => {
      if (cancelled) return;
      setIsProcessing(true);
      setProcessingProgress(0);
      frameId = window.requestAnimationFrame(() => {
        try {
          process();
        } catch {
          if (!cancelled) {
            setNotice(text.invalid);
            setIsProcessing(false);
          }
        }
      });
    });
    return () => {
      cancelled = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [amount, source, text.invalid, visionType]);

  const updateDivider = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setDivider(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  const compareLeft = originalUrl;
  const compareRight = resultUrl;
  const leftLabel = `${text.original} · ${text.mine}`;
  const rightLabel = `${text.translated} · ${text.theirs}`;

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = resultUrl;
    link.download = `nunbit-for-${visionType}-${date}.png`;
    link.click();
  };

  return (
    <main className="mx-auto w-full max-w-[1184px] px-5 pb-12 pt-7 md:px-8 md:pt-10">
      <div className="mb-10 max-w-[620px] border-b border-[var(--color-border)] pb-7">
        <h1 className="min-w-0 text-[28px] font-semibold leading-9 tracking-[-0.035em] [overflow-wrap:anywhere] md:text-[32px] md:leading-10">
          {text.translateTitle}
        </h1>
        <p className="mt-3 text-[16px] leading-[26px] text-[var(--color-text-sub)]">
          {text.translateIntro}
        </p>
      </div>

      {!source ? (
        <section
          onDragEnter={(event) => { event.preventDefault(); setIsDraggingFile(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(event) => { event.preventDefault(); setIsDraggingFile(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}
          className={`flex min-h-[430px] items-end rounded-[var(--radius-l)] border border-dashed p-6 transition-[background-color,transform,border-color] duration-[var(--duration-fast)] ${isDraggingFile ? "scale-[1.01] border-[var(--color-accent)] bg-[var(--color-bg)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
        >
          <div className="max-w-sm">
            <h2 className="text-[22px] font-semibold leading-[30px]">{text.drop}</h2>
            <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.paste}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => fileInput.current?.click()} className="h-12 whitespace-nowrap rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[16px] font-medium text-white transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,var(--color-accent))] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3">{text.select}</button>
              <button type="button" onClick={() => cameraInput.current?.click()} className="h-12 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-5 text-[16px] font-medium transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3">{text.camera}</button>
            </div>
            <p className="mt-7 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.privacy}</p>
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
          <input ref={cameraInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <div className="mb-3 flex items-start justify-between gap-5 text-[13px] font-medium text-[var(--color-text-sub)]">
              <span className="min-w-0"><strong className="block text-[var(--color-primary)]">{text.original}</strong><span>{text.mine}</span></span>
              <span className="min-w-0 text-right"><strong className="block text-[var(--color-primary)]">{text.translated}</strong><span>{text.theirs}</span></span>
            </div>
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
              {isProcessing && <ProcessingOverlay label={text.processingTranslate} detail={text.processingDetail} progress={processingProgress} />}
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(36,52,71,0.2)]" style={{ left: `${divider}%` }}>
                <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-[var(--shadow-m)]">↔</span>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.compareHint}</p>
            <p className="mt-6 flex items-center gap-2 text-[13px] leading-5 text-[var(--color-text-sub)]"><span aria-hidden="true">⌁</span>{text.privacy}</p>
          </section>

          <aside className="border-t border-[var(--color-border)] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <fieldset>
              <legend className="text-[16px] font-semibold">{text.typeQuestion}</legend>
              <div className="mt-4 space-y-4">
                <div><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{visionLabels.redGreen}</p><div className="mt-2 grid grid-cols-2 gap-2">{redGreenTypes.map((type) => <button key={type} type="button" onClick={() => setVisionType(type)} aria-pressed={visionType === type} className={`min-h-11 rounded-[var(--radius-s)] border px-3 text-left text-[14px] font-medium transition-colors ${visionType === type ? "border-[var(--color-primary)] bg-[var(--color-bg)]" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"}`}>{visionLabels.types[type]}</button>)}</div></div>
                <div><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{visionLabels.blueYellow}</p><button type="button" onClick={() => setVisionType("tritan")} aria-pressed={visionType === "tritan"} className={`mt-2 min-h-11 w-full rounded-[var(--radius-s)] border px-3 text-left text-[14px] font-medium transition-colors ${visionType === "tritan" ? "border-[var(--color-primary)] bg-[var(--color-bg)]" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"}`}>{visionLabels.types.tritan}</button></div>
              </div>
            </fieldset>
            <div className="mt-7 border-t border-[var(--color-border)] pt-6">
              <label htmlFor="translation-amount" className="flex items-center justify-between text-[16px] font-semibold"><span>{text.strength}</span><output className="tabular-nums text-[14px] font-medium text-[var(--color-text-sub)]">{Math.round(amount * 100)}%</output></label>
              <input id="translation-amount" className="mt-4 w-full accent-[var(--color-primary)]" type="range" min="0" max="1" step="0.05" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
            </div>
            <p className="mt-5 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.unknownType}</p>
            <div className="mt-7 grid gap-3">
              <button type="button" onClick={download} disabled={!resultUrl || isProcessing} className="h-12 whitespace-nowrap rounded-[var(--radius-m)] bg-[var(--color-primary)] px-4 text-[16px] font-medium text-white transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,var(--color-accent))] disabled:cursor-not-allowed disabled:opacity-50">{isProcessing ? text.processingTranslate : text.download}</button>
              <button type="button" onClick={() => fileInput.current?.click()} className="h-12 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-4 text-[16px] font-medium hover:bg-[var(--color-bg)]">{text.replace}</button>
            </div>
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.currentTarget.value = ""; }} />
          </aside>
        </div>
      )}
      {notice && <p role="status" className="fixed bottom-5 left-1/2 z-30 max-w-[calc(100%-2.5rem)] -translate-x-1/2 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-4 py-3 text-center text-[13px] leading-5 shadow-[var(--shadow-l)]"><span aria-hidden="true">ⓘ </span>{notice}</p>}
    </main>
  );
}
