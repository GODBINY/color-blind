import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeColorPickLink } from "@/components/ui/HomeColorPickLink";
import { HomePhotoFlowLink } from "@/components/ui/HomePhotoFlowLink";
import { HeroCompare } from "@/components/ui/HeroCompare";
import { appSchema, seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

const TASK_ROUTES = {
  tileTranslate: "/translate",
  tileSimulate: "/simulate",
  tileFindMyView: "/find-my-view",
  tileLive: "/live",
  tileColorPick: "/color-pick",
  tileLearn: "/learn",
} as const;

type TaskKey = keyof typeof TASK_ROUTES;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "home");
}

const taskGroupsFor = (locale: string): { title: string; description: string; tasks: TaskKey[] }[] => locale === "ko"
  ? [
      { title: "색약·색맹을 위한 색 확인 도구", description: "헷갈리는 색을 이름과 HEX·RGB 값으로 확인하고 기록해요.", tasks: ["tileLive", "tileColorPick"] },
      { title: "내 색약·색맹 시야 알아보기", description: "사진을 비교하며 내 시야가 어떤 색약·색맹 유형에 가까운지 살펴봐요.", tasks: ["tileFindMyView", "tileLearn"] },
    ]
  : [
      { title: "Check and record colors", description: "Check a color now or save precise values from an image.", tasks: ["tileLive", "tileColorPick"] },
      { title: "Understand a view", description: "Find a starting view for photo previews and learn about different ways of seeing color.", tasks: ["tileFindMyView", "tileLearn"] },
    ];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const taskGroups = taskGroupsFor(locale);
  const schema = appSchema(locale as AppLocale);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mx-auto grid max-w-[1184px] gap-4 px-5 pb-6 pt-3 md:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] md:items-start md:gap-12 md:px-8 md:pb-24 md:pt-12">
        <div className="contents md:block md:min-w-0">
          <div className="order-1">
            <p className="mb-2 text-[13px] text-[var(--color-text-sub)] md:mb-6">{t("eyebrow")}</p>
            <h1 className={`font-semibold tracking-[-0.045em] [overflow-wrap:anywhere] md:whitespace-pre-line md:text-[48px] md:leading-[54px] ${locale === "ko" ? "whitespace-nowrap text-[clamp(19px,6.2vw,28px)] leading-[1.2]" : "whitespace-pre-line text-[32px] leading-[40px]"}`}>
              {t("tagline")}
            </h1>
            <p className="mt-3 max-w-[440px] text-[16px] leading-[26px] text-[var(--color-text-sub)] md:mt-6">{t("intro")}</p>
          </div>
          <section
            aria-labelledby="photo-actions-title"
            className="order-3 w-full max-w-[440px] border-t border-[var(--color-border)] pt-3 md:mt-8 md:pt-5"
          >
            <h2
              id="photo-actions-title"
              className="text-[20px] font-semibold leading-7 tracking-[-0.025em] [overflow-wrap:anywhere]"
            >
              {t("choiceTitle")}
            </h2>
            <div className="mt-2 grid gap-2 md:mt-3 md:gap-3">
              <HomePhotoFlowLink
                mode="simulate"
                className="group flex min-h-[120px] min-w-0 flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3 md:min-h-[144px] md:p-5"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold leading-6 tracking-[-0.02em] [overflow-wrap:anywhere]">{t("secondaryCta")}</span>
                  <span className="mt-2 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t("secondaryCtaBody")}</span>
                  <span className="sr-only">{t("simulateAction")}</span>
                </span>
                <span aria-hidden="true" className="mt-3 text-[17px] transition-transform duration-150 group-hover:translate-x-1 md:mt-4">→</span>
              </HomePhotoFlowLink>
              <HomePhotoFlowLink
                mode="translate"
                className="group flex min-h-[120px] min-w-0 flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3 md:min-h-[144px] md:p-5"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold leading-6 tracking-[-0.02em] [overflow-wrap:anywhere]">{t("cta")}</span>
                  <span className="mt-2 block whitespace-pre-line text-[13px] leading-5 text-[var(--color-text-sub)]">{t("ctaBody")}</span>
                  <span className="sr-only">{t("translateAction")}</span>
                </span>
                <span aria-hidden="true" className="mt-3 text-[17px] transition-transform duration-150 group-hover:translate-x-1 md:mt-4">→</span>
              </HomePhotoFlowLink>
            </div>
            <p className="mt-3 border-t border-[var(--color-border)] pt-3 text-[13px] leading-5 text-[var(--color-text-sub)] md:mt-5 md:pt-5">{t("privacy")}</p>
          </section>
        </div>

        <div className="order-2 md:order-none">
          <HeroCompare before={t("heroOriginal")} after={t("heroSimulation")} hint={t("visualCaption")} locale={locale} />
        </div>
      </section>

      <section aria-label={t("exploreEyebrow")} className="mx-auto max-w-[1184px] px-5 pb-16 md:px-8 md:pb-28">
        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {taskGroups.map((group) => (
              <section key={group.title} aria-labelledby={`group-${group.title}`} className="py-5 md:grid md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-10 md:py-9">
                <div className="min-w-0">
                  <h3 id={`group-${group.title}`} className="text-[20px] font-semibold leading-7 tracking-[-0.025em] [overflow-wrap:anywhere]">{group.title}</h3>
                  <p className="mt-2 max-w-[330px] text-[14px] leading-6 text-[var(--color-text-sub)]">{group.description}</p>
                </div>
                <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 md:mt-0 md:gap-3">
                  {group.tasks.map((key) => (
                    key === "tileColorPick" ? (
                      <HomeColorPickLink key={key} className="group flex min-h-[120px] min-w-0 flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] md:min-h-[144px] md:p-5">
                        <span className="min-w-0">
                          <span className="block text-[16px] font-semibold leading-6 tracking-[-0.02em] [overflow-wrap:anywhere]">{t(key)}</span>
                          <span className="mt-2 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</span>
                        </span>
                        <span aria-hidden="true" className="mt-3 text-[17px] transition-transform duration-150 group-hover:translate-x-1 md:mt-4">→</span>
                      </HomeColorPickLink>
                    ) : (
                      <Link key={key} href={TASK_ROUTES[key]} className="group flex min-h-[120px] min-w-0 flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] md:min-h-[144px] md:p-5">
                        <span className="min-w-0">
                          <span className="block text-[16px] font-semibold leading-6 tracking-[-0.02em] [overflow-wrap:anywhere]">{t(key)}</span>
                          <span className="mt-2 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</span>
                        </span>
                        <span aria-hidden="true" className="mt-3 text-[17px] transition-transform duration-150 group-hover:translate-x-1 md:mt-4">→</span>
                      </Link>
                    )
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>
    </main>
  );
}
