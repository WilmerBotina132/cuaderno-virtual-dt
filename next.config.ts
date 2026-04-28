import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cuaderno-virtual-dt",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;