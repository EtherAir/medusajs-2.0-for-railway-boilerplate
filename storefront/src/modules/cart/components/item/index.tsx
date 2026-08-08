"use client"

import { useState } from "react"
import Image from "next/image"

import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cx } from "@modules/common/components/ah"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
}

/**
 * Ruled cart line per the comp: caps name over lowercase descriptor, variant
 * line, 61×29 outlined qty stepper with "Remove →", price and packshot
 * right. Preview type (checkout summary) is a compact row.
 */
const Item = ({ item, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant?.product ?? {}

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    try {
      if (quantity <= 0) {
        await deleteLineItem(item.id)
      } else {
        await updateLineItem({ lineId: item.id, quantity }).catch((err) =>
          setError(err.message)
        )
      }
    } finally {
      setUpdating(false)
    }
  }

  const showVariant =
    item.variant?.title && item.variant.title !== "Default variant"

  if (type === "preview") {
    return (
      <div
        className="flex gap-4 justify-between items-start"
        data-testid="product-row"
      >
        <div className="flex gap-4 items-start">
          {item.thumbnail && (
            <Image
              src={item.thumbnail}
              alt={item.product_title ?? ""}
              width={48}
              height={60}
              className="object-contain w-12 h-[60px] flex-none"
            />
          )}
          <div className="text-p2">
            <span className="uppercase block" data-testid="product-title">
              {item.product_title}
            </span>
            {showVariant && (
              <span className="text-ah-muted block" data-testid="product-variant">
                {item.variant?.title}
              </span>
            )}
            <span className="text-ah-muted block">× {item.quantity}</span>
          </div>
        </div>
        <span className="text-p2 flex-none"><LineItemPrice item={item} style="tight" /></span>
      </div>
    )
  }

  return (
    <div
      className={cx(
        "flex gap-6 justify-between border-t-hairline border-ah-ink pt-8 first:border-t-0 first:pt-0",
        updating && "opacity-50"
      )}
      data-testid="product-row"
    >
      <div className="flex-1">
        <LocalizedClientLink
          href={`/products/${handle}`}
          className="no-underline text-ah-ink transition-ah hover:text-ah-dark-seafoam"
        >
          <div className="text-p1">
            <span className="uppercase" data-testid="product-title">
              {item.product_title}
            </span>
            {item.subtitle && (
              <span className="lowercase block">{item.subtitle}</span>
            )}
          </div>
        </LocalizedClientLink>
        {showVariant && (
          <div className="text-p2 mt-3" data-testid="product-variant">
            {item.variant?.title}
          </div>
        )}
        <div className="flex items-center gap-[25px] mt-[22px]">
          <div
            className="w-[61px] h-[29px] border border-ah-ink flex items-center justify-between px-[6px]"
            data-testid="product-select-button"
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={updating}
              onClick={() => changeQuantity(item.quantity - 1)}
              className="text-p2 w-4 text-left"
            >
              –
            </button>
            <span className="text-p2" data-value={item.quantity}>
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={updating}
              onClick={() => changeQuantity(item.quantity + 1)}
              className="text-p2 w-4 text-right"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={updating}
            onClick={() => changeQuantity(0)}
            className="text-p2 text-ah-ink underline decoration-[0.5px] underline-offset-[7px] transition-ah hover:text-ah-dark-seafoam"
            data-testid="product-delete-button"
          >
            Remove →
          </button>
        </div>
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      <div className="flex-none flex items-start gap-7">
        <span className="text-p1"><LineItemPrice item={item} style="tight" /></span>
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.product_title ?? ""}
            width={88}
            height={110}
            className="object-contain w-[72px] small:w-[88px] h-auto"
          />
        )}
      </div>
    </div>
  )
}

export default Item
