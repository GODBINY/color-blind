"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { savePendingImage } from "@/lib/pending-image";

export function HomeUpload({ label, error }: { label: string; error: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const openImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 20 * 1024 * 1024) {
      setMessage(error);
      return;
    }
    void savePendingImage(file)
      .then(() => router.push("/translate"))
      .catch(() => setMessage(error));
  };
  return <div><input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => openImage(event.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-6 text-[16px] font-medium text-white shadow-[var(--shadow-m)] transition-transform duration-150 hover:-translate-y-0.5 sm:w-auto">{label} <span aria-hidden="true" className="ml-2">→</span></button>{message && <p role="alert" className="mt-2 text-[13px] text-[var(--color-error)]">{message}</p>}</div>;
}
