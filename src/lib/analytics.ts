export type AnalyticsEvent =
  | "photo_translation_started"
  | "photo_translation_completed"
  | "translated_image_saved"
  | "color_picker_started"
  | "color_sample_added"
  | "color_sample_exported"
  | "find_my_view_started"
  | "find_my_view_completed"
  | "find_my_view_profile_saved"
  | "kofi_support_clicked";

type EventParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: AnalyticsEvent, parameters: EventParameters = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...parameters });
}
