import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Напишіть нам",
  description:
    "Фідбек, партнерські пропозиції, побажання та ідеї — напишіть команді fata.studio.",
  alternates: { canonical: "/napyshit-nam" },
  openGraph: {
    title: "Напишіть нам · fata.studio",
    description:
      "Маєте питання або пропозиції? Напишіть нам — фідбек, партнерства, ідеї.",
    url: "/napyshit-nam",
    type: "website",
  },
};

export default function NapyshitNamRoute() {
  return <ContactPage />;
}
