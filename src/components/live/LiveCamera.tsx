"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type CameraCopy = {
  eyebrow: string;
  title: string;
  body: string;
  start: string;
  starting: string;
  flip: string;
  front: string;
  back: string;
  colorAtPoint: string;
  pickHint: string;
  unsupportedTitle: string;
  unsupportedBody: string;
  deniedTitle: string;
  deniedBody: string;
  translate: string;
  tryAgain: string;
  privacy: string;
};

type CameraState = "idle" | "requesting" | "active" | "unsupported" | "denied" | "error";

const toHex = (value: number) => value.toString(16).padStart(2, "0").toUpperCase();

export function LiveCamera({ copy }: { copy: CameraCopy }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraFrameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: 0.5, y: 0.5 });
  const [state, setState] = useState<CameraState>("idle");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [rgb, setRgb] = useState<[number, number, number]>([36, 52, 71]);
  const [point, setPoint] = useState({ x: 0.5, y: 0.5 });

  const stopCamera = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const beginSampling = useCallback(() => {
    const sampleFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.videoWidth && video.videoHeight) {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          const frame = cameraFrameRef.current;
          const rect = frame?.getBoundingClientRect();
          const frameWidth = rect?.width ?? video.clientWidth;
          const frameHeight = rect?.height ?? video.clientHeight;
          const scale = Math.max(frameWidth / video.videoWidth, frameHeight / video.videoHeight);
          const renderedWidth = video.videoWidth * scale;
          const renderedHeight = video.videoHeight * scale;
          const x = Math.max(0, Math.min(video.videoWidth - 1, Math.floor((pointRef.current.x * frameWidth - (frameWidth - renderedWidth) / 2) / scale)));
          const y = Math.max(0, Math.min(video.videoHeight - 1, Math.floor((pointRef.current.y * frameHeight - (frameHeight - renderedHeight) / 2) / scale)));
          context.drawImage(video, x, y, 1, 1, 0, 0, 1, 1);
          const pixel = context.getImageData(0, 0, 1, 1).data;
          const [red = 0, green = 0, blue = 0] = pixel;
          setRgb((previous) =>
            previous[0] === red && previous[1] === green && previous[2] === blue
              ? previous
              : [red, green, blue],
          );
        }
      }
      frameRef.current = requestAnimationFrame(sampleFrame);
    };
    sampleFrame();
  }, []);

  const startCamera = useCallback(
    async (nextFacingMode = facingMode) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("unsupported");
        return;
      }

      stopCamera();
      setState("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: nextFacingMode } },
        });
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setState("active");
        beginSampling();
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      }
    },
    [beginSampling, facingMode, stopCamera],
  );

  useEffect(() => stopCamera, [stopCamera]);

  const switchCamera = async () => {
    const nextFacingMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacingMode);
    await startCamera(nextFacingMode);
  };

  const pickColor = (event: React.PointerEvent<HTMLDivElement>) => {
    if (state !== "active") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
    pointRef.current = next;
    setPoint(next);
  };

  const hex = `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  const isFallback = state === "unsupported" || state === "denied" || state === "error";
  const fallbackTitle = state === "denied" ? copy.deniedTitle : copy.unsupportedTitle;
  const fallbackBody = state === "denied" ? copy.deniedBody : copy.unsupportedBody;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1184px] items-center px-5 pb-10 pt-4 md:px-8 md:pb-16">
      <section className="w-full overflow-hidden rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-m)]">
        <div className="grid min-h-[min(720px,calc(100vh-140px))] lg:grid-cols-[minmax(0,1fr)_320px]">
          <div ref={cameraFrameRef} onPointerDown={pickColor} className="relative min-h-[520px] overflow-hidden bg-[var(--color-primary)] touch-manipulation sm:min-h-[600px]">
            <video
              ref={videoRef}
              aria-label={copy.title}
              autoPlay
              muted
              playsInline
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${state === "active" ? "opacity-100" : "opacity-0"}`}
            />
            <canvas ref={canvasRef} width="1" height="1" className="hidden" aria-hidden="true" />

            {state === "active" && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,52,71,0.42),transparent_25%,transparent_70%,rgba(36,52,71,0.58))]" />
                <div className="pointer-events-none absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_6px_rgba(36,52,71,0.45)] transition-[left,top] duration-150" style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}>
                  <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
                  <p className="rounded-full bg-[rgba(36,52,71,0.78)] px-3 py-2 text-[13px] font-medium text-white backdrop-blur-sm">Iris / Live Camera</p>
                  <button
                    type="button"
                    onClick={switchCamera}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-medium text-[var(--color-primary)] shadow-[var(--shadow-m)] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-[var(--color-accent)]"
                  >
                    <span aria-hidden="true">↺</span>
                    {facingMode === "environment" ? copy.back : copy.front}
                  </button>
                </div>
                <div className="absolute bottom-5 left-1/2 w-[calc(100%-40px)] max-w-[360px] -translate-x-1/2 rounded-[var(--radius-m)] bg-white/95 p-4 shadow-[var(--shadow-l)] backdrop-blur-sm sm:bottom-7">
                  <p className="text-[13px] leading-5 text-[var(--color-text-sub)]">{copy.colorAtPoint}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="size-10 shrink-0 rounded-[var(--radius-s)] border border-black/10" style={{ backgroundColor: hex }} aria-label={hex} />
                    <div className="min-w-0 font-mono text-[14px] font-medium tabular-nums text-[var(--color-primary)]">
                      <p>{hex}</p>
                      <p className="mt-1 text-[12px] text-[var(--color-text-sub)]">RGB {rgb.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {state !== "active" && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                {isFallback ? (
                  <div className="max-w-[390px] rounded-[var(--radius-l)] bg-[var(--color-bg)] p-6 text-[var(--color-primary)] shadow-[var(--shadow-l)]">
                    <span className="mx-auto grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_38%,white)] text-[20px]" aria-hidden="true">⌁</span>
                    <h1 className="mt-5 text-[28px] font-semibold leading-[36px] tracking-[-0.03em]">{fallbackTitle}</h1>
                    <p className="mt-3 text-[16px] leading-[26px] text-[var(--color-text-sub)]">{fallbackBody}</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Link href="/translate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[16px] font-medium text-white shadow-[var(--shadow-s)]">{copy.translate}</Link>
                      {state !== "unsupported" && <button type="button" onClick={() => startCamera()} className="min-h-12 rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[16px] font-medium transition-colors hover:bg-white">{copy.tryAgain}</button>}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[420px] text-white">
                    <p className="text-[13px] font-medium tracking-[0.12em] text-[var(--color-accent)]">{copy.eyebrow}</p>
                    <h1 className="mt-4 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] sm:text-[40px] sm:leading-[48px]">{copy.title}</h1>
                    <p className="mt-4 text-[16px] leading-[26px] text-white/75">{copy.body}</p>
                    <button type="button" disabled={state === "requesting"} onClick={() => startCamera()} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-white px-6 text-[16px] font-medium text-[var(--color-primary)] shadow-[var(--shadow-m)] transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
                      {state === "requesting" ? copy.starting : copy.start}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="flex flex-col justify-between border-t border-[var(--color-border)] p-6 lg:border-l lg:border-t-0">
            <div>
              <p className="text-[13px] font-medium text-[var(--color-text-sub)]">{copy.eyebrow}</p>
              <h2 className="mt-3 text-[22px] font-semibold leading-[30px] tracking-[-0.025em]">{copy.title}</h2>
              <p className="mt-3 text-[16px] leading-[26px] text-[var(--color-text-sub)]">{copy.body}</p>
              <div className="mt-7 rounded-[var(--radius-m)] bg-[var(--color-bg)] p-4">
                <p className="text-[13px] leading-5 text-[var(--color-text-sub)]">{copy.colorAtPoint}</p>
                <p className="mt-2 font-mono text-[16px] font-medium tabular-nums">{hex}</p>
                <p className="mt-1 font-mono text-[13px] tabular-nums text-[var(--color-text-sub)]">RGB {rgb.join(", ")}</p>
              </div>
              <p className="mt-3 text-[13px] leading-5 text-[var(--color-text-sub)]">{copy.pickHint}</p>
            </div>
            <p className="mt-8 text-[13px] leading-5 text-[var(--color-text-sub)]">{copy.privacy}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
