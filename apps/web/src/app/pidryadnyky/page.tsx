import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  PidryadnykyPage,
} from "@/components/pidryadnyky-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/pidryadnyky" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/pidryadnyky",
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

export default function PidryadnykyRoute() {
  return <PidryadnykyPage />;
}
