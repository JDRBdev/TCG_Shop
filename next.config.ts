import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'directus-tcg-shop.onrender.com',
        port: '',
        pathname: '/assets/**',
      },
      // Puedes agregar más hosts si necesitas
      {
        protocol: 'https',
        hostname: '**.render.com',
      },
    ],
  },
  // Otras configuraciones que quieras agregar...
};

export default nextConfig;