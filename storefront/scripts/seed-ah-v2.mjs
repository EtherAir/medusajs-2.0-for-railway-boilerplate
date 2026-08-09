/**
 * Ascended Health real-catalog migrator (replaces seed-ah.mjs).
 * Driven by scripts/data/ah-catalog.json (+ scripts/data/ah-copy.json when
 * present — approved copy overrides the workbook excerpts).
 *
 * Idempotent: categories/products upsert by handle; variants reconcile by
 * SKU diff (create missing, update matched title/price, delete undesired) so
 * re-runs are stable and existing variant IDs survive.
 *
 * Usage:
 *   MEDUSA_BACKEND_URL=... MEDUSA_ADMIN_EMAIL=... MEDUSA_ADMIN_PASSWORD=... \
 *   node scripts/seed-ah-v2.mjs [--dry-run] [--cleanup] [--products=h1,h2]
 *
 * --cleanup additionally deletes the 20 placeholder rebrand products and the
 * 4 retired placeholder categories. sufi-bliss-ascension-oil and the
 * energetic-consciousness / longevity category handles are shared between
 * old and new sets — they are updated in place, never deleted.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"

const BASE = (process.env.MEDUSA_BACKEND_URL ?? "").replace(/\/$/, "")
const EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD
const DRY = process.argv.includes("--dry-run")
const CLEANUP = process.argv.includes("--cleanup")
const ONLY = process.argv
  .find((a) => a.startsWith("--products="))
  ?.slice("--products=".length)
  .split(",")
  .filter(Boolean)

if (!BASE || !EMAIL || !PASSWORD) {
  console.error("Missing env: MEDUSA_BACKEND_URL, MEDUSA_ADMIN_EMAIL, MEDUSA_ADMIN_PASSWORD")
  process.exit(1)
}

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts/data/ah-catalog.json"))
)
const copyPath = path.join(process.cwd(), "scripts/data/ah-copy.json")
const approvedCopy = existsSync(copyPath) ? JSON.parse(readFileSync(copyPath)) : {}

const MANIFEST_PATH = path.join(process.cwd(), "scripts/data/.upload-manifest.json")
const manifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH))
  : {}

const REBRAND_PRODUCT_HANDLES = [
  "recover", "oralive-detoxifying", "oralive-unsweetened-detoxifying",
  "oralive-extra-strength", "oralive-unsweetened-extra-strength", "remedy",
  "flourish", "regenerate", "heal", "rejuvenate", "supercharge", "ascend",
  "foundations", "energize", "align", "superconscious", "protect", "balance",
  "biome-detox", "extend",
]
const RETIRED_CATEGORY_HANDLES = [
  "dental-care-gum-health", "skin-regeneration-healing",
  "essential-superfood", "probiotics",
]

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif" }

let token = null
async function api(pathname, init = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    ...init,
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${init.method ?? "GET"} ${pathname} → ${res.status}: ${text.slice(0, 400)}`)
  }
  return res.json()
}

function buildMetadata(p) {
  const copy = approvedCopy[p.handle] ?? {}
  const paras =
    copy.paragraphs?.length
      ? copy.paragraphs
      : p.copy.fullDescription
      ? p.copy.fullDescription.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
      : []
  const meta = {}
  if (paras.length) meta.ah_paragraphs = JSON.stringify(paras)
  const use = copy.use || p.copy.directions
  if (use) meta.ah_use = use
  const ingredients = copy.ingredients || p.copy.ingredients
  if (ingredients) meta.ah_ingredients = ingredients
  const warnings = copy.warnings || p.copy.warnings
  if (warnings) meta.ah_warnings = warnings
  if (copy.applications?.length) meta.ah_applications = JSON.stringify(copy.applications)
  if (copy.design?.length) meta.ah_design = JSON.stringify(copy.design)
  if (copy.frequencies?.length) meta.ah_frequencies = JSON.stringify(copy.frequencies)
  if (p.crossSell?.length) meta.ah_cross_sell = JSON.stringify(p.crossSell)
  return meta
}

async function uploadImage(localPath) {
  const abs = path.join(process.cwd(), localPath)
  if (!existsSync(abs)) return null
  const buf = readFileSync(abs)
  const hash = `${localPath}:${buf.length}`
  if (manifest[hash]) return manifest[hash]
  if (DRY) return `dry://${localPath}`
  const ext = path.extname(abs).toLowerCase()
  const form = new FormData()
  form.append(
    "files",
    new Blob([buf], { type: MIME[ext] ?? "application/octet-stream" }),
    path.basename(abs)
  )
  const { files } = await api("/admin/uploads", { method: "POST", body: form })
  const url = files?.[0]?.url ?? null
  if (url) {
    manifest[hash] = url
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  }
  return url
}

/* ── auth + infrastructure ── */
const auth = await fetch(`${BASE}/auth/user/emailpass`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
if (!auth.ok) {
  console.error("Auth failed:", auth.status, await auth.text())
  process.exit(1)
}
token = (await auth.json()).token
console.log(`Authenticated. ${DRY ? "(DRY RUN — no writes)" : ""}`)

const { sales_channels } = await api("/admin/sales-channels?limit=10")
const channel = sales_channels?.[0]
if (!channel) throw new Error("No sales channel found")

const { shipping_profiles } = await api("/admin/shipping-profiles?limit=10")
const shippingProfile = shipping_profiles?.[0]
if (!shippingProfile) throw new Error("No shipping profile found")

let { stock_locations } = await api("/admin/stock-locations?limit=10")
let location = stock_locations?.[0]
if (!location && !DRY) {
  const res = await api("/admin/stock-locations", {
    method: "POST",
    body: JSON.stringify({ name: "Ascended Health" }),
  })
  location = res.stock_location
  await api(`/admin/stock-locations/${location.id}/sales-channels`, {
    method: "POST",
    body: JSON.stringify({ add: [channel.id] }),
  })
}
console.log("channel:", channel.name, "· location:", location?.name ?? "(dry)")

const report = {
  categoriesUpserted: 0, created: [], updated: [],
  variantsCreated: 0, variantsUpdated: 0, variantsDeleted: 0,
  inventorySet: 0, deletedProducts: [], deletedCategories: [], warnings: [],
}

/* ── categories ── */
const catIds = {}
for (const c of catalog.categories) {
  const { product_categories } = await api(`/admin/product-categories?handle=${c.handle}`)
  let cat = product_categories?.[0]
  const payload = {
    name: c.title,
    is_active: true,
    rank: c.rank,
    metadata: { numeral: c.numeral, tint: c.tint },
  }
  if (DRY) {
    console.log(`[dry] category ${cat ? "update" : "create"}: ${c.handle}`)
    catIds[c.handle] = cat?.id ?? `dry_${c.handle}`
  } else if (cat) {
    await api(`/admin/product-categories/${cat.id}`, { method: "POST", body: JSON.stringify(payload) })
    catIds[c.handle] = cat.id
  } else {
    const res = await api("/admin/product-categories", {
      method: "POST",
      body: JSON.stringify({ ...payload, handle: c.handle }),
    })
    catIds[c.handle] = res.product_category.id
  }
  report.categoriesUpserted++
}
console.log("categories ok:", report.categoriesUpserted)

/* ── products ── */
const productList = catalog.products.filter((p) => !ONLY || ONLY.includes(p.handle))

for (const p of productList) {
  // upload images (ordered main → additional → label)
  const uploaded = []
  for (const img of p.images) {
    if (!img.localPath) continue
    const url = await uploadImage(img.localPath)
    if (url) uploaded.push(url)
  }

  const metadata = buildMetadata(p)
  const base = {
    title: p.title,
    shipping_profile_id: shippingProfile.id,
    subtitle: p.subtitle,
    status: p.status,
    categories: p.categories.map((h) => ({ id: catIds[h] })),
    ...(uploaded.length ? { thumbnail: uploaded[0], images: uploaded.map((url) => ({ url })) } : {}),
    ...(Object.keys(metadata).length ? { metadata } : {}),
  }

  const { products } = await api(`/admin/products?handle=${p.handle}&fields=*variants,*variants.options,*options,*options.values`)
  const existing = products?.[0]

  if (!existing) {
    if (DRY) {
      console.log(`[dry] create product ${p.handle} (${p.variants.length} variants)`)
      report.created.push(p.handle)
      continue
    }
    await api("/admin/products", {
      method: "POST",
      body: JSON.stringify({
        ...base,
        handle: p.handle,
        sales_channels: [{ id: channel.id }],
        options: [{ title: "Size", values: p.variants.map((v) => v.title) }],
        variants: p.variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          options: { Size: v.title },
          prices: [{ amount: v.price, currency_code: "usd" }],
          manage_inventory: true,
        })),
      }),
    })
    report.created.push(p.handle)
  } else {
    if (DRY) {
      const existingSkus = (existing.variants ?? []).map((v) => v.sku)
      console.log(`[dry] update ${p.handle}: existing skus [${existingSkus}] → desired [${p.variants.map((v) => v.sku)}]`)
      report.updated.push(p.handle)
      continue
    }
    // Structural change detection: if the existing Size option is missing any
    // desired value, variants can't be created (2.17 has no option-value
    // update API) — delete and recreate the product. Safe pre-orders; logged.
    const sizeOption = (existing.options ?? []).find((o) => o.title === "Size")
    const haveValues = new Set(
      (sizeOption?.values ?? []).map((v) => (typeof v === "string" ? v : v.value))
    )
    const needsRebuild =
      !sizeOption || p.variants.some((v) => !haveValues.has(v.title))

    if (needsRebuild) {
      console.log(`  rebuilding ${p.handle} (option values changed)`)
      await api(`/admin/products/${existing.id}`, { method: "DELETE" })
      await api("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...base,
          handle: p.handle,
          sales_channels: [{ id: channel.id }],
          options: [{ title: "Size", values: p.variants.map((v) => v.title) }],
          variants: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            options: { Size: v.title },
            prices: [{ amount: v.price, currency_code: "usd" }],
            manage_inventory: true,
          })),
        }),
      })
      report.updated.push(`${p.handle} (rebuilt)`)
      console.log("product ok:", p.handle)
      continue
    }

    await api(`/admin/products/${existing.id}`, { method: "POST", body: JSON.stringify(base) })

    // variant reconcile by SKU (fall back to title match for legacy "Default")
    const existingVariants = existing.variants ?? []
    const desiredBySku = new Map(p.variants.map((v) => [v.sku, v]))
    const matched = new Set()

    for (const ev of existingVariants) {
      const desired = desiredBySku.get(ev.sku)
      if (desired) {
        matched.add(desired.sku)
        await api(`/admin/products/${existing.id}/variants/${ev.id}`, {
          method: "POST",
          body: JSON.stringify({
            title: desired.title,
            options: { Size: desired.title },
            prices: [{ amount: desired.price, currency_code: "usd" }],
            manage_inventory: true,
          }),
        })
        report.variantsUpdated++
      } else {
        await api(`/admin/products/${existing.id}/variants/${ev.id}`, { method: "DELETE" })
        report.variantsDeleted++
      }
    }
    for (const v of p.variants) {
      if (matched.has(v.sku)) continue
      await api(`/admin/products/${existing.id}/variants`, {
        method: "POST",
        body: JSON.stringify({
          title: v.title,
          sku: v.sku,
          options: { Size: v.title },
          prices: [{ amount: v.price, currency_code: "usd" }],
          manage_inventory: true,
        }),
      })
      report.variantsCreated++
    }
    report.updated.push(p.handle)
  }
  console.log("product ok:", p.handle)
}

/* ── inventory levels ── */
if (!DRY && location) {
  for (const p of productList) {
    for (const v of p.variants) {
      const { inventory_items } = await api(
        `/admin/inventory-items?sku=${encodeURIComponent(v.sku)}`
      )
      const item = inventory_items?.[0]
      if (!item) {
        report.warnings.push(`no inventory item for ${v.sku}`)
        continue
      }
      const { inventory_levels } = await api(
        `/admin/inventory-items/${item.id}/location-levels`
      )
      const level = inventory_levels?.find((l) => l.location_id === location.id)
      if (level) {
        await api(`/admin/inventory-items/${item.id}/location-levels/${location.id}`, {
          method: "POST",
          body: JSON.stringify({ stocked_quantity: v.quantity }),
        })
      } else {
        await api(`/admin/inventory-items/${item.id}/location-levels`, {
          method: "POST",
          body: JSON.stringify({ location_id: location.id, stocked_quantity: v.quantity }),
        })
      }
      report.inventorySet++
    }
  }
  console.log("inventory levels set:", report.inventorySet)
}

/* ── cleanup of the placeholder rebrand catalog ── */
if (CLEANUP) {
  for (const handle of REBRAND_PRODUCT_HANDLES) {
    const { products } = await api(`/admin/products?handle=${handle}`)
    if (products?.[0]) {
      if (DRY) console.log(`[dry] delete product ${handle}`)
      else await api(`/admin/products/${products[0].id}`, { method: "DELETE" })
      report.deletedProducts.push(handle)
    }
  }
  for (const handle of RETIRED_CATEGORY_HANDLES) {
    const { product_categories } = await api(`/admin/product-categories?handle=${handle}`)
    if (product_categories?.[0]) {
      if (DRY) console.log(`[dry] delete category ${handle}`)
      else await api(`/admin/product-categories/${product_categories[0].id}`, { method: "DELETE" })
      report.deletedCategories.push(handle)
    }
  }
}

/* ── report ── */
console.log("\n=== MIGRATION REPORT ===")
console.log(`categories upserted: ${report.categoriesUpserted}`)
console.log(`products created: ${report.created.length}  updated: ${report.updated.length}`)
console.log(`variants created/updated/deleted: ${report.variantsCreated}/${report.variantsUpdated}/${report.variantsDeleted}`)
console.log(`inventory levels set: ${report.inventorySet}`)
if (report.deletedProducts.length)
  console.log(`cleanup deleted products (${report.deletedProducts.length}): ${report.deletedProducts.join(", ")}`)
if (report.deletedCategories.length)
  console.log(`cleanup deleted categories: ${report.deletedCategories.join(", ")}`)
if (report.warnings.length) {
  console.log("WARNINGS:")
  report.warnings.forEach((w) => console.log("  •", w))
}
