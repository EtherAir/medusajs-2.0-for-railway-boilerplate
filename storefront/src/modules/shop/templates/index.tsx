import { getCategoriesList } from "@lib/data/categories"
import { getProductsList } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { AH_CATEGORIES, AhCategory } from "@lib/constants/ah"
import { AhRule, SectionRule } from "@modules/common/components/ah"
import AhProductCard from "@modules/common/components/ah/product-card"
import ProductPreview from "@modules/products/components/product-preview"
import FilterFlyout from "@modules/shop/components/filter-flyout"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

/**
 * The Shop page: H1 + tagline, then one ruled section per category
 * (roman-numeraled label, "View category →", 4-col grid), with the edge
 * FILTER tab. Prefers live Medusa categories matched by the AH handle
 * contract; falls back to the static map until the catalog is seeded.
 */
export default async function ShopTemplate({
  countryCode,
  selectedCategories,
  selectedConditions,
}: {
  countryCode: string
  selectedCategories: string[]
  selectedConditions: string[]
}) {
  const region = await getRegion(countryCode)
  const { product_categories } = await getCategoriesList(0, 100).catch(() => ({
    product_categories: [] as HttpTypes.StoreProductCategory[],
  }))

  const backendByHandle = new Map(
    (product_categories ?? []).map((c) => [c.handle, c])
  )
  const seeded = AH_CATEGORIES.some((c) => backendByHandle.has(c.handle))

  const visible = AH_CATEGORIES.filter(
    (c) => selectedCategories.length === 0 || selectedCategories.includes(c.handle)
  )

  return (
    <main className="relative pt-16" data-testid="category-container">
      <FilterFlyout showCategories top={219} />

      <div className="content-container">
        <h1 className="text-h1 m-0" data-testid="store-page-title">
          Shop
        </h1>
        <div className="text-p1 mt-3 mb-v42">
          Life-enhancing formulas for holistic microbiome and cellular support.
        </div>

        {visible.map((cat) => (
          <ShopSection
            key={cat.handle}
            cat={cat}
            backend={backendByHandle.get(cat.handle)}
            region={region}
            countryCode={countryCode}
            conditions={selectedConditions}
            seeded={seeded}
          />
        ))}
        <AhRule />
      </div>
    </main>
  )
}

async function ShopSection({
  cat,
  backend,
  region,
  countryCode,
  conditions,
  seeded,
}: {
  cat: AhCategory
  backend?: HttpTypes.StoreProductCategory
  region: HttpTypes.StoreRegion | undefined | null
  countryCode: string
  conditions: string[]
  seeded: boolean
}) {
  let backendProducts: HttpTypes.StoreProduct[] = []

  if (backend && region) {
    const {
      response: { products },
    } = await getProductsList({
      queryParams: { category_id: [backend.id], limit: 24 } as any,
      countryCode,
    }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] } }))

    backendProducts = conditions.length
      ? products.filter((p) =>
          p.tags?.some((t) =>
            conditions.some(
              (c) => t.value === `condition:${c.toLowerCase().replace(/\s+/g, "-")}`
            )
          )
        )
      : products
  }

  const useBackend = seeded && backend
  if (useBackend && backendProducts.length === 0 && conditions.length > 0) {
    return null
  }

  return (
    <section className="mb-v82">
      <SectionRule
        label={`${cat.numeral} ${cat.title}`}
        right={
          <LocalizedClientLink
            href={`/categories/${cat.handle}`}
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
          >
            View category <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        }
      />
      <div className="grid grid-cols-2 small:grid-cols-4 gap-x-10 gap-y-14 pt-v49">
        {useBackend && region ? (
          backendProducts.map((p) => (
            <ProductPreview key={p.id} product={p} region={region} />
          ))
        ) : (
          cat.products.map((p) => (
            <AhProductCard
              key={p.handle}
              image={p.image || undefined}
              name={p.name}
              descriptor={p.descriptor}
              price={p.price}
              href={`/products/${p.handle}`}
              imageHeight={260}
              align="center"
            />
          ))
        )}
      </div>
    </section>
  )
}
