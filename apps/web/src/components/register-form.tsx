"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { checkEmailAvailable } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { upsertWedding } from "@/lib/dashboard-api";
import { getErrorMessage, toast } from "@/lib/toast";

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type PlanningStage =
  | "NOT_ENGAGED"
  | "EXPLORING"
  | "PLANNING_NO_VENUE"
  | "PLANNING_WITH_VENUE"
  | "FINAL_DETAILS";

const PLANNING_OPTIONS: Array<{ value: PlanningStage; label: string }> = [
  { value: "NOT_ENGAGED", label: "Ще не заручені" },
  {
    value: "EXPLORING",
    label: "Нещодавно заручилися та поки придивляємося",
  },
  {
    value: "PLANNING_NO_VENUE",
    label: "Почали планувати, але ще не забронювали місце",
  },
  {
    value: "PLANNING_WITH_VENUE",
    label: "Плануємо весілля та вже забронювали місце",
  },
  {
    value: "FINAL_DETAILS",
    label: "Майже все готово, залишилися лише деталі",
  },
];

const STEPS = [
  { n: 1, label: "Початок" },
  { n: 2, label: "Основне" },
  { n: 3, label: "Завершення" },
] as const;

const inputClass =
  "w-full rounded-full border border-black/10 bg-white px-5 py-3.5 text-[15px] text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1);
  const [planningStage, setPlanningStage] =
    useState<PlanningStage>("PLANNING_WITH_VENUE");
  const [partnerOneName, setPartnerOneName] = useState("");
  const [partnerTwoName, setPartnerTwoName] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [cityUndecided, setCityUndecided] = useState(false);
  const [guests, setGuests] = useState("");
  const [guestsUndecided, setGuestsUndecided] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "available" | "taken" | "invalid"
  >("idle");

  async function goNext() {
    setError(null);
    if (step === 2) {
      if (!partnerOneName.trim() || !partnerTwoName.trim() || !date) {
        toast.error("Заповни обидва імені та дату весілля");
        return;
      }
      if (!cityUndecided && !city.trim()) {
        toast.error("Вкажи місто або обери «Ще вирішуємо»");
        return;
      }
      if (!guestsUndecided && (!guests || Number(guests) < 1)) {
        toast.error("Вкажи кількість гостей або обери «Ще вирішуємо»");
        return;
      }
    }
    if (step === 3) {
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step !== 3) {
      void goNext();
      return;
    }
    if (!email.trim() || password.length < 6) {
      toast.error("Вкажи email і пароль щонайменше з 6 символів");
      return;
    }
    if (!looksLikeEmail(email)) {
      setEmailStatus("invalid");
      toast.error("Вкажи коректний email");
      return;
    }
    setCheckingEmail(true);
    try {
      const result = await checkEmailAvailable(email);
      if (!result.available) {
        setEmailStatus("taken");
        setError("Цей email уже зайнятий. Увійди або обери інший.");
        toast.error("Цей email уже зайнятий");
        return;
      }
    } catch (err) {
      const message = getErrorMessage(err, "Не вдалось перевірити email");
      setError(message);
      toast.error(message);
      return;
    } finally {
      setCheckingEmail(false);
    }

    setError(null);
    setLoading(true);
    try {
      await register({
        name: `${partnerOneName.trim()} і ${partnerTwoName.trim()}`,
        email: email.trim(),
        password,
        role: "COUPLE",
      });
      await upsertWedding({
        date,
        city: cityUndecided ? "Ще вирішуємо" : city.trim(),
        guests: guestsUndecided ? 1 : Number(guests),
        budget: 0,
        partnerOneName: partnerOneName.trim(),
        partnerTwoName: partnerTwoName.trim(),
        planningStage,
        cityUndecided,
        guestsUndecided,
      });
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось зареєструватись"));
      setError(getErrorMessage(err, "Не вдалось зареєструватись"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F3EC] text-[#1a1a1a]">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="inline-flex items-center" aria-label="fata.studio">
          <span className="font-[family-name:var(--font-mak)] text-[26px] leading-none tracking-tight md:text-[28px]">
            fata.studio
          </span>
        </Link>
        <ol className="flex items-center gap-5 md:gap-8">
          {STEPS.map((item) => {
            const active = item.n === step;
            const done = item.n < step;
            return (
              <li key={item.n} className="flex items-center gap-2">
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[12px] ${
                    active || done
                      ? "border border-[#1a1a1a] text-[#1a1a1a]"
                      : "border border-[#1a1a1a]/25 text-[#1a1a1a]/35"
                  }`}
                >
                  {item.n}
                </span>
                <span
                  className={`hidden text-sm md:inline ${
                    active ? "font-medium text-[#1a1a1a]" : "text-[#1a1a1a]/40"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 pb-8 pt-10 md:pt-16">
          {step === 1 ? (
            <>
              <h1 className="text-center font-[family-name:var(--font-display)] text-[clamp(28px,4.2vw,44px)] font-medium leading-[1.15] tracking-tight">
                На якому етапі планування весілля ви зараз?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-6 text-[#5c574e]">
                Ми допоможемо на будь-якому етапі — від перших ідей до останніх
                штрихів.
              </p>
              <p className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]">
                В якому ви статусі?
              </p>
              <div className="mt-4 space-y-2.5">
                {PLANNING_OPTIONS.map((option) => {
                  const selected = planningStage === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPlanningStage(option.value)}
                      className={`flex w-full items-center gap-3 rounded-full px-5 py-3.5 text-left text-[15px] leading-snug transition ${
                        selected
                          ? "bg-[#F0FEBB] ring-1 ring-[#1a1a1a]"
                          : "bg-white ring-1 ring-black/10 hover:ring-black/20"
                      }`}
                    >
                      <span
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                          selected ? "border-[#1a1a1a]" : "border-[#1a1a1a]/30"
                        }`}
                        aria-hidden
                      >
                        {selected ? (
                          <span className="size-2 rounded-full bg-[#61040f]" />
                        ) : null}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-center font-[family-name:var(--font-display)] text-[clamp(28px,4.2vw,40px)] font-medium leading-[1.15] tracking-tight">
                Розкажіть головне про ваше весілля
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-6 text-[#5c574e]">
                Імена, дата, місто й орієнтовна кількість гостей. Можна змінити
                пізніше.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Field label="Твоє імʼя">
                  <input
                    value={partnerOneName}
                    onChange={(event) => setPartnerOneName(event.target.value)}
                    className={inputClass}
                    placeholder="Марія"
                  />
                </Field>
                <Field label="Імʼя партнера або партнерки">
                  <input
                    value={partnerTwoName}
                    onChange={(event) => setPartnerTwoName(event.target.value)}
                    className={inputClass}
                    placeholder="Андрій"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Дата весілля">
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Місто">
                  <CityAutocomplete
                    value={city}
                    disabled={cityUndecided}
                    onChange={setCity}
                    className={`${inputClass} disabled:bg-white/60 disabled:opacity-60`}
                    placeholder="Почни вводити місто…"
                  />
                </Field>
                <UndecidedToggle
                  active={cityUndecided}
                  onClick={() => setCityUndecided((value) => !value)}
                />
              </div>
              <div className="mt-4">
                <Field label="Кількість гостей">
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    disabled={guestsUndecided}
                    onChange={(event) => setGuests(event.target.value)}
                    className={`${inputClass} disabled:bg-white/60 disabled:opacity-60`}
                    placeholder="80"
                  />
                </Field>
                <UndecidedToggle
                  active={guestsUndecided}
                  onClick={() => setGuestsUndecided((value) => !value)}
                />
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h1 className="text-center font-[family-name:var(--font-display)] text-[clamp(28px,4.2vw,40px)] font-medium leading-[1.15] tracking-tight">
                Створіть кабінет
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-6 text-[#5c574e]">
                Збережемо план, гостей і бюджет в одному місці для вас обох.
              </p>
              <div className="mx-auto mt-10 w-full max-w-md space-y-4">
                <Field label="Email">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailStatus("idle");
                      setError(null);
                    }}
                    className={`${inputClass} ${
                      emailStatus === "taken" || emailStatus === "invalid"
                        ? "border-red-300"
                        : emailStatus === "available"
                          ? "border-[#8a9a6b]"
                          : ""
                    }`}
                    placeholder="you@email.com"
                  />
                </Field>
                <Field label="Пароль">
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClass}
                    placeholder="Мінімум 6 символів"
                  />
                </Field>
              </div>
            </>
          ) : null}

          {error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-5 pb-10">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[15px] text-[#61040f] underline underline-offset-4"
            >
              Пропустити
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((current) => Math.max(current - 1, 1));
              }}
              className="text-[15px] text-[#61040f] underline underline-offset-4"
            >
              Назад
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => void goNext()}
              className="rounded-full bg-[#61040f] px-10 py-3 text-[15px] font-medium text-white hover:bg-[#4a030c]"
            >
              Далі
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || checkingEmail}
              className="rounded-full bg-[#61040f] px-10 py-3 text-[15px] font-medium text-white hover:bg-[#4a030c] disabled:opacity-60"
            >
              <LoadingButtonLabel loading={loading || checkingEmail} loadingText="Створюємо…">
                Створити кабінет
              </LoadingButtonLabel>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[#5c574e]">{label}</span>
      {children}
    </label>
  );
}

function UndecidedToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-3 text-sm ${active ? "text-[#61040f]" : "text-[#5c574e]"}`}
    >
      {active ? "✓ Ще вирішуємо" : "Ще вирішуємо"}
    </button>
  );
}
