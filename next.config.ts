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
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "static.lenskart.com",
      },
      {
        protocol: "https",
        hostname: "static1.lenskart.com",
      },
      {
        protocol: "https",
        hostname: "static5.lenskart.com",
      },
    ],
  },
};

export default nextConfig;
