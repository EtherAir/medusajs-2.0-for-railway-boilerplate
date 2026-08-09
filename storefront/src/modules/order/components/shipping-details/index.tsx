import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <h2 className="text-p1 uppercase mt-v49 mb-4 pb-3 border-b-hairline border-ah-ink">
        Delivery
      </h2>
      <div className="grid grid-cols-1 xsmall:grid-cols-3 gap-6">
        <div
          className="flex flex-col"
          data-testid="shipping-address-summary"
        >
          <span className="text-p2 mb-1">Shipping Address</span>
          <span className="text-p2 text-ah-muted">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </span>
          <span className="text-p2 text-ah-muted">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </span>
          <span className="text-p2 text-ah-muted">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </span>
          <span className="text-p2 text-ah-muted">
            {order.shipping_address?.country_code?.toUpperCase()}
          </span>
        </div>

        <div
          className="flex flex-col"
          data-testid="shipping-contact-summary"
        >
          <span className="text-p2 mb-1">Contact</span>
          <span className="text-p2 text-ah-muted">
            {order.shipping_address?.phone}
          </span>
          <span className="text-p2 text-ah-muted">{order.email}</span>
        </div>

        <div
          className="flex flex-col"
          data-testid="shipping-method-summary"
        >
          <span className="text-p2 mb-1">Method</span>
          <span className="text-p2 text-ah-muted">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </span>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
