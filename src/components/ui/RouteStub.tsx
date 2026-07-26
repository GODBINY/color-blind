import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function RouteStub({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const t = useTranslations("RouteStub");

  return (
    <main className="mx-auto grid min-h-[calc(100vh-76px)] max-w-[1184px] place-items-center px-5 py-12 md:px-8">
      <section className="w-full max-w-[760px] rounded-[var(--radius-l)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-m)] md:p-10">
        <p className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-sub)]"><span className="size-2 rounded-full bg-[var(--color-accent)]" /> NUNBIT / {title}</p>
        <h1 className="mt-5 text-[32px] font-semibold leading-[40px] tracking-[-0.04em] md:text-[40px] md:leading-[48px]">{title}</h1>
        <p className="mt-4 max-w-[510px] text-[16px] leading-[26px] text-[var(--color-text-sub)]">{body}</p>
        <div className="mt-9 grid gap-3 rounded-[var(--radius-m)] bg-[var(--color-bg)] p-4 sm:grid-cols-3">
          {["01", "02", "03"].map((number) => <div key={number} className="rounded-[var(--radius-s)] border border-[var(--color-border)] bg-white p-4"><span className="text-[12px] text-[var(--color-text-sub)]">{number}</span><div className="mt-5 h-1.5 w-2/3 rounded-full bg-[var(--color-accent)]" /><div className="mt-2 h-1.5 w-full rounded-full bg-[var(--color-border)]" /></div>)}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-[var(--radius-m)] bg-[var(--color-primary)] px-5 text-[16px] font-medium text-white shadow-[var(--shadow-s)]">{t("back")} <span aria-hidden="true" className="ml-2">←</span></Link>
          <p className="text-[13px] leading-5 text-[var(--color-text-sub)]">{t("preparing")}</p>
        </div>
      </section>
    </main>
  );
}
