"use client"

import { AH_ANNOUNCEMENT } from "@lib/constants/ah"
import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AhButton, AhRule } from "@modules/common/components/ah"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

/** Cart aside: rule, totals, free-shipping note, full-width checkout button. */
const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <aside>
      <AhRule />
      <div className="pt-[18px]">
        <CartTotals totals={cart} />
      </div>
      <div className="mt-[18px] text-p2 text-ah-muted">{AH_ANNOUNCEMENT}</div>
      <div className="mt-6">
        <DiscountCode cart={cart} />
      </div>
      <div className="mt-[34px]">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <AhButton full>Go to Checkout</AhButton>
        </LocalizedClientLink>
      </div>
    </aside>
  )
}

export default Summary
