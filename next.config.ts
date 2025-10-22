import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'directus-tcg-shop.onrender.com',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**.render.com',
      },
      {
        protocol: 'https',
        hostname: 'pihjmdqfdxosppgdgyed.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
