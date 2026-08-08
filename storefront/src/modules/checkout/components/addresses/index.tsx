"use client"

import { useToggleState } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { useFormState } from "react-dom"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  return (
    <div>
      <div className="flex flex-row items-baseline justify-between mb-6">
        <h2 className="text-p1 m-0">
          I. Contact &amp; shipping address
        </h2>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-p2 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
            data-testid="edit-address-button"
          >
            Edit →
          </button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <h2 className="text-p1 pb-6 pt-8 m-0">Billing address</h2>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="grid grid-cols-1 xsmall:grid-cols-3 gap-6 w-full">
                  <div
                    className="flex flex-col"
                    data-testid="shipping-address-summary"
                  >
                    <span className="text-p2 mb-1">Shipping Address</span>
                    <span className="text-p2 text-ah-muted">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </span>
                    <span className="text-p2 text-ah-muted">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </span>
                    <span className="text-p2 text-ah-muted">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </span>
                    <span className="text-p2 text-ah-muted">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </span>
                  </div>

                  <div
                    className="flex flex-col"
                    data-testid="shipping-contact-summary"
                  >
                    <span className="text-p2 mb-1">Contact</span>
                    <span className="text-p2 text-ah-muted">
                      {cart.shipping_address.phone}
                    </span>
                    <span className="text-p2 text-ah-muted">
                      {cart.email}
                    </span>
                  </div>

                  <div
                    className="flex flex-col"
                    data-testid="billing-address-summary"
                  >
                    <span className="text-p2 mb-1">Billing Address</span>

                    {sameAsBilling ? (
                      <span className="text-p2 text-ah-muted">
                        Billing- and delivery address are the same.
                      </span>
                    ) : (
                      <>
                        <span className="text-p2 text-ah-muted">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </span>
                        <span className="text-p2 text-ah-muted">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </span>
                        <span className="text-p2 text-ah-muted">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </span>
                        <span className="text-p2 text-ah-muted">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
