import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

/** Ruled stack of cart lines (no table). */
const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  return (
    <div className="grid gap-8">
      {items
        ? items
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => <Item key={item.id} item={item} />)
        : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
    </div>
  )
}

export default ItemsTemplate
