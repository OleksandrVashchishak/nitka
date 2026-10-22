import type { Metadata } from "next";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  VesilnyySaytPage,
} from "@/components/vesilnyy-sayt-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "весільний сайт",
    "сайт запрошення на весілля",
    "онлайн запрошення на весілля",
    "сайт-візитка весілля",
    "весільний сайт українською",
  ],
  alternates: { canonical: "/vesilnyy-sayt" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/vesilnyy-sayt",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function VesilnyySaytRoute() {
  return <VesilnyySaytPage />;
}
