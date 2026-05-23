import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: [
    "@repo/brand",
    "@repo/ui",
    "@repo/db",
    "@repo/stripe",
    "@repo/email",
  ],
  serverExternalPackages: [
    "stripe",
    "@prisma/client",
    "resend",
    "@react-email/components",
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  typedRoutes: true,
};

export default nextConfig;
