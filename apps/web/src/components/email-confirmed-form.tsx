"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { Button } from "@/components/ui/button";

export function EmailConfirmedForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "register";

  function continueNext() {
    if (flow === "forgot") {
      router.push("/login");
      return;
    }
    router.push("/register");
  }

  return (
    <AuthSplitShell>
      <AuthLogo />

      <h1 className="login-title">Електронну пошту підтверджено!</h1>
      <p className="login-subtitle">
        Чудово! Тепер можемо перейти до налаштування вашого профілю.
      </p>

      <div className="login-form">
        <Button type="button" tone="dark" fullWidth className="mt-8" onClick={continueNext}>
          Продовжити
        </Button>
      </div>
    </AuthSplitShell>
  );
}
