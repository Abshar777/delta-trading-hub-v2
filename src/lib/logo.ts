import fs from 'fs'
import path from 'path'

/* The white logo — shows on the dark header bands of the PDF + email. */
let cached: Buffer | null | undefined

export function getLogoBuffer(): Buffer | null {
  if (cached !== undefined) return cached
  try {
    cached = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
  } catch {
    cached = null
  }
  return cached
}
