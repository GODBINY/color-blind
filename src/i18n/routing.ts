import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh-TW", "ru", "fr", "de", "es", "pt"],
  defaultLocale: "en",
});
