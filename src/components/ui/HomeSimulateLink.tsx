"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

export function HomeSimulateLink({ children, className }: { children: ReactNode; className: string }) {
  return <Link href="/simulate" onClick={() => trackEvent("home_simulation_opened")} className={className}>{children}</Link>;
}
