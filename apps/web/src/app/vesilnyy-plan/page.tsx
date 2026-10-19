import type { Metadata } from "next";
import { VesilnyyPlanPage } from "@/components/vesilnyy-plan-page";

export const metadata: Metadata = {
  title: "План весілля онлайн: список завдань без хаосу",
  description:
    "Fata.studio — сучасний український весільний пленер, який формує персональний список справ за 3 кроки, допомагає розподіляти обов'язки та тримає дедлайни під контролем.",
  alternates: { canonical: "/vesilnyy-plan" },
  openGraph: {
    title: "План весілля онлайн: список завдань без хаосу",
    description:
      "Персональний список справ за 3 кроки, розподіл обов'язків і дедлайни під контролем.",
    url: "/vesilnyy-plan",
    type: "website",
  },
};

export default function VesilnyyPlanRoute() {
  return <VesilnyyPlanPage />;
}
