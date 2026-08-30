import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { routing } from "@/i18n/routing";

describe("SEO route discovery", () => {
  it("keeps hreflang generation in page metadata and the sitemap", () => {
    expect(routing.alternateLinks).toBe(false);
  });

  it("publishes only unique, genuinely localized sitemap URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const learnUrls = urls.filter((url) => new URL(url).pathname.includes("/learn"));

    expect(entries).toHaveLength(64);
    expect(new Set(urls).size).toBe(entries.length);
    expect(learnUrls).toHaveLength(10);
    expect(learnUrls.every((url) => /^\/(ko|en)\/learn(?:\/|$)/.test(new URL(url).pathname))).toBe(true);
  });

  it("limits Learn hreflang alternates to Korean, English, and x-default", () => {
    const learnEntry = sitemap().find((entry) => entry.url.endsWith("/ko/learn/deuteranopia"));
    const languages = learnEntry?.alternates?.languages;

    expect(languages).toBeDefined();
    expect(Object.keys(languages ?? {}).sort()).toEqual(["en", "ko", "x-default"]);
    expect(languages?.["x-default"]).toBe("https://nunbit.withint.com/en/learn/deuteranopia");
  });
});
