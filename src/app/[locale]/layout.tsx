import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { seoMetadata, siteUrl, type AppLocale } from "@/lib/seo";
import "../globals.css";

const languages = [
  ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["zh-TW", "繁體中文"],
  ["ru", "Русский"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["pt", "Português"],
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: siteUrl(),
    ...seoMetadata(locale as AppLocale, "home"),
    applicationName: "NUNBIT",
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

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
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WGGZWCCN');`}
        </Script>
        <script dangerouslySetInnerHTML={{ __html: "try { document.documentElement.dataset.theme = localStorage.getItem('iris-theme') === 'dark' ? 'dark' : 'light'; } catch {}" }} />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WGGZWCCN" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        <NextIntlClientProvider>
          <header className="mx-auto flex max-w-[1184px] items-center justify-between border-b border-[var(--color-border)] px-5 py-5 md:px-8">
            <Link href="/" className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.05em]">
              <Image src="/icon.svg" alt="" width={28} height={28} className="size-7" priority />
              <span>{t("brand")}</span>
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
          <footer className="mx-auto flex max-w-[1184px] flex-col gap-6 border-t border-[var(--color-border)] px-5 py-8 text-[13px] leading-5 text-[var(--color-text-sub)] md:flex-row md:items-center md:justify-between md:px-8">
            <p>{t("privacy")}</p>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <p className="max-w-[340px] md:text-right">{t("supportMessage")}</p>
              <a href="https://ko-fi.com/C1Y623WBYN" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-s)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[13px] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3">
                <span aria-hidden="true">♡</span>{t("supportCta")}<span aria-hidden="true">↗</span>
              </a>
              <p>© {new Date().getFullYear()} NUNBIT</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
