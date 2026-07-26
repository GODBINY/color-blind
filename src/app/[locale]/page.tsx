import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeUpload } from "@/components/ui/HomeUpload";
import { HeroCompare } from "@/components/ui/HeroCompare";

const ROUTES = [
  { key: "tileSimulate", href: "/simulate" },
  { key: "tileLive", href: "/live" },
  { key: "tileFindMyView", href: "/find-my-view" },
  { key: "tileLearn", href: "/learn" },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main>
      <section className="mx-auto grid max-w-[1184px] gap-8 px-5 pb-16 pt-10 md:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] md:items-end md:gap-12 md:px-8 md:pb-24 md:pt-16">
        <div className="min-w-0 pb-2">
          <p className="mb-6 text-[13px] text-[var(--color-text-sub)]">{t("eyebrow")}</p>
          <h1 className="whitespace-pre-line text-[32px] font-semibold leading-[40px] tracking-[-0.045em] [overflow-wrap:anywhere] md:text-[48px] md:leading-[54px]">
            {t("tagline")}
          </h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{t("intro")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:items-start">
            <HomeUpload label={t("cta")} error={t("uploadError")} />
            <Link href="/simulate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-6 text-[16px] font-medium transition-colors hover:bg-[var(--color-bg)]">
              {t("secondaryCta")}
            </Link>
            <Link href="/color-pick" className="inline-flex min-h-11 items-center gap-2 self-start px-1 text-[14px] font-medium text-[var(--color-text-sub)] underline underline-offset-4 transition-colors hover:text-[var(--color-primary)]">
              {locale === "ko" ? "사진에서 색 고르기" : "Pick colors from a photo"} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="mt-5 text-[13px] leading-5 text-[var(--color-text-sub)]">{t("privacy")}</p>
        </div>

        <HeroCompare before={t("before")} after={t("after")} hint={t("visualCaption")} />
      </section>

      <section className="mx-auto max-w-[1184px] px-5 pb-20 md:px-8 md:pb-28">
        <div className="border-t border-[var(--color-border)] pt-6">
          <p className="text-[13px] text-[var(--color-text-sub)]">{t("exploreEyebrow")}</p>
          <h2 className="mt-2 max-w-[450px] text-[22px] font-semibold leading-[30px] tracking-[-0.03em] [overflow-wrap:anywhere]">{t("exploreTitle")}</h2>
          <div className="mt-8 border-t border-[var(--color-border)]">
          {ROUTES.map(({ key, href }) => (
            <Link key={key} href={href} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b border-[var(--color-border)] py-5">
              <span><span className="block text-[17px] font-semibold tracking-[-0.02em]">{t(key)}</span><span className="mt-1 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</span></span>
              <span aria-hidden="true" className="text-[18px] transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          ))}
          </div>
        </div>
      </section>
    </main>
  );
}
