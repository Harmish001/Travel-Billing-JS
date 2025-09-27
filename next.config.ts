import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'], // Add any other domains you're using for images
  },
};

const withPWA = nextPWA({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);