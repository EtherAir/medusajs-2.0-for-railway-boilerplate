/**
 * Emits src/lib/constants/ah-catalog.generated.ts from ah-catalog.json —
 * the static catalog map the chrome (mega menu, footer, mobile menu,
 * homepage) renders without runtime backend calls.
 *
 *   node scripts/generate-ah-constants.mjs
 */
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts/data/ah-catalog.json"))
)

const fmt = (n) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`)

const categories = catalog.categories.map((cat) => {
  const products = catalog.products
    .filter((p) => p.categories[0] === cat.handle && p.status === "published")
    .map((p) => {
      const prices = [...new Set(p.variants.map((v) => v.price))]
      const min = Math.min(...prices)
      return {
        name: p.title,
        descriptor: p.subtitle,
        price: prices.length > 1 ? `from ${fmt(min)}` : fmt(min),
        image: p.cardImage ?? "",
        handle: p.handle,
      }
    })
  return { numeral: cat.numeral, title: cat.title, handle: cat.handle, tint: cat.tint, products }
})

const visible = categories.filter((c) => c.products.length > 0)

const ts = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/data/ah-catalog.json (from the migration workbook).
 * Regenerate with: node scripts/generate-ah-constants.mjs
 *
 * Only PUBLISHED products appear; a product's primary category is the first
 * entry in its categories array. Categories with no published products are
 * omitted (e.g. Longevity while Prana Longevity Powder is a draft).
 */
import type { AhCategory } from "./ah"

export const AH_CATALOG: AhCategory[] = ${JSON.stringify(visible, null, 2)}
`

const out = path.join(process.cwd(), "src/lib/constants/ah-catalog.generated.ts")
writeFileSync(out, ts)
console.log(
  `written: ${out} — ${visible.length} categories, ${visible.reduce((n, c) => n + c.products.length, 0)} products`
)
