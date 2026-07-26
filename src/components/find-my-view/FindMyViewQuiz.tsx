"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getVisionLabels } from "@/lib/vision-labels";

type Axis = "protanopia" | "deuteranopia" | "tritanopia";
type Answer = "match" | "miss" | "unsure";

type Question = {
  axis: Axis;
  colors: readonly [string, string, string];
  correct: number;
};

const axes: Axis[] = ["protanopia", "deuteranopia", "tritanopia"];

// These are Iris-made comparison cards, not copied pseudoisochromatic plates
// and not a medical instrument. Each set intentionally asks about one simple
// local colour distinction only.
const studies: Record<Axis, readonly (readonly [string, string, string])[]> = {
  protanopia: [
    ["#a95661", "#6f7d49", "#a95661"],
    ["#b96855", "#748b52", "#b96855"],
    ["#97505e", "#667946", "#97505e"],
    ["#bd7554", "#72844f", "#bd7554"],
  ],
  deuteranopia: [
    ["#aa604c", "#597a54", "#aa604c"],
    ["#b66c50", "#63824f", "#b66c50"],
    ["#9e5849", "#52734d", "#9e5849"],
    ["#bd754f", "#6b8754", "#bd754f"],
  ],
  tritanopia: [
    ["#557da1", "#786ca2", "#557da1"],
    ["#6289ab", "#8575a7", "#6289ab"],
    ["#4d7598", "#71649b", "#4d7598"],
    ["#6d91ad", "#8c7aae", "#6d91ad"],
  ],
};

function getQuestions(): Question[] {
  return Array.from({ length: 12 }, (_, index) => {
    const axis = axes[index % axes.length]!;
    return { axis, colors: studies[axis][Math.floor(index / axes.length)]!, correct: 1 };
  });
}

function ColorStudy({ colors, label }: { colors: Question["colors"]; label: string }) {
  return (
    <figure aria-label={label} className="mx-auto grid max-w-[480px] grid-cols-3 gap-3 sm:gap-5">
      {colors.map((color, index) => (
        <div key={`${color}-${index}`} className="aspect-[4/5] overflow-hidden rounded-[var(--radius-m)] border border-black/5 shadow-[var(--shadow-s)]" style={{ backgroundColor: color }}>
          <div className="h-full w-full opacity-25" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,.35), transparent 55%)" }} />
        </div>
      ))}
    </figure>
  );
}

export function FindMyViewQuiz({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const visionLabels = getVisionLabels(locale);
  const questions = useMemo(() => getQuestions(), []);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const question = questions[position];
  const labels: Record<Axis, string> = { protanopia: visionLabels.types.protan, deuteranopia: visionLabels.types.deutan, tritanopia: visionLabels.types.tritan };

  const result = useMemo(() => {
    const misses = { protanopia: 0, deuteranopia: 0, tritanopia: 0 };
    const totals = { protanopia: 0, deuteranopia: 0, tritanopia: 0 };
    answers.forEach((answer, index) => {
      const axis = questions[index]!.axis;
      totals[axis]++;
      if (answer !== "match") misses[axis]++;
    });
    const ranked = axes
      .map((axis) => ({ axis, rate: totals[axis] ? misses[axis] / totals[axis] : 0 }))
      .sort((a, b) => b.rate - a.rate);
    const top = ranked[0]!;
    if (top.rate < 0.5 || Math.abs(top.rate - ranked[1]!.rate) < 0.25) return null;
    return { type: top.axis, severity: top.rate >= 0.75 ? 1 : 0.6 };
  }, [answers, questions]);

  function choose(choiceIndex: number) {
    const answer: Answer = choiceIndex === 3 ? "unsure" : choiceIndex === question!.correct ? "match" : "miss";
    const next = [...answers, answer];
    setAnswers(next);
    if (position + 1 === questions.length) setFinished(true);
    else setPosition(position + 1);
  }

  function saveSetting() {
    if (!result) return;
    localStorage.setItem("iris.vision-profile", JSON.stringify({ visionType: result.type.replace("opia", ""), severity: result.severity, source: "find-my-view" }));
  }

  if (!started) {
    return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View</p><h1 className="mt-3 whitespace-pre-line text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{isKo ? "색의 차이를\n천천히 살펴봐요" : "Take a quiet look\nat colour differences"}</h1><p className="mt-5 max-w-[580px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{isKo ? "색 이름을 맞히는 검사가 아니라, 비슷하게 느껴지는 색의 차이를 살펴보는 짧은 비교예요." : "This is a short comparison of colour differences, not a test of colour names."}</p><div className="mt-10 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)]"><p className="text-[15px] font-semibold">{isKo ? "시작하기 전에" : "Before you begin"}</p><ul className="mt-4 space-y-3 text-[14px] leading-6 text-[var(--color-text-sub)]"><li>✓ {isKo ? "화면 밝기를 편안한 정도로 맞춰 주세요." : "Set your screen to a comfortable brightness."}</li><li>✓ {isKo ? "잘 모르겠으면 ‘잘 모르겠어요’를 골라도 괜찮아요." : "It is fine to choose “I’m not sure.”"}</li><li>✓ {isKo ? "의학적 검사나 진단을 대신하지 않아요." : "It does not replace a clinical colour-vision assessment."}</li></ul><button onClick={() => setStarted(true)} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-6 text-[16px] font-medium text-white shadow-[var(--shadow-s)] transition-transform hover:-translate-y-0.5 sm:w-auto">{isKo ? "비교 시작하기" : "Start comparing"}<span className="ml-2" aria-hidden="true">→</span></button></div></section>;
  }

  if (finished) {
    return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View · 12 / 12</p><div className="mt-5 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)] md:p-10"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "가까운 비교 프로필" : "Closest comparison profile"}</p>{result ? <><h1 className="mt-3 text-[40px] font-semibold tracking-[-0.04em]">{labels[result.type]}</h1><p className="mt-2 text-[15px] text-[var(--color-text-sub)]">{result.type === "tritanopia" ? (isKo ? "청황 계열의 차이가 비슷하게 느껴질 수 있어요." : "Blue–yellow differences may feel closer together.") : (isKo ? "적록 계열의 차이가 비슷하게 느껴질 수 있어요." : "Red–green differences may feel closer together.")}</p><p className="mt-6 rounded-[var(--radius-m)] bg-[var(--color-bg)] p-4 text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "이 결과는 사진을 어떤 시야로 미리 볼지 정하는 출발점이에요. 실제 체감은 사람과 화면 환경에 따라 달라질 수 있어요." : "This is a starting point for choosing a preview. What feels distinct can vary by person and display."}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link onClick={saveSetting} href="/translate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white">{isKo ? "이 시야로 사진 보기" : "Preview photos this way"}<span className="ml-2" aria-hidden="true">→</span></Link><Link href={`/learn/${result.type}`} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? `${labels[result.type]} 알아보기` : `Learn about ${labels[result.type]}`}</Link></div></> : <><h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em]">{isKo ? "한 가지로 정하지 않아도 괜찮아요" : "It does not need one label"}</h1><p className="mt-3 text-[15px] leading-6 text-[var(--color-text-sub)]">{isKo ? "여러 색의 차이가 비슷하게 느껴졌어요. Translate에서 Protan과 Deutan을 직접 바꿔 보며 더 편한 쪽을 골라 보세요." : "A few differences felt similarly close. In Translate, compare Protan and Deutan directly and choose the more comfortable view."}</p><Link href="/translate" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? "사진으로 직접 비교하기" : "Compare with a photo"}</Link></>}</div><button onClick={() => { setStarted(false); setPosition(0); setAnswers([]); setFinished(false); }} className="mt-5 text-[14px] underline underline-offset-4">{isKo ? "처음부터 다시 보기" : "Start again"}</button></section>;
  }

  const choices = isKo ? ["첫 번째", "가운데", "세 번째", "잘 모르겠어요"] : ["First", "Middle", "Third", "I’m not sure"];
  return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><div className="flex items-center justify-between text-[13px] font-medium text-[var(--color-text-sub)]"><span>Find My View</span><span>{position + 1} / {questions.length}</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-border)]"><div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${((position + 1) / questions.length) * 100}%` }} /></div><div className="mt-8 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)] md:p-10"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "색의 차이" : "Colour difference"}</p><ColorStudy colors={question!.colors} label={isKo ? "서로 비슷한 세 개의 색 카드" : "Three nearby colour cards"} /><h1 className="mt-8 text-[24px] font-semibold tracking-[-0.03em]">{isKo ? "조금 다르게 느껴지는 카드를 골라 보세요" : "Choose the card that feels a little different"}</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{choices.map((choice, index) => <button key={choice} onClick={() => choose(index)} className="group flex min-h-14 items-center justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-left text-[15px] font-medium transition-all hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-s)]"><span>{choice}</span><span className="grid size-5 place-items-center rounded-full border border-[var(--color-border)] text-[11px] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span></button>)}</div></div><p className="mt-5 text-center text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "정답을 맞히는 화면이 아니에요. 편하게 느껴지는 대로 골라 주세요." : "There is no need to get this right. Choose what feels closest."}</p></section>;
}
