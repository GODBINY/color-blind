import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh-TW", "ru", "fr", "de", "es", "pt"],
  defaultLocale: "en",
  // Page metadata and sitemap entries own hreflang so route-specific locale sets stay accurate.
  alternateLinks: false,
});
