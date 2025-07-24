import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kyliejennercosmetics.co.uk',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.sephora.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.stratiaskin.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.weleda.co.uk',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tirabeauty.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'theordinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.feelunique.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'skintrusted.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.therabody.co.uk',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.skinceuticals.co.uk',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'omniluxled.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
      
    ],
  },
};

export default nextConfig;
