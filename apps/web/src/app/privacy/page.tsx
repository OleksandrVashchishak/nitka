import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY_DOC } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: PRIVACY_DOC.title,
  description: PRIVACY_DOC.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyRoute() {
  return <LegalPage doc={PRIVACY_DOC} />;
}
