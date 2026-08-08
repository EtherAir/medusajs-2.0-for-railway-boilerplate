# Ascended Health seed

`seed-ah.mjs` seeds the Medusa backend with the Ascended Health catalog from
the design handoff: 6 roman-numeraled categories (with `{numeral, tint}`
metadata driving the storefront's numbering and packaging-tint panels) and
22 products (subtitle = the lowercase descriptor, single default variant at
the list price, packshots uploaded to the configured file storage).

```bash
MEDUSA_BACKEND_URL=https://backend-production-300d.up.railway.app \
MEDUSA_ADMIN_EMAIL=... MEDUSA_ADMIN_PASSWORD=... \
node scripts/seed-ah.mjs            # add --delete-demo to remove the
                                    # boilerplate t-shirt catalog
```

Idempotent: rerunning updates by handle instead of duplicating.

## Product metadata template (the SUFI BLISS shape)

The PDP renders extra sections only when these `metadata` keys exist
(strings contain JSON arrays or plain text; `\n\n` splits paragraphs):

| key              | renders                                    |
| ---------------- | ------------------------------------------ |
| `ah_price_line`  | price line under the title, e.g. `15mL ∙ $60` |
| `ah_paragraphs`  | description paragraphs                     |
| `ah_applications`| POTENTIAL APPLICATIONS roman list          |
| `ah_design`      | "Strategic design" section (first item left, rest right) |
| `ah_frequencies` | "Infused resonant healing frequencies" ruled rows |
| `ah_use`         | "Suggested use" accordion                  |

SUFI BLISS ASCENSION OIL is seeded with the full set as the reference;
fill the other products in the admin (Products → … → Metadata) as copy
arrives.

## Conditions filter

The storefront's FILTER flyout filters by product tags shaped
`condition:<kebab-case>`, e.g. `condition:gum-health`. The handoff lists the
condition vocabulary but no product↔condition mapping, so none are seeded —
add tags per product in the admin and the flyout picks them up.

## Manual admin steps (once)

1. **Free shipping ≥ $250** — Settings → Shipping: add a price rule on the
   shipping option (amount 0 when cart total ≥ 250). The announcement bar
   copy lives in the storefront and must be kept in sync.
2. **"from $X" products** — the seed creates a single Default variant at the
   base price; replace with real size variants (e.g. `15mL ∙ $65 — 30mL ∙
   $120`) when the client supplies them. The seed report lists them.
3. **Missing packshots** — SUFI BLISS and Lemurian ORMUS cutouts live in the
   client Drive (`01_BACKGROUND REMOVED`); upload in admin when received.
