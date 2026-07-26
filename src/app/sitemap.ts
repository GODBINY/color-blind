import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

const paths = [
  "",
  "/translate",
  "/simulate",
  "/color-pick",
  "/live",
  "/find-my-view",
  "/learn",
  "/learn/faq",
  "/learn/protanopia",
  "/learn/deuteranopia",
  "/learn/tritanopia",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return paths.flatMap((path) => routing.locales.map((locale) => ({
    url: new URL(`/${locale}${path}`, base).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/translate" || path === "/simulate" ? 0.9 : 0.7,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((alternateLocale) => [alternateLocale, new URL(`/${alternateLocale}${path}`, base).toString()]),
        ["x-default", new URL(`/en${path}`, base).toString()],
      ]),
    },
  })));
}
