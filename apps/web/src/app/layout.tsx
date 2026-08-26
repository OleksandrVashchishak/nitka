import type { Metadata } from "next";
import "./globals.css";
import "./hero-artboard.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterWrapper } from "@/components/site-footer";
import { ToastViewport } from "@/components/toast-viewport";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import {
  akzidenz,
  akzidenzExt,
  cormorant,
  mak,
  montserrat,
  scriptCyr,
} from "@/lib/fonts";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — планування весілля без хаосу`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — планування весілля без хаосу`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — планування весілля без хаосу`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${akzidenz.variable} ${akzidenzExt.variable} ${mak.variable} ${cormorant.variable} ${scriptCyr.variable} ${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooterWrapper />
          <ToastViewport />
        </AuthProvider>
      </body>
    </html>
  );
}
