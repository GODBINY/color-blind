"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

export function ThemeToggle({ locale }: { locale: string }) {
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("iris-theme-change", onStoreChange);
      return () => window.removeEventListener("iris-theme-change", onStoreChange);
    },
    () => document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    () => "light",
  );
  const isKo = locale === "ko";

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("iris-theme", nextTheme);
    window.dispatchEvent(new Event("iris-theme-change"));
  }

  const nextLabel = theme === "light"
    ? (isKo ? "어두운 모드로 바꾸기" : "Switch to dark mode")
    : (isKo ? "밝은 모드로 바꾸기" : "Switch to light mode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      aria-pressed={theme === "dark"}
      className="grid size-8 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3"
    >
      {theme === "light" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15px] fill-none stroke-current stroke-[1.8]">
          <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15px] fill-none stroke-current stroke-[1.8]">
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" />
        </svg>
      )}
    </button>
  );
}
