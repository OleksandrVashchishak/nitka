"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLogo, AuthSplitShell } from "@/components/auth-split-shell";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { toast } from "@/lib/toast";

const RESEND_COOLDOWN_MS = 30_000;

export function ConfirmEmailForm() {
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") || "").trim();
  const flow = searchParams.get("flow") || "forgot";

  const [loading, setLoading] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(() => Date.now());

  const changeHref =
    flow === "register"
      ? "/register"
      : `/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`;

  async function resend() {
    const wait = RESEND_COOLDOWN_MS - (Date.now() - lastSentAt);
    if (wait > 0) {
      toast.info(`Зачекай ще ${Math.ceil(wait / 1000)} сек перед повторним надсиланням`);
      return;
    }

    setLoading(true);
    try {
      // Backend email endpoint still pending — keep UI ready.
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLastSentAt(Date.now());
      toast.success("Лист надіслано повторно");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell>
      <AuthLogo />

      <h1 className="login-title">Підтвердіть свою електронну пошту</h1>
      <p className="login-subtitle">
        Ми надіслали лист із посиланням для підтвердження на вашу електронну
        пошту. Перейдіть за посиланням у листі, щоб продовжити. Не бачите
        листа? Перевірте папку «Спам».
      </p>

      <div className="login-form">
        <button
          type="button"
          disabled={loading}
          className="login-btn login-submit"
          onClick={() => void resend()}
        >
          <LoadingButtonLabel loading={loading} loadingText="Надсилаємо…">
            <ResendIcon />
            Надіслати лист повторно
          </LoadingButtonLabel>
        </button>

        <Link href={changeHref} className="login-back">
          Змінити електронну пошту
        </Link>
      </div>
    </AuthSplitShell>
  );
}

function ResendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M15.5 9A6.5 6.5 0 1 1 12.3 3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 2.5h3.2V5.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
