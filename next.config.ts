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
    "agent0-sdk",
    "helia",
    "@libp2p/webrtc",
    "@ipshipyard/node-datachannel",
  ],
};

export default nextConfig;
