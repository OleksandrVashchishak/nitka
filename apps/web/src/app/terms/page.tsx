import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { TERMS_DOC } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: TERMS_DOC.title,
  description: TERMS_DOC.description,
  alternates: { canonical: "/terms" },
};

export default function TermsRoute() {
  return <LegalPage doc={TERMS_DOC} />;
}
