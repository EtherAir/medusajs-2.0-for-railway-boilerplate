/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/data/ah-catalog.json (from the migration workbook).
 * Regenerate with: node scripts/generate-ah-constants.mjs
 *
 * Only PUBLISHED products appear; a product's primary category is the first
 * entry in its categories array. Categories with no published products are
 * omitted (e.g. Longevity while Prana Longevity Powder is a draft).
 */
import type { AhCategory } from "./ah"

export const AH_CATALOG: AhCategory[] = [
  {
    "numeral": "I.",
    "title": "Dental & Gum Care",
    "handle": "dental-gum-care",
    "tint": "dental",
    "products": [
      {
        "name": "Regular Strength Oralive Toothpaste",
        "descriptor": "all vegan natural toothpaste and oral elixir with live enzymes and probiotics, activated by saliva.",
        "price": "from $35",
        "image": "/images/ah/products/regular-strength-oralive.jpg",
        "handle": "regular-strength-oralive"
      },
      {
        "name": "Unsweetened Regular Strength Oralive",
        "descriptor": "same formula as regular oralive but without xylitol. vegan, safe for children and pets.",
        "price": "from $30",
        "image": "/images/ah/products/unsweetened-oralive.jpg",
        "handle": "unsweetened-oralive"
      },
      {
        "name": "Super Gum Oil",
        "descriptor": "undiluted, highly oxygenated blend of antimicrobial and pain-relieving essential oils for gum pain.",
        "price": "from $60",
        "image": "/images/ah/products/super-gum-oil.jpg",
        "handle": "super-gum-oil"
      },
      {
        "name": "Extra Strength Oralive Toothpaste",
        "descriptor": "double concentration of oils and botanicals versus regular oralive. for severe gum and tooth pain.",
        "price": "from $55",
        "image": "/images/ah/products/extra-strength-oralive.jpg",
        "handle": "extra-strength-oralive"
      }
    ]
  },
  {
    "numeral": "II.",
    "title": "Skin Regeneration",
    "handle": "skin-regeneration",
    "tint": "skin",
    "products": [
      {
        "name": "I Am Beautiful Skin Regeneration Oil",
        "descriptor": "deeply nourishing oxygenated facial oil with marine phytoplankton for skin regeneration.",
        "price": "from $65",
        "image": "/images/ah/products/i-am-beautiful-oil.jpg",
        "handle": "i-am-beautiful-oil"
      },
      {
        "name": "Triple Skin Oil",
        "descriptor": "signature medicinal oil for burns, cuts, acne and lesions. alleviates pain, stops infection, starts regeneration.",
        "price": "from $60",
        "image": "/images/ah/products/triple-skin-oil.jpg",
        "handle": "triple-skin-oil"
      },
      {
        "name": "DermAlive Topical Probiotic",
        "descriptor": "premium probiotic skin rejuvenation formula that helps skin maintain a natural balance of beneficial microbes.",
        "price": "$100",
        "image": "/images/ah/products/dermalive-topical-probiotic.jpg",
        "handle": "dermalive-topical-probiotic"
      }
    ]
  },
  {
    "numeral": "III.",
    "title": "Concentrated Superfood Supplements",
    "handle": "superfood-supplements",
    "tint": "superfood",
    "products": [
      {
        "name": "Euphoraprash Lifeforce Supplement",
        "descriptor": "vegan superfood paste based on the ayurvedic chyawanprash formula. a meal in one teaspoon.",
        "price": "$60",
        "image": "/images/ah/products/euphoraprash.jpg",
        "handle": "euphoraprash"
      },
      {
        "name": "PhytoVelvet Elixir (No. 1)",
        "descriptor": "chocolate superfood elixir with marine phytoplankton and elk antler velvet. tastes like an almond joy.",
        "price": "$65",
        "image": "/images/ah/products/phytovelvet-elixir.jpg",
        "handle": "phytovelvet-elixir"
      },
      {
        "name": "Life Extension Elixir",
        "descriptor": "highest potency elixir with 10x herbal extracts and fermented marine phytoplankton. no elk antler velvet.",
        "price": "$150",
        "image": "/images/ah/products/life-extension-elixir.jpg",
        "handle": "life-extension-elixir"
      },
      {
        "name": "Marine Phytoplankton (supercharged)",
        "descriptor": "freeze-dried pure powder marine phytoplankton, certified free of heavy metals. world's most powerful superfood.",
        "price": "from $168",
        "image": "/images/ah/products/marine-phytoplankton.png",
        "handle": "marine-phytoplankton"
      }
    ]
  },
  {
    "numeral": "IV.",
    "title": "Energetic Consciousness",
    "handle": "energetic-consciousness",
    "tint": "energy",
    "products": [
      {
        "name": "Sufi Bliss Ascension Oil",
        "descriptor": "best-selling aromatic oil encoded with vibrational frequencies. libido enhancing and anti-anxiety.",
        "price": "from $60",
        "image": "/images/ah/products/sufi-bliss-ascension-oil.jpg",
        "handle": "sufi-bliss-ascension-oil"
      },
      {
        "name": "Lemurian Crystal ORMUS",
        "descriptor": "pure ground crystal powder with natural ormus. sublingual or mixed in water.",
        "price": "$80",
        "image": "/images/ah/products/lemurian-crystal-ormus.jpg",
        "handle": "lemurian-crystal-ormus"
      }
    ]
  },
  {
    "numeral": "V.",
    "title": "Skin Infection & Healing",
    "handle": "skin-infection-healing",
    "tint": "skin",
    "products": [
      {
        "name": "Anti-Venom Balm",
        "descriptor": "all natural poultice for spider bites, bee stings and skin toxins. also used as a facial mask.",
        "price": "$75",
        "image": "/images/ah/products/anti-venom-balm.jpg",
        "handle": "anti-venom-balm"
      },
      {
        "name": "Electrical Neopulser",
        "descriptor": "device using a modified electrical pulse to inactivate venom from bites and stings. 9v powered.",
        "price": "$340",
        "image": "/images/ah/products/electrical-neopulser.jpg",
        "handle": "electrical-neopulser"
      },
      {
        "name": "Combo Set: Anti-Venom Balm + Triple Skin Oil",
        "descriptor": "bundle of anti-venom balm and triple skin oil, used together for severe skin conditions.",
        "price": "$135",
        "image": "/images/ah/products/combo-antivenom-tripleskin.jpg",
        "handle": "combo-antivenom-tripleskin"
      },
      {
        "name": "Combo Set: Neopulser with Anti-Venom Balm + Triple Skin Oil",
        "descriptor": "neopulser device bundled with anti-venom balm and triple skin oil. for bites, stings and rashes.",
        "price": "$475",
        "image": "/images/ah/products/combo-neopulser-antivenom-tripleskin.jpg",
        "handle": "combo-neopulser-antivenom-tripleskin"
      }
    ]
  },
  {
    "numeral": "VI.",
    "title": "Liquid Probiotics",
    "handle": "liquid-probiotics",
    "tint": "probiotic",
    "products": [
      {
        "name": "Active Detox Probiotic",
        "descriptor": "liquid probiotic with live microbes, chelators and trace minerals to support liver and kidney detox.",
        "price": "$60",
        "image": "/images/ah/products/active-detox-probiotic.jpg",
        "handle": "active-detox-probiotic"
      },
      {
        "name": "ProAlive Probiotic",
        "descriptor": "live ancient probiotics from longevity zones. safe for children and pets.",
        "price": "$60",
        "image": "/images/ah/products/proalive-probiotic.jpg",
        "handle": "proalive-probiotic"
      },
      {
        "name": "Active Detox & ProAlive Probiotic Set",
        "descriptor": "buy-both set of the two liquid probiotics. proalive in the morning, active detox before bed.",
        "price": "$115",
        "image": "/images/ah/products/active-detox-proalive-set.jpg",
        "handle": "active-detox-proalive-set"
      }
    ]
  },
  {
    "numeral": "VIII.",
    "title": "AH Cafe",
    "handle": "ah-cafe",
    "tint": "superfood",
    "products": [
      {
        "name": "This Cheese is Nuts (Book)",
        "descriptor": "cookbook by julie piatt with 75 recipes for dairy-free nut cheeses. 208 pages.",
        "price": "$25",
        "image": "/images/ah/products/this-cheese-is-nuts.jpg",
        "handle": "this-cheese-is-nuts"
      },
      {
        "name": "Organic Chickpea Miso",
        "descriptor": "soy-free, gluten-free miso made with chickpeas instead of soybeans. 16 oz jar.",
        "price": "$20",
        "image": "/images/ah/products/organic-chickpea-miso.jpg",
        "handle": "organic-chickpea-miso"
      },
      {
        "name": "Noni Fruit Leather",
        "descriptor": "organic noni fruit leather, 14x more potent than noni juice. 2 oz.",
        "price": "$36",
        "image": "/images/ah/products/noni-fruit-leather.jpg",
        "handle": "noni-fruit-leather"
      },
      {
        "name": "Kalahari Mustard Seed Beauty Bath",
        "descriptor": "mineral bath powder with kalahari salts and ground mustard seed. 8 oz, 4-5 baths.",
        "price": "$45",
        "image": "/images/ah/products/kalahari-mustard-seed-beauty-bath.png",
        "handle": "kalahari-mustard-seed-beauty-bath"
      },
      {
        "name": "The Auracle Healing Cards: Complete Book & Card Set",
        "descriptor": "56-card healing deck with 112 images plus a 159-page guidebook.",
        "price": "$135",
        "image": "/images/ah/products/auracle-healing-cards.png",
        "handle": "auracle-healing-cards"
      }
    ]
  }
]
