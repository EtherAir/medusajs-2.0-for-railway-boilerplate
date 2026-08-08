/**
 * Ascended Health catalog seed — idempotent, Medusa Admin REST API.
 *
 * Creates the 6 roman-numeraled categories (rank-ordered, with
 * {numeral, tint} metadata) and the 21 catalog products + SUFI BLISS
 * (subtitle = lowercase descriptor, single default variant at the list
 * price, packshots uploaded from public/images/ah/products, linked to the
 * default sales channel). SUFI BLISS also gets the full ah_* metadata
 * template (see scripts/README.md).
 *
 * Usage:
 *   MEDUSA_BACKEND_URL=https://... \
 *   MEDUSA_ADMIN_EMAIL=... MEDUSA_ADMIN_PASSWORD=... \
 *   node scripts/seed-ah.mjs [--delete-demo]
 *
 * Safe to re-run: existing handles are updated, not duplicated.
 */

import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"

const BASE = (process.env.MEDUSA_BACKEND_URL ?? "").replace(/\/$/, "")
const EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD
const DELETE_DEMO = process.argv.includes("--delete-demo")

if (!BASE || !EMAIL || !PASSWORD) {
  console.error(
    "Missing env: MEDUSA_BACKEND_URL, MEDUSA_ADMIN_EMAIL, MEDUSA_ADMIN_PASSWORD"
  )
  process.exit(1)
}

/* ── Catalog (ported from the design handoff data/catalog.js) ── */

const CATEGORIES = [
  { numeral: "I.", title: "Dental Care: Gum Health", handle: "dental-care-gum-health", tint: "dental" },
  { numeral: "II.", title: "Skin Regeneration & Healing", handle: "skin-regeneration-healing", tint: "skin" },
  { numeral: "III.", title: "Essential Superfood", handle: "essential-superfood", tint: "superfood" },
  { numeral: "IV.", title: "Energetic Consciousness", handle: "energetic-consciousness", tint: "energy" },
  { numeral: "V.", title: "Probiotics", handle: "probiotics", tint: "probiotic" },
  { numeral: "VI.", title: "Longevity", handle: "longevity", tint: "longevity" },
]

const P = (name, descriptor, price, image, handle, cat) => ({
  name, descriptor, price, image, handle, cat,
})

const PRODUCTS = [
  P("Recover", "gum oil with kanuka tea tree", "from $35", "recover.png", "recover", 0),
  P("Oralive", "detoxifying toothpaste with ozonated oils", "from $50", "oralive-detoxifying.png", "oralive-detoxifying", 0),
  P("Oralive Unsweetened", "detoxifying toothpaste with ozonated oils", "$50", "oralive-unsweetened.png", "oralive-unsweetened-detoxifying", 0),
  P("Oralive", "extra strength toothpaste with sangre de grado", "from $60", "oralive-extra-strength.png", "oralive-extra-strength", 0),
  P("Oralive Unsweetened", "extra strength toothpaste with sangre de grado", "$60", "oralive-detoxifying-100.png", "oralive-unsweetened-extra-strength", 0),
  P("Remedy", "toxin-pulling paste with probiotic live clays", "from $50", "remedy.png", "remedy", 0),
  P("Flourish", "microbiome rebuilding paste with flavinoid-rich probiotics", "$60", "flourish.png", "flourish", 0),
  P("Regenerate", "skin oil with rose otto", "from $65", "regenerate.png", "regenerate", 1),
  P("Heal", "first aid blend with oxygenated oils", "from $65", "heal.png", "heal", 1),
  P("Rejuvenate", "skin probiotic with camu camu", "from $50", "rejuvenate.png", "rejuvenate", 1),
  P("Supercharge", "vegan life force supplement with astaxanthin", "$125", "supercharge.png", "supercharge", 2),
  P("Ascend", "superfood longevity supplement with ashwagandha", "$115", "ascend.png", "ascend", 2),
  P("Foundations", "phytoplankton & blue green algae superfood with tetraselmis chuii", "$168", "foundations.png", "foundations", 2),
  P("Energize", "superfood adaptogenic energy supplement with elk antler velvet", "from $100", "energize.png", "energize", 2),
  P("Align", "energetic oil with ylang ylang", "$55", "align.png", "align", 3),
  P("Superconscious", "crystal supplement with ormus", "$125", "superconscious.png", "superconscious", 3),
  P("Sufi Bliss Ascension Oil", "ascension oil with rose otto, blue lotus & agarwood", "$60", null, "sufi-bliss-ascension-oil", 3),
  P("Protect", "triple turmeric supplement with circumin", "from $55", "protect.png", "protect", 4),
  P("Balance", "adaptogenic probiotic with bifidobacterium", "$50", "balance.png", "balance", 4),
  P("Biome Detox", "chelating probiotic with l. plantarum", "$100", "biome-detox.png", "biome-detox", 4),
  P("Extend", "longevity supplement with elk antler velvet", "$115", "extend.png", "extend", 5),
]

const SUFI_METADATA = {
  ah_price_line: "15mL ∙ $60",
  ah_paragraphs: JSON.stringify([
    "This oil is our best seller during trade shows because it smells absolutely delicious. Sufi Bliss oil is encoded with the vibrational frequencies of ecstatic bliss.",
    "This oil is designed to help you attain a higher state of being. Dabs on your temples take you to intense levels of awareness.",
    "The energetic shifts this oil puts on your body extend to the people around you. Once you put this on, we think you will feel better, think clearer and be more present.",
  ]),
  ah_applications: JSON.stringify(["ANXIETY", "DEPRESSION", "CHRONIC FATIGUE"]),
  ah_design: JSON.stringify([
    "At Ascended Health, we approach beauty from the inside as well as the outside. Beauty, in our view, is attained when one feels comfortable with oneself — physically, emotionally, mentally and spiritually.",
    "We titled this oil “ascension” because it is designed to help you think clearer, feel more love and align what we call your physical, or 3rd dimensional self to your 4th and 5th dimensional selves. Others call it aligning your 12 chakras.",
    "The original base oils are prepared by Sufi Masters in Afghanistan by cold rolling. During preparation, the oils are present inside a sacred prayer room — where they are subjected to the very high vibrational rates of many ancient Qurans, holy texts, prayers and chants performed by Sufi masters — for the highest good of every living being on the planet. In addition, these oils are chanted upon by Kabbalah Masters, using prayers from the Torah.",
    "Sufi Bliss Ascension oil is made from freshly rolled essential oils of Rose, Blue Lotus and Agarwood, amongst other oils. These are not attars, but pure essential oils from Afghanistan, India, Laos and Turkey. Our pure rose otto comes from Eidan, Turkey — the purported Garden of Eden.",
  ]),
  ah_frequencies: JSON.stringify([
    "7.83 Hz Schumann Earth resonance (1 week)",
    "44 Hz Energy (3 weeks)",
    "Nurse Dolphin and Blue Whale frequencies — taken during birthing season from the Amazon River and Coast of Chile (3 weeks)",
    "Sufi frequencies of Bliss & Ecstasy",
    "Kabbalah sacred vibrational imprints of the 72 names of God",
  ]),
  ah_use:
    "Use sparingly. This oil is very concentrated. Place small dabs on your wrists, temples, back of your neck, thymus (throat chakra) and top of head (crown chakra).",
}

/* ── API helpers ── */

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
    throw new Error(`${init.method ?? "GET"} ${pathname} → ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json()
}

const parsePrice = (s) => Number(String(s).replace(/[^0-9.]/g, ""))

async function uploadImage(file) {
  const p = path.join(process.cwd(), "public/images/ah/products", file)
  if (!existsSync(p)) return null
  const buf = await readFile(p)
  const form = new FormData()
  form.append("files", new Blob([buf], { type: "image/png" }), file)
  const { files } = await api("/admin/uploads", { method: "POST", body: form })
  return files?.[0]?.url ?? null
}

/* ── Main ── */

const report = { categories: [], created: [], updated: [], fromPrices: [], noImage: [] }

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
console.log("Authenticated.")

const { sales_channels } = await api("/admin/sales-channels?limit=10")
const channel = sales_channels?.[0]
console.log("Sales channel:", channel?.name)

// Categories
const catIds = []
for (const [i, c] of CATEGORIES.entries()) {
  const { product_categories } = await api(
    `/admin/product-categories?handle=${c.handle}`
  )
  let cat = product_categories?.[0]
  const payload = {
    name: c.title,
    is_active: true,
    rank: i,
    metadata: { numeral: c.numeral, tint: c.tint },
  }
  if (cat) {
    await api(`/admin/product-categories/${cat.id}`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  } else {
    const res = await api("/admin/product-categories", {
      method: "POST",
      body: JSON.stringify({ ...payload, handle: c.handle }),
    })
    cat = res.product_category
  }
  catIds.push(cat.id)
  report.categories.push(`${c.numeral} ${c.title}`)
  console.log("category ok:", c.handle)
}

// Products
for (const p of PRODUCTS) {
  const amount = parsePrice(p.price)
  const isFrom = /^from /.test(p.price)
  if (isFrom) report.fromPrices.push(`${p.name} (${p.price}) — needs real size variants`)

  let imageUrl = null
  if (p.image) {
    imageUrl = await uploadImage(p.image)
  }
  if (!imageUrl) report.noImage.push(p.name)

  const metadata = p.handle === "sufi-bliss-ascension-oil" ? SUFI_METADATA : undefined

  const { products } = await api(`/admin/products?handle=${p.handle}`)
  const existing = products?.[0]

  const base = {
    title: p.name,
    subtitle: p.descriptor,
    status: "published",
    categories: [{ id: catIds[p.cat] }],
    ...(imageUrl ? { thumbnail: imageUrl, images: [{ url: imageUrl }] } : {}),
    ...(metadata ? { metadata } : {}),
  }

  if (existing) {
    await api(`/admin/products/${existing.id}`, {
      method: "POST",
      body: JSON.stringify(base),
    })
    report.updated.push(p.name)
  } else {
    await api("/admin/products", {
      method: "POST",
      body: JSON.stringify({
        ...base,
        handle: p.handle,
        ...(channel ? { sales_channels: [{ id: channel.id }] } : {}),
        options: [{ title: "Size", values: ["Default"] }],
        variants: [
          {
            title: "Default",
            options: { Size: "Default" },
            prices: [{ amount, currency_code: "usd" }],
            manage_inventory: false,
          },
        ],
      }),
    })
    report.created.push(p.name)
  }
  console.log("product ok:", p.handle)
}

// Optionally remove the boilerplate demo catalog
if (DELETE_DEMO) {
  for (const handle of ["t-shirt", "sweatshirt", "sweatpants", "shorts"]) {
    const { products } = await api(`/admin/products?handle=${handle}`)
    if (products?.[0]) {
      await api(`/admin/products/${products[0].id}`, { method: "DELETE" })
      console.log("deleted demo product:", handle)
    }
  }
  for (const handle of ["shirts", "sweatshirts", "pants", "merch"]) {
    const { product_categories } = await api(
      `/admin/product-categories?handle=${handle}`
    )
    if (product_categories?.[0]) {
      await api(`/admin/product-categories/${product_categories[0].id}`, {
        method: "DELETE",
      })
      console.log("deleted demo category:", handle)
    }
  }
}

console.log("\n=== SEED REPORT ===")
console.log("Categories:", report.categories.length)
console.log("Created:", report.created.length, "Updated:", report.updated.length)
if (report.fromPrices.length) {
  console.log("\nTODO — client to supply real size variants for:")
  report.fromPrices.forEach((l) => console.log("  •", l))
}
if (report.noImage.length) {
  console.log("\nTODO — missing packshots (Drive → 01_BACKGROUND REMOVED):")
  report.noImage.forEach((l) => console.log("  •", l))
}
