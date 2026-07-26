import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeUpload } from "@/components/ui/HomeUpload";
import { HeroCompare } from "@/components/ui/HeroCompare";

const TASK_ROUTES = {
  tileTranslate: "/translate",
  tileSimulate: "/simulate",
  tileFindMyView: "/find-my-view",
  tileLive: "/live",
  tileColorPick: "/color-pick",
  tileLearn: "/learn",
} as const;

type TaskKey = keyof typeof TASK_ROUTES;

const taskGroupsFor = (locale: string): { title: string; description: string; tasks: TaskKey[] }[] => locale === "ko"
  ? [
      { title: "사진을 함께 보기", description: "같은 장면을 다른 시야로 비교하거나, 그 사람의 색으로 번역해요.", tasks: ["tileTranslate", "tileSimulate", "tileFindMyView"] },
      { title: "색을 확인하고 기록하기", description: "지금 보이는 색을 확인하거나, 이미지 속 색상값을 저장해요.", tasks: ["tileLive", "tileColorPick"] },
      { title: "색을 다르게 보는 이야기", description: "색을 다르게 보는 방식과 일상에서 도움이 되는 정보를 읽어봐요.", tasks: ["tileLearn"] },
    ]
  : [
      { title: "Compare a view", description: "Compare the same scene or translate it for another view.", tasks: ["tileTranslate", "tileSimulate", "tileFindMyView"] },
      { title: "Check and record colors", description: "Check a color now or save precise values from an image.", tasks: ["tileLive", "tileColorPick"] },
      { title: "Learn about color vision", description: "Read practical information about different ways of seeing color.", tasks: ["tileLearn"] },
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
              {t("colorPickCta")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="mt-5 text-[13px] leading-5 text-[var(--color-text-sub)]">{t("privacy")}</p>
        </div>

        <HeroCompare before={t("before")} after={t("after")} hint={t("visualCaption")} locale={locale} />
      </section>

      <section className="mx-auto max-w-[1184px] px-5 pb-20 md:px-8 md:pb-28">
        <div className="border-t border-[var(--color-border)] pt-6">
          <p className="text-[13px] text-[var(--color-text-sub)]">{t("exploreEyebrow")}</p>
          <h2 className="mt-2 max-w-[520px] text-[24px] font-semibold leading-[32px] tracking-[-0.03em] [overflow-wrap:anywhere]">{t("exploreTitle")}</h2>
          <div className="mt-8 space-y-10">
            {taskGroups.map((group) => <section key={group.title} aria-labelledby={`group-${group.title}`}>
              <div className="max-w-[560px] border-b border-[var(--color-border)] pb-3"><h3 id={`group-${group.title}`} className="text-[16px] font-semibold">{group.title}</h3><p className="mt-1 text-[13px] leading-5 text-[var(--color-text-sub)]">{group.description}</p></div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">{group.tasks.map((key) => <Link key={key} href={TASK_ROUTES[key]} className="group flex min-h-[120px] flex-col justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-s)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-m)]"><span><span className="block text-[16px] font-semibold tracking-[-0.02em]">{t(key)}</span><span className="mt-2 block text-[13px] leading-5 text-[var(--color-text-sub)]">{t(`${key}Body`)}</span></span><span aria-hidden="true" className="mt-4 text-[17px] transition-transform duration-150 group-hover:translate-x-1">→</span></Link>)}</div>
            </section>)}
          </div>
        </div>
      </section>
    </main>
  );
}
