import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeUpload } from "@/components/ui/HomeUpload";
import { HeroCompare } from "@/components/ui/HeroCompare";
import { KofiSupportLink } from "@/components/ui/KofiSupportLink";
import { appSchema, seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

const TASK_ROUTES = {
  tileTranslate: "/translate",
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
      { title: "사진을 함께 보기", description: "사진 한 장으로 그 사람에게 전할 새 사진을 만들어요.", tasks: ["tileTranslate"] },
      { title: "색을 확인하고 기록하기", description: "지금 보이는 색을 확인하거나, 이미지 속 색상값을 저장해요.", tasks: ["tileLive", "tileColorPick"] },
      { title: "내 시야 알아보기", description: "사진 비교의 기준이 될 시야를 찾아보고, 색을 다르게 보는 방식도 알아봐요.", tasks: ["tileFindMyView", "tileLearn"] },
    ]
  : [
      { title: "See a photo together", description: "Make a new photo to share with them from one image.", tasks: ["tileTranslate"] },
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
  const nav = await getTranslations("Nav");
  const taskGroups = taskGroupsFor(locale);
  const schema = appSchema(locale as AppLocale);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mx-auto grid max-w-[1184px] gap-8 px-5 pb-16 pt-10 md:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] md:items-start md:gap-12 md:px-8 md:pb-24 md:pt-12">
        <div className="min-w-0">
          <p className="mb-6 text-[13px] text-[var(--color-text-sub)]">{t("eyebrow")}</p>
          <h1 className="whitespace-pre-line text-[32px] font-semibold leading-[40px] tracking-[-0.045em] [overflow-wrap:anywhere] md:text-[48px] md:leading-[54px]">
            {t("tagline")}
          </h1>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{t("intro")}</p>
          <div className="mt-8 grid w-full max-w-[360px] gap-4">
            <div>
              <HomeUpload label={t("cta")} error={t("uploadError")} />
              <p className={`mt-2 min-h-10 text-[13px] leading-5 text-[var(--color-text-sub)] ${locale === "ko" ? "whitespace-pre-line" : ""}`}>{t("ctaBody")}</p>
            </div>
            <div>
              <Link href="/color-pick" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-m)] border border-[var(--color-border)] bg-white px-6 text-[16px] font-medium transition-colors hover:bg-[var(--color-bg)]">
                {t("colorPickCta")} <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-2 min-h-10 text-[13px] leading-5 text-[var(--color-text-sub)]">{t("colorPickCtaBody")}</p>
            </div>
          </div>
          <div className="mt-6 max-w-[440px] border-t border-[var(--color-border)] pt-5">
            <p className="text-[13px] leading-5 text-[var(--color-text-sub)]">{t("privacy")}</p>
            <p className="mt-4 text-[14px] leading-6 text-[var(--color-text-sub)]">{nav("supportMessage")}</p>
            <KofiSupportLink placement="home" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-s)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[13px] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3"><span aria-hidden="true">♡</span>{nav("supportCta")}<span aria-hidden="true">↗</span></KofiSupportLink>
          </div>
        </div>

        <HeroCompare before={t("before")} after={t("after")} hint={t("visualCaption")} locale={locale} />
      </section>

      <section aria-labelledby="tasks-title" className="mx-auto max-w-[1184px] px-5 pb-20 md:px-8 md:pb-28">
        <div className="border-t border-[var(--color-border)] pt-8">
          <h2 id="tasks-title" className="max-w-[520px] text-[28px] font-semibold leading-[36px] tracking-[-0.035em] [overflow-wrap:anywhere]">{t("exploreTitle")}</h2>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{t("exploreBody")}</p>
          <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {taskGroups.map((group) => (
              <section key={group.title} aria-labelledby={`group-${group.title}`} className="py-7 md:grid md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-10 md:py-9">
                <div className="min-w-0">
                  <h3 id={`group-${group.title}`} className="text-[20px] font-semibold leading-7 tracking-[-0.025em] [overflow-wrap:anywhere]">{group.title}</h3>
                  <p className="mt-2 max-w-[330px] text-[14px] leading-6 text-[var(--color-text-sub)]">{group.description}</p>
                </div>
                <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 md:mt-0">
                  {group.tasks.map((key) => (
                    <Link key={key} href={TASK_ROUTES[key]} className="group flex min-h-[144px] min-w-0 flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)] focus-visible:outline-3 focus-visible:outline-[var(--color-accent)]">
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold leading-6 tracking-[-0.02em] [overflow-wrap:anywhere]">{t(key)}</span>
                        <span className="mt-2 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</span>
                      </span>
                      <span aria-hidden="true" className="mt-4 text-[17px] transition-transform duration-150 group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
