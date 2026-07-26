import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "../globals.css";

const languages = [
  ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["zh-TW", "繁體中文"],
  ["ru", "Русский"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["pt", "Português"],
] as const;

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try { document.documentElement.dataset.theme = localStorage.getItem('iris-theme') === 'dark' ? 'dark' : 'light'; } catch {}" }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <header className="mx-auto flex max-w-[1184px] items-center justify-between border-b border-[var(--color-border)] px-5 py-5 md:px-8">
            <Link href="/" className="text-[19px] font-semibold tracking-[-0.05em]">
              {t("brand").toLowerCase()}
            </Link>
            <nav aria-label={t("languageNav")} className="flex items-center gap-3 text-[12px] font-medium text-[var(--color-text-sub)]">
              <details className="relative">
                <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1 rounded-[var(--radius-s)] px-2 hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)]"><span aria-hidden="true">◎</span>{languages.find(([code]) => code === locale)?.[1] ?? "English"}<span aria-hidden="true">⌄</span></summary>
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 grid min-w-40 gap-1 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-l)]">
                  {languages.map(([code, label]) => <Link key={code} href="/" locale={code} aria-current={locale === code ? "page" : undefined} className={`rounded-[var(--radius-s)] px-3 py-2 transition-colors hover:bg-[var(--color-bg)] ${locale === code ? "bg-[var(--color-bg)] text-[var(--color-primary)]" : ""}`}>{label}</Link>)}
                </div>
              </details>
              <ThemeToggle locale={locale} />
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
