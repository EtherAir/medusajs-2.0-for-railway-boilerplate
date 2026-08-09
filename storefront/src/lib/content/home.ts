/**
 * Homepage copy from the design handoff. The Gaia section and taglines are
 * real approved copy; reviews are placeholders written in-voice, flagged for
 * replacement (they move to the Payload `reviews` global in Phase 7).
 */

export const HOME_HERO = {
  image: "/images/ah/imagery/hero-moss-landscape.png",
  headline: "Regenerative wellness\nfor a new generation",
  subhead:
    "Life-enhancing formulas for holistic microbiome and cellular support.",
  ctaLabel: "Shop now",
}

export const HOME_SECOND_HERO = {
  image: "/images/ah/imagery/fullbleed-ritual-bw.jpg",
  headline: "Align your health,\nelevate your self.",
  subhead:
    "See what it’s like to live without limits and experience vitality on every level.",
  ctaLabel: "Shop now",
}

export const HOME_STATEMENT =
  "We believe wellness is a physical, mental, emotional, and spiritual practice that begins within. We bring ancient microbiome wisdom into modern formulas, created to awaken your internal ecosystem."

export const HOME_FEATURES = [
  {
    image: "/images/ah/imagery/feature-rowse-moss.jpg",
    name: "Marine Phytoplankton",
    descriptor: "supercharged nutrigenomic superfood,\nabsorbed at the microcellular level",
    price: "from $168",
    handle: "marine-phytoplankton",
  },
  {
    image: "/images/ah/imagery/feature-lesse-rocks.jpg",
    name: "I Am Beautiful Oil",
    descriptor: "skin regeneration oil",
    price: "from $65",
    handle: "i-am-beautiful-oil",
  },
]

export const GAIA = {
  label: "Healing with Micronutrients: Going Beyond Organic",
  lead: "Watch Ascended Health founder Compton Rom’s interview on Gaia.com",
  paras: [
    "What’s the next step in natural healing? Compton Rom uses scientific research and indigenous cultural teachings to create innovative, all-natural treatments using powerful botanicals, minerals and herbs.",
    "Join the founder of Ascended Health for an eye-opening conversation in this exclusive interview with Regina Meredith, Pioneer in Conscious Media.",
  ],
  linkLabel: "www.gaia.com/ascendedhealth",
  linkHref: "https://www.gaia.com/ascendedhealth",
}

export const PRINCIPLES = [
  {
    numeral: "I.",
    name: "Science",
    motif: "science" as const,
    body: "Our foundation is built on research-backed findings that support probiotic-rich cultures to address the unmet needs of our modern ways of living.",
  },
  {
    numeral: "II.",
    name: "Consciousness",
    motif: "consciousness" as const,
    body: "We believe that a flourishing microbiome allows our bodies to come into balance — encouraging healthy energy flow and enhanced longevity.",
  },
  {
    numeral: "III.",
    name: "Nature",
    motif: "nature" as const,
    body: "We value the earth as our life source, providing us with everything we need — and more — to heal and thrive. We source all of our potent and effective ingredients from the areas in nature with the best soil and highest energetic vibrations.",
  },
]

/** PLACEHOLDER reviews (client to supply real ones). */
export const REVIEWS = [
  {
    author: "Sarah M",
    date: "Mar 2026",
    rating: 5,
    body: "Three months with ORALIVE and my hygienist noticed the difference before I said a word. My gums feel settled — that is the only way I can describe it.",
  },
  {
    author: "Elena R",
    date: "Jan 2026",
    rating: 5,
    body: "REGENERATE is the first oil that has not argued with my skin. A little goes far, and the rose is quiet rather than perfumed.",
  },
  {
    author: "David K",
    date: "May 2026",
    rating: 5,
    body: "FOUNDATIONS replaced four separate supplements on my shelf. Energy stays even through the day — no spike, no fall.",
  },
]

export const HOME_BLOG_CARDS = [
  {
    href: "/learn/concept",
    image: "/images/ah/illustrations/engraving-mushrooms.jpg",
    date: "Our mission",
    title: "A deeper look at our concept",
    excerpt: "Living, biologically aligned nourishment.",
  },
  {
    href: "/learn",
    image: "/images/ah/imagery/editorial-portrait-bw.png",
    date: "Learn",
    title: "Ancient microbiome wisdom, in practice",
    excerpt: "Read the latest from the journal.",
  },
]

/** Featured formula per category (keyed by category handle) for the
 *  homepage category-index panel and product row. */
export const CATEGORY_FEATURE: Record<string, string> = {
  "dental-gum-care": "regular-strength-oralive",
  "skin-regeneration": "i-am-beautiful-oil",
  "superfood-supplements": "marine-phytoplankton",
  "energetic-consciousness": "sufi-bliss-ascension-oil",
  "skin-infection-healing": "anti-venom-balm",
  "liquid-probiotics": "proalive-probiotic",
  "longevity": "prana-longevity-powder",
  "ah-cafe": "auracle-healing-cards",
}
