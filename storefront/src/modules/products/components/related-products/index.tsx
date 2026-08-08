import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { AhRule, SectionRule } from "@modules/common/components/ah"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

/**
 * "More {category} products": three cards from the product's first category
 * (topped up from the wider catalog), between rules.
 */
export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const category = product.categories?.[0]

  const queryParams: HttpTypes.StoreProductParams & {
    category_id?: string[]
  } = { limit: 8 }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (category) {
    queryParams.category_id = [category.id]
  } else if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  const products = await getProductsList({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products.filter((p) => p.id !== product.id).slice(0, 3)
  )

  if (!products.length) {
    return null
  }

  const label = category
    ? `More ${category.name.toLowerCase()} products`
    : "More products"

  return (
    <div data-testid="related-products-container">
      <SectionRule label={label} rules="top" />
      <ul className="grid grid-cols-1 xsmall:grid-cols-3 gap-10 pt-v49 list-none m-0 p-0">
        {products.map((p) => (
          <li key={p.id}>
            <Product region={region} product={p} />
          </li>
        ))}
      </ul>
      <div className="mt-v49">
        <AhRule />
      </div>
    </div>
  )
}
