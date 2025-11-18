import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // cacheComponents: true,
  allowedDevOrigins: ["192.168.77.232"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.77.232",
      },
    ],
  },
};

export default nextConfig;
