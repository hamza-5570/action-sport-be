import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "groupmoussa.ma",
        pathname: "**", // Autorise toutes les images de ce domaine
      },
    ],
  },
};

export default nextConfig;
