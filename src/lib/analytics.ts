export type AnalyticsEvent =
  | "home_translation_cta_clicked"
  | "home_translation_photo_added"
  | "home_color_picker_opened"
  | "home_simulation_opened"
  | "photo_translation_started"
  | "photo_translation_completed"
  | "translated_image_saved"
  | "photo_simulation_started"
  | "photo_simulation_completed"
  | "simulated_image_saved"
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
  const locale = window.location.pathname.split("/").filter(Boolean)[0] ?? "unknown";
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    locale,
    ...parameters,
  });
}
