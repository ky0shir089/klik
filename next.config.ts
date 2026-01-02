import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // cacheComponents: true,
  allowedDevOrigins: ["192.168.77.253"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.77.253",
      },
      {
        protocol: "https",
        hostname: "klik-lelang.vercel.app",
      },
      {
        protocol: "https",
        hostname: "api.kliklelang.co.id",
      },
    ],
  },
};

export default nextConfig;
