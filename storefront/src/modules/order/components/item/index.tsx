import { HttpTypes } from "@medusajs/types"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
}

/** Order line: thumbnail, caps name + variant, qty × unit, line total. */
const Item = ({ item }: ItemProps) => {
  return (
    <div
      className="flex gap-4 items-start justify-between"
      data-testid="product-row"
    >
      <div className="flex gap-4 items-start">
        <div className="w-14 flex-none">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
        <div className="text-p2">
          <span className="uppercase block" data-testid="product-name">
            {item.product_title ?? item.title}
          </span>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          <span className="text-ah-muted flex gap-1 items-baseline">
            <span data-testid="product-quantity">{item.quantity}</span>
            <span>×</span>
            <LineItemUnitPrice item={item} style="tight" />
          </span>
        </div>
      </div>
      <span className="text-p2 flex-none">
        <LineItemPrice item={item} style="tight" />
      </span>
    </div>
  )
}

export default Item
