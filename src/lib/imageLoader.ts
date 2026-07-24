/* Custom next/image loader.

   assetPrefix rewrites /_next/static/* to the hub domain, but NOT the image
   optimizer endpoint (/_next/image). Without this, images 404 when the page is
   reverse-proxied at deltainstitutions.com/seminar (they'd hit that app's
   optimizer). Routing every image through the hub's optimizer makes images
   resolve from deltatradinghub.com on both domains, still optimized. */

/* Empty in dev so images load from the local server; hub domain in production. */
const HUB = process.env.NODE_ENV === 'production' ? 'https://deltatradinghub.com' : ''

export default function hubImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 75),
  })
  return `${HUB}/_next/image?${params.toString()}`
}
