import { AH_CATEGORIES } from "@lib/constants/ah"
import { getCategoriesList } from "@lib/data/categories"
import { getProductsList } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { AhRule, SectionRule } from "@modules/common/components/ah"
import ProductPreview from "@modules/products/components/product-preview"
import FilterFlyout from "@modules/shop/components/filter-flyout"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

/**
 * The Shop page: H1 + tagline, one ruled roman-numeraled section per
 * category (rank-ordered from the backend; numeral/tint from category
 * metadata), 4-col product grid, edge FILTER tab. Fully backend-driven —
 * categories without published products are skipped, and an explicit
 * empty state renders if the catalog is unreachable.
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

  const currentHandles = new Set(AH_CATEGORIES.map((c) => c.handle))
  const categories = (product_categories ?? [])
    .filter((c) => currentHandles.has(c.handle)) // current AH catalog only
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
    .filter(
      (c) =>
        selectedCategories.length === 0 || selectedCategories.includes(c.handle)
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

        {categories.length === 0 || !region ? (
          <p className="text-p1 text-ah-muted m-0 py-v49">
            The shop is being restocked — check back shortly.
          </p>
        ) : (
          categories.map((cat) => (
            <ShopSection
              key={cat.id}
              category={cat}
              region={region}
              countryCode={countryCode}
              conditions={selectedConditions}
            />
          ))
        )}
        <AhRule />
      </div>
    </main>
  )
}

async function ShopSection({
  category,
  region,
  countryCode,
  conditions,
}: {
  category: HttpTypes.StoreProductCategory
  region: HttpTypes.StoreRegion
  countryCode: string
  conditions: string[]
}) {
  const {
    response: { products },
  } = await getProductsList({
    queryParams: { category_id: [category.id], limit: 24 } as any,
    countryCode,
  }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] } }))

  const visible = conditions.length
    ? products.filter((p) =>
        p.tags?.some((t) =>
          conditions.some(
            (c) => t.value === `condition:${c.toLowerCase().replace(/\s+/g, "-")}`
          )
        )
      )
    : products

  if (visible.length === 0) {
    return null
  }

  const numeral = (category.metadata?.numeral as string) ?? ""

  return (
    <section className="mb-v82">
      <SectionRule
        label={`${numeral} ${category.name}`}
        right={
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
          >
            View category <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        }
      />
      <div className="grid grid-cols-2 small:grid-cols-4 gap-x-10 gap-y-14 pt-v49">
        {visible.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} />
        ))}
      </div>
    </section>
  )
}
