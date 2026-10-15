"use client";

import { BrandLogo } from "@/components/brand-logo";
import { PageLoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  acceptPartnerInvite,
  getPartnerInvitePreview,
} from "@/lib/dashboard-api";
import { useAuthStore } from "@/lib/auth-store";
import { detectUaNameGender } from "@/lib/ua-name-case";
import { toast } from "@/lib/toast";
import "@/styles/auth/partner-invite.scss";

function firstName(raw: string) {
  return raw.trim().split(/\s+/).filter(Boolean)[0] ?? "";
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
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    coupleName: string;
    city: string;
    date: string;
    expiresAt: string;
    inviterName: string;
    inviteeName: string;
  } | null>(null);

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

  const invitee = firstName(preview?.inviteeName ?? "");
  const inviter = firstName(preview?.inviterName ?? "");
  const inviterFeminine =
    !!inviter && detectUaNameGender(inviter) === "feminine";
  const invitedVerb = inviterFeminine ? "запросила" : "запросив";

  const title = (() => {
    if (invitee && inviter) return `${invitee}, ${inviter} кличе!`;
    if (inviter) return `${inviter} кличе!`;
    if (invitee) return `${invitee}, тебе кличуть!`;
    return "Тебе кличуть!";
  })();

  const subtitle = (() => {
    const who = invitee || "Привіт";
    if (inviter) {
      return `${who}, ${inviter} вас ${invitedVerb} до fata.studio для спільного планування весілля! Зареєструйтесь та заходьте у ваш спільний простір.`;
    }
    return `${who}, вас запросили до fata.studio для спільного планування весілля! Зареєструйтесь та заходьте у ваш спільний простір.`;
  })();

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
        const accountName =
          (preview?.inviteeName || "").trim() ||
          email.trim().split("@")[0] ||
          email.trim();
        await register({
          name: accountName,
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
    <div className="partner-invite-page">
      <header className="partner-invite-page__header">
        <BrandLogo className="partner-invite-page__logo" />
      </header>

      <div className="partner-invite-page__main">
        <div className="partner-invite-page__col">
          {preview ? (
            <>
              <h1 className="partner-invite-page__title">{title}</h1>
              <p className="partner-invite-page__subtitle">{subtitle}</p>
            </>
          ) : (
            <>
              <h1 className="partner-invite-page__title">Запрошення</h1>
              <p className="partner-invite-page__subtitle">
                Це запрошення більше недійсне або термін його дії минув.
              </p>
            </>
          )}

          {error ? (
            <p className="partner-invite-page__error" role="alert">
              {error}
            </p>
          ) : null}

          {preview && user ? (
            <div className="partner-invite-page__accept">
              <Button
                type="button"
                tone="dark"
                fullWidth
                loading={busy}
                loadingText="Підключаємо…"
                onClick={() => void onAcceptLoggedIn()}
              >
                Прийняти запрошення
              </Button>
            </div>
          ) : null}

          {preview && !user ? (
            <form onSubmit={onAuthSubmit} className="partner-invite-page__form">
              <Button
                type="button"
                size="m"
                tone="outline"
                fullWidth
                onClick={() =>
                  toast.info("Вхід через Google скоро зʼявиться")
                }
              >
                <GoogleIcon />
                Продовжити з Google
              </Button>

              <div className="partner-invite-page__or">або</div>

              <div className="partner-invite-page__fields">
                <TextInput
                  size="l"
                  shape="pill"
                  label="Електронна пошта"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                <TextInput
                  size="l"
                  shape="pill"
                  label="Пароль"
                  type="password"
                  required
                  minLength={mode === "register" ? 8 : 6}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="········"
                  hint={
                    mode === "register" ? "8 або більше символів" : undefined
                  }
                />
              </div>

              <Button
                type="submit"
                tone="dark"
                fullWidth
                className="mt-6"
                loading={busy}
                loadingText="Зачекай…"
              >
                Продовжити
              </Button>

              <p className="partner-invite-page__switch">
                {mode === "register" ? (
                  <>
                    Вже є акаунт?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                      }}
                    >
                      Увійти
                    </button>
                  </>
                ) : (
                  <>
                    Немає акаунта?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setError(null);
                      }}
                    >
                      Зареєструватися
                    </button>
                  </>
                )}
              </p>
            </form>
          ) : null}

          {!preview ? (
            <Link href="/" className="partner-invite-page__fallback">
              На головну
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
