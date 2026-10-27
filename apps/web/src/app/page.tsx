import type { Metadata } from "next";
import { HomeLanding } from "@/components/home-landing";
import { SITE_NAME } from "@/lib/site";
import { buildHomeJsonLd, serializeJsonLd } from "@/lib/service-json-ld";

const TITLE = `Планування весілля онлайн: чекліст, бюджет, гості · ${SITE_NAME}`;
const DESCRIPTION =
  "Безкоштовна платформа для планування весілля в Україні: чекліст, бюджет, список гостей, розсадка, запрошення та сайт пари — усе вдвох в одному місці.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildHomeJsonLd()) }}
      />
      <HomeLanding />
    </>
  );
}
