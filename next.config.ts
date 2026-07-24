import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Serve static assets from the hub domain so the page also works when
     reverse-proxied under deltainstitutions.com/seminar (production only). */
  assetPrefix:
    process.env.NODE_ENV === "production" ? "https://deltatradinghub.com" : undefined,

  /* Keep the dev-tools badge out of the bottom-right corner used by the floating call button */
  devIndicators: {
    position: "bottom-left",
  },
};

export default nextConfig;
