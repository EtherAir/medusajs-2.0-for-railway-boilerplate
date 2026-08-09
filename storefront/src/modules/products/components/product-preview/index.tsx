import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

/**
 * Catalog card, AH style: packshot, ALL-CAPS title, lowercase descriptor
 * (subtitle), bare price. Whole card hovers to Dark Seafoam. Testids kept
 * for the e2e suite.
 */
export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  const hasVariedPrices =
    new Set((pricedProduct.variants ?? []).map((v) => v.calculated_price?.calculated_amount)).size > 1

  const soldOut = (pricedProduct.variants ?? []).every(
    (v) => v.manage_inventory && (v.inventory_quantity ?? 0) <= 0
  )

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block no-underline text-ah-ink transition-ah hover:text-ah-dark-seafoam"
    >
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="mt-v21 text-p2">
          <span className="uppercase block" data-testid="product-title">
            {product.title}
          </span>
          {product.subtitle && (
            <span className="lowercase block">{product.subtitle}</span>
          )}
        </div>
        {cheapestPrice && (
          <div className="mt-2 text-p2 leading-none flex gap-2 items-baseline">
            <span className="flex gap-1">
              {hasVariedPrices && <span>from</span>}
              <PreviewPrice price={cheapestPrice} />
            </span>
            {soldOut && (
              <span className="text-ah-muted uppercase">Out of stock</span>
            )}
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}
