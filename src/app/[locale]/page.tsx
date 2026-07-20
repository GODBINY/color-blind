import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeUpload } from "@/components/ui/HomeUpload";
import { HeroCompare } from "@/components/ui/HeroCompare";

const TILES = [
  { key: "tileSimulate", href: "/simulate", index: "01" },
  { key: "tileLive", href: "/live", index: "02" },
  { key: "tileFindMyView", href: "/find-my-view", index: "03" },
  { key: "tileLearn", href: "/learn", index: "04" },
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
    <main className="overflow-hidden">
      <section className="iris-grid relative mx-auto grid max-w-[1184px] gap-10 px-5 pb-16 pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] md:items-center md:px-8 md:pb-24 md:pt-16">
        <div className="relative z-10">
          <p className="mb-5 flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-sub)]">
            <span className="inline-block size-2 rounded-full bg-[var(--color-accent)]" />
            {t("eyebrow")}
          </p>
          <h1 className="whitespace-pre-line text-[32px] font-semibold leading-[40px] tracking-[-0.045em] md:text-[48px] md:leading-[58px]">
            {t("tagline")}
          </h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{t("intro")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HomeUpload locale={locale as "en" | "ko"} label={t("cta")} error={t("uploadError")} />
            <Link href="/simulate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-6 text-[16px] font-medium transition-colors hover:bg-[var(--color-bg)]">
              {t("secondaryCta")}
            </Link>
          </div>
          <p className="mt-5 text-[13px] leading-5 text-[var(--color-text-sub)]">{t("privacy")}</p>
        </div>

        <HeroCompare before={t("before")} after={t("after")} hint={t("visualCaption")} />
      </section>

      <section className="mx-auto max-w-[1184px] px-5 pb-20 md:px-8 md:pb-28">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{t("exploreEyebrow")}</p><h2 className="mt-2 text-[22px] font-semibold leading-[30px] tracking-[-0.03em]">{t("exploreTitle")}</h2></div>
          <p className="hidden max-w-[280px] text-right text-[13px] leading-5 text-[var(--color-text-sub)] md:block">{t("exploreBody")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map(({ key, href, index }) => (
            <Link key={key} href={href} className="group min-h-[172px] rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-s)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-m)]">
              <div className="flex items-center justify-between text-[12px] text-[var(--color-text-sub)]"><span>{index}</span><span className="transition-transform group-hover:translate-x-1">→</span></div>
              <h3 className="mt-10 text-[17px] font-semibold tracking-[-0.02em]">{t(key)}</h3>
              <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
