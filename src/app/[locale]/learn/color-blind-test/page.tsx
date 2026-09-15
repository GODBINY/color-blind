import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedUrl, seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "colorBlindTest");
}

const faqEntries = {
  ko: [
    ["이 테스트로 색약 여부를 확정할 수 있나요?", "아니요. 화면 밝기와 색상 설정에 따라 결과가 달라질 수 있어 참고용으로만 써 주세요. 정확한 확인은 안과에서 할 수 있어요."],
    ["몇 장을 봐야 하나요?", "NUNBIT은 8장의 판을 준비했어요. 짧게 마칠 수 있어요."],
    ["결과는 저장되나요?", "결과는 이 기기 안에서만 쓰이고, 서버로 전송되지 않아요."],
  ],
  en: [
    ["Does this confirm a diagnosis?", "No — treat it as a reference only, since screen brightness and color settings can change the result. An eye-care professional can give you an accurate assessment."],
    ["How many plates are there?", "NUNBIT uses eight plates, so it stays quick."],
    ["Is my result saved anywhere?", "Your result stays on this device. Nothing is sent to a server."],
  ],
};

export default async function ColorBlindTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === "ko";
  const faq = faqEntries[isKo ? "ko" : "en"];
  const title = isKo ? "온라인 색약 테스트, 무료로 가볍게 해봐요" : "Try a Free Online Color Blind Test";
  const intro = isKo
    ? "이시하라 판은 오랫동안 쓰여온 색 구분 참고 자료예요. NUNBIT에서 8장을 살펴보고, 사진 비교에 쓸 시야까지 함께 골라볼 수 있어요."
    : "Ishihara plates are a long-used color-vision reference. Check eight of them on NUNBIT, then choose the view you'll use for photo comparisons.";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: intro,
    inLanguage: isKo ? "ko" : "en",
    mainEntityOfPage: localizedUrl(locale as AppLocale, "colorBlindTest"),
    publisher: { "@type": "Organization", name: "NUNBIT", url: localizedUrl(locale as AppLocale) },
  };

  return <main className="mx-auto max-w-[820px] px-5 pb-20 pt-8 md:pb-28 md:pt-16">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <Link href="/learn" className="text-[14px] text-[var(--color-text-sub)] underline underline-offset-4">← {isKo ? "Learn으로" : "Back to Learn"}</Link>
    <p className="mt-8 text-[13px] font-medium text-[var(--color-text-sub)]">Learn</p>
    <h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{title}</h1>
    <p className="mt-5 max-w-[660px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{intro}</p>

    <section className="mt-12 grid gap-5 md:grid-cols-2">
      <article className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)]">
        <h2 className="text-[21px] font-semibold">{isKo ? "이시하라 판이란?" : "What is an Ishihara plate?"}</h2>
        <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-sub)]">{isKo
          ? "이시하라 시노부 박사가 만든 색각 참고판으로, 1920년 원본이 공개 도메인으로 남아 있어요. 점으로 이루어진 원 안에 숫자가 숨어 있고, 그 숫자가 얼마나 잘 보이는지로 적록 계열의 색 차이를 가볍게 살펴볼 수 있어요."
          : "Dr. Shinobu Ishihara created these color-vision reference plates; the 1920 originals remain public domain. Numbers are hidden in dot patterns, and how easily you can read them offers a light-touch look at red–green color differences."}</p>
      </article>
      <article className="rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-s)]">
        <h2 className="text-[21px] font-semibold">{isKo ? "온라인 테스트로 알 수 있는 것과 없는 것" : "What an online test can and can't tell you"}</h2>
        <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-sub)]">{isKo
          ? "화면 밝기, 기기 색상 설정, 화질에 따라 결과가 달라질 수 있어요. 그래서 온라인 판은 색 차이를 가볍게 살펴보는 참고용이며, 정확한 확인은 안과에서 할 수 있어요."
          : "Screen brightness, device color settings, and image quality can all change the result. Online plates are a reference, not a clinical exam — an eye-care professional can give you an accurate assessment."}</p>
      </article>
    </section>

    <section className="mt-12 rounded-[var(--radius-l)] bg-[color-mix(in_srgb,var(--color-accent)_20%,white)] p-6 md:p-8">
      <p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "지금 바로 해볼 수 있어요" : "Try it now"}</p>
      <h2 className="mt-2 text-[22px] font-semibold">{isKo ? "NUNBIT에서 8장을 확인해요" : "Check eight plates on NUNBIT"}</h2>
      <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-[var(--color-text-sub)]">{isKo
        ? "공개 도메인 이시하라 판 8장으로 적록 계열의 색 차이를 살펴보고, 사진 비교에 쓸 시야까지 이어서 골라볼 수 있어요."
        : "Use eight public-domain Ishihara plates to get a light-touch look at red–green differences, then carry that straight into choosing a view for photo comparisons."}</p>
      <Link href="/find-my-view" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white">{isKo ? "8장 확인하러 가기" : "Check eight plates"} <span className="ml-2" aria-hidden="true">→</span></Link>
    </section>

    <section className="mt-12">
      <h2 className="text-[22px] font-semibold">{isKo ? "자주 묻는 점" : "Frequently asked"}</h2>
      <div className="mt-5 divide-y divide-[var(--color-border)] rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white px-6 shadow-[var(--shadow-s)]">
        {faq.map(([question, answer], index) => <details key={question} className="group py-5" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[15px] font-semibold"><span>{question}</span><span className="text-[20px] font-normal text-[var(--color-text-sub)] group-open:rotate-45">+</span></summary>
          <p className="max-w-[600px] pt-4 text-[14px] leading-6 text-[var(--color-text-sub)]">{answer}</p>
        </details>)}
      </div>
    </section>

    <section className="mt-10 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-8">
      <p className="text-[14px] text-[var(--color-text-sub)]">{isKo ? "이미 알고 있는 시야가 있다면" : "Already know your view?"}</p>
      <Link href="/translate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? "사진 번역해 보기" : "Translate a photo"}</Link>
    </section>
  </main>;
}
