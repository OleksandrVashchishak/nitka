import type { Metadata } from "next";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  PlanDnyaPage,
} from "@/components/plan-dnya-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "план весільного дня",
    "таймінг весілля",
    "погодинний план весілля",
    "розклад весільного дня онлайн",
    "синхронізація з підрядниками весілля",
  ],
  alternates: { canonical: "/plan-dnya" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/plan-dnya",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function PlanDnyaRoute() {
  return <PlanDnyaPage />;
}
