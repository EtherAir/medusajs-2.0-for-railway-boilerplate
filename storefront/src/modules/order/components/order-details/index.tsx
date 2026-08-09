import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <p className="text-p2 m-0">
        We have sent the order confirmation details to{" "}
        <span data-testid="order-email">{order.email}</span>.
      </p>
      <p className="text-p2 m-0 mt-2 text-ah-muted">
        Order date:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </p>
      <p className="text-p2 m-0 mt-2">
        Order number: <span data-testid="order-id">{order.display_id}</span>
      </p>

      <div className="flex items-center text-p2 gap-x-4 mt-4">
        {showStatus && (
          <>
            <p className="text-p2 m-0">
              Order status:{" "}
              <span className="text-ah-muted" data-testid="order-status">
                {/* TODO: Check where the statuses should come from */}
                {/* {formatStatus(order.fulfillment_status)} */}
              </span>
            </p>
            <p className="text-p2 m-0">
              Payment status:{" "}
              <span
                className="text-ah-muted"
                sata-testid="order-payment-status"
              >
                {/* {formatStatus(order.payment_status)} */}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
