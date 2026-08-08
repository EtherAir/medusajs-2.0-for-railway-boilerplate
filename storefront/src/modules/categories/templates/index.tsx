import { notFound } from "next/navigation"
import { Suspense } from "react"

import { AH_CATEGORIES } from "@lib/constants/ah"
import { AhArrowLink, AhRule } from "@modules/common/components/ah"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import FilterFlyout from "@modules/shop/components/filter-flyout"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

/**
 * Category page: breadcrumb (Home → Shop → Category), roman-numeraled H1,
 * 3-col grid, edge FILTER tab (conditions only), Shop all beneath.
 */
export default function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const category = categories[categories.length - 1]

  if (!category || !countryCode) notFound()

  // Roman numeral from category metadata (seeded) or the static handle map.
  const numeral =
    (category.metadata?.numeral as string | undefined) ??
    AH_CATEGORIES.find((c) => c.handle === category.handle)?.numeral

  return (
    <main
      className="relative pt-16 min-h-[700px]"
      data-testid="category-container"
    >
      <FilterFlyout showCategories={false} top={190} />

      <div className="content-container">
        <nav className="flex gap-[10px] text-p2 mb-5">
          <LocalizedClientLink
            href="/"
            className="text-ah-muted no-underline transition-ah hover:text-ah-ink"
          >
            Home
          </LocalizedClientLink>
          <span className="text-ah-muted" aria-hidden="true">
            →
          </span>
          <LocalizedClientLink
            href="/shop"
            className="text-ah-muted no-underline transition-ah hover:text-ah-ink"
          >
            Shop
          </LocalizedClientLink>
          <span className="text-ah-muted" aria-hidden="true">
            →
          </span>
          <span>{category.name}</span>
        </nav>

        <h1 className="text-h1 m-0" data-testid="category-page-title">
          {numeral ? `${numeral} ` : ""}
          {category.name}
        </h1>

        {category.description && (
          <p className="text-p1 mt-3 m-0 max-w-[600px]">
            {category.description}
          </p>
        )}

        <div className="pt-v49 pb-[62px]">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>

        <AhRule />
        <div className="pt-[34px] pb-[92px]">
          <AhArrowLink href="/shop">Shop all</AhArrowLink>
        </div>
      </div>
    </main>
  )
}
