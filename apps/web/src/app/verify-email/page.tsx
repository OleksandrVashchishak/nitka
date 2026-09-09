"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    const email = searchParams.get("email");
    const flow = searchParams.get("flow") || "register";
    if (email) params.set("email", email);
    params.set("flow", flow);
    // token will be validated on the API later; for now land on success UI
    router.replace(`/email-confirmed?${params.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailRedirectInner />
    </Suspense>
  );
}
