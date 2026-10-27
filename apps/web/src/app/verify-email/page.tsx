"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { verifyEmailRequest } from "@/lib/auth-api";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const started = useRef(false);
  const [error, setError] = useState<string | null>(
    token ? null : "Посилання недійсне. Запроси нове",
  );

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    verifyEmailRequest(token)
      .then(() => router.replace("/email-confirmed?flow=register"))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Не вдалось підтвердити"),
      );
  }, [token, router]);

  if (!error) return null;

  return (
    <AuthSplitShell>
      <AuthLogo />
      <h1 className="login-title">Не вдалось підтвердити пошту</h1>
      <p className="login-subtitle">{error}</p>
      <div className="login-form">
        <Link
          href={`/confirm-email?flow=register${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          className="login-back"
        >
          Надіслати новий лист
        </Link>
      </div>
    </AuthSplitShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
