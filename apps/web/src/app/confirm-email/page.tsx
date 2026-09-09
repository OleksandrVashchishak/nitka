import { Suspense } from "react";
import { ConfirmEmailForm } from "@/components/confirm-email-form";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailForm />
    </Suspense>
  );
}
