import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const usePolling =
  process.env.WATCHPACK_POLLING === "true" ||
  process.env.CHOKIDAR_USEPOLLING === "true";

const nextConfig: NextConfig = {
  // Next 16: production build = Turbopack; порожній turbopack глушить конфлікт з optional webpack
  turbopack: {},
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
  // Windows + Docker bind mounts: webpack polling лише коли явно увімкнено (dev:docker)
  ...(usePolling
    ? {
        webpack: (config: {
          watchOptions?: Record<string, unknown>;
        }) => {
          config.watchOptions = {
            ...config.watchOptions,
            poll: Number(process.env.WATCHPACK_POLL_INTERVAL || 1000),
            aggregateTimeout: 300,
            ignored: /node_modules/,
          };
          return config;
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
