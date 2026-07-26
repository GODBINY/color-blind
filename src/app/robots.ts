import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: routing.locales.map((locale) => `/${locale}/dev/`),
    },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
