/* Standard PDF fonts are ASCII/WinAnsi only — normalise fancy glyphs. */
export function ascii(s: string) {
  return (s || '')
    .replace(/[‒-―]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/₹/g, 'INR ')
}
