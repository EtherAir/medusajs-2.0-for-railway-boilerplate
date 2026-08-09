/**
 * M6 content-QA sweep: compares every product on the live backend against
 * scripts/data/ah-catalog.json + ah-copy.json and sweeps the storefront's
 * key pages + redirect rules. Emits a markdown report.
 *
 *   node scripts/qa-checklist.mjs <storefront-base-url> <output.md>
 */
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const SITE = (process.argv[2] ?? "https://storefront-production-0430.up.railway.app").replace(/\/$/, "")
const OUT = process.argv[3] ?? "qa-report.md"
const BACKEND = "https://backend-production-300d.up.railway.app"
const PK = "pk_aba205d4a122f64037974ef0b86e65440836adf05ba12443820aceb2fc066ae1"

const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "scripts/data/ah-catalog.json")))
const copy = JSON.parse(readFileSync(path.join(process.cwd(), "scripts/data/ah-copy.json")))

const lines = []
const issues = []
const ok = (s) => lines.push(`- [x] ${s}`)
const bad = (s) => { lines.push(`- [ ] **${s}**`); issues.push(s) }

async function store(pathname) {
  const res = await fetch(`${BACKEND}${pathname}`, {
    headers: { "x-publishable-api-key": PK },
  })
  if (!res.ok) throw new Error(`${pathname} → ${res.status}`)
  return res.json()
}

lines.push(`# Ascended Health migration — content QA report`)
lines.push(`Generated ${new Date().toISOString()} against ${SITE}\n`)

/* ── products ── */
lines.push(`## Products (${catalog.products.length})`)
const { regions } = await store("/store/regions")
const regionId = regions[0].id

for (const p of catalog.products) {
  const label = `**${p.handle}**`
  const { products } = await store(
    `/store/products?handle=${p.handle}&region_id=${regionId}&fields=*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+metadata,*categories,+status`
  )
  const live = products[0]

  if (p.status === "draft") {
    if (live) bad(`${label}: DRAFT product is visible in the store API`)
    else ok(`${label}: draft, correctly hidden`)
    continue
  }
  if (!live) { bad(`${label}: MISSING from store API`); continue }

  const problems = []
  if (live.title !== p.title) problems.push(`title "${live.title}" ≠ "${p.title}"`)
  if ((live.variants?.length ?? 0) !== p.variants.length)
    problems.push(`${live.variants?.length ?? 0} variants (want ${p.variants.length})`)
  for (const v of p.variants) {
    const lv = (live.variants ?? []).find((x) => x.sku === v.sku)
    if (!lv) { problems.push(`variant ${v.sku} missing`); continue }
    const amt = lv.calculated_price?.calculated_amount
    if (amt !== v.price) problems.push(`${v.sku} price ${amt} ≠ ${v.price}`)
    const qty = lv.inventory_quantity ?? 0
    if (v.inStock && qty <= 0) problems.push(`${v.sku} should be in stock`)
    if (!v.inStock && qty > 0) problems.push(`${v.sku} should be OOS`)
  }
  const wantImages = p.images.filter((i) => i.localPath).length
  if ((live.images?.length ?? 0) < wantImages)
    problems.push(`${live.images?.length ?? 0}/${wantImages} images`)
  if (!live.thumbnail && wantImages > 0) problems.push(`no thumbnail`)
  const catHandles = (live.categories ?? []).map((c) => c.handle).sort()
  if (JSON.stringify(catHandles) !== JSON.stringify([...p.categories].sort()))
    problems.push(`categories [${catHandles}] ≠ [${p.categories}]`)

  const m = live.metadata ?? {}
  if (!m.ah_paragraphs) problems.push(`no ah_paragraphs`)
  if (copy[p.handle]) {
    const approved = copy[p.handle]
    try {
      const firstLive = JSON.parse(m.ah_paragraphs ?? "[]")[0] ?? ""
      const firstDoc = approved.paragraphs?.[0] ?? ""
      if (firstDoc && firstLive.slice(0, 60) !== firstDoc.slice(0, 60))
        problems.push(`first paragraph ≠ approved doc (${approved.sourceDoc})`)
    } catch { problems.push(`ah_paragraphs unparsable`) }
  }

  // PDP page check
  const page = await fetch(`${SITE}/products/${p.handle}`)
  if (page.status !== 200) problems.push(`PDP HTTP ${page.status}`)

  if (problems.length) bad(`${label}: ${problems.join("; ")}`)
  else ok(`${label}: title, ${p.variants.length} variant(s)+prices, stock, ${wantImages} image(s), categories, copy, PDP 200`)
}

/* ── categories ── */
lines.push(`\n## Categories`)
const { product_categories } = await store(`/store/product-categories?limit=50`)
for (const c of catalog.categories) {
  const live = product_categories.find((x) => x.handle === c.handle)
  if (!live) { bad(`category ${c.handle} missing`); continue }
  const numeral = live.metadata?.numeral
  const pageRes = await fetch(`${SITE}/categories/${c.handle}`)
  if (numeral !== c.numeral) bad(`category ${c.handle}: numeral ${numeral} ≠ ${c.numeral}`)
  else if (pageRes.status !== 200) bad(`category ${c.handle}: page HTTP ${pageRes.status}`)
  else ok(`category ${c.handle} (${c.numeral}): metadata + page 200`)
}

/* ── pages ── */
lines.push(`\n## Pages`)
for (const p of ["/", "/shop", "/learn", "/learn/concept", "/learn/root-canal", "/learn/fluoride", "/learn/nutrigenomics", "/faq", "/policies", "/our-story", "/contact", "/affiliate", "/account", "/cart"]) {
  const res = await fetch(`${SITE}${p}`)
  if (res.status === 200) ok(`${p} → 200`)
  else bad(`${p} → ${res.status}`)
}

/* ── redirects ── */
lines.push(`\n## Redirects`)
const { ahRedirects } = await import(path.join(process.cwd(), "src/lib/redirects.mjs"))
let rOk = 0
for (const r of ahRedirects()) {
  const res = await fetch(`${SITE}${encodeURI(r.source)}`, { redirect: "manual" })
  const loc = res.headers.get("location") ?? ""
  if ([301, 302, 307, 308].includes(res.status) && loc.endsWith(r.destination)) rOk++
  else bad(`redirect ${r.source} → ${res.status} ${loc} (want ${r.destination})`)
}
ok(`${rOk}/${ahRedirects().length} redirect rules verified`)

/* ── summary ── */
lines.push(`\n## Summary`)
lines.push(issues.length === 0
  ? `**All checks passed.** Ready for client sign-off (open items: real stock quantities, real shipping rates, Prana verification/packshot, testimonial republication approval, "from $X" size variants where the client has more sizes than the workbook captured).`
  : `**${issues.length} issue(s) need attention** — see unchecked boxes above.`)

writeFileSync(OUT, lines.join("\n"))
console.log(`report: ${OUT} — ${issues.length} issue(s)`)
