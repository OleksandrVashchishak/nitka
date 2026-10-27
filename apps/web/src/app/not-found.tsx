import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { noIndexRobots } from "@/lib/site";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  robots: noIndexRobots,
};

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Сторінку не знайдено"
      text="Схоже, цієї сторінки не існує або її перенесли. Перевірте адресу чи поверніться на головну."
    >
      <Button href="/" tone="dark">
        На головну
      </Button>
      <Button href="/napyshit-nam" tone="outline">
        Напишіть нам
      </Button>
    </ErrorState>
  );
}
