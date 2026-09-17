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
          "/admin",
          "/admin/",
          "/dashboard",
          "/budget",
          "/guests",
          "/invitations",
          "/website",
          "/settings",
          "/vendors",
          "/vesillya",
          "/my-vendors",
          "/moyi-pidryadnyky",
          "/favorites",
          "/requests",
          "/vendor",
          "/vendor/",
          "/login",
          "/forgot-password",
          "/confirm-email",
          "/email-confirmed",
          "/verify-email",
          "/register",
          "/rsvp",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
