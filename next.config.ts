import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // tamamen statik HTML/CSS/JS üretir -> out/ klasörü
  reactCompiler: true,
};

export default nextConfig;
