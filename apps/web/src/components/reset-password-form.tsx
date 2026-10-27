"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { resetPasswordRequest } from "@/lib/auth-api";
import { toast } from "@/lib/toast";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordRequest({ token, password });
      toast.success("Пароль змінено", "Тепер можна увійти");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не змінено пароль");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthSplitShell>
        <AuthLogo />
        <h1 className="login-title">Посилання недійсне</h1>
        <p className="login-subtitle">
          Запросіть нове посилання для відновлення пароля.
        </p>
        <div className="login-form">
          <Link href="/forgot-password" className="login-back">
            Відновити пароль
          </Link>
        </div>
      </AuthSplitShell>
    );
  }

  return (
    <AuthSplitShell>
      <AuthLogo />

      <h1 className="login-title">Створіть новий пароль</h1>
      <p className="login-subtitle">
        Придумайте новий пароль для входу в fata.studio.
      </p>

      <form onSubmit={onSubmit} className="login-form">
        <div className="login-fields">
          <TextInput
            id="password"
            name="password"
            type="password"
            size="l"
            shape="pill"
            label="Новий пароль"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="········"
            hint="8 або більше символів"
          />
        </div>

        <Button
          type="submit"
          tone="dark"
          fullWidth
          loading={loading}
          loadingText="Зберігаємо…"
          className="mt-8"
        >
          Змінити пароль
        </Button>

        <Link href="/login" className="login-back">
          Повернутися до входу
        </Link>
      </form>
    </AuthSplitShell>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
