import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <h2 className="text-p1 uppercase mt-v49 mb-4 pb-3 border-b-hairline border-ah-ink">
        Payment
      </h2>
      <div>
        {payment && (
          <div className="grid grid-cols-1 xsmall:grid-cols-[1fr_2fr] gap-6 w-full">
            <div className="flex flex-col">
              <span className="text-p2 mb-1">Payment method</span>
              <span className="text-p2 text-ah-muted" data-testid="payment-method">
                {paymentInfoMap[payment.provider_id].title}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-p2 mb-1">Payment details</span>
              <div className="flex gap-2 text-p2 text-ah-muted items-center">
                <span className="flex items-center h-7 w-fit">
                  {paymentInfoMap[payment.provider_id].icon}
                </span>
                <span data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default PaymentDetails
