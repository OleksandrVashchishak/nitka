import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SpysokGosteyPage,
} from "@/components/spysok-gostey-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "список гостей весілля",
    "облік гостей весілля онлайн",
    "запрошення на весілля",
    "rsvp весілля",
    "статистика гостей весілля",
  ],
  alternates: { canonical: "/spysok-gostey" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/spysok-gostey",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function SpysokGosteyRoute() {
  return <SpysokGosteyPage />;
}
