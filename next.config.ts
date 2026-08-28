import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // cacheComponents: true,
  allowedDevOrigins: [
    "192.168.22.16",
    "napkin-excess-overdrive.ngrok-free.dev",
  ],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.22.16",
      },
      {
        protocol: "http",
        hostname: "159.89.203.169",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "api.kliklelang.co.id",
      },
      {
        protocol: "https",
        hostname: "keu.klikinternal.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
