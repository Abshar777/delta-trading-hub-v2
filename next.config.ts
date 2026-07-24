import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Serve static assets from the hub domain so the page also works when
     reverse-proxied under deltainstitutions.com/seminar (production only). */
  assetPrefix:
    process.env.NODE_ENV === "production" ? "https://deltatradinghub.com" : undefined,

  /* Route next/image through the hub's optimizer (assetPrefix doesn't cover
     /_next/image), so images also load correctly on the proxied mirror. */
  images: {
    loaderFile: "./src/lib/imageLoader.ts",
  },

  /* Keep the dev-tools badge out of the bottom-right corner used by the floating call button */
  devIndicators: {
    position: "bottom-left",
  },

  async redirects() {
    return [
      { source: "/seminar-bangalore", destination: "/seminar", permanent: true },
    ]
  },
};

export default nextConfig;
