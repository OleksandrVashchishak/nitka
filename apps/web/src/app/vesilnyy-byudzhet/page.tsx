import type { Metadata } from "next";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  VesilnyyByudzhetPage,
} from "@/components/vesilnyy-byudzhet-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "бюджет весілля",
    "калькулятор витрат на весілля",
    "облік весільних витрат",
    "весільний бюджет онлайн",
    "планування витрат на весілля",
  ],
  alternates: { canonical: "/vesilnyy-byudzhet" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/vesilnyy-byudzhet",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function VesilnyyByudzhetRoute() {
  return <VesilnyyByudzhetPage />;
}
