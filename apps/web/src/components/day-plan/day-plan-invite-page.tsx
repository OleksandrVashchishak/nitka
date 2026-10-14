"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import {
  acceptDayPlanInvite,
  fetchDayPlanInvitePreview,
  type DayPlanInvitePreview,
} from "@/lib/day-plan-share-api";
import { toast } from "@/lib/toast";

export function DayPlanInvitePage() {
  const params = useParams<{ token: string }>();
  const inviteToken = params.token;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<DayPlanInvitePreview | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchDayPlanInvitePreview(inviteToken);
        setPreview(data);
        setEmail(data.email);
        setName(data.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Запрошення недійсне");
      } finally {
        setLoading(false);
      }
    })();
  }, [inviteToken]);

  async function joinAfterAuth() {
    const result = await acceptDayPlanInvite(inviteToken);
    toast.success("Готово", "Доступ до плану дня відкрито");
    router.replace(result.path);
  }

  async function onAcceptLoggedIn() {
    setBusy(true);
    setError(null);
    try {
      await joinAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалось прийняти");
    } finally {
      setBusy(false);
    }
  }

  async function onAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await register({
          name: name.trim() || email.trim(),
          email: email.trim(),
          password,
          role: "COUPLE",
        });
      } else {
        await login(email.trim(), password);
      }
      await joinAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалось увійти");
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated || loading) {
    return <PageLoader label="Перевіряємо запрошення…" />;
  }

  const accessLabel =
    preview?.access === "EDIT" ? "редагувати" : "переглядати";

  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Запрошення до плану дня
      </p>

      {error && !preview ? (
        <>
          <h1 className="mt-3 font-display text-3xl">Запрошення недійсне</h1>
          <p className="mt-3 text-ink/70">{error}</p>
          <Link href="/" className="mt-6 inline-block underline">
            На головну
          </Link>
        </>
      ) : preview ? (
        <>
          <h1 className="mt-3 font-display text-3xl">
            {preview.coupleName}
          </h1>
          <p className="mt-3 text-ink/70">
            Тебе запросили {accessLabel} план весільного дня.
            {preview.accepted ? " Запрошення вже прийнято." : null}
          </p>

          {error ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          {user ? (
            <div className="mt-8 flex flex-col gap-3">
              <p className="text-sm text-ink/60">
                Увійшов як {user.email}. Для прийняття потрібен email{" "}
                <strong>{preview.email}</strong>.
              </p>
              <Button
                type="button"
                tone="ink"
                size="l"
                loading={busy}
                onClick={() => void onAcceptLoggedIn()}
              >
                {preview.accepted ? "Відкрити план дня" : "Прийняти запрошення"}
              </Button>
            </div>
          ) : (
            <form className="mt-8 flex flex-col gap-4" onSubmit={onAuthSubmit}>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className={mode === "login" ? "font-semibold" : "opacity-60"}
                  onClick={() => setMode("login")}
                >
                  Увійти
                </button>
                <span aria-hidden>·</span>
                <button
                  type="button"
                  className={
                    mode === "register" ? "font-semibold" : "opacity-60"
                  }
                  onClick={() => setMode("register")}
                >
                  Зареєструватись
                </button>
              </div>

              {mode === "register" ? (
                <TextInput
                  label="Імʼя"
                  size="m"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              ) : null}

              <TextInput
                label="Email"
                size="m"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <TextInput
                label="Пароль"
                size="m"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                required
              />

              <Button
                type="submit"
                tone="ink"
                size="l"
                loading={busy}
                loadingText="Обробляємо…"
              >
                {mode === "register"
                  ? "Створити акаунт і прийняти"
                  : "Увійти і прийняти"}
              </Button>
            </form>
          )}
        </>
      ) : null}
    </div>
  );
}
