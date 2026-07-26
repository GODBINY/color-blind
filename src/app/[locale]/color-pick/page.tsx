import { setRequestLocale } from "next-intl/server";
import { ImageColorPicker } from "@/components/color-pick/ImageColorPicker";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "colorPick");
}

export default async function ColorPickPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImageColorPicker locale={locale} />;
}
