"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";

type Axis = "protanopia" | "deuteranopia" | "tritanopia";
type Answer = "match" | "miss" | "unsure";

type Question = { axis: Axis; prompt: string; choices: string[]; correct: number; variant: "plate" | "patch" };

const axes: Axis[] = ["protanopia", "deuteranopia", "tritanopia"];

function getQuestions(isKo: boolean): Question[] {
  const text = isKo
    ? [
        ["이 도형은 무엇처럼 보이나요?", ["원", "삼각형", "잘 안 보여요"]],
        ["다른 하나를 골라 보세요.", ["첫 번째", "두 번째", "세 번째", "잘 안 보여요"]],
        ["가운데 무늬는 무엇처럼 보이나요?", ["8", "3", "잘 안 보여요"]],
        ["다른 하나를 골라 보세요.", ["첫 번째", "두 번째", "세 번째", "잘 안 보여요"]],
      ]
    : [
        ["What shape do you notice?", ["Circle", "Triangle", "I can’t make it out"]],
        ["Choose the one that feels different.", ["First", "Second", "Third", "I’m not sure"]],
        ["What do you notice in the center?", ["8", "3", "I can’t make it out"]],
        ["Choose the one that feels different.", ["First", "Second", "Third", "I’m not sure"]],
      ];
  return Array.from({ length: 12 }, (_, index) => {
    const source = text[index % text.length]!;
    const variant = index % 3 === 1 ? "patch" : "plate";
    const choices = source[1] as string[];
    return { axis: axes[index % axes.length]!, prompt: source[0] as string, choices, correct: index % (choices.length - 1), variant };
  });
}

function DotPlate({ axis, index }: { axis: Axis; index: number }) {
  const tone = axis === "tritanopia" ? ["#7897ad", "#d9c87d"] : axis === "protanopia" ? ["#bc846d", "#89995f"] : ["#ba876b", "#738d70"];
  const dots = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ x: (i * 31 + index * 17) % 172 + 14, y: (i * 47 + index * 13) % 172 + 14, r: 3 + ((i + index) % 5) })), [index]);
  return <svg role="img" aria-label="A softly colored dot pattern" viewBox="0 0 200 200" className="mx-auto size-52 max-w-full rounded-full bg-[#e8e1ce] shadow-[var(--shadow-s)]"><circle cx="100" cy="100" r="96" fill="#e8e1ce" />{dots.map((dot, i) => <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={tone[i % 2]} opacity={i % 4 === 0 ? 0.7 : 0.94} />)}<path d={index % 2 ? "M55 58 L145 142 M145 58 L55 142" : "M62 100a38 38 0 1 0 76 0a38 38 0 1 0-76 0"} fill="none" stroke={tone[1]} strokeWidth="12" strokeLinecap="round" opacity="0.86" /></svg>;
}

export function FindMyViewQuiz({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const questions = useMemo(() => getQuestions(isKo), [isKo]);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const question = questions[position];

  const result = useMemo(() => {
    const misses = { protanopia: 0, deuteranopia: 0, tritanopia: 0 };
    const totals = { protanopia: 0, deuteranopia: 0, tritanopia: 0 };
    answers.forEach((answer, index) => { const axis = questions[index]!.axis; totals[axis]++; if (answer === "miss" || answer === "unsure") misses[axis]++; });
    const ranked = axes.map((axis) => ({ axis, rate: totals[axis] ? misses[axis] / totals[axis] : 0 })).sort((a, b) => b.rate - a.rate);
    const top = ranked[0]!;
    if (top.rate < 0.5 || (ranked[1] && Math.abs(top.rate - ranked[1].rate) < 0.15)) return null;
    return { type: top.axis, severity: top.rate >= 0.75 ? 1 : 0.6 };
  }, [answers, questions]);

  function choose(choiceIndex: number) {
    const answer: Answer = choiceIndex === question!.choices.length - 1 ? "unsure" : choiceIndex === question!.correct ? "match" : "miss";
    const next = [...answers, answer];
    setAnswers(next);
    if (position + 1 === questions.length) setFinished(true); else setPosition(position + 1);
  }

  function saveSetting() {
    if (!result) return;
    localStorage.setItem("iris.vision-profile", JSON.stringify({ visionType: result.type.replace("opia", ""), severity: result.severity, source: "find-my-view" }));
  }

  const labels: Record<Axis, string> = { protanopia: "Protan", deuteranopia: "Deutan", tritanopia: "Tritan" };

  if (!started) return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View</p><h1 className="mt-3 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{isKo ? "내 색의 특징을\n차분히 살펴봐요" : "A quiet way to\nexplore your view"}</h1><p className="mt-5 max-w-[560px] whitespace-pre-line text-[16px] leading-[26px] text-[var(--color-text-sub)]">{isKo ? "12개의 짧은 질문으로, 어떤 색의 차이가 더 가깝게 느껴지는지 살펴봐요.\n이 화면의 밝기와 설정에 따라 달라질 수 있어요." : "Twelve short questions help you notice which color differences feel closer. Your screen brightness and settings can affect what you see."}</p><div className="mt-10 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-m)]"><p className="text-[15px] font-semibold">{isKo ? "시작하기 전에" : "Before you begin"}</p><ul className="mt-4 space-y-3 text-[14px] leading-6 text-[var(--color-text-sub)]"><li>✓ {isKo ? "밝기가 편안한 곳에서 화면을 보세요." : "View your screen somewhere comfortably lit."}</li><li>✓ {isKo ? "잘 안 보이면 ‘잘 안 보여요’를 골라도 괜찮아요." : "It is fine to choose “I’m not sure.”"}</li><li>✓ {isKo ? "의료적 확인을 대신하지 않아요." : "This does not replace a clinical assessment."}</li></ul><button onClick={() => setStarted(true)} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-6 text-[16px] font-medium text-white shadow-[var(--shadow-s)] transition-transform hover:-translate-y-0.5 sm:w-auto">{isKo ? "질문 시작하기" : "Begin the questions"} <span className="ml-2" aria-hidden="true">→</span></button></div></section>;

  if (finished) return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View · 12 / 12</p><div className="mt-5 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-m)] md:p-10"><p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "가장 가까운 시야" : "Most likely"}</p>{result ? <><h1 className="mt-3 text-[40px] font-semibold tracking-[-0.04em]">{labels[result.type]}</h1><p className="mt-2 text-[15px] text-[var(--color-text-sub)]">{result.type === "tritanopia" ? (isKo ? "청황 계열의 색 차이가 가깝게 느껴질 가능성이 있어요." : "Blue–yellow differences may feel closer together.") : (isKo ? `적록 계열 중 ${labels[result.type]}에 가까운 가능성이 있어요.` : `A red–green view closer to ${labels[result.type]} is possible.`)}</p><p className="mt-6 rounded-[var(--radius-m)] bg-[var(--color-bg)] p-4 text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "이 짧은 확인은 하나의 출발점이에요. 더 정확한 확인은 안과에서 할 수 있어요." : "This quick check is only a starting point. An eye-care professional can offer a more accurate assessment."}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link onClick={saveSetting} href="/translate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white">{isKo ? "이 설정으로 시작하기" : "Use this setting"}</Link><Link href={`/learn/${result.type}`} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? `${labels[result.type]} 알아보기` : `Learn about ${labels[result.type]}`}</Link></div></> : <><h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em]">{isKo ? "한 가지로 정하기 어려워요" : "There isn’t one clear match"}</h1><p className="mt-3 text-[15px] leading-6 text-[var(--color-text-sub)]">{isKo ? "답이 여러 방향으로 비슷했어요. 화면 환경이나 그날의 컨디션도 영향을 줄 수 있어요." : "Your answers were spread across a few directions. Your screen and the day you are having can play a part, too."}</p><Link href="/learn" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-[15px] font-medium">{isKo ? "색의 시야 알아보기" : "Explore different views"}</Link></>}</div><button onClick={() => { setStarted(false); setPosition(0); setAnswers([]); setFinished(false); }} className="mt-5 text-[14px] underline underline-offset-4">{isKo ? "처음부터 다시 보기" : "Start again"}</button></section>;

  return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16"><div className="flex items-center justify-between text-[13px] font-medium text-[var(--color-text-sub)]"><span>Find My View</span><span>{position + 1} / {questions.length}</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-border)]"><div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${((position + 1) / questions.length) * 100}%` }} /></div><div className="mt-8 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-m)] md:p-10">{question!.variant === "plate" ? <DotPlate axis={question!.axis} index={position} /> : <div className="mx-auto grid max-w-[360px] grid-cols-3 gap-3 py-8">{[0, 1, 2].map((i) => <div key={i} className="aspect-square rounded-[var(--radius-m)] border-2 border-[var(--color-border)]" style={{ background: question!.axis === "tritanopia" ? ["#9aa9b7", "#a5b4a1", "#d5c98d"][i] : ["#a77f68", "#8d986e", "#aa8c66"][i] }} aria-label={`${i + 1}`} />)}</div>}<h1 className="mt-8 text-[24px] font-semibold tracking-[-0.03em]">{question!.prompt}</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{question!.choices.map((choice, index) => <button key={choice} onClick={() => choose(index)} className="group flex min-h-14 items-center justify-between rounded-[var(--radius-m)] border border-[var(--color-border)] px-5 text-left text-[15px] font-medium transition-all hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-s)]"><span>{choice}</span><span className="grid size-5 place-items-center rounded-full border border-[var(--color-border)] text-[11px] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">✓</span></button>)}</div></div><p className="mt-5 text-center text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "색만으로 답을 고를 필요는 없어요. 잘 안 보이면 그대로 알려 주세요." : "You do not have to guess from color alone. Choose “I’m not sure” when it feels right."}</p></section>;
}
