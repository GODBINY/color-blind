"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";

export function HeaderBrandLink({ label }: { label: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      href="/"
      className={`${isHome ? "flex" : "hidden"} items-center gap-1.5 text-[20px] font-semibold tracking-[-0.05em] md:flex`}
    >
      <Image src="/icon.svg" alt="" width={24} height={24} className="size-6" priority />
      <span>{label}</span>
    </Link>
  );
}
