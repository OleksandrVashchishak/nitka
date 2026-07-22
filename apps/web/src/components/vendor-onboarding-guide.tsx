import Link from "next/link";

type StepStatus = "done" | "current" | "upcoming";

type Step = {
  n: number;
  title: string;
  text: string;
  status: StepStatus;
  href?: string;
  cta?: string;
};

type Props = {
  hasProfile: boolean;
  vendorStatus?: string | null;
  requestsCount?: number;
};

function resolveSteps({
  hasProfile,
  vendorStatus,
  requestsCount = 0,
}: Props): Step[] {
  const approved = vendorStatus === "APPROVED";
  const pending = vendorStatus === "PENDING";
  const rejected =
    vendorStatus === "REJECTED" || vendorStatus === "BLOCKED";

  return [
    {
      n: 1,
      title: "Створи профіль",
      text: "Назва, категорія, місто, ціна і кілька фото.",
      status: hasProfile ? "done" : "current",
      href: "/vendor/profile",
      cta: hasProfile ? "Редагувати профіль" : "Створити профіль",
    },
    {
      n: 2,
      title: pending
        ? "Чекай approve"
        : rejected
          ? "Потрібні правки"
          : approved
            ? "Профіль опубліковано"
            : "Надішли на модерацію",
      text: pending
        ? "Адмін перевіряє профіль. Після approve ти зʼявишся в каталозі."
        : rejected
          ? "Профіль відхилено або заблоковано. Онови дані і напиши в підтримку / спробуй знову через адміна."
          : approved
            ? "Ти в каталозі — пари вже можуть тебе знайти."
            : "Збережи профіль — він піде на модерацію зі статусом PENDING.",
      status: !hasProfile
        ? "upcoming"
        : approved
          ? "done"
          : pending || rejected
            ? "current"
            : "current",
      href: "/vendor/profile",
      cta: approved ? undefined : "Відкрити профіль",
    },
    {
      n: 3,
      title: "Дивись заявки",
      text:
        requestsCount > 0
          ? `У тебе вже ${requestsCount} заявок — відповідай і оновлюй статус.`
          : "Коли профіль approved, сюди прилітатимуть ліди від пар.",
      status: !approved ? "upcoming" : requestsCount > 0 ? "done" : "current",
      href: "/vendor/requests",
      cta: approved ? "До заявок" : undefined,
    },
  ];
}

export function VendorOnboardingGuide(props: Props) {
  const steps = resolveSteps(props);
  const current = steps.find((s) => s.status === "current") ?? steps[0];

  return (
    <section className="rounded-2xl border border-line bg-mist p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-ink-soft">
            Гайд для підрядника
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
            3 кроки до заявок
          </h2>
        </div>
        {current.cta && current.href ? (
          <Link
            href={current.href}
            className="rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            {current.cta}
          </Link>
        ) : null}
      </div>

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const tone =
            step.status === "done"
              ? "border-sage/40 bg-white"
              : step.status === "current"
                ? "border-sage bg-white shadow-[0_12px_30px_var(--glow)]"
                : "border-line bg-white/60 opacity-70";

          return (
            <li key={step.n} className={`rounded-2xl border p-5 ${tone}`}>
              <div className="flex items-center gap-3">
                <span
                  className={
                    step.status === "done"
                      ? "flex size-8 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white"
                      : step.status === "current"
                        ? "flex size-8 items-center justify-center rounded-full bg-sage-deep text-sm font-semibold text-white"
                        : "flex size-8 items-center justify-center rounded-full border border-line text-sm text-ink-soft"
                  }
                >
                  {step.status === "done" ? "✓" : step.n}
                </span>
                <p className="font-medium text-ink">{step.title}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {step.text}
              </p>
              {step.status === "current" && step.href && step.cta ? (
                <Link
                  href={step.href}
                  className="mt-4 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline md:hidden"
                >
                  {step.cta}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
