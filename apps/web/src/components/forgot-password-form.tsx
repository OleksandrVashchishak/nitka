"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { forgotPasswordRequest } from "@/lib/auth-api";
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
      await forgotPasswordRequest(email);
      const params = new URLSearchParams({
        email: email.trim(),
        flow: "forgot",
      });
      router.push(`/confirm-email?${params.toString()}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалось надіслати інструкції",
      );
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
          <TextInput
            id="email"
            name="email"
            type="email"
            size="l"
            shape="pill"
            label="Електронна пошта"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <Button
          type="submit"
          tone="dark"
          fullWidth
          loading={loading}
          loadingText="Надсилаємо…"
          className="mt-8"
        >
          Надіслати інструкції
        </Button>

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
