/**
 * Ascended Health static catalog map, ported from the design handoff
 * (design_handoff_medusa_storefront/data/catalog.js).
 *
 * Used by the chrome (footer, mega menu, mobile menu) and the homepage
 * category index until the Phase-6 seed populates the Medusa backend —
 * the `handle` values here are the contract the seed script creates, so
 * links keep working across the switch. After seeding, components should
 * prefer backend categories (matched by handle) and fall back to this map.
 */

export type AhProduct = {
  name: string // stored normal-case; ALL CAPS is a UI transform
  descriptor: string // brand rule: always lowercase in the UI
  price: string
  image: string // under /images/ah/
  handle: string
}

export type AhCategory = {
  numeral: string
  title: string
  handle: string
  tint: "dental" | "skin" | "superfood" | "energy" | "probiotic" | "longevity"
  products: AhProduct[]
}

export const AH_CATEGORIES: AhCategory[] = [
  {
    numeral: "I.",
    title: "Dental Care: Gum Health",
    handle: "dental-care-gum-health",
    tint: "dental",
    products: [
      { name: "RECOVER", descriptor: "gum oil with kanuka tea tree", price: "from $35", image: "/images/ah/products/recover.png", handle: "recover" },
      { name: "ORALIVE", descriptor: "detoxifying toothpaste with ozonated oils", price: "from $50", image: "/images/ah/products/oralive-detoxifying.png", handle: "oralive-detoxifying" },
      { name: "ORALIVE unsweetened", descriptor: "detoxifying toothpaste with ozonated oils", price: "$50", image: "/images/ah/products/oralive-unsweetened.png", handle: "oralive-unsweetened-detoxifying" },
      { name: "ORALIVE", descriptor: "extra strength toothpaste with sangre de grado", price: "from $60", image: "/images/ah/products/oralive-extra-strength.png", handle: "oralive-extra-strength" },
      { name: "ORALIVE unsweetened", descriptor: "extra strength toothpaste with sangre de grado", price: "$60", image: "/images/ah/products/oralive-detoxifying-100.png", handle: "oralive-unsweetened-extra-strength" },
      { name: "REMEDY", descriptor: "toxin-pulling paste with probiotic live clays", price: "from $50", image: "/images/ah/products/remedy.png", handle: "remedy" },
      { name: "FLOURISH", descriptor: "microbiome rebuilding paste with flavinoid-rich probiotics", price: "$60", image: "/images/ah/products/flourish.png", handle: "flourish" },
    ],
  },
  {
    numeral: "II.",
    title: "Skin Regeneration & Healing",
    handle: "skin-regeneration-healing",
    tint: "skin",
    products: [
      { name: "REGENERATE", descriptor: "skin oil with rose otto", price: "from $65", image: "/images/ah/products/regenerate.png", handle: "regenerate" },
      { name: "HEAL", descriptor: "first aid blend with oxygenated oils", price: "from $65", image: "/images/ah/products/heal.png", handle: "heal" },
      { name: "REJUVENATE", descriptor: "skin probiotic with camu camu", price: "from $50", image: "/images/ah/products/rejuvenate.png", handle: "rejuvenate" },
    ],
  },
  {
    numeral: "III.",
    title: "Essential Superfood",
    handle: "essential-superfood",
    tint: "superfood",
    products: [
      { name: "SUPERCHARGE", descriptor: "vegan life force supplement with astaxanthin", price: "$125", image: "/images/ah/products/supercharge.png", handle: "supercharge" },
      { name: "ASCEND", descriptor: "superfood longevity supplement with ashwagandha", price: "$115", image: "/images/ah/products/ascend.png", handle: "ascend" },
      { name: "FOUNDATIONS", descriptor: "phytoplankton & blue green algae superfood with tetraselmis chuii", price: "$168", image: "/images/ah/products/foundations.png", handle: "foundations" },
      { name: "ENERGIZE", descriptor: "superfood adaptogenic energy supplement with elk antler velvet", price: "from $100", image: "/images/ah/products/energize.png", handle: "energize" },
    ],
  },
  {
    numeral: "IV.",
    title: "Energetic Consciousness",
    handle: "energetic-consciousness",
    tint: "energy",
    products: [
      { name: "ALIGN", descriptor: "energetic oil with ylang ylang", price: "$55", image: "/images/ah/products/align.png", handle: "align" },
      { name: "SUPERCONSCIOUS", descriptor: "crystal supplement with ormus", price: "$125", image: "/images/ah/products/superconscious.png", handle: "superconscious" },
      { name: "SUFI BLISS ASCENSION OIL", descriptor: "ascension oil with rose otto, blue lotus & agarwood", price: "$60", image: "", handle: "sufi-bliss-ascension-oil" },
    ],
  },
  {
    numeral: "V.",
    title: "Probiotics",
    handle: "probiotics",
    tint: "probiotic",
    products: [
      { name: "PROTECT", descriptor: "triple turmeric supplement with circumin", price: "from $55", image: "/images/ah/products/protect.png", handle: "protect" },
      { name: "BALANCE", descriptor: "adaptogenic probiotic with bifidobacterium", price: "$50", image: "/images/ah/products/balance.png", handle: "balance" },
      { name: "BIOME DETOX", descriptor: "chelating probiotic with l. plantarum", price: "$100", image: "/images/ah/products/biome-detox.png", handle: "biome-detox" },
    ],
  },
  {
    numeral: "VI.",
    title: "Longevity",
    handle: "longevity",
    tint: "longevity",
    products: [
      { name: "EXTEND", descriptor: "longevity supplement with elk antler velvet", price: "$115", image: "/images/ah/products/extend.png", handle: "extend" },
    ],
  },
]

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
