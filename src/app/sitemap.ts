import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { learnLocales } from "@/lib/learn/content";
import { LEARN_ARTICLE_DATES, siteUrl } from "@/lib/seo";

const paths = [
  { path: "", lastModified: "2026-08-16T01:29:42+09:00", locales: routing.locales },
  { path: "/translate", lastModified: "2026-08-16T01:29:42+09:00", locales: routing.locales },
  { path: "/simulate", lastModified: "2026-08-16T01:29:42+09:00", locales: routing.locales },
  { path: "/color-pick", lastModified: "2026-07-27T23:02:23+09:00", locales: routing.locales },
  { path: "/live", lastModified: "2026-07-26T19:20:42+09:00", locales: routing.locales },
  { path: "/find-my-view", lastModified: "2026-07-27T23:02:23+09:00", locales: routing.locales },
  { path: "/learn", lastModified: LEARN_ARTICLE_DATES.modified, locales: learnLocales },
  { path: "/learn/faq", lastModified: LEARN_ARTICLE_DATES.modified, locales: learnLocales },
  { path: "/learn/protanopia", lastModified: LEARN_ARTICLE_DATES.modified, locales: learnLocales },
  { path: "/learn/deuteranopia", lastModified: LEARN_ARTICLE_DATES.modified, locales: learnLocales },
  { path: "/learn/tritanopia", lastModified: LEARN_ARTICLE_DATES.modified, locales: learnLocales },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return paths.flatMap(({ path, lastModified, locales }) => locales.map((locale) => ({
    url: new URL(`/${locale}${path}`, base).toString(),
    lastModified: new Date(lastModified),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/translate" || path === "/simulate" ? 0.9 : 0.7,
    alternates: {
      languages: Object.fromEntries([
        ...locales.map((alternateLocale) => [alternateLocale, new URL(`/${alternateLocale}${path}`, base).toString()]),
        ["x-default", new URL(`/en${path}`, base).toString()],
      ]),
    },
  })));
}
