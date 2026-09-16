import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "be-trashly-production.up.railway.app",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://be-trashly-production.up.railway.app/api/v1/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "https://be-trashly-production.up.railway.app/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
