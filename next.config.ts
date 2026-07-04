import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep the dev-tools badge out of the bottom-right corner used by the floating call button */
  devIndicators: {
    position: "bottom-left",
  },
};

export default nextConfig;
