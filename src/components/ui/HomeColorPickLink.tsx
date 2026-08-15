"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

export function HomeColorPickLink({ children, className }: { children: ReactNode; className: string }) {
  return <Link href="/color-pick" onClick={() => trackEvent("home_color_picker_opened")} className={className}>{children}</Link>;
}
