/**
 * Default-region URLs are unprefixed (/shop); every other region keeps its
 * country prefix (/de/shop). Single source of truth for building hrefs.
 */
export const DEFAULT_COUNTRY = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
).toLowerCase()

export function countryPath(
  countryCode: string | string[] | undefined,
  path: string
) {
  const cc = (Array.isArray(countryCode) ? countryCode[0] : countryCode || "")
    .toLowerCase()
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (!cc || cc === DEFAULT_COUNTRY) {
    return normalized === "" ? "/" : normalized
  }
  return `/${cc}${normalized === "/" ? "" : normalized}`
}
