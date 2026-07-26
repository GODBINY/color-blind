"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Pick = { id: number; x: number; y: number; rgb: [number, number, number] };

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const SAMPLE_SIZE = 7;

const toHex = (value: number) => value.toString(16).padStart(2, "0").toUpperCase();
const hexOf = ([red, green, blue]: Pick["rgb"]) => `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
const markerInk = ([red, green, blue]: Pick["rgb"]) => {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
  return luminance > 0.45 ? "#171717" : "#FFFFFF";
};

const copy = {
  ko: {
    eyebrow: "Image Color Picker",
    title: "사진 속 색을, 필요한 만큼 골라 보세요",
    intro: "이미지를 탭할 때마다 번호와 색상값이 쌓여요. 고른 색 목록까지 한 장의 이미지로 저장할 수 있어요.",
    select: "사진 선택",
    replace: "다른 사진 고르기",
    drop: "여기에 사진을 놓아주세요",
    help: "이미지의 원하는 지점을 탭해 색을 추가해 보세요.",
    list: "선택한 색",
    empty: "아직 고른 색이 없어요.",
    zoom: "확대",
    zoomOut: "축소",
    zoomIn: "확대",
    zoomReset: "원래 크기",
    clear: "모두 지우기",
    save: "점과 목록 저장하기",
    invalid: "JPG, PNG, WebP 파일을 20MB 이하로 선택해 주세요.",
    privacy: "사진은 이 기기 안에서만 읽어요.",
  },
  en: {
    eyebrow: "Image Color Picker",
    title: "Pick as many colors from a photo as you need",
    intro: "Each tap adds a numbered color value. Save the photo and your picked-color list together as one image.",
    select: "Choose a photo",
    replace: "Choose another photo",
    drop: "Drop a photo here",
    help: "Tap anywhere on the image to add a color.",
    list: "Picked colors",
    empty: "No colors picked yet.",
    zoom: "Zoom",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    zoomReset: "Actual size",
    clear: "Clear all",
    save: "Save points and list",
    invalid: "Choose a JPG, PNG, or WebP image under 20MB.",
    privacy: "Your photo is read only on this device.",
  },
} as const;

export function ImageColorPicker({ locale }: { locale: string }) {
  const text = locale === "ko" ? copy.ko : copy.en;
  const inputRef = useRef<HTMLInputElement>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const loadFile = useCallback(async (file?: File) => {
    if (!file || !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE) {
      setNotice(text.invalid);
      return;
    }
    try {
      const nextBitmap = await createImageBitmap(file);
      const nextUrl = URL.createObjectURL(file);
      const canvas = sampleCanvasRef.current;
      if (!canvas) return;
      canvas.width = nextBitmap.width;
      canvas.height = nextBitmap.height;
      canvas.getContext("2d", { willReadFrequently: true })?.drawImage(nextBitmap, 0, 0);
      setBitmap(nextBitmap);
      setImageUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return nextUrl;
      });
      setPicks([]);
      setZoom(1);
      setNotice(null);
    } catch {
      setNotice(text.invalid);
    }
  }, [text.invalid]);

  function pickColor(event: React.PointerEvent<HTMLDivElement>) {
    const canvas = sampleCanvasRef.current;
    const activeBitmap = bitmap;
    if (!canvas || !activeBitmap) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(activeBitmap.width - 1, Math.round(((event.clientX - rect.left) / rect.width) * activeBitmap.width)));
    const y = Math.max(0, Math.min(activeBitmap.height - 1, Math.round(((event.clientY - rect.top) / rect.height) * activeBitmap.height)));
    const radius = Math.floor(SAMPLE_SIZE / 2);
    const startX = Math.max(0, x - radius);
    const startY = Math.max(0, y - radius);
    const width = Math.min(SAMPLE_SIZE, activeBitmap.width - startX);
    const height = Math.min(SAMPLE_SIZE, activeBitmap.height - startY);
    const data = canvas.getContext("2d", { willReadFrequently: true })?.getImageData(startX, startY, width, height).data;
    if (!data) return;
    let red = 0; let green = 0; let blue = 0; let pixels = 0;
    for (let index = 0; index < data.length; index += 4) { red += data[index]!; green += data[index + 1]!; blue += data[index + 2]!; pixels++; }
    setPicks((current) => [...current, { id: current.length + 1, x: x / activeBitmap.width, y: y / activeBitmap.height, rgb: [Math.round(red / pixels), Math.round(green / pixels), Math.round(blue / pixels)] }]);
  }

  function saveImage() {
    if (!bitmap || !picks.length) return;
    const listWidth = Math.max(300, Math.round(bitmap.width * 0.3));
    const rowHeight = 62;
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width + listWidth;
    canvas.height = Math.max(bitmap.height, 98 + picks.length * rowHeight + 28);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#F7F7FC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0);
    picks.forEach((pick) => {
      const x = pick.x * bitmap.width;
      const y = pick.y * bitmap.height;
      const ink = markerInk(pick.rgb);
      context.beginPath(); context.arc(x, y, 12, 0, Math.PI * 2); context.fillStyle = hexOf(pick.rgb); context.fill(); context.lineWidth = 2; context.strokeStyle = ink; context.stroke();
      context.fillStyle = ink; context.font = "600 12px system-ui"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(String(pick.id), x, y + 0.5);
    });
    const left = bitmap.width + 28;
    context.fillStyle = "#2D2330"; context.font = "600 22px system-ui"; context.textAlign = "left"; context.textBaseline = "alphabetic"; context.fillText(text.list, left, 42);
    picks.forEach((pick, index) => {
      const top = 72 + index * rowHeight;
      context.fillStyle = hexOf(pick.rgb); context.fillRect(left, top, 34, 34); context.strokeStyle = "rgba(0,0,0,.12)"; context.strokeRect(left, top, 34, 34);
      context.fillStyle = "#2D2330"; context.font = "600 15px ui-monospace, monospace"; context.fillText(`${pick.id}. ${hexOf(pick.rgb)}`, left + 48, top + 15);
      context.fillStyle = "#6E6474"; context.font = "13px ui-monospace, monospace"; context.fillText(`RGB ${pick.rgb.join(", ")}`, left + 48, top + 31);
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `iris-picked-colors-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  }

  return <main className="mx-auto max-w-[1184px] px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-14">
    <section className="max-w-[680px]"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{text.eyebrow}</p><h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{text.title}</h1><p className="mt-5 text-[16px] leading-[26px] text-[var(--color-text-sub)]">{text.intro}</p></section>
    {!bitmap || !imageUrl ? <section onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void loadFile(event.dataTransfer.files[0]); }} className="mt-10 flex min-h-[380px] items-end rounded-[var(--radius-l)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6"><div><h2 className="text-[22px] font-semibold">{text.drop}</h2><button type="button" onClick={() => inputRef.current?.click()} className="mt-6 inline-flex min-h-12 items-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[16px] font-medium text-white">{text.select}</button><p className="mt-6 text-[13px] text-[var(--color-text-sub)]">{text.privacy}</p></div></section> : <section className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div><div className="mb-3 flex items-center justify-between gap-3"><p className="text-[13px] text-[var(--color-text-sub)]">{text.zoom} <output className="tabular-nums text-[var(--color-primary)]">{Math.round(zoom * 100)}%</output></p><div className="flex items-center gap-1"><button type="button" onClick={() => setZoom((current) => Math.max(1, current - 0.5))} disabled={zoom === 1} aria-label={text.zoomOut} className="grid size-8 place-items-center rounded-[var(--radius-s)] border border-[var(--color-border)] text-[18px] disabled:opacity-35">−</button><button type="button" onClick={() => setZoom(1)} disabled={zoom === 1} className="min-h-8 rounded-[var(--radius-s)] px-2 text-[12px] font-medium underline underline-offset-4 disabled:no-underline disabled:opacity-35">{text.zoomReset}</button><button type="button" onClick={() => setZoom((current) => Math.min(4, current + 0.5))} disabled={zoom === 4} aria-label={text.zoomIn} className="grid size-8 place-items-center rounded-[var(--radius-s)] border border-[var(--color-border)] text-[18px] disabled:opacity-35">+</button></div></div><div className="max-h-[70vh] overflow-auto rounded-[var(--radius-l)] bg-[var(--color-primary)] shadow-[var(--shadow-m)]"><div onPointerDown={pickColor} className="relative min-w-full cursor-crosshair" style={{ width: `${zoom * 100}%` }}><img src={imageUrl} alt={text.help} draggable={false} className="block h-auto w-full" />{picks.map((pick) => { const ink = markerInk(pick.rgb); return <span key={pick.id} aria-label={`${pick.id}: ${hexOf(pick.rgb)}`} className="pointer-events-none absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-[11px] font-semibold shadow-[var(--shadow-s)]" style={{ left: `${pick.x * 100}%`, top: `${pick.y * 100}%`, backgroundColor: hexOf(pick.rgb), borderColor: ink, color: ink }}>{pick.id}</span>; })}</div></div><p className="mt-4 text-[13px] leading-5 text-[var(--color-text-sub)]">{text.help}</p></div>
      <aside className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-s)] lg:sticky lg:top-6"><div className="flex items-center justify-between gap-3"><h2 className="text-[18px] font-semibold">{text.list} <span className="tabular-nums text-[var(--color-text-sub)]">{picks.length}</span></h2>{picks.length > 0 && <button type="button" onClick={() => setPicks([])} className="text-[13px] underline underline-offset-4">{text.clear}</button>}</div><div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">{picks.length ? picks.map((pick) => <div key={pick.id} className="flex items-center gap-3 rounded-[var(--radius-s)] border border-[var(--color-border)] p-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-bg)] text-[12px] font-semibold">{pick.id}</span><span className="size-9 shrink-0 rounded-[var(--radius-s)] border border-black/10" style={{ backgroundColor: hexOf(pick.rgb) }} /><span className="min-w-0 font-mono text-[13px] leading-5"><b className="block text-[var(--color-primary)]">{hexOf(pick.rgb)}</b><span className="text-[var(--color-text-sub)]">RGB {pick.rgb.join(", ")}</span></span></div>) : <p className="py-8 text-center text-[14px] text-[var(--color-text-sub)]">{text.empty}</p>}</div><div className="mt-5 grid gap-3"><button type="button" disabled={!picks.length} onClick={saveImage} className="min-h-12 rounded-[var(--radius-m)] bg-[var(--color-primary)] px-4 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-45">{text.save}</button><button type="button" onClick={() => inputRef.current?.click()} className="min-h-11 rounded-[var(--radius-m)] border border-[var(--color-border)] text-[14px] font-medium">{text.replace}</button></div></aside>
    </section>}
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { void loadFile(event.target.files?.[0]); event.currentTarget.value = ""; }} />
    <canvas ref={sampleCanvasRef} className="hidden" aria-hidden="true" />
    {notice && <p role="status" className="mt-5 text-[13px] text-[var(--color-error)]">{notice}</p>}
  </main>;
}
