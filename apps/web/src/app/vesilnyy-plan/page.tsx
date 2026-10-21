import type { Metadata } from "next";
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
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function VesilnyyPlanRoute() {
  return <VesilnyyPlanPage />;
}
