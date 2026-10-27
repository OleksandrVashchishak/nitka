"use client";

import "@/styles/globals.scss";
import "@/styles/ui/index.scss";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import {
  akzidenz,
  akzidenzExt,
  cormorant,
  mak,
  manrope,
  montserrat,
  scriptCyr,
} from "@/lib/fonts";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body
        className={`${akzidenz.variable} ${akzidenzExt.variable} ${mak.variable} ${cormorant.variable} ${scriptCyr.variable} ${manrope.variable} ${montserrat.variable} antialiased`}
      >
        <ErrorState
          code="500"
          title="Щось пішло не так"
          text="Сервіс тимчасово недоступний. Спробуйте оновити сторінку за кілька хвилин."
        >
          <Button tone="dark" onClick={reset}>
            Спробувати ще раз
          </Button>
        </ErrorState>
      </body>
    </html>
  );
}
