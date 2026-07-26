import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NUNBIT — Colorblind Photo Tools",
    short_name: "NUNBIT",
    description: "Translate photos for colorblind viewers, simulate color vision, and extract image colors on your device.",
    start_url: "/en",
    display: "standalone",
    background_color: "#F7F7FC",
    theme_color: "#F7F7FC",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
