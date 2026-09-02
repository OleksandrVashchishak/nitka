"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { checkEmailAvailable } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { upsertWedding } from "@/lib/dashboard-api";
import {
  clearOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
  type OnboardingScreen,
} from "@/lib/onboarding-draft";
import { getHomePath } from "@/lib/routes";
import { getErrorMessage, toast } from "@/lib/toast";

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function joinName(first: string, last: string) {
  return [first.trim(), last.trim()].filter(Boolean).join(" ").slice(0, 80);
}

function maskUkDate(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}.${mm}`;
  return `${dd}.${mm}.${yyyy}`;
}

function ukDateToIso(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function fallbackWeddingDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
    label: "Щойно заручилися і поки придивляємося",
  },
  {
    value: "PLANNING_NO_VENUE",
    label: "Почали планувати, але ще не забронювали місце",
  },
  {
    value: "PLANNING_WITH_VENUE",
    label: "Плануємо весілля і вже забронювали місце",
  },
  {
    value: "FINAL_DETAILS",
    label: "Майже все готово, лишилися лише деталі",
  },
];

const STEPS = [
  { n: 1, label: "Початок" },
  { n: 2, label: "Основне" },
  { n: 3, label: "Завершення" },
] as const;

const GUEST_BANDS = [
  { id: "upto30", label: "До 30", guests: 30 },
  { id: "30-50", label: "30-50", guests: 40 },
  { id: "50-100", label: "50-100", guests: 75 },
  { id: "100-150", label: "100-150", guests: 125 },
  { id: "150-200", label: "150-200", guests: 175 },
  { id: "over200", label: "Понад 200", guests: 250 },
  { id: "unknown", label: "Ще не знаємо", guests: null },
] as const;

const REFERRAL_OPTIONS = [
  "Google",
  "Instagram",
  "TikTok",
  "Facebook",
  "YouTube",
  "Порадили друзі або знайомі",
  "Інше",
  "Не пам'ятаю",
] as const;

const titleClass =
  "w-full text-left font-[family-name:var(--font-display)] text-[28px] font-normal leading-[1.1] text-[#1B1B19] md:text-center md:text-[50px] md:leading-none";

const subtitleClass =
  "mt-4 w-full text-left font-[family-name:var(--font-sans)] text-[14px] font-normal leading-[1.4] text-[#7F7E7C] md:text-center md:leading-[1.5]";

const labelClass =
  "mb-2 block font-[family-name:var(--font-sans)] text-[13px] font-semibold leading-none text-[#1A1A1A]";

const inputClass =
  "h-[46px] w-full rounded-[40px] border border-[#EBE5D4] bg-[#FFFDF7] px-4 text-[15px] text-[#1B1B19] outline-none transition placeholder:text-[#1a1a1a]/45 focus:border-[#1a1a1a] disabled:opacity-60";

const nextBtnClass =
  "flex h-[56px] w-[119px] items-center justify-center rounded-[40px] bg-[#61040f] px-8 py-[14px] text-[15px] italic text-white hover:bg-[#4a030c] disabled:opacity-60 md:w-[203px]";

const backLinkClass =
  "font-[family-name:var(--font-sans)] text-[14px] font-semibold leading-none text-[#7F7E7C] underline";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [screen, setScreen] = useState<OnboardingScreen>(1);
  const [draftReady, setDraftReady] = useState(false);
  const [planningStage, setPlanningStage] =
    useState<PlanningStage>("PLANNING_WITH_VENUE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [partnerFirstName, setPartnerFirstName] = useState("");
  const [partnerLastName, setPartnerLastName] = useState("");
  const [date, setDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [city, setCity] = useState("");
  const [cityUndecided, setCityUndecided] = useState(false);
  const [guestBand, setGuestBand] = useState("");
  const [referral, setReferral] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "available" | "taken" | "invalid"
  >("idle");

  const partnerOneName = joinName(firstName, lastName);
  const partnerTwoName = joinName(partnerFirstName, partnerLastName);
  const visualStep = screen === "2.1" || screen === "2.2" ? 2 : screen;

  function persistDraft(nextScreen: OnboardingScreen, accountSaved = false) {
    saveOnboardingDraft({
      planningStage,
      firstName,
      lastName,
      partnerFirstName,
      partnerLastName,
      date,
      dateUndecided,
      city,
      cityUndecided,
      guestBand,
      referral,
      screen: nextScreen,
      accountSaved,
    });
  }

  useEffect(() => {
    if (!hydrated) return;
    const draft = loadOnboardingDraft();
    if (user && !draft) {
      router.replace(getHomePath(user.role));
      return;
    }
    if (draft) {
      setPlanningStage(
        (PLANNING_OPTIONS.some((option) => option.value === draft.planningStage)
          ? draft.planningStage
          : "PLANNING_WITH_VENUE") as PlanningStage,
      );
      setFirstName(draft.firstName);
      setLastName(draft.lastName);
      setPartnerFirstName(draft.partnerFirstName);
      setPartnerLastName(draft.partnerLastName);
      setDate(draft.date);
      setDateUndecided(draft.dateUndecided);
      setCity(draft.city);
      setCityUndecided(draft.cityUndecided);
      setGuestBand(draft.guestBand);
      setReferral(draft.referral);
      if (user && draft.accountSaved) {
        setScreen(draft.screen === "2.1" ? "2.2" : draft.screen);
      } else if (!user) {
        setScreen(draft.screen === 3 || draft.screen === "2.2" ? "2.1" : draft.screen);
      }
    }
    setDraftReady(true);
  }, [hydrated, user, router]);

  function guestsPayload() {
    const band = GUEST_BANDS.find((item) => item.id === guestBand);
    if (!band || band.guests === null) {
      return { guests: 1, guestsUndecided: true };
    }
    return { guests: band.guests, guestsUndecided: false };
  }

  async function saveWedding() {
    const guests = guestsPayload();
    await upsertWedding({
      date: dateUndecided ? fallbackWeddingDate() : ukDateToIso(date) ?? fallbackWeddingDate(),
      city: cityUndecided || !city.trim() ? "Ще вирішуємо" : city.trim(),
      guests: guests.guests,
      budget: 0,
      partnerOneName,
      partnerTwoName,
      planningStage,
      cityUndecided: cityUndecided || !city.trim(),
      guestsUndecided: guests.guestsUndecided,
    });
  }

  async function goNext() {
    setError(null);
    if (screen === 2) {
      if (!firstName.trim() || !partnerFirstName.trim()) {
        toast.error("Заповни імена для вас обох");
        return;
      }
      if (!dateUndecided && !ukDateToIso(date)) {
        toast.error("Вкажи дату у форматі ДД.ММ.РРРР або обери «Ми ще вирішуємо»");
        return;
      }
      persistDraft("2.1");
      setScreen("2.1");
      return;
    }
    if (screen === 1) {
      persistDraft(2);
      setScreen(2);
    }
  }

  async function createAccountAndContinue() {
    const alreadySignedIn = Boolean(useAuthStore.getState().user);
    if (!alreadySignedIn) {
      if (!email.trim() || password.length < 8) {
        toast.error("Вкажи email і пароль щонайменше з 8 символів");
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
    }

    setError(null);
    setLoading(true);
    try {
      persistDraft("2.1");
      if (!useAuthStore.getState().user) {
        await register(
          {
            name: `${partnerOneName} і ${partnerTwoName}`,
            email: email.trim(),
            password,
            role: "COUPLE",
          },
          { silent: true },
        );
      }
      await saveWedding();
      persistDraft("2.2", true);
      setScreen("2.2");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось зареєструватись"));
      setError(getErrorMessage(err, "Не вдалось зареєструватись"));
    } finally {
      setLoading(false);
    }
  }

  async function continueFromDetails() {
    if (!cityUndecided && !city.trim()) {
      toast.error("Вкажи місто або обери «Ще не знаємо»");
      return;
    }
    if (!guestBand) {
      toast.error("Обери орієнтовну кількість гостей");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await saveWedding();
      persistDraft(3, true);
      setScreen(3);
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось зберегти дані"));
      setError(getErrorMessage(err, "Не вдалось зберегти дані"));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (screen === "2.1") {
      void createAccountAndContinue();
      return;
    }
    if (screen === "2.2") {
      void continueFromDetails();
      return;
    }
    if (screen !== 3) {
      void goNext();
    }
  }

  function finishOnboarding() {
    clearOnboardingDraft();
    router.push(getHomePath(user?.role ?? "COUPLE"));
  }

  const stepper = (
    <ol className="flex items-center gap-4 md:gap-6">
      {STEPS.map((item, index) => {
        const active = item.n === visualStep;
        const done = item.n < visualStep;
        return (
          <li key={item.n} className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5 md:gap-2">
              <span
                className={`flex size-5 items-center justify-center rounded-full font-[family-name:var(--font-sans)] text-[11px] font-semibold leading-none md:size-6 md:rounded-[12px] md:border md:text-[12px] md:font-bold ${
                  active || done
                    ? "bg-black text-white md:border-black md:bg-transparent md:text-black"
                    : "border border-[#1a1a1a]/20 text-[#1a1a1a]/35 md:border-black/25 md:text-black/35"
                }`}
              >
                {done ? <CheckIcon /> : item.n}
              </span>
              <span
                className={`font-[family-name:var(--font-sans)] text-[12px] font-semibold leading-none md:text-[14px] ${
                  active ? "text-black" : "text-black/35"
                }`}
              >
                {item.label}
              </span>
            </span>
            {index < STEPS.length - 1 ? (
              <span className="hidden text-[11px] text-black/25 md:inline" aria-hidden>
                ›
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );

  if (!draftReady) {
    return <div className="min-h-screen bg-[#FFFDF7]" />;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#FFFDF7] text-[#1A1A1A]">
      <header className="flex flex-col items-center gap-4 px-5 pt-5 pb-2 md:flex-row md:justify-between md:border-b md:border-[#1a1a1a]/8 md:px-10 md:py-6">
        <Link href="/" className="inline-flex items-center" aria-label="fata.studio">
          <span className="font-[family-name:var(--font-mak)] text-[26px] leading-none tracking-tight md:text-[28px]">
            fata.studio
          </span>
        </Link>
        {stepper}
      </header>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <div
          className={`onboarding-step mx-auto flex flex-1 flex-col px-5 pb-8 pt-6 md:px-0 md:pt-16 ${
            screen === 3 ? "items-center justify-center" : ""
          }`}
        >
          {screen === 1 ? (
            <>
              <h1 className={titleClass}>
                На якому етапі планування весілля ви зараз?
              </h1>
              <p className={subtitleClass}>
                Неважливо, чи ви тільки починаєте шукати ідеї, чи вже рахуєте
                останні деталі — ми допоможемо організувати все необхідне.
              </p>
              <p className="mt-8 text-left font-[family-name:var(--font-sans)] text-[13px] font-semibold uppercase leading-none tracking-[0.1em] text-[#1A1A1A] md:mt-10">
                В якому ви статусі?
              </p>
              <div className="mt-3 space-y-3">
                {PLANNING_OPTIONS.map((option) => {
                  const selected = planningStage === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPlanningStage(option.value)}
                      className={`flex min-h-[46px] w-full items-center gap-3 rounded-[40px] border px-4 py-3 text-left font-[family-name:var(--font-sans)] text-[15px] font-medium leading-none text-[#1B1B19] transition ${
                        selected
                          ? "border-[#EBE5D4] bg-[#F0FEBB]"
                          : "border-[#EBE5D4] bg-white"
                      }`}
                    >
                      <span
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full ${
                          selected
                            ? "bg-[#61040f]"
                            : "border border-[#EBE5D4] bg-white"
                        }`}
                        aria-hidden
                      >
                        {selected ? (
                          <span className="size-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="min-w-0">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {screen === 2 ? (
            <>
              <h1 className={titleClass}>Розкажіть трохи про себе</h1>
              <p className={subtitleClass}>
                Як і будь-які хороші стосунки, планування весілля починається з
                основного.
              </p>
              <div className="mx-auto mt-8 grid w-full gap-x-4 gap-y-5 md:mt-10 sm:grid-cols-2">
                <Field label="Імʼя">
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className={inputClass}
                    placeholder="Ваше імʼя"
                    autoComplete="given-name"
                    maxLength={40}
                  />
                </Field>
                <Field label="Прізвище">
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className={inputClass}
                    placeholder="Ваше прізвище"
                    autoComplete="family-name"
                    maxLength={40}
                  />
                </Field>
                <Field label="Імʼя партнера / партнерки">
                  <input
                    value={partnerFirstName}
                    onChange={(event) => setPartnerFirstName(event.target.value)}
                    className={inputClass}
                    placeholder="Імʼя партнера / партнерки"
                    autoComplete="off"
                    maxLength={40}
                  />
                </Field>
                <Field label="Прізвище партнера / партнерки">
                  <input
                    value={partnerLastName}
                    onChange={(event) => setPartnerLastName(event.target.value)}
                    className={inputClass}
                    placeholder="Прізвище партнера / партнерки"
                    autoComplete="off"
                    maxLength={40}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Дата весілля">
                    <input
                      inputMode="numeric"
                      value={date}
                      disabled={dateUndecided}
                      onChange={(event) => setDate(maskUkDate(event.target.value))}
                      className={inputClass}
                      placeholder="ДД.ММ.РРРР"
                      autoComplete="off"
                    />
                  </Field>
                  <label className="mt-3 flex cursor-pointer items-center gap-2.5 font-[family-name:var(--font-sans)] text-[12px] font-normal leading-none text-[#1A1A1A]">
                    <input
                      type="checkbox"
                      checked={dateUndecided}
                      onChange={(event) => setDateUndecided(event.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border transition ${
                        dateUndecided
                          ? "border-[#61040f] bg-[#61040f]"
                          : "border-[#EBE5D4] bg-white"
                      }`}
                      aria-hidden
                    >
                      {dateUndecided ? (
                        <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                          <path
                            d="M2 6.2 4.7 9 10 3.5"
                            stroke="white"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    Ми ще вирішуємо
                  </label>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center gap-2.5 md:mt-12">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    persistDraft(1);
                    setScreen(1);
                  }}
                  className="flex h-[56px] w-full items-center justify-center rounded-[40px] border border-black bg-transparent px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-[#1A1A1A] md:w-[295px]"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={() => void goNext()}
                  className="flex h-[56px] w-full items-center justify-center rounded-[40px] bg-[#61040f] px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-white hover:bg-[#4a030c] md:w-[295px]"
                >
                  Далі
                </button>
              </div>
            </>
          ) : null}

          {screen === "2.1" ? (
            <div className="mx-auto w-full">
              <h1 className={titleClass}>
                Перш ніж іти далі, збережемо ваші відповіді
              </h1>
              <p className={subtitleClass}>
                Неважливо, чи ви лише шукаєте ідеї, чи вже рахуєте останні
                деталі — допоможемо зібрати все потрібне.
              </p>
              <button
                type="button"
                onClick={() => {
                  persistDraft("2.1");
                  toast.info("Вхід через Google скоро зʼявиться");
                }}
                className="mt-8 flex h-[46px] w-full items-center justify-center gap-3 rounded-[40px] border border-[#EBE5D4] bg-white px-4 font-[family-name:var(--font-poppins)] text-[16px] font-medium leading-6 text-[#7F8791] md:mt-10"
              >
                <GoogleIcon />
                Продовжити з Google
              </button>
              <div className="my-6 flex items-center gap-3 text-[13px] text-[#1a1a1a]/40">
                <span className="h-px flex-1 bg-[#1a1a1a]/12" />
                або
                <span className="h-px flex-1 bg-[#1a1a1a]/12" />
              </div>
              <div className="space-y-4">
                <Field label="Електронна пошта">
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
                    placeholder="name@example.com"
                  />
                </Field>
                <label className="block">
                  <span className={labelClass}>Пароль</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClass}
                    placeholder="········"
                  />
                  <span className="mt-2 block text-[13px] text-[#1a1a1a]/45">
                    8 або більше символів
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || checkingEmail}
                className="mt-8 flex h-[56px] w-full items-center justify-center rounded-[40px] bg-[#61040f] px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-white hover:bg-[#4a030c] disabled:opacity-60 md:mt-10"
              >
                <LoadingButtonLabel loading={loading || checkingEmail} loadingText="Зберігаємо…">
                  Продовжити
                </LoadingButtonLabel>
              </button>
            </div>
          ) : null}

          {screen === "2.2" ? (
            <div className="mx-auto w-full">
              <h1 className={titleClass}>Розкажіть більше про ваше весілля</h1>

              <div className="mt-8">
                <p className={labelClass}>
                  У якому місті буде ваше весілля?
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40">
                      <SearchIcon />
                    </span>
                    <CityAutocomplete
                      value={cityUndecided ? "" : city}
                      onChange={(value) => {
                        setCity(value);
                        if (value.trim()) setCityUndecided(false);
                      }}
                      disabled={cityUndecided}
                      placeholder="Введіть місто"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCityUndecided((value) => {
                        const next = !value;
                        if (next) setCity("");
                        return next;
                      });
                    }}
                    className={`h-[46px] shrink-0 rounded-[40px] px-5 text-[14px] ${
                      cityUndecided
                        ? "border border-[#61040f] bg-[#F0FEBB]"
                        : "border border-[#EBE5D4] bg-[#FFFDF7]"
                    }`}
                  >
                    Ще не знаємо
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <p className={labelClass}>
                  Скільки гостей ви приблизно плануєте запросити?
                </p>
                <div className="flex flex-wrap gap-2">
                  {GUEST_BANDS.map((band) => (
                    <Chip
                      key={band.id}
                      selected={guestBand === band.id}
                      onClick={() => setGuestBand(band.id)}
                    >
                      {band.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className={labelClass}>
                  Як ви дізналися про нас?
                </p>
                <div className="flex flex-wrap gap-2">
                  {REFERRAL_OPTIONS.map((option) => (
                    <Chip
                      key={option}
                      selected={referral === option}
                      onClick={() => setReferral(option)}
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    persistDraft("2.1", true);
                    setScreen("2.1");
                  }}
                  className="flex h-[56px] w-full items-center justify-center rounded-[40px] border border-black bg-transparent px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-[#1A1A1A] md:w-[295px]"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[56px] w-full items-center justify-center rounded-[40px] bg-[#61040f] px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-white hover:bg-[#4a030c] disabled:opacity-60 md:w-[295px]"
                >
                  <LoadingButtonLabel loading={loading} loadingText="Зберігаємо…">
                    Далі
                  </LoadingButtonLabel>
                </button>
              </div>
            </div>
          ) : null}

          {screen === 3 ? (
            <div className="flex w-full flex-col items-center text-center">
              <div className="aspect-[499/466] w-full max-w-[499px] overflow-hidden md:h-[466px] md:w-[499px] md:max-w-[499px]">
                <img
                  src="/landing/compare-1.jpg"
                  alt=""
                  className="size-full object-cover object-center grayscale contrast-[1.05] saturate-0"
                />
              </div>
              <h1 className={`${titleClass} mt-6 text-center`}>Усе готово!</h1>
              <p className="mt-4 w-full max-w-[620px] text-center font-[family-name:var(--font-sans)] text-[14px] font-normal leading-[1.5] text-[#1A1A1A]">
                Ваш профіль створено. Тепер можна починати планувати весілля
                своєї мрії без стресу й турбот.
              </p>
              <button
                type="button"
                onClick={finishOnboarding}
                className="mt-8 flex h-[56px] w-[203px] items-center justify-center rounded-[40px] border border-[#61040f] bg-[#61040f] px-8 py-[14px] font-[family-name:var(--font-akzidenz)] text-[16px] font-medium italic leading-none text-white hover:bg-[#4a030c]"
              >
                Розпочати
              </button>
            </div>
          ) : null}

          {error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        {screen === 1 ? (
          <div className="onboarding-step mx-auto flex items-center justify-between px-5 pb-8 md:px-0 md:pb-10">
            <button
              type="button"
              onClick={() => {
                persistDraft(2);
                setScreen(2);
              }}
              className={backLinkClass}
            >
              Пропустити
            </button>
            <button
              type="button"
              onClick={() => void goNext()}
              className={nextBtnClass}
            >
              Далі
            </button>
          </div>
        ) : null}
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
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
      <path
        d="M2 6.2 4.7 9 10 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-[40px] border px-4 py-2.5 text-[14px] leading-none ${
        selected
          ? "border-[#61040f] bg-[#F0FEBB]"
          : "border-[#EBE5D4] bg-[#FFFDF7]"
      }`}
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
