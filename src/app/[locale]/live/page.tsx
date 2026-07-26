import { setRequestLocale } from "next-intl/server";
import { LiveCamera } from "@/components/live/LiveCamera";
import { seoMetadata, type AppLocale } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return seoMetadata(locale as AppLocale, "live");
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = locale === "en"
    ? {
        eyebrow: "A closer look, right now",
        title: "Live Camera",
        body: "Tap any point in the frame to see its RGB and HEX values.",
        start: "Turn on camera",
        starting: "Opening camera…",
        flip: "Switch camera",
        front: "Front camera",
        back: "Back camera",
        colorAtPoint: "Picked color",
        pickHint: "Tap anywhere in the camera frame to pick a new color.",
        unsupportedTitle: "This camera is not available here",
        unsupportedBody: "You can still explore a photo from your device in Translate.",
        deniedTitle: "Camera access is needed to continue",
        deniedBody: "Allow camera access in your browser settings, or try this with a photo instead.",
        translate: "Use a photo instead",
        tryAgain: "Try again",
        privacy: "The camera stays on this device. Nothing is recorded or sent anywhere.",
      }
    : {
        eyebrow: "지금, 눈앞의 색을",
        title: "Live Camera",
        body: "프레임 안에서 보고 싶은 곳을 탭해 RGB와 HEX 값을 살펴보세요.",
        start: "카메라 켜기",
        starting: "카메라를 여는 중…",
        flip: "카메라 전환",
        front: "전면 카메라",
        back: "후면 카메라",
        colorAtPoint: "선택한 색",
        pickHint: "카메라 프레임 안의 원하는 곳을 탭해 보세요.",
        unsupportedTitle: "이곳에서는 카메라를 열 수 없어요",
        unsupportedBody: "기기에 있는 사진으로도 Translate를 이용할 수 있어요.",
        deniedTitle: "계속하려면 카메라 접근이 필요해요",
        deniedBody: "브라우저 설정에서 카메라 접근을 허용하거나, 사진으로 대신 살펴보세요.",
        translate: "사진으로 살펴보기",
        tryAgain: "다시 시도하기",
        privacy: "카메라 영상은 이 기기 안에서만 처리돼요. 기록하거나 전송하지 않아요.",
      };

  return <LiveCamera copy={copy} />;
}
