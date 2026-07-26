import { ImageEditor } from "@/components/editor/ImageEditor";
import { setRequestLocale } from "next-intl/server";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "simulate");
}

export default async function SimulatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImageEditor mode="simulate" locale={locale} />;
}
