import { Suspense } from "react";
import { EmailConfirmedForm } from "@/components/email-confirmed-form";

export default function EmailConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <EmailConfirmedForm />
    </Suspense>
  );
}
