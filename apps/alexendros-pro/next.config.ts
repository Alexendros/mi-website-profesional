import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/brand",
    "@repo/ui",
    "@repo/db",
    "@repo/stripe",
    "@repo/email",
  ],
};

export default nextConfig;
