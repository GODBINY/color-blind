"use client";

import { useEffect, useState } from "react";
import { simulate, type VisionType } from "@/lib/color/simulate";
import { clamp01, linearToRGB, rgbToLinear } from "@/lib/color/srgb";

const imagePath = "/images/iris-hero-flower.jpg";
type PreviewType = Extract<VisionType, "protan" | "deutan" | "tritan">;

export function VisionSimulationPreview({ type, alt }: { type: PreviewType; alt: string }) {
  const [src, setSrc] = useState(imagePath);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const image = new Image();
      image.src = imagePath;
      await image.decode();
      const scale = Math.min(1, 560 / image.naturalWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < frame.data.length; index += 4) {
        const linear = rgbToLinear([frame.data[index]! / 255, frame.data[index + 1]! / 255, frame.data[index + 2]! / 255]);
        const [red, green, blue] = linearToRGB(simulate(linear, type, 1));
        frame.data[index] = Math.round(clamp01(red) * 255);
        frame.data[index + 1] = Math.round(clamp01(green) * 255);
        frame.data[index + 2] = Math.round(clamp01(blue) * 255);
      }
      context.putImageData(frame, 0, 0);
      if (!cancelled) setSrc(canvas.toDataURL("image/jpeg", 0.88));
    };
    void render();
    return () => { cancelled = true; };
  }, [type]);

  return <img src={src} alt={alt} className="block size-full object-cover transition-opacity duration-[var(--duration-slow)]" />;
}
