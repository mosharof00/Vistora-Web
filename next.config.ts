import type { NextConfig } from "next";

const UPLOAD_LIMIT = "16mb";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: UPLOAD_LIMIT,
    },
    proxyClientMaxBodySize: UPLOAD_LIMIT,
  },
  agentRules: false,
};

export default nextConfig;
