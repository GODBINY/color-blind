import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Iris",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Nav");

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header className="mx-auto flex max-w-[1184px] items-center justify-between px-5 py-5 md:px-8">
            <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.04em]">
              <span className="grid size-7 place-items-center rounded-full bg-[var(--color-primary)] text-[13px] text-white">i</span>
              {t("brand")}
            </Link>
            <nav aria-label={t("languageNav")} className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white p-1 text-[12px] font-medium shadow-[var(--shadow-s)]">
              <Link href="/" locale="en" className="rounded-full px-3 py-1.5 transition-colors hover:bg-[var(--color-bg)]">
                EN
              </Link>
              <Link href="/" locale="ko" className="rounded-full px-3 py-1.5 transition-colors hover:bg-[var(--color-bg)]">
                KO
              </Link>
            </nav>
          </header>
          {children}
          <footer className="mx-auto flex max-w-[1184px] flex-col gap-3 border-t border-[var(--color-border)] px-5 py-8 text-[13px] leading-5 text-[var(--color-text-sub)] md:flex-row md:items-center md:justify-between md:px-8">
            <p>{t("privacy")}</p>
            <p>© {new Date().getFullYear()} Iris</p>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
