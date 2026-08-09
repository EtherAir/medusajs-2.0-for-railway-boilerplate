/**
 * Ascended Health chrome constants.
 *
 * The catalog map (categories, numerals, tints, product cards) is GENERATED
 * from the migration workbook — see ah-catalog.generated.ts and
 * scripts/generate-ah-constants.mjs. This file re-exports it and holds the
 * few non-catalog constants.
 */

export type AhProduct = {
  name: string
  descriptor: string
  price: string
  image: string
  handle: string
}

export type AhCategory = {
  numeral: string
  title: string
  handle: string
  tint: "dental" | "skin" | "superfood" | "energy" | "probiotic" | "longevity"
  products: AhProduct[]
}

export { AH_CATALOG as AH_CATEGORIES } from "./ah-catalog.generated"

export const AH_ANNOUNCEMENT = "Free shipping on US orders over $250."

export const AH_CONTACT = {
  web: "AscendedHealth.com",
  phone: "310.683.0333",
  email: "products@ascendedhealth.com",
  text: "323.899.1588",
}

export const AH_FOOTER_LINKS = [
  { label: "Our Story", href: "/our-story" },
  { label: "Learn", href: "/learn" },
  { label: "Contact Us", href: "/contact" },
  { label: "My Account", href: "/account" },
]

export const AH_COMMUNITY_LINE =
  "FOLLOW. ENGAGE. FLOURISH.\nFind our community online @ascendedhealth."
