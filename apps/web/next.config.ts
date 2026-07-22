import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Локально не тримаємо fetch/data cache між реквестами
  ...(isDev
    ? {
        experimental: {
          staleTimes: {
            dynamic: 0,
            static: 30,
          },
        },
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http",
        hostname: "api",
        port: "3001",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
