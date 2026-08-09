import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  items: HttpTypes.StoreCartLineItem[] | HttpTypes.StoreOrderLineItem[] | null
}

/** Ruled stack of order lines (no table). */
const Items = ({ items }: ItemsProps) => {
  return (
    <div className="grid gap-6" data-testid="products-table">
      {items?.length
        ? items
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => <Item key={item.id} item={item} />)
        : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
    </div>
  )
}

export default Items
