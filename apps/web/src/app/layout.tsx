import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastViewport } from "@/components/toast-viewport";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — весільні професіонали поруч`,
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
    title: `${SITE_NAME} — весільні професіонали поруч`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — весільні професіонали поруч`,
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
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <AuthProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <ToastViewport />
        </AuthProvider>
      </body>
    </html>
  );
}
