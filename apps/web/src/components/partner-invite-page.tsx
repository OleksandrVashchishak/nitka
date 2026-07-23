"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  acceptPartnerInvite,
  getPartnerInvitePreview,
} from "@/lib/dashboard-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

export function PartnerInvitePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    coupleName: string;
    city: string;
    date: string;
    expiresAt: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await getPartnerInvitePreview(token);
        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Запрошення недійсне");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function joinAfterAuth() {
    await acceptPartnerInvite(token);
    toast.success("Готово", "Ти в спільному кабінеті пари");
    router.replace("/dashboard");
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

  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Запрошення партнера
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
        Спільне весілля
      </h1>

      {preview ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <p className="font-[family-name:var(--font-display)] text-2xl text-ink">
            {preview.coupleName}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {preview.city} ·{" "}
            {new Intl.DateTimeFormat("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(preview.date))}
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            Після прийняття ти побачиш той самий план, бюджет і список гостей.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {preview && user ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onAcceptLoggedIn()}
          className="mt-6 rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {busy ? "Підключаємо…" : "Прийняти запрошення"}
        </button>
      ) : null}

      {preview && !user ? (
        <form onSubmit={onAuthSubmit} className="mt-6 space-y-3">
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={
                mode === "login"
                  ? "font-semibold text-sage-deep"
                  : "text-ink-soft"
              }
            >
              Увійти
            </button>
            <span className="text-ink-soft">·</span>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={
                mode === "register"
                  ? "font-semibold text-sage-deep"
                  : "text-ink-soft"
              }
            >
              Новий акаунт
            </button>
          </div>

          {mode === "register" ? (
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Твоє імʼя"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          ) : null}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
          >
            {busy
              ? "Зачекай…"
              : mode === "register"
                ? "Створити акаунт і приєднатись"
                : "Увійти і приєднатись"}
          </button>
        </form>
      ) : null}

      {!preview ? (
        <Link href="/" className="mt-6 inline-flex text-sm text-sage-deep underline">
          На головну
        </Link>
      ) : null}
    </div>
  );
}
