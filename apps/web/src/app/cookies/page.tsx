import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { COOKIES_DOC } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: COOKIES_DOC.title,
  description: COOKIES_DOC.description,
  alternates: { canonical: "/cookies" },
};

export default function CookiesRoute() {
  return <LegalPage doc={COOKIES_DOC} />;
}
