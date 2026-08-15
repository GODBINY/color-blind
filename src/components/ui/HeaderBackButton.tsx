"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

const labels: Record<string, string> = {
  ko: "뒤로 가기",
  en: "Go back",
  ja: "戻る",
  "zh-TW": "返回",
  ru: "Назад",
  fr: "Retour",
  de: "Zurück",
  es: "Volver",
  pt: "Voltar",
};

export function HeaderBackButton({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    return null;
  }

  const label = labels[locale] ?? labels.en;

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace("/");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1 rounded-[var(--radius-s)] px-2 text-[12px] font-medium text-[var(--color-text-sub)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3 sm:min-h-8 sm:min-w-8"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2 sm:size-3.5">
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
