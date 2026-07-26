import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "faq");
}

const questions = {
  ko: [
    ["색을 다르게 본다는 건 무슨 뜻인가요?", "색 사이의 거리가 모두에게 똑같이 느껴지지는 않는다는 뜻이에요. 어떤 색들은 더 가깝게, 어떤 밝기는 다르게 느껴질 수 있어요."],
    ["Protan, Deutan, Tritan은 무엇인가요?", "색의 차이가 다르게 느껴지는 방향을 가리키는 이름이에요. Protan과 Deutan은 적록 계열, Tritan은 청황 계열의 차이와 관련이 있어요."],
    ["‘적녹색약’은 하나의 유형인가요?", "보통 Protan과 Deutan을 함께 부르는 큰 범주예요. 실제 경험과 차이의 정도는 한 사람마다 다를 수 있어요."],
    ["Find My View는 무엇을 알려주나요?", "짧은 화면 기반 질문으로, 어떤 색의 차이가 가까웠는지 가볍게 살펴보는 출발점이에요. 의료적 확인을 대신하지는 않아요."],
    ["사진과 화면 설정도 영향을 주나요?", "네. 화면 밝기, 야간 모드, 주변 빛, 사진의 색감에 따라 차이가 달라 보일 수 있어요."],
    ["색을 다르게 보는 사람도 모든 색을 못 보나요?", "그렇지 않아요. 대부분은 많은 색을 보고, 특정 색 사이의 구분이나 밝기를 다르게 경험해요."],
    ["어떻게 더 잘 전할 수 있나요?", "중요한 정보에는 색 이름, 위치, 아이콘, 패턴을 함께 써 보세요. 사진은 구분이 쉬운 대비를 더한 버전도 전할 수 있어요."],
    ["NUNBIT은 사진을 어디에 저장하나요?", "NUNBIT의 사진 작업은 이 기기 안에서 이뤄지도록 설계되어 있어요. 사진을 서버에 올리지 않아요."],
    ["정확한 확인이 필요하면 어떻게 하나요?", "시야에 대한 정확한 확인이나 상담이 필요하다면 안과에 문의해 보세요."],
    ["이 주제를 어떻게 말하면 좋을까요?", "‘색을 다르게 보는 방식’처럼 사람을 먼저 두는 말이 좋아요. 상대가 어떤 색을 어떻게 느끼는지 직접 묻는 것도 좋은 시작이에요."],
  ],
  en: [
    ["What does it mean to see color differently?", "Color distances do not feel identical to everyone. Some colors can sit closer together, and brightness can feel different too."],
    ["What are Protan, Deutan, and Tritan?", "They name directions in which color differences can feel different. Protan and Deutan relate to red–green differences; Tritan relates to blue–yellow differences."],
    ["Is red–green color blindness one type?", "It is often used as an umbrella term for Protan and Deutan views. The degree and lived experience vary from person to person."],
    ["What does Find My View tell me?", "It is a gentle starting point: short screen-based questions about which color differences felt close. It does not replace clinical assessment."],
    ["Can my photo or display change things?", "Yes. Brightness, night mode, surrounding light, and a photo’s color treatment can all change what feels distinct."],
    ["Does someone who sees color differently see no color?", "No. Most people see many colors; certain separations or brightness relationships simply feel different."],
    ["How can I communicate more clearly?", "Pair important color with a name, position, icon, or pattern. With photos, you can also share a version with clearer contrast."],
    ["Where does NUNBIT keep my photos?", "NUNBIT is designed to process photos on this device. Your photo is not uploaded to a server."],
    ["What if I need a more accurate answer?", "For an accurate assessment or personal advice, an eye-care professional can help."],
    ["What is a considerate way to talk about this?", "Put the person first: ‘a way of seeing color differently’ is a good start. Asking how they experience a color is even better."],
  ],
};

export default async function LearnFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === "ko";
  const entries = questions[isKo ? "ko" : "en"];
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entries.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return <main className="mx-auto max-w-[820px] px-5 pb-20 pt-8 md:pb-28 md:pt-16"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><Link href="/learn" className="text-[14px] text-[var(--color-text-sub)] underline underline-offset-4">← {isKo ? "Learn으로" : "Back to Learn"}</Link><p className="mt-8 text-[13px] font-medium text-[var(--color-text-sub)]">Learn · FAQ</p><h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{isKo ? "색을 나누는 대신,\n이해를 더해요" : "A little more clarity,\nwithout drawing lines"}</h1><p className="mt-5 text-[16px] leading-[26px] text-[var(--color-text-sub)]">{isKo ? "색을 다르게 보는 방식과 NUNBIT에 대해 자주 묻는 질문을 모았어요." : "A few common questions about seeing color differently and about NUNBIT."}</p><div className="mt-10 divide-y divide-[var(--color-border)] rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white px-6 shadow-[var(--shadow-s)]">{entries.map(([question, answer], index) => <details key={question} className="group py-5" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[16px] font-semibold"><span>{question}</span><span className="text-[20px] font-normal text-[var(--color-text-sub)] group-open:rotate-45">+</span></summary><p className="max-w-[660px] pt-4 text-[15px] leading-7 text-[var(--color-text-sub)]">{answer}</p></details>)}</div></main>;
}
