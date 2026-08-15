"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { savePendingImage } from "@/lib/pending-image";
import { trackEvent } from "@/lib/analytics";

export function HomeUpload({ label, error, dropHint }: { label: string; error: string; dropHint: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const openImage = (file: File | undefined, entryMethod: "file_picker" | "drag_drop") => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 20 * 1024 * 1024) {
      setMessage(error);
      return;
    }
    void savePendingImage(file)
      .then(() => {
        trackEvent("home_translation_photo_added", { entry_method: entryMethod });
        router.push("/translate");
      })
      .catch(() => setMessage(error));
  };
  return <div
    onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
    onDragOver={(event) => event.preventDefault()}
    onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }}
    onDrop={(event) => { event.preventDefault(); setIsDragging(false); openImage(event.dataTransfer.files[0], "drag_drop"); }}
    className={`rounded-[var(--radius-m)] transition-[background-color,box-shadow] duration-150 ${isDragging ? "bg-[color-mix(in_srgb,var(--color-accent)_12%,var(--color-surface))] shadow-[var(--shadow-s)]" : ""}`}
  >
    <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { openImage(event.target.files?.[0], "file_picker"); event.currentTarget.value = ""; }} />
    <button type="button" onClick={() => { trackEvent("home_translation_cta_clicked"); inputRef.current?.click(); }} className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-6 text-[16px] font-medium text-white shadow-[var(--shadow-m)] transition-transform duration-150 hover:-translate-y-0.5">{label} <span aria-hidden="true" className="ml-2">→</span></button>
    <p className="mt-2 text-center text-[12px] leading-5 text-[var(--color-text-sub)]">{dropHint}</p>
    {message && <p role="alert" className="mt-2 text-[13px] text-[var(--color-error)]">{message}</p>}
  </div>;
}
