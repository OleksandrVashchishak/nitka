import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import {
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  VesilnyyPlanPage,
} from "@/components/vesilnyy-plan-page";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "план весілля",
    "чекліст весілля",
    "весільний планер",
    "організація весілля онлайн",
    "список завдань весілля",
  ],
  alternates: { canonical: "/vesilnyy-plan" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/vesilnyy-plan",
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

export default function VesilnyyPlanRoute() {
  return <VesilnyyPlanPage />;
}
