"use client";

import { useEffect, useRef, useState } from "react";
import {
  clamp01,
  computeDelta,
  daltonize,
  linearToRGB,
  rgbToLinear,
  simulate,
  type DaltonizeVisionType,
} from "@/lib/color";

const MAX_DIM = 800;

export default function ColorCheckPage() {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);
  const [visionType, setVisionType] = useState<DaltonizeVisionType>("deutan");
  const [severity, setSeverity] = useState(1);
  const [strength, setStrength] = useState(0.8);
  const [delta, setDelta] = useState<number | null>(null);

  const originalRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<HTMLCanvasElement>(null);
  const translatedRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageBitmap) return;
    const original = originalRef.current;
    const sim = simRef.current;
    const translated = translatedRef.current;
    if (!original || !sim || !translated) return;

    const scale = Math.min(1, MAX_DIM / Math.max(imageBitmap.width, imageBitmap.height));
    const w = Math.round(imageBitmap.width * scale);
    const h = Math.round(imageBitmap.height * scale);
    for (const canvas of [original, sim, translated]) {
      canvas.width = w;
      canvas.height = h;
    }

    const octx = original.getContext("2d")!;
    octx.drawImage(imageBitmap, 0, 0, w, h);
    const src = octx.getImageData(0, 0, w, h);
    const simOut = new ImageData(w, h);
    const translatedOut = new ImageData(w, h);

    let deltaSum = 0;
    let deltaCount = 0;

    for (let i = 0; i < src.data.length; i += 4) {
      const linear = rgbToLinear([src.data[i]! / 255, src.data[i + 1]! / 255, src.data[i + 2]! / 255]);

      const simLinear = simulate(linear, visionType, severity);
      const [sr, sg, sb] = linearToRGB(simLinear);
      simOut.data[i] = Math.round(clamp01(sr) * 255);
      simOut.data[i + 1] = Math.round(clamp01(sg) * 255);
      simOut.data[i + 2] = Math.round(clamp01(sb) * 255);
      simOut.data[i + 3] = 255;

      const translatedLinear = daltonize(linear, visionType, severity, strength);
      const [tr, tg, tb] = linearToRGB(simulate(translatedLinear, visionType, severity));
      translatedOut.data[i] = Math.round(clamp01(tr) * 255);
      translatedOut.data[i + 1] = Math.round(clamp01(tg) * 255);
      translatedOut.data[i + 2] = Math.round(clamp01(tb) * 255);
      translatedOut.data[i + 3] = 255;

      if (i % 16 === 0) {
        deltaSum += computeDelta(linear, translatedLinear, visionType, severity);
        deltaCount++;
      }
    }

    sim.getContext("2d")!.putImageData(simOut, 0, 0);
    translated.getContext("2d")!.putImageData(translatedOut, 0, 0);
    setDelta(deltaCount ? deltaSum / deltaCount : 0);
  }, [imageBitmap, visionType, severity, strength]);

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-9">
      <p className="text-[13px] text-[var(--color-text-sub)]">
        M0 algorithm check — throwaway, replaced by the real Translate editor in M1.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) setImageBitmap(await createImageBitmap(file));
          }}
        />

        <label className="flex items-center gap-2 text-[14px]">
          type
          <select
            value={visionType}
            onChange={(e) => setVisionType(e.target.value as DaltonizeVisionType)}
          >
            <option value="protan">protan</option>
            <option value="deutan">deutan</option>
            <option value="tritan">tritan</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-[14px]">
          severity
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
          />
          <span className="tabular-nums">{severity.toFixed(2)}</span>
        </label>

        <label className="flex items-center gap-2 text-[14px]">
          strength
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
          />
          <span className="tabular-nums">{strength.toFixed(2)}</span>
        </label>

        {delta !== null && (
          <span className="text-[14px] tabular-nums">Δ = {delta.toFixed(4)}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <figure>
          <figcaption className="mb-2 text-[13px] text-[var(--color-text-sub)]">original</figcaption>
          <canvas ref={originalRef} className="w-full rounded-[var(--radius-s)] border border-[var(--color-border)]" />
        </figure>
        <figure>
          <figcaption className="mb-2 text-[13px] text-[var(--color-text-sub)]">
            their eyes, before translate
          </figcaption>
          <canvas ref={simRef} className="w-full rounded-[var(--radius-s)] border border-[var(--color-border)]" />
        </figure>
        <figure>
          <figcaption className="mb-2 text-[13px] text-[var(--color-text-sub)]">
            their eyes, after translate
          </figcaption>
          <canvas ref={translatedRef} className="w-full rounded-[var(--radius-s)] border border-[var(--color-border)]" />
        </figure>
      </div>
    </main>
  );
}
