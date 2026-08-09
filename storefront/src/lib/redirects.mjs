/**
 * Legacy-URL redirect table for next.config.mjs.
 *
 * Sources:
 * - product/category rules generated from scripts/data/ah-catalog.json
 *   (the migration workbook's map, targets already translated to this
 *   storefront's routes — default region is unprefixed)
 * - content + dead-URL rules from the migration inventory crawl
 *
 * No `/products/:path*` wildcard — it would shadow live PDP routes.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(
  readFileSync(path.join(here, "../../scripts/data/ah-catalog.json"))
)

/** Content pages + known-dead legacy URLs (still hold backlinks). */
const CONTENT_RULES = [
  { source: "/aboutus.htm", destination: "/our-story", permanent: true },
  { source: "/concept.htm", destination: "/learn/concept", permanent: true },
  { source: "/FAQ.htm", destination: "/faq", permanent: true },
  { source: "/nutrigenomics", destination: "/learn", permanent: true },
  { source: "/products.htm", destination: "/shop", permanent: true },
  { source: "/skin-care", destination: "/categories/skin-regeneration", permanent: true },
  { source: "/gum-disease", destination: "/categories/dental-gum-care", permanent: true },
  { source: "/testimonials.htm", destination: "/learn", permanent: false },

  // Already-404 legacy URLs from the crawl, mapped to their successors:
  { source: "/gum-disease/products.htm", destination: "/categories/dental-gum-care", permanent: true },
  { source: "/products_Anti_Aging_Superfood.htm", destination: "/categories/superfood-supplements", permanent: true },
  { source: "/products_dentalcare.htm", destination: "/categories/dental-gum-care", permanent: true },
  { source: "/skin-care/products_SkinRegeneration.htm", destination: "/categories/skin-regeneration", permanent: true },
  { source: "/skin-care/AscendedHealth_SufiBliss_AscensionOil.htm", destination: "/products/sufi-bliss-ascension-oil", permanent: true },
  { source: "/skin-care/AscendedHealth_Facial_Skin_Regenerative_Oil.htm", destination: "/products/i-am-beautiful-oil", permanent: true },
  { source: "/brown-recluse/bite-treatment.htm", destination: "/products/anti-venom-balm", permanent: true },
  { source: "/brown-recluse-spider/brown-recluse-bite-treatment_testimonials.htm", destination: "/products/anti-venom-balm", permanent: true },
  { source: "/index_2009.html", destination: "/", permanent: true },
]

export function ahRedirects() {
  const fromCatalog = catalog.redirects.map((r) => ({
    source: r.source.replace(/\/$/, "") || "/",
    destination: r.destination,
    permanent: r.permanent !== false,
  }))

  // De-duplicate by source (content rules win over generated ones)
  const bySource = new Map()
  for (const r of [...fromCatalog, ...CONTENT_RULES]) {
    bySource.set(r.source, r)
  }
  return [...bySource.values()]
}
