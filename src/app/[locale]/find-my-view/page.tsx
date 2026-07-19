import { setRequestLocale } from "next-intl/server";
import { FindMyViewQuiz } from "@/components/find-my-view/FindMyViewQuiz";

export default async function FindMyViewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main><FindMyViewQuiz locale={locale} /></main>;
}
