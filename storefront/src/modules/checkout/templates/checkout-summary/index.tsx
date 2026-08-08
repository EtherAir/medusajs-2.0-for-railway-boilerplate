"use client"

import { useState } from "react"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { AhRule, SectionRule, cx } from "@modules/common/components/ah"

/**
 * Order summary per comp: "ORDER SUMMARY (n)" on a rule, compact ruled
 * items, rule, totals. Collapsible accordion above the form on mobile.
 */
const CheckoutSummary = ({ cart }: { cart: any }) => {
  const [openOnMobile, setOpenOnMobile] = useState(false)
  const count =
    cart?.items?.reduce((n: number, i: any) => n + i.quantity, 0) ?? 0

  return (
    <div className="small:sticky small:top-8 py-8 small:py-0 order-first small:order-none">
      {/* Mobile toggle */}
      <button
        type="button"
        className="w-full small:hidden flex items-baseline justify-between py-3 border-y-hairline border-ah-ink text-p2 uppercase"
        onClick={() => setOpenOnMobile((o) => !o)}
        aria-expanded={openOnMobile}
      >
        <span>Order summary ({count})</span>
        <span aria-hidden="true">{openOnMobile ? "−" : "+"}</span>
      </button>

      <div className={cx("small:block", openOnMobile ? "block" : "hidden")}>
        <div className="hidden small:block">
          <SectionRule label={`Order summary (${count})`} rules="bottom" />
        </div>
        <div className="pt-[34px]">
          <ItemsPreviewTemplate items={cart?.items} />
        </div>
        <div className="mt-v42">
          <AhRule />
          <div className="pt-[18px]">
            <CartTotals totals={cart} />
          </div>
        </div>
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
