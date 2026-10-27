"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      code="500"
      title="Щось пішло не так"
      text="Сталася неочікувана помилка. Спробуйте оновити сторінку — якщо не допоможе, напишіть нам."
    >
      <Button tone="dark" onClick={reset}>
        Спробувати ще раз
      </Button>
      <Button href="/" tone="outline">
        На головну
      </Button>
    </ErrorState>
  );
}
