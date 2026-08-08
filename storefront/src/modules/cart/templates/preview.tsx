"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { cx } from "@modules/common/components/ah"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

/** Compact ruled stack for the checkout order summary. */
const ItemsPreviewTemplate = ({ items }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={cx(
        "grid gap-6",
        hasOverflow &&
          "overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]"
      )}
      data-testid="items-table"
    >
      {items
        ? items
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => <Item key={item.id} item={item} type="preview" />)
        : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
    </div>
  )
}

export default ItemsPreviewTemplate
