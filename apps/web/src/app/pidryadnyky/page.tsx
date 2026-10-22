import type { Metadata } from "next";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  PidryadnykyPage,
} from "@/components/pidryadnyky-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "підрядники весілля",
    "облік підрядників весілля",
    "весільні підрядники список",
    "контроль авансів весілля",
    "організація підрядників онлайн",
  ],
  alternates: { canonical: "/pidryadnyky" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/pidryadnyky",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function PidryadnykyRoute() {
  return <PidryadnykyPage />;
}
