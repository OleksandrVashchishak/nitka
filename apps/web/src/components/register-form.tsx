"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { upsertWedding } from "@/lib/dashboard-api";
import { getErrorMessage, toast } from "@/lib/toast";

type PlanningStage =
  | "NOT_ENGAGED"
  | "EXPLORING"
  | "PLANNING_NO_VENUE"
  | "PLANNING_WITH_VENUE"
  | "FINAL_DETAILS";

const PLANNING_OPTIONS: Array<{
  value: PlanningStage;
  icon: string;
  label: string;
}> = [
  { value: "NOT_ENGAGED", icon: "○", label: "Ще не заручені" },
  { value: "EXPLORING", icon: "◇", label: "Щойно заручились і придивляємось" },
  {
    value: "PLANNING_NO_VENUE",
    icon: "☷",
    label: "Плануємо, але ще не обрали локацію",
  },
  {
    value: "PLANNING_WITH_VENUE",
    icon: "⌂",
    label: "Плануємо й уже забронювали локацію",
  },
  { value: "FINAL_DETAILS", icon: "✓", label: "Майже все готово — лишились деталі" },
];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-sage";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [role, setRole] = useState<"COUPLE" | "VENDOR">("COUPLE");
  const [step, setStep] = useState(1);
  const [planningStage, setPlanningStage] =
    useState<PlanningStage>("EXPLORING");
  const [partnerOneName, setPartnerOneName] = useState("");
  const [partnerTwoName, setPartnerTwoName] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [cityUndecided, setCityUndecided] = useState(false);
  const [guests, setGuests] = useState("");
  const [guestsUndecided, setGuestsUndecided] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function chooseRole(nextRole: "COUPLE" | "VENDOR") {
    setRole(nextRole);
    setStep(1);
    setError(null);
  }

  function nextStep() {
    setError(null);
    if (
      step === 2 &&
      (!partnerOneName.trim() || !partnerTwoName.trim() || !date)
    ) {
      toast.error("Заповни обидва імені та дату весілля");
      return;
    }
    if (step === 3 && (!email.trim() || password.length < 6)) {
      toast.error("Вкажи email і пароль щонайменше з 6 символів");
      return;
    }
    if (step === 4 && !cityUndecided && !city.trim()) {
      toast.error("Вкажи місто або обери «Ще вирішуємо»");
      return;
    }
    setStep((current) => Math.min(current + 1, 5));
  }

  async function onCoupleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!guestsUndecided && (!guests || Number(guests) < 1)) {
      toast.error("Вкажи кількість гостей або обери «Ще вирішуємо»");
      return;
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

  async function onVendorSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name: vendorName.trim(),
        email: email.trim(),
        password,
        role: "VENDOR",
      });
      router.push(getHomePath("VENDOR"));
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось зареєструватись"));
      setError(getErrorMessage(err, "Не вдалось зареєструватись"));
    } finally {
      setLoading(false);
    }
  }

  const roleSelector = (
    <div className="mx-auto grid w-full max-w-sm grid-cols-2 rounded-full bg-mist p-1">
      <button
        type="button"
        onClick={() => chooseRole("COUPLE")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          role === "COUPLE" ? "bg-white text-ink shadow-sm" : "text-ink-soft"
        }`}
      >
        Для пари
      </button>
      <button
        type="button"
        onClick={() => chooseRole("VENDOR")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          role === "VENDOR" ? "bg-white text-ink shadow-sm" : "text-ink-soft"
        }`}
      >
        Для підрядника
      </button>
    </div>
  );

  if (role === "VENDOR") {
    return (
      <div className="mx-auto w-full max-w-md">
        {roleSelector}
        <form onSubmit={onVendorSubmit} className="mt-10 space-y-5">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
              Реєстрація підрядника
            </h1>
            <p className="mt-2 text-ink-soft">Створи профіль і покажи свої послуги парам.</p>
          </div>
          <Field label="Імʼя або назва">
            <input
              required
              minLength={2}
              value={vendorName}
              onChange={(event) => setVendorName(event.target.value)}
              className={inputClass}
              placeholder="Студія «Світло»"
            />
          </Field>
          <AccountFields
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          <ErrorMessage error={error} />
          <PrimaryButton loading={loading}>Створити акаунт</PrimaryButton>
          <LoginLink />
        </form>
      </div>
    );
  }

  return (
    <div className="grid min-h-[700px] overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm lg:grid-cols-[0.82fr_1.18fr]">
      <div className="relative hidden min-h-[700px] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=85"
          alt="Щаслива пара"
          fill
          priority
          className="object-cover"
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <p className="absolute inset-x-10 top-1/2 -translate-y-1/2 text-center font-[family-name:var(--font-display)] text-4xl leading-tight text-white">
          Для дня, з якого все починається
        </p>
        <p className="absolute inset-x-0 bottom-10 text-center font-[family-name:var(--font-display)] text-3xl tracking-[0.15em] text-white">
          NITKA
        </p>
      </div>

      <form onSubmit={onCoupleSubmit} className="flex min-h-[700px] flex-col px-6 py-8 md:px-14">
        {roleSelector}
        <div className="mx-auto mt-8 flex w-full max-w-xl items-center gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  item <= step ? "bg-ink text-white" : "border border-line text-ink-soft"
                }`}
              >
                {item}
              </span>
              {item < 5 ? (
                <span className={`h-px flex-1 ${item < step ? "bg-ink" : "bg-line"}`} />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-8">
          {step === 1 ? (
            <>
              <StepHeading
                title="Привіт! На якому ви етапі планування?"
                subtitle="Тільки придивляєтесь чи вже рахуєте останні дні — підлаштуємо план під вас."
              />
              <div className="mt-7 space-y-3">
                {PLANNING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPlanningStage(option.value)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      planningStage === option.value
                        ? "border-ink bg-mist text-ink"
                        : "border-line hover:border-sage"
                    }`}
                  >
                    <span className="w-5 text-center text-base">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <StepHeading
                title="Як і будь-які класні стосунки, почнемо з основ"
                subtitle="Розкажіть, як вас звати та коли плануєте святкувати."
              />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
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
            </>
          ) : null}

          {step === 3 ? (
            <>
              <StepHeading
                title="Створімо ваш акаунт"
                subtitle="Збережемо план, обране та всі важливі деталі в одному місці."
              />
              <div className="mt-7 space-y-4">
                <AccountFields
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <StepHeading
                title="Де ви святкуватимете?"
                subtitle="Приблизний варіант теж ок — це допоможе підібрати локальних підрядників."
              />
              <div className="mt-7">
                <Field label="Місто або найближчий населений пункт">
                  <CityAutocomplete
                    value={city}
                    disabled={cityUndecided}
                    onChange={setCity}
                    className={`${inputClass} disabled:bg-mist disabled:opacity-60`}
                    placeholder="Почни вводити місто…"
                  />
                </Field>
                <DecisionButton
                  active={cityUndecided}
                  onClick={() => setCityUndecided((value) => !value)}
                />
              </div>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <StepHeading
                title="Схоже, буде вечірка! Хто у списку?"
                subtitle="Порада від NITKA: приблизна кількість допоможе точніше порахувати бюджет і знайти локацію."
              />
              <div className="mt-7">
                <Field label="Кількість гостей — приблизна теж підійде">
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    disabled={guestsUndecided}
                    onChange={(event) => setGuests(event.target.value)}
                    className={`${inputClass} disabled:bg-mist disabled:opacity-60`}
                    placeholder="80"
                  />
                </Field>
                <DecisionButton
                  active={guestsUndecided}
                  onClick={() => setGuestsUndecided((value) => !value)}
                />
              </div>
            </>
          ) : null}

          <ErrorMessage error={error} />

          <div className="mt-7 flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep((current) => current - 1);
                }}
                className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-sage"
              >
                Назад
              </button>
            ) : null}
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep"
              >
                Далі
              </button>
            ) : (
              <div className="flex-1">
                <PrimaryButton loading={loading}>Почати планування</PrimaryButton>
              </div>
            )}
          </div>
          {step === 1 ? <LoginLink /> : null}
        </div>
      </form>
    </div>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
        Реєстрація пари
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-ink md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function AccountFields({
  email,
  password,
  setEmail,
  setPassword,
}: {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
}) {
  return (
    <>
      <Field label="Email">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
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
    </>
  );
}

function DecisionButton({
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
      className={`mt-3 flex items-center gap-2 text-sm font-medium ${
        active ? "text-sage-deep" : "text-ink"
      }`}
    >
      <span
        className={`flex size-5 items-center justify-center rounded border ${
          active ? "border-sage bg-sage text-white" : "border-line"
        }`}
      >
        {active ? "✓" : ""}
      </span>
      Ще вирішуємо
    </button>
  );
}

function ErrorMessage({ error }: { error: string | null }) {
  return error ? (
    <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  ) : null;
}

function PrimaryButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:opacity-60"
    >
      <LoadingButtonLabel loading={loading} loadingText="Створюємо…">
        {children}
      </LoadingButtonLabel>
    </button>
  );
}

function LoginLink() {
  return (
    <p className="mt-6 text-center text-sm text-ink-soft">
      Вже є акаунт?{" "}
      <Link
        href="/login"
        className="font-medium text-sage-deep underline-offset-4 hover:underline"
      >
        Увійти
      </Link>
    </p>
  );
}
