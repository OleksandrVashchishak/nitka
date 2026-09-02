"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { getErrorMessage, toast } from "@/lib/toast";
import "@/app/login.css";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const role = useAuthStore.getState().user?.role;
      router.push(getHomePath(role));
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось увійти"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-left">
        <div className="login-col">
          <Link href="/" className="login-logo" aria-label="fata.studio">
            fata.studi<span className="fata-ring">o</span>
          </Link>

          <h1 className="login-title">Вітаємо з поверненням</h1>
          <p className="login-subtitle">
            Увійдіть, щоб продовжити планування вашого ідеального дня
          </p>

          <form onSubmit={onSubmit} className="login-form">
            <div className="login-fields">
              <label className="login-field" htmlFor="email">
                <span className="login-label">Електронна пошта</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="name@example.com"
                />
              </label>

              <div className="login-field">
                <label htmlFor="password" className="login-label">
                  Пароль
                </label>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input has-eye"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <button
                  type="button"
                  className="login-forgot"
                  onClick={() =>
                    toast.info("Відновлення пароля скоро зʼявиться")
                  }
                >
                  Забули пароль?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-btn login-submit">
              <LoadingButtonLabel loading={loading} loadingText="Входимо…">
                Увійти
              </LoadingButtonLabel>
            </button>

            <div className="login-or">або</div>

            <button
              type="button"
              className="login-btn login-google"
              onClick={() => toast.info("Вхід через Google скоро зʼявиться")}
            >
              <GoogleIcon />
              Google
            </button>
          </form>

          <p className="login-foot">
            Ще не маєте облікового запису?{" "}
            <Link href="/register">Зареєструватися</Link>
          </p>
        </div>
      </section>

      <aside className="login-right" aria-hidden="true">
        <h2 className="login-hero">
          <span className="login-hero-row">
            <span className="login-hero-line is-italic">Єдина</span>{" "}
            <span className="login-hero-line is-accent">ПЛАТФОРМА</span>
          </span>
          <span className="login-hero-line is-regular">
            для всіх весільних завдань
          </span>
        </h2>
        <p className="login-lead">
          Сучасні інструменти для планування без стресу. Чеклісти, бюджети,
          гості та розсадка — усе в одному місці.
        </p>
        <div className="login-photo">
          <Image
            src="/landing/feat-1.jpg"
            alt="Пара на заході сонця"
            fill
            priority
            sizes="50vw"
          />
          <div className="login-tag">
            <CursorIcon />
            Olya Vashchyshak
          </div>
          <div className="login-copy">FATA.STUDIO © 2026</div>
        </div>
      </aside>
    </div>
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

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.3M6.1 6.1C3.8 7.8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2 1.5 8.5 16l1.7-5.2L16 9.2 2 1.5Z"
        fill="#1A1A1A"
        stroke="#fff"
        strokeWidth="1"
      />
    </svg>
  );
}
