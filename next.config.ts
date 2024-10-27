import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    movieBaseUrl: "http://localhost:3000/",
  },
  images: {
    domains: ["localhost"], // Add localhost to the allowed domains
  },
};

export default nextConfig;
