import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
