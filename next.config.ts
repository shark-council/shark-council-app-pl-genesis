import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@storacha/client",
    "@ucanto/core",
    "@ucanto/transport",
    "@ucanto/principal",
    "@ucanto/interface",
    "@ipld/car",
    "multiformats",
  ],
};

export default nextConfig;
