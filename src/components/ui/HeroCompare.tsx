"use client";

import { useState } from "react";

export function HeroCompare({ before, after, hint }: { before: string; after: string; hint: string }) {
  const [divider, setDivider] = useState(48);
  const [dragging, setDragging] = useState(false);
  const updateDivider = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setDivider(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div className="relative mx-auto w-full max-w-[560px] rounded-[var(--radius-l)] border border-white/80 bg-white p-3 shadow-[var(--shadow-l)]">
      <div
        role="slider"
        tabIndex={0}
        aria-label={hint}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(divider)}
        className="relative aspect-[1.08/1] cursor-ew-resize touch-none select-none overflow-hidden rounded-[15px] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3"
        onPointerDown={(event) => { event.preventDefault(); setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateDivider(event.clientX, event.currentTarget); }}
        onPointerMove={(event) => { if (dragging) { event.preventDefault(); updateDivider(event.clientX, event.currentTarget); } }}
        onPointerUp={(event) => { setDragging(false); event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setDivider((value) => Math.max(0, value - 5)); }
          if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setDivider((value) => Math.min(100, value + 5)); }
          if (event.key === "Home") { event.preventDefault(); setDivider(0); }
          if (event.key === "End") { event.preventDefault(); setDivider(100); }
        }}
      >
        <img src="/images/iris-hero-flower.jpg" alt="A field of red tulips" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
        <img src="/images/iris-hero-flower.jpg" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover [filter:hue-rotate(155deg)_saturate(.72)_contrast(.92)]" style={{ clipPath: `inset(0 0 0 ${divider}%)` }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow-[0_0_0_1px_rgba(36,52,71,0.13)]" style={{ left: `${divider}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[var(--color-primary)] text-[14px] text-white shadow-[var(--shadow-m)]">↔</span>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-[var(--color-primary)] backdrop-blur">{before}</div>
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[12px] font-medium text-white">{after}</div>
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-4 text-[13px] text-[var(--color-text-sub)]"><span>{hint}</span><span aria-hidden="true">↔</span></div>
    </div>
  );
}
