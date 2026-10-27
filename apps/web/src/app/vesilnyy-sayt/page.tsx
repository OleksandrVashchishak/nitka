import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
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
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function VesilnyySaytRoute() {
  return <VesilnyySaytPage />;
}
