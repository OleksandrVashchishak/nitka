"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { toast } from "@/lib/toast";

function ForgotPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("email");
    if (fromQuery) setEmail(fromQuery);
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend endpoint for reset still pending — keep UI ready.
      await new Promise((resolve) => setTimeout(resolve, 400));
      const params = new URLSearchParams({
        email: email.trim(),
        flow: "forgot",
      });
      router.push(`/confirm-email?${params.toString()}`);
    } catch {
      toast.error("Не вдалось надіслати інструкції");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell>
      <AuthLogo />

      <h1 className="login-title">Відновіть свій пароль</h1>
      <p className="login-subtitle">
        Введіть електронну пошту, яку ви використовуєте для входу. Ми надішлемо
        вам інструкції для створення нового пароля.
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
        </div>

        <button type="submit" disabled={loading} className="login-btn login-submit">
          <LoadingButtonLabel loading={loading} loadingText="Надсилаємо…">
            Надіслати інструкції
          </LoadingButtonLabel>
        </button>

        <Link href="/login" className="login-back">
          Повернутися до входу
        </Link>
      </form>
    </AuthSplitShell>
  );
}

export function ForgotPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordFormInner />
    </Suspense>
  );
}
