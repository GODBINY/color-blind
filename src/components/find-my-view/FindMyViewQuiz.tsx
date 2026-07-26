"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getVisionLabels } from "@/lib/vision-labels";
import { saveVisionProfile } from "@/lib/vision-profile";
import { scoreVisionResponses } from "@/lib/vision-score";

type SelectableVision = "protan" | "deutan" | "tritan";

const ishiharaSource = "https://commons.wikimedia.org/wiki/File:NDL1679314_The_series_of_plates_designed_as_tests_for_colour-blindness,_by_Dr._Shinobu_Ishihara.pdf";

const plates = [
  { id: "1", src: "/images/ishihara-plate-01.jpg", answer: "12" },
  { id: "2", src: "/images/ishihara-plate-02.jpg", answer: "8" },
  { id: "3", src: "/images/ishihara-plate-03.jpg", answer: "6" },
  { id: "4", src: "/images/ishihara-plate-04.jpg", answer: "5" },
  { id: "5", src: "/images/ishihara-plate-05.jpg", answer: "74" },
  { id: "6", src: "/images/ishihara-plate-06.jpg", answer: "2" },
  { id: "7", src: "/images/ishihara-plate-07.jpg", answer: "6" },
  { id: "8", src: "/images/ishihara-plate-08.jpg", answer: "5" },
] as const;

export function FindMyViewQuiz({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const labels = getVisionLabels(locale);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [selectedVision, setSelectedVision] = useState<SelectableVision | null>(null);
  const plate = plates[position];
  const finished = responses.length === plates.length;
  const score = scoreVisionResponses(plates, responses);
  const mayHaveRedGreenDifference = score.incorrect.length >= 4;

  function submit() {
    if (!value.trim()) return;
    const next = [...responses, value.trim()];
    setResponses(next);
    setValue("");
    if (next.length < plates.length) setPosition((current) => current + 1);
  }

  function saveSetting() {
    if (!selectedVision) return;
    saveVisionProfile({ visionType: selectedVision, severity: 1, source: "find-my-view" });
  }

  function reset() {
    setStarted(false);
    setPosition(0);
    setResponses([]);
    setValue("");
    setSelectedVision(null);
  }

  if (!started) {
    return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16">
      <p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View</p>
      <h1 className="mt-3 whitespace-pre-line text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{isKo ? "색약·색맹 시야를\n사진으로 확인해요" : "Set a color-vision view\nfor photo comparisons"}</h1>
      <p className="mt-5 max-w-[580px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{isKo ? "1920년 공개 도메인 이시하라 원본 8장으로 적록 계열의 색 차이를 가볍게 확인한 뒤, 사진 비교에 쓸 시야를 직접 골라요." : "Use eight public-domain Ishihara plates from the 1920 original as a quick red–green screen, then choose the view you want to use for photo comparisons."}</p>
      <div className="mt-10 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)]">
        <p className="text-[15px] font-semibold">{isKo ? "시작하기 전에" : "Before you begin"}</p>
        <ul className="mt-4 space-y-3 text-[14px] leading-6 text-[var(--color-text-sub)]">
          <li>✓ {isKo ? "화면 밝기를 편안한 정도로 맞추고 야간 모드·색상 필터를 꺼 주세요." : "Set a comfortable brightness and turn off night mode or color filters."}</li>
          <li>✓ {isKo ? "각 판은 보이는 숫자만 입력해 주세요. 답을 모르면 ‘?’를 입력해도 돼요." : "Enter only the number you see on each plate. If you are unsure, you can enter “?”."}</li>
          <li>✓ {isKo ? "온라인 판은 참고용이며 Protan·Deutan·Tritan을 확정하지 않아요." : "Online plates are a reference only; they do not identify Protan, Deutan, or Tritan."}</li>
        </ul>
        <button onClick={() => setStarted(true)} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-6 text-[16px] font-medium text-white shadow-[var(--shadow-s)] transition-transform hover:-translate-y-0.5 sm:w-auto">{isKo ? "8장 확인하기" : "Check eight plates"}<span className="ml-2" aria-hidden="true">→</span></button>
      </div>
    </section>;
  }

  if (!finished && plate) {
    return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16">
      <div className="flex items-center justify-between text-[13px] font-medium text-[var(--color-text-sub)]"><span>Find My View</span><span>{position + 1} / {plates.length}</span></div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-border)]"><div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${((position + 1) / plates.length) * 100}%` }} /></div>
      <div className="mt-8 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)] md:p-10">
        <p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "적록 계열 참고 판" : "Red–green reference plate"}</p>
        <figure className="mx-auto mt-6 max-w-[440px]">
          <Image src={plate.src} alt={isKo ? `공개 도메인 이시하라 색각 판 ${plate.id}` : `Public-domain Ishihara color plate ${plate.id}`} width={1400} height={1400} className="h-auto w-full rounded-[var(--radius-l)] shadow-[var(--shadow-s)]" priority={position === 0} />
          <figcaption className="mt-3 text-[12px] leading-5 text-[var(--color-text-sub)]">{isKo ? <>1920년 공개 도메인 이시하라 {plate.id}번 판 · <a className="underline underline-offset-4" href={ishiharaSource} target="_blank" rel="noreferrer">Wikimedia Commons 원본</a></> : <>1920 public-domain Ishihara plate {plate.id} · <a className="underline underline-offset-4" href={ishiharaSource} target="_blank" rel="noreferrer">Wikimedia Commons original</a></>}</figcaption>
        </figure>
        <label className="mt-8 block text-[24px] font-semibold tracking-[-0.03em]" htmlFor="plate-answer">{isKo ? "어떤 숫자가 보이나요?" : "Which number do you see?"}</label>
        <div className="mt-5 flex gap-2"><input id="plate-answer" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} inputMode="text" autoComplete="off" maxLength={2} placeholder={isKo ? "숫자 또는 ?" : "Number or ?"} className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-s)] border border-[var(--color-border)] bg-white px-4 text-[16px] font-medium outline-none placeholder:text-[var(--color-text-sub)] focus-visible:border-[var(--color-primary)]" /><button type="button" onClick={submit} disabled={!value.trim()} className="min-h-12 rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-45">{isKo ? "다음" : "Next"}</button></div>
      </div>
      <button type="button" onClick={reset} className="mt-5 text-[14px] underline underline-offset-4">{isKo ? "처음으로" : "Back"}</button>
    </section>;
  }

  return <section className="mx-auto max-w-[720px] px-5 pb-20 pt-8 md:pt-16">
    <p className="text-[13px] font-medium text-[var(--color-text-sub)]">Find My View · {plates.length} / {plates.length}</p>
    <div className="mt-5 rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)] md:p-10">
      <p className="text-[13px] font-medium text-[var(--color-text-sub)]">{isKo ? "사진 비교를 위한 시야 설정" : "Set a view for photo comparisons"}</p>
      <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em]">{score.incorrect.length > 0 ? (isKo ? `${plates.length}장 중 ${score.incorrect.length}장이 기준 숫자와 달랐어요` : `${score.incorrect.length} of ${plates.length} answers differed from the reference`) : (isKo ? `${plates.length}장 모두 기준 숫자와 같았어요` : `All ${plates.length} answers matched the reference`)}</h1>
      <p className="mt-3 text-[15px] leading-6 text-[var(--color-text-sub)]">{mayHaveRedGreenDifference ? (isKo ? <><strong className="font-semibold text-[var(--color-primary)]">적록 계열</strong>의 색 차이가 비슷하게 느껴질 수 있어요. 이 결과는 화면과 판에 따라 달라질 수 있으므로, 알고 있는 유형이나 사진에서 더 가까운 시야를 직접 골라 주세요.</> : <><strong className="font-semibold text-[var(--color-primary)]">Red–green differences</strong> may feel closer together. Displays and online plates can vary, so choose the type you already know or the view that feels closest in a photo.</>) : (isKo ? "온라인 판에서 큰 차이가 드러나지 않았어요. 이 결과만으로 색각 유형을 확정할 수는 없으니, 사진 비교에 필요한 시야를 직접 골라 주세요." : "No large difference appeared on these online plates. This does not confirm a color-vision type, so choose the view you need for photo comparisons.")}</p>
      {score.incorrect.length > 0 && <details className="mt-5 rounded-[var(--radius-s)] bg-[var(--color-bg)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-sub)]">
        <summary className="cursor-pointer font-medium text-[var(--color-primary)]">{isKo ? "입력한 답과 기준 숫자 확인" : "Review your answers against the reference"}</summary>
        <ul className="mt-3 space-y-1.5">
          {score.incorrect.map((entry) => <li key={entry.id}>{isKo ? `${entry.id}번 판 · 입력 ${entry.response || "—"} / 기준 ${entry.answer}` : `Plate ${entry.id} · you entered ${entry.response || "—"} / reference ${entry.answer}`}</li>)}
        </ul>
      </details>}
      <fieldset className="mt-8">
        <legend className="text-[16px] font-semibold">{isKo ? "사진 비교에 쓸 시야" : "View to use for photo comparisons"}</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{(["protan", "deutan", "tritan"] as const).map((type) => <button key={type} type="button" onClick={() => setSelectedVision(type)} aria-pressed={selectedVision === type} className={`min-h-12 rounded-[var(--radius-s)] border px-3 text-left text-[14px] font-medium transition-colors ${selectedVision === type ? "border-[var(--color-primary)] bg-[var(--color-bg)]" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"}`}>{labels.types[type]}</button>)}</div>
      </fieldset>
      <p className="mt-4 text-[13px] leading-5 text-[var(--color-text-sub)]">{isKo ? "적록색약이라면 Protan과 Deutan을 사진으로 각각 비교해 보고 더 가까운 쪽을 골라 보세요." : "For red–green color vision differences, compare Protan and Deutan with a photo and choose the closer view."}</p>
      <Link href="/translate" onClick={(event) => { if (!selectedVision) event.preventDefault(); else saveSetting(); }} aria-disabled={!selectedVision} className={`mt-7 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-m)] px-5 text-[15px] font-medium text-white ${selectedVision ? "bg-[var(--color-primary)]" : "cursor-not-allowed bg-[var(--color-text-sub)] opacity-55"}`}>{isKo ? "이 시야로 사진 보기" : "Preview photos this way"}<span className="ml-2" aria-hidden="true">→</span></Link>
    </div>
    <button type="button" onClick={reset} className="mt-5 text-[14px] underline underline-offset-4">{isKo ? "처음부터 다시 보기" : "Start again"}</button>
  </section>;
}
