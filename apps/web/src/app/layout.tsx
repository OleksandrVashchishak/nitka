import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastViewport } from "@/components/toast-viewport";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "NITKA — весільні професіонали поруч",
  description:
    "Знайдіть ідеальних весільних підрядників: фото, локації, музику, декор і beauty.",
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
