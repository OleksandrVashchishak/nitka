import type { Metadata } from "next";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  RozsadkaGosteyPage,
} from "@/components/rozsadka-gostey-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "розсадка гостей весілля",
    "схема розсадки весілля",
    "план столів весілля",
    "посадкова карта весілля",
    "розсадка гостей онлайн",
  ],
  alternates: { canonical: "/rozsadka-gostey" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/rozsadka-gostey",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function RozsadkaGosteyRoute() {
  return <RozsadkaGosteyPage />;
}
