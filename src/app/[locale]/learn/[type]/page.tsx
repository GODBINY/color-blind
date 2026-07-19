import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLearnContent, learnTypes, type LearnType } from "@/lib/learn/content";

export function generateStaticParams() {
  return learnTypes.map((type) => ({ type }));
}

export default async function LearnTypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  setRequestLocale(locale);
  if (!learnTypes.includes(type as LearnType)) notFound();
  const item = getLearnContent(locale, type as LearnType);
  const isKo = locale === "ko";

  return <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-16">
    <Link href="/learn" className="text-[14px] text-[var(--color-text-sub)] underline underline-offset-4">← {isKo ? "Learn으로" : "Back to Learn"}</Link>
    <section className="mt-8 max-w-[760px]"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{item.family} · {item.shortName}</p><h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{item.title}</h1><p className="mt-5 text-[17px] leading-7 text-[var(--color-text-sub)]">{item.intro}</p></section>
    <section className="mt-12 grid gap-5 md:grid-cols-2"><article className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)]"><h2 className="text-[21px] font-semibold">{isKo ? "어떤 차이가 있을까요?" : "What can feel different?"}</h2><p className="mt-4 text-[15px] leading-7 text-[var(--color-text-sub)]">{item.definition}</p></article><article className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)]"><h2 className="text-[21px] font-semibold">{isKo ? "한 사람의 경험으로 보기" : "Keeping it personal"}</h2><p className="mt-4 text-[15px] leading-7 text-[var(--color-text-sub)]">{item.prevalence}</p></article></section>
    <section className="mt-16"><div className="max-w-[640px]"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "같은 장면, 다른 대비" : "One scene, different contrast"}</p><h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">{isKo ? "사진으로 차이를 살펴봐요" : "Notice the difference in a photo"}</h2></div><div className="mt-7 grid gap-4 md:grid-cols-3">{[[isKo ? "내 눈으로" : "Original", "iris-photo"], [isKo ? `${item.shortName}의 시야` : `${item.shortName} view`, "iris-photo opacity-75"], [isKo ? "번역한 뒤" : "Translated", "iris-photo iris-photo--translated"]].map(([label, className]) => <figure key={label as string}><div className={`relative aspect-[1.1/1] overflow-hidden rounded-[var(--radius-l)] border border-white shadow-[var(--shadow-m)] ${className as string}`} role="img" aria-label={item.photoAlt} /><figcaption className="mt-3 text-[13px] font-medium text-[var(--color-text-sub)]">{label}</figcaption></figure>)}</div><p className="mt-5 max-w-[760px] text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "이 그림은 색의 차이를 이야기하기 위한 예시예요. 실제로 느끼는 방식은 사람마다 다를 수 있어요." : "This illustration is a way to talk about color difference. Each person’s lived view can be different."}</p></section>
    <section className="mt-16 grid gap-8 md:grid-cols-2"><article><h2 className="text-[22px] font-semibold">{isKo ? "가까이 느껴질 수 있는 색" : "Colors that can sit closer"}</h2><ul className="mt-5 space-y-3">{item.pairs.map((pair) => <li key={pair} className="flex items-center gap-3 text-[15px]"><span className="grid size-6 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_42%,white)] text-[12px]">•</span>{pair}</li>)}</ul><h2 className="mt-10 text-[22px] font-semibold">{isKo ? "일상에서는" : "In everyday moments"}</h2><ul className="mt-5 space-y-3 text-[15px] leading-6 text-[var(--color-text-sub)]">{item.everyday.map((line) => <li key={line}>{line}</li>)}</ul></article><article className="rounded-[var(--radius-l)] bg-[color-mix(in_srgb,var(--color-accent)_20%,white)] p-6"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "곁에 있는 사람이 할 수 있는 것" : "What someone nearby can do"}</p><h2 className="mt-2 text-[22px] font-semibold">{isKo ? "색에 말과 단서를 더해요" : "Give color a few more clues"}</h2><ul className="mt-5 space-y-4 text-[15px] leading-6">{item.support.map((line) => <li key={line} className="flex gap-3"><span aria-hidden="true">✓</span><span>{line}</span></li>)}</ul><Link href="/translate" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white">{isKo ? "사진 번역해 보기" : "Translate a photo"} <span className="ml-2" aria-hidden="true">→</span></Link></article></section>
  </main>;
}
