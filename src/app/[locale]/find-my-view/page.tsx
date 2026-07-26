import { setRequestLocale } from "next-intl/server";
import { FindMyViewQuiz } from "@/components/find-my-view/FindMyViewQuiz";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "findMyView");
}

export default async function FindMyViewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <main><FindMyViewQuiz locale={locale} /></main>;
}
