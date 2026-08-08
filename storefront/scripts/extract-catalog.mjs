/**
 * Extracts the Ascended Health migration workbook into the committed
 * source-of-truth JSON the seed, chrome generator and redirect layer read.
 *
 *   node scripts/extract-catalog.mjs [path-to-xlsx]
 *   → scripts/data/ah-catalog.json
 *
 * Encodes the migration decisions:
 * - legacy handles are canonical
 * - the Marine Phytoplankton co-op subscription row is skipped
 * - unverified products (prana-longevity-powder,
 *   combo-neopulser-proalive-activedetox) become status:draft
 * - the xlsx's 11 category strings collapse to the approved 8-category IA
 * - SKUs are generated (the site never published any)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import xlsx from "xlsx"

const XLSX_PATH =
  process.argv[2] ?? "/Users/peter/AHMedusa/Ascended_Health_Catalog_Migration.xlsx"
const OUT = path.join(process.cwd(), "scripts/data/ah-catalog.json")

/* ── Final category architecture (approved 7-category IA + AH Cafe) ── */
const CATEGORIES = [
  { handle: "dental-gum-care", title: "Dental & Gum Care", numeral: "I.", tint: "dental", rank: 0 },
  { handle: "skin-regeneration", title: "Skin Regeneration", numeral: "II.", tint: "skin", rank: 1 },
  { handle: "superfood-supplements", title: "Concentrated Superfood Supplements", numeral: "III.", tint: "superfood", rank: 2 },
  { handle: "energetic-consciousness", title: "Energetic Consciousness", numeral: "IV.", tint: "energy", rank: 3 },
  { handle: "skin-infection-healing", title: "Skin Infection & Healing", numeral: "V.", tint: "skin", rank: 4 },
  { handle: "liquid-probiotics", title: "Liquid Probiotics", numeral: "VI.", tint: "probiotic", rank: 5 },
  { handle: "longevity", title: "Longevity", numeral: "VII.", tint: "longevity", rank: 6 },
  { handle: "ah-cafe", title: "AH Cafe", numeral: "VIII.", tint: "superfood", rank: 7 },
]

/* xlsx Category string → final category handle(s). Multi-membership allowed. */
const CATEGORY_MAP = {
  "Dental / Gum Health": ["dental-gum-care"],
  "Skin Care": ["skin-regeneration"],
  "Skin Care / Energetic Consciousness": ["energetic-consciousness"],
  "Skin Care / Devices": ["skin-infection-healing"],
  "Skin Care / Bundles": ["skin-infection-healing"],
  "Essential Superfood": ["superfood-supplements"],
  "Longevity": ["longevity"],
  "Liquid Probiotics": ["liquid-probiotics"],
  "Liquid Probiotics / Bundles": ["liquid-probiotics"],
  "Energetic Consciousness": ["energetic-consciousness"],
  "AH Cafe": ["ah-cafe"],
}

/* Per-product overrides on top of the map. */
const PRODUCT_CATEGORY_OVERRIDES = {
  // Anti-Venom Balm and Triple Skin Oil are the Skin Infection & Healing core;
  // Triple Skin also stays in Skin Regeneration (approved IA lists it there).
  "anti-venom-balm": ["skin-infection-healing"],
  "triple-skin-oil": ["skin-regeneration", "skin-infection-healing"],
  "i-am-beautiful-oil": ["skin-regeneration"],
  "dermalive-topical-probiotic": ["skin-regeneration"],
}

const DRAFT_HANDLES = new Set([
  "prana-longevity-powder",
  "combo-neopulser-proalive-activedetox",
])

const SKIP_VARIANTS = [
  { handle: "marine-phytoplankton", match: /co-?op/i }, // PayPal subscription — out of scope
]

/* Stock quantity placeholders (client to supply real numbers). */
const QTY_IN_STOCK = 100
const QTY_AH_CAFE = 25

const wb = xlsx.read(readFileSync(XLSX_PATH))

const rows = xlsx.utils.sheet_to_json(wb.Sheets["Product Catalog"], { defval: "" })
const imageRows = xlsx.utils.sheet_to_json(wb.Sheets["Images"], { defval: "" })
const redirectRows = xlsx.utils.sheet_to_json(wb.Sheets["Redirects"], { defval: "" })

const clean = (v) => String(v ?? "").trim()

/* SKU generation: AH + compact handle token + size token */
function makeSku(handle, variantTitle, size) {
  const h = handle
    .replace(/[^a-z0-9]+/gi, "-")
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 4).toUpperCase())
    .slice(0, 3)
    .join("-")
  const s =
    clean(size || variantTitle)
      .replace(/[^a-z0-9]+/gi, "")
      .toUpperCase()
      .slice(0, 10) || "STD"
  return `AH-${h}-${s}`
}

const products = new Map()

for (const r of rows) {
  const handle = clean(r["Handle"])
  if (!handle) continue

  const variantTitle = clean(r["Variant / Option"]) || "Default"
  const skip = SKIP_VARIANTS.some(
    (s) => s.handle === handle && s.match.test(variantTitle)
  )
  if (skip) continue

  const availability = clean(r["Availability"]).toLowerCase()
  const inStock = availability !== "out of stock" && availability !== "unverified"
  const price = Number(String(r["Price (USD)"]).replace(/[^0-9.]/g, ""))

  if (!products.has(handle)) {
    const catStr = clean(r["Category"])
    const categories =
      PRODUCT_CATEGORY_OVERRIDES[handle] ??
      CATEGORY_MAP[catStr] ??
      (() => {
        throw new Error(`Unmapped category "${catStr}" for ${handle}`)
      })()

    products.set(handle, {
      productId: clean(r["Product ID"]),
      handle,
      title: clean(r["Product Name"]),
      subtitle: clean(r["Short Description"]).toLowerCase(),
      vendor: clean(r["Brand / Vendor"]),
      status: DRAFT_HANDLES.has(handle) ? "draft" : "published",
      categories,
      sourceUrl: clean(r["Product Page URL"]),
      copy: {
        shortDescription: clean(r["Short Description"]),
        fullDescription: clean(r["Full Description"]),
        directions: clean(r["Directions / Usage"]),
        ingredients: clean(r["Key Ingredients"]),
        warnings: clean(r["Warnings / Storage"]),
        crossSellNames: clean(r["Cross-sell"]),
      },
      variants: [],
      images: [],
      notes: [],
    })
  }

  const p = products.get(handle)
  p.variants.push({
    title: variantTitle,
    sku: makeSku(handle, variantTitle, clean(r["Size / Weight"])),
    price,
    inStock,
    availability: clean(r["Availability"]) || "Not stated",
    size: clean(r["Size / Weight"]),
    quantity: !inStock
      ? 0
      : p.categories.includes("ah-cafe")
      ? QTY_AH_CAFE
      : QTY_IN_STOCK,
  })
  const note = clean(r["Migration Notes"])
  if (note) p.notes.push(note)
}

/* Images: main → additional → label per product */
const ROLE_ORDER = { Main: 0, Additional: 1, Label: 2 }
for (const r of imageRows) {
  const handle = clean(r["Handle"])
  const p = products.get(handle)
  if (!p) continue
  p.images.push({
    url: clean(r["Image URL"]),
    role: clean(r["Role"]) || "Additional",
  })
}
for (const p of products.values()) {
  p.images.sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9)
  )
}

/* Cross-sell name → handle resolution (best effort by title inclusion) */
const byTitleFrag = [...products.values()].map((p) => ({
  handle: p.handle,
  title: p.title.toLowerCase(),
}))
for (const p of products.values()) {
  const names = p.copy.crossSellNames
    .split(/[;,]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s && !/ah cafe line/i.test(s))
  p.crossSell = names
    .map((n) => {
      const hit = byTitleFrag.find(
        (t) =>
          t.handle !== p.handle && (t.title.includes(n) || n.includes(t.title))
      )
      return hit?.handle
    })
    .filter(Boolean)
}

/* Redirects: product rules pass through; collection targets translated */
const COLLECTION_TO_CATEGORY = {
  "/collections/dental-gum-health": "/categories/dental-gum-care",
  "/collections/skin-care": "/categories/skin-regeneration",
  "/collections/superfood": "/categories/superfood-supplements",
  "/collections/liquid-probiotics": "/categories/liquid-probiotics",
  "/collections/energetic-consciousness": "/categories/energetic-consciousness",
  "/collections/longevity": "/categories/longevity",
  "/collections/ah-cafe": "/categories/ah-cafe",
}

const redirects = []
const seenSources = new Set()
for (const r of redirectRows) {
  let source = clean(r["Old URL (path)"])
  let target = clean(r["Suggested New Target"])
  if (!source || !target) continue
  if (source === "/products/*") continue // handled as explicit rules + fallback, never a wildcard

  // Longevity collision: the sheet maps /products_Longevity.htm to both the
  // Prana product and the Longevity collection. Prana imports as draft, so
  // the interim canonical target is the category page.
  if (source.replace(/\s+$/, "") === "/products_Longevity.htm") {
    source = "/products_Longevity.htm"
    target = "/categories/longevity"
  }
  if (COLLECTION_TO_CATEGORY[target]) target = COLLECTION_TO_CATEGORY[target]
  if (target === "/policies/terms-of-service") target = "/policies"

  if (seenSources.has(source)) continue
  seenSources.add(source)
  redirects.push({ source, destination: target, permanent: true })
}

const out = {
  generatedFrom: path.basename(XLSX_PATH),
  generatedAt: new Date().toISOString(),
  categories: CATEGORIES,
  products: [...products.values()],
  redirects,
}

mkdirSync(path.dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 2))

/* Report */
const all = [...products.values()]
const variantCount = all.reduce((n, p) => n + p.variants.length, 0)
const oos = all.flatMap((p) =>
  p.variants.filter((v) => !v.inStock).map((v) => `${p.handle} · ${v.title}`)
)
console.log(`products: ${all.length}  variants: ${variantCount}`)
console.log(`drafts: ${all.filter((p) => p.status === "draft").map((p) => p.handle).join(", ")}`)
console.log(`out-of-stock variants (${oos.length}):`)
oos.forEach((l) => console.log("  •", l))
console.log(`no images: ${all.filter((p) => p.images.length === 0).map((p) => p.handle).join(", ") || "none"}`)
console.log(`redirect rules: ${redirects.length}`)
console.log(`written: ${OUT}`)
