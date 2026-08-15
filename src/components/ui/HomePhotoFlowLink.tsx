"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

export function HomePhotoFlowLink({
  mode,
  children,
  className,
}: {
  mode: "simulate" | "translate";
  children: ReactNode;
  className: string;
}) {
  return (
    <Link
      href={mode === "simulate" ? "/simulate" : "/translate"}
      onClick={() => trackEvent(mode === "simulate" ? "home_simulation_opened" : "home_translation_cta_clicked")}
      className={className}
    >
      {children}
    </Link>
  );
}
