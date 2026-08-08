import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

/**
 * PDP heading: ALL-CAPS product name over its lowercase descriptor, set as
 * one pre-line block at the h2 size (per the comp).
 */
const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <h1 className="text-h2 m-0 whitespace-pre-line" data-testid="product-title">
        <span className="uppercase">{product.title}</span>
        {product.subtitle && (
          <>
            {"\n"}
            <span className="lowercase">{product.subtitle}</span>
          </>
        )}
      </h1>
    </div>
  )
}

export default ProductInfo
