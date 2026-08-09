import { HttpTypes } from "@medusajs/types"

/**
 * Parser for the Ascended Health product metadata shape (SUFI BLISS is the
 * template — see scripts/README.md once seeded):
 *
 *   ah_paragraphs   string[] | string   description paragraphs
 *   ah_applications string[] | string   "POTENTIAL APPLICATIONS" list
 *   ah_design       string[] | string   "Strategic design" long-form copy
 *   ah_frequencies  string[] | string   infused frequency rows
 *   ah_use          string              suggested use
 *   ah_price_line   string              e.g. "15mL ∙ $60"
 *
 * Every field is optional; sections simply don't render when absent, so
 * products keep working before their content is entered in admin.
 */

export type AhProductContent = {
  paragraphs: string[]
  applications: string[]
  design: string[]
  frequencies: string[]
  use: string | null
  ingredients: string | null
  warnings: string | null
  crossSell: string[]
  priceLine: string | null
}

function toList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
      } catch {
        // fall through to newline split
      }
    }
    return trimmed.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

export function getAhProductContent(
  product: HttpTypes.StoreProduct
): AhProductContent {
  const m = (product.metadata ?? {}) as Record<string, unknown>

  const paragraphs = toList(m.ah_paragraphs)

  return {
    // fall back to the plain description for products without metadata
    paragraphs: paragraphs.length
      ? paragraphs
      : toList(product.description ?? undefined),
    applications: toList(m.ah_applications),
    design: toList(m.ah_design),
    frequencies: toList(m.ah_frequencies),
    use: typeof m.ah_use === "string" && m.ah_use.trim() ? m.ah_use : null,
    ingredients:
      typeof m.ah_ingredients === "string" && m.ah_ingredients.trim()
        ? m.ah_ingredients
        : null,
    warnings:
      typeof m.ah_warnings === "string" && m.ah_warnings.trim()
        ? m.ah_warnings
        : null,
    crossSell: toList(m.ah_cross_sell),
    priceLine:
      typeof m.ah_price_line === "string" && m.ah_price_line.trim()
        ? m.ah_price_line
        : null,
  }
}
