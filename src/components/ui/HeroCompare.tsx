"use client";

import { useEffect, useRef, useState } from "react";
import { simulate, type VisionType } from "@/lib/color/simulate";
import { getVisionLabels } from "@/lib/vision-labels";
import { clamp01, linearToRGB, rgbToLinear } from "@/lib/color/srgb";

type HeroVisionType = Extract<VisionType, "protan" | "deutan" | "tritan">;
const HERO_IMAGE = "/images/iris-hero-flower.jpg";

async function simulatedHero(type: HeroVisionType) {
  const image = new Image();
  image.src = HERO_IMAGE;
  await image.decode();
  const scale = Math.min(1, 720 / image.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return HERO_IMAGE;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < frame.data.length; index += 4) {
    const rgb = rgbToLinear([frame.data[index]! / 255, frame.data[index + 1]! / 255, frame.data[index + 2]! / 255]);
    const [red, green, blue] = linearToRGB(simulate(rgb, type, 1));
    frame.data[index] = Math.round(clamp01(red) * 255);
    frame.data[index + 1] = Math.round(clamp01(green) * 255);
    frame.data[index + 2] = Math.round(clamp01(blue) * 255);
  }
  context.putImageData(frame, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function HeroCompare({ before, after, hint, locale }: { before: string; after: string; hint: string; locale: string }) {
  const [divider, setDivider] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [visionType, setVisionType] = useState<HeroVisionType>("deutan");
  const [rightImage, setRightImage] = useState(HERO_IMAGE);
  const cache = useRef<Partial<Record<HeroVisionType, string>>>({});
  const labels = getVisionLabels(locale);
  const updateDivider = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setDivider(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  useEffect(() => {
    let cancelled = false;
    const cached = cache.current[visionType];
    if (cached) { setRightImage(cached); return; }
    void simulatedHero(visionType).then((image) => {
      cache.current[visionType] = image;
      if (!cancelled) setRightImage(image);
    });
    return () => { cancelled = true; };
  }, [visionType]);

  return <figure className="relative mx-auto w-full max-w-[560px]">
    <div role="slider" tabIndex={0} aria-label={hint} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(divider)} className="relative aspect-[1.08/1] cursor-ew-resize touch-none select-none overflow-hidden rounded-[var(--radius-l)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3" onPointerDown={(event) => { event.preventDefault(); setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateDivider(event.clientX, event.currentTarget); }} onPointerMove={(event) => { if (dragging) { event.preventDefault(); updateDivider(event.clientX, event.currentTarget); } }} onPointerUp={(event) => { setDragging(false); event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerCancel={() => setDragging(false)} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setDivider((value) => Math.max(0, value - 5)); } if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setDivider((value) => Math.min(100, value + 5)); } if (event.key === "Home") { event.preventDefault(); setDivider(0); } if (event.key === "End") { event.preventDefault(); setDivider(100); } }}>
      <img src={HERO_IMAGE} alt="A field of red tulips" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
      <img src={rightImage} alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-[var(--duration-slow)]" style={{ clipPath: `inset(0 0 0 ${divider}%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(36,52,71,0.13)]" style={{ left: `${divider}%` }}><span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[var(--color-primary)] text-[14px] text-white shadow-[var(--shadow-m)]">↔</span></div>
    </div>
    <figcaption className="flex justify-between border-b border-[var(--color-border)] py-3 text-[13px] text-[var(--color-text-sub)]"><span>{before}</span><span>{after}</span></figcaption>
    <div className="mt-3 space-y-3" aria-label={labels.chooser}>
      <div><div className="flex items-center gap-1"><p className="text-[12px] font-medium text-[var(--color-text-sub)]">{labels.redGreen}</p><span tabIndex={0} aria-label={labels.redGreenHelpLabel} aria-describedby="red-green-vision-help" className="group relative inline-grid size-4 cursor-help place-items-center rounded-full border border-[var(--color-text-sub)] text-[10px] font-semibold leading-none text-[var(--color-text-sub)] outline-none transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:border-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"><span aria-hidden="true">?</span><span id="red-green-vision-help" role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-72 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left text-[12px] font-normal leading-5 text-[var(--color-text-sub)] opacity-0 shadow-[var(--shadow-m)] transition-opacity group-hover:opacity-100 group-focus:opacity-100">{labels.redGreenHelp}</span></span></div><div role="group" aria-label={labels.redGreen} className="mt-2 flex flex-wrap gap-2">{(["protan", "deutan"] as HeroVisionType[]).map((type) => <button key={type} type="button" onClick={() => setVisionType(type)} aria-pressed={visionType === type} className={`min-h-10 rounded-[var(--radius-s)] border px-3 text-[13px] font-medium transition-colors ${visionType === type ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)]"}`}>{labels.types[type]}</button>)}</div></div>
      <div><p className="text-[12px] font-medium text-[var(--color-text-sub)]">{labels.blueYellow}</p><button type="button" onClick={() => setVisionType("tritan")} aria-pressed={visionType === "tritan"} className={`mt-2 min-h-10 rounded-[var(--radius-s)] border px-3 text-[13px] font-medium transition-colors ${visionType === "tritan" ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)]"}`}>{labels.types.tritan}</button></div>
    </div>
    <p className="pt-3 text-[13px] leading-5 text-[var(--color-text-sub)]">{hint}</p>
  </figure>;
}
