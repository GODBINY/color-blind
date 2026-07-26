import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLearnIndex } from "@/lib/learn/content";
import { getLocalizedLearnName } from "@/lib/learn/content";
import { VisionSimulationPreview } from "@/components/learn/VisionSimulationPreview";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

const simulationType = { protanopia: "protan", deuteranopia: "deutan", tritanopia: "tritan" } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "learn");
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === "ko";
  const page = getLearnIndex(locale);

  return <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-16">
    <section className="max-w-[700px]">
      <p className="text-[13px] font-medium text-[var(--color-text-sub)]">Learn</p>
      <h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{page.title}</h1>
      <p className="mt-5 text-[16px] leading-[26px] text-[var(--color-text-sub)]">{page.intro}</p>
    </section>
    <section className="mt-12 grid gap-4 md:grid-cols-3">
      {page.types.map((type, index) => <Link key={type.type} href={`/learn/${type.type}`} className="group rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-m)]">
        <p className="flex items-center justify-between text-[13px] font-medium text-[var(--color-text-sub)]"><span>0{index + 1}</span><span className="transition-transform group-hover:translate-x-1">→</span></p>
        <div className="mt-6 h-32 overflow-hidden rounded-[var(--radius-m)] bg-[var(--color-bg)]"><VisionSimulationPreview type={simulationType[type.type]} alt={type.photoAlt} /></div>
        <h2 className="mt-6 text-[21px] font-semibold tracking-[-0.03em]">{getLocalizedLearnName(locale, type.type)}</h2>
        <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-sub)]">{type.intro}</p>
      </Link>)}
    </section>
    <section className="mt-16 grid gap-6 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
      <div><p className="text-[13px] font-medium text-[var(--color-text-sub)]">FAQ</p><h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">{isKo ? "궁금한 점을 차분히 풀어봐요" : "A few gentle answers"}</h2><p className="mt-2 text-[14px] leading-6 text-[var(--color-text-sub)]">{isKo ? "색을 다르게 보는 일, 그리고 사진을 함께 나누는 일에 대한 질문을 모았어요." : "Questions about seeing color differently, and sharing a photo with care."}</p></div>
      <Link href="/learn/faq" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? "FAQ 보기" : "Read the FAQ"}</Link>
    </section>
  </main>;
}
