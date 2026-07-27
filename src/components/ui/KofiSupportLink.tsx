"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function KofiSupportLink({ children, className, placement }: { children: ReactNode; className: string; placement: "footer" | "home" | "learn" }) {
  return <a href="https://ko-fi.com/C1Y623WBYN" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("kofi_support_clicked", { placement })} className={className}>{children}</a>;
}
