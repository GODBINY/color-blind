import { setRequestLocale } from "next-intl/server";
import { ImageColorPicker } from "@/components/color-pick/ImageColorPicker";

export default async function ColorPickPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImageColorPicker locale={locale} />;
}
