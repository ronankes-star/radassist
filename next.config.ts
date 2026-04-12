import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (used by `next dev` in Next.js 16+)
  turbopack: {
    rules: {
      "*.wasm": {
        loaders: [],
        as: "*.wasm",
      },
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    // Handle WASM files for Cornerstone codecs
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },
  // Allow Supabase storage domain for images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
