"use client";

import { useRouter } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { Button } from "@/components/ui/button";

export function EmailConfirmedForm() {
  const router = useRouter();
  function continueNext() {
    router.push("/login");
  }

  return (
    <AuthSplitShell>
      <AuthLogo />

      <h1 className="login-title">Електронну пошту підтверджено!</h1>
      <p className="login-subtitle">
        Чудово! Тепер можна увійти в акаунт.
      </p>

      <div className="login-form">
        <Button type="button" tone="dark" fullWidth className="mt-8" onClick={continueNext}>
          Продовжити
        </Button>
      </div>
    </AuthSplitShell>
  );
}
