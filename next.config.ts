import type { NextConfig } from "next";

// Old Squarespace URLs land on their section.
const moved: Record<string, string> = {
  shows: "shows",
  music: "music",
  video: "video",
  merch: "store",
};

const nextConfig: NextConfig = {
  agentRules: false,
  async redirects() {
    return Object.entries(moved).map(([from, to]) => ({
      source: `/${from}`,
      destination: `/#${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
