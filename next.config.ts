import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Phosphor ships one module per icon behind a barrel file; without this the
  // dev server compiles all of them on every change.
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
