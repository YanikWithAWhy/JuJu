import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile in the home
  // directory was otherwise being inferred as the root).
  turbopack: {
    root: path.resolve(),
  },
};

export default nextConfig;
