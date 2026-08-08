import { Suspense } from "react"

import { AhArrowLink, AhRule } from "@modules/common/components/ah"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

/** Collection page, styled like the category page (no numerals). */
export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <main className="relative pt-16 min-h-[700px]">
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
          <span>{collection.title}</span>
        </nav>

        <h1 className="text-h1 m-0">{collection.title}</h1>

        <div className="pt-v49 pb-[62px]">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
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
