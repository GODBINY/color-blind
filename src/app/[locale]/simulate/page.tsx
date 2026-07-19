import { ImageEditor } from "@/components/editor/ImageEditor";
import { setRequestLocale } from "next-intl/server";

export default async function SimulatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ImageEditor mode="simulate" locale={locale} />;
}
