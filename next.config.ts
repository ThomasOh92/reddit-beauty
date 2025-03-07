import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kyliejennercosmetics.co.uk',
        port: '',
      },
    ],
  },
};

export default nextConfig;
