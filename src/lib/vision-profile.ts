import type { VisionType } from "@/lib/color";

export const VISION_PROFILE_STORAGE_KEY = "nunbit.vision-profile";
const LEGACY_VISION_PROFILE_STORAGE_KEY = "iris.vision-profile";

export type VisionProfile = {
  visionType: VisionType;
  severity: number;
  source: "find-my-view";
};

const visionTypes: VisionType[] = ["protan", "deutan", "tritan", "monochromacy"];

export function readVisionProfile(): VisionProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(VISION_PROFILE_STORAGE_KEY) ?? localStorage.getItem(LEGACY_VISION_PROFILE_STORAGE_KEY);
    if (!stored) return null;
    const profile: unknown = JSON.parse(stored);
    if (!profile || typeof profile !== "object") return null;
    const { visionType, severity, source } = profile as Partial<VisionProfile>;
    if (!visionTypes.includes(visionType as VisionType) || typeof severity !== "number" || !Number.isFinite(severity) || source !== "find-my-view") return null;
    return { visionType: visionType as VisionType, severity: Math.max(0, Math.min(1, severity)), source };
  } catch {
    return null;
  }
}

export function saveVisionProfile(profile: VisionProfile) {
  localStorage.setItem(VISION_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
