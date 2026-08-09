import { cookies } from "next/headers"

import { AhRule } from "@modules/common/components/ah"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"

  return (
    <main className="pt-[88px] min-h-[600px]">
      <div
        className="content-container max-w-[900px] pb-[121px]"
        data-testid="order-complete-container"
      >
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <h1 className="text-h1 m-0 whitespace-pre-line">
          {"Thank you!\nYour order was placed successfully."}
        </h1>
        <div className="mt-[26px]">
          <AhRule />
        </div>
        <div className="pt-v42">
          <OrderDetails order={order} />
        </div>
        <h2 className="text-p1 uppercase mt-v49 mb-4 pb-3 border-b-hairline border-ah-ink">
          Order summary
        </h2>
        <Items items={order.items} />
        <div className="mt-6 pt-[18px] border-t-hairline border-ah-ink">
          <CartTotals totals={order} />
        </div>
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <Help />
      </div>
    </main>
  )
}
