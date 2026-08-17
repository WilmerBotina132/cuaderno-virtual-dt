import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imagenes servidas desde Vercel Blob.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Miniaturas de YouTube.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
