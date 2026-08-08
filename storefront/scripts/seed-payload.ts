/**
 * Seed Payload with the handoff content: the real concept article, the five
 * placeholder post stubs (real titles from the captured site, template
 * bodies), the site-settings + reviews globals, and — if none exists — the
 * first admin user (random password printed once; change it after login).
 *
 * Run:  railway run --service Storefront -- sh -c \
 *         'PAYLOAD_DATABASE_URL="$PAYLOAD_DATABASE_PUBLIC_URL" npx payload run scripts/seed-payload.ts'
 */
import crypto from "node:crypto"
import { getPayload } from "payload"
import config from "@payload-config"

const CONCEPT_SECTIONS = [
  { heading: "Biological Intelligence", body: "Biological Intelligence is the natural instruction set found in plants, microbes, and living ecosystems — the language our bodies evolved to understand. Nearly 90% of our cells are microbial, and these microbes instantly recognize compounds shaped by nature, not synthetic processing. Modern supplements often lack this intelligence and therefore offer limited guidance for true regeneration.\n\nAt Ascended Health, we restore this conversation by using whole-plant extracts and microbial fermentation to preserve nature’s original signals. Our formulas don’t just deliver nutrients — they reintroduce the biological cues the body needs to repair, rebalance, and thrive." },
  { heading: "Food as Information", body: "Food doesn’t just feed the body — it informs it, shaping how cells respond to stress and maintain health. Processed and synthetic foods deliver poor or distorted information, while natural foods carry the Biological Intelligence our cells rely on.\n\nWe view our supplements as high-quality “informational food,” crafted in small batches and treated with intention — including prayer and sacred music — to support the subtle and key ways nourishment shapes the body’s healing responses." },
  { heading: "The Hidden Majority", body: "Most of the microbes that sustain us live deep in the large intestine, where oxygen cannot reach them — making them extraordinarily difficult to study. Yet these anaerobic “keystone” species are essential for gut integrity, immune regulation, and long-term health.\n\nAscended Health focuses on nurturing three of the most important: Akkermansia muciniphila, Faecalibacterium prausnitzii, and Christensenella minutae. Many of our formulas are specifically designed to feed, activate, and strengthen this hidden microbial majority." },
  { heading: "Bioavailability of our products", body: "Your gut is the most densely populated ecosystem on earth, with ten layers of microbes forming a barrier between your food and your own cells. These microbes get the first “bite” of everything you eat — and immediately begin fermenting it into more usable forms.\n\nAt Ascended Health, by fermenting our plant extracts outside the body first, through a natural pre-digestion process, we spare the gut unnecessary work and enhance nutrient availability. This ensures our formulas feed both you and your microbes for more complete, efficient nourishment." },
  { heading: "Multi-stage Cascade Fermentation", body: "Just as the microbiome works in layered synergy, our formulations are created through a proprietary multi-stage fermentation process. Each stage builds on the last, mirroring the complexity of the gut and dramatically enhancing the vitality and potency of the final product." },
  { heading: "Biophotonic Fermentation", body: "We reconnect fermentation to nature by burying our cultures in black soil and compost, exposing them to the biophotonic light and biological signals emitted by living soil ecosystems. This infuses our quartz-glass vessels with natural intelligence.\n\nMost commercial ferments are isolated in stainless-steel vats, disconnected from earth’s resonance — resulting in products that lack the vibrancy we consider essential." },
  { heading: "Sourcing from Longevity Zones", body: "Our microbial starters come directly from regions where people routinely live past 100 — Ikaria, Costa Rica, Japan, and the Kamchatka Peninsula. From their fermented foods and root vegetables, we collect wild, naturally resilient strains of Lactobacillus, Bifidobacterium, Streptococcus, and Saccharomyces.\n\nThese microbes have not been weakened by repeated lab propagation; they are shaped by real environments and daily stressors. If they help nourish long-lived communities, we believe they can help support yours as well." },
  { heading: "Scalar-based Vibrational Frequency Imprinting", body: "We also integrate subtle-energy elements into our formulations through carefully selected mineral and crystalline components. These materials are known for their stable vibrational properties, which help support the energetic coherence of each product. In this way, while our fermentation methods maximize biological effectiveness, every formula is also crafted with a deeper intention — to create products that nourish on both the physical and subtle levels." },
]

const POSTS = [
  {
    slug: "concept",
    title: "A deeper look at our concept",
    tag: "Our mission",
    byline: "by Compton Rom ∙ Our mission",
    excerpt: "Our mission statement: the principles and fermentation methods behind living, biologically aligned nourishment.",
    intro:
      "At Ascended Health, our mission is shaped by the vision of our founder and formulator, microbiologist Compton Rom, whose work centers on giving the microbes within us the nourishment and consideration they need. We view supplements as a form of concentrated food — carrying information and biological intelligence that guide the body’s natural processes of repair and regeneration. This page serves as our mission statement, outlining the principles and fermentation methods that define our approach to creating living, biologically aligned nourishment.",
    sections: CONCEPT_SECTIONS,
    _status: "published",
  },
  // PLACEHOLDER stubs — real titles from the captured site, template bodies.
  { slug: "science-of-skin-resonance", title: "The science of skin resonance", tag: "Science", excerpt: "Brief description or excerpt from the full length blog post.", intro: "Full post copy to come — this page is the blog-post template.", sections: [], _status: "published" },
  { slug: "why-we-cold-press-everything", title: "Why we cold-press everything", tag: "Ingredients", excerpt: "Brief description or excerpt from the full length blog post.", intro: "Full post copy to come — this page is the blog-post template.", sections: [], _status: "published" },
  { slug: "rose-otto", title: "Rose Otto: the regeneration botanical", tag: "Ingredients", excerpt: "Brief description or excerpt from the full length blog post.", intro: "Full post copy to come — this page is the blog-post template.", sections: [], _status: "published" },
  { slug: "minimalist-nightly-ritual", title: "Building a minimalist nightly ritual", tag: "Rituals", excerpt: "Brief description or excerpt from the full length blog post.", intro: "Full post copy to come — this page is the blog-post template.", sections: [], _status: "published" },
  { slug: "sun-skin-regeneration-myth", title: "Sun & skin: the regeneration myth", tag: "Science", excerpt: "Brief description or excerpt from the full length blog post.", intro: "Full post copy to come — this page is the blog-post template.", sections: [], _status: "published" },
]

const REVIEWS = [
  { author: "Sarah M", date: "Mar 2026", rating: 5, body: "Three months with ORALIVE and my hygienist noticed the difference before I said a word. My gums feel settled — that is the only way I can describe it." },
  { author: "Elena R", date: "Jan 2026", rating: 5, body: "REGENERATE is the first oil that has not argued with my skin. A little goes far, and the rose is quiet rather than perfumed." },
  { author: "David K", date: "May 2026", rating: 5, body: "FOUNDATIONS replaced four separate supplements on my shelf. Energy stays even through the day — no spike, no fall." },
]

const payload = await getPayload({ config })

// First admin user
const users = await payload.find({ collection: "users", limit: 1 })
if (users.totalDocs === 0) {
  const password = crypto.randomBytes(9).toString("base64url")
  await payload.create({
    collection: "users",
    data: { email: "cobabeconsulting@gmail.com", password, name: "Peter C" },
  })
  console.log("\n=== FIRST ADMIN USER ===")
  console.log("email:    cobabeconsulting@gmail.com")
  console.log("password:", password)
  console.log("(change it after first login at /admin)\n")
} else {
  console.log("admin user exists")
}

// Posts
for (const post of POSTS) {
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: post.slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    await payload.update({
      collection: "posts",
      id: existing.docs[0].id,
      data: post as any,
    })
    console.log("updated post:", post.slug)
  } else {
    await payload.create({ collection: "posts", data: post as any })
    console.log("created post:", post.slug)
  }
}

// Globals
await payload.updateGlobal({
  slug: "site-settings",
  data: {
    announcement: "Free shipping on US orders over $250.",
    freeShippingThreshold: 250,
    communityLine:
      "FOLLOW. ENGAGE. FLOURISH.\nFind our community online @ascendedhealth.",
  },
})
await payload.updateGlobal({ slug: "reviews", data: { items: REVIEWS } })
console.log("globals seeded")

process.exit(0)
