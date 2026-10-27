import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/budget",
          "/guests",
          "/website",
          "/settings",
          "/support",
          "/my-vendors",
          "/moyi-pidryadnyky",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/confirm-email",
          "/email-confirmed",
          "/verify-email",
          "/register",
          "/admin",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
