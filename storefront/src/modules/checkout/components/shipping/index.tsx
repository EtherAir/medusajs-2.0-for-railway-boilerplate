"use client"

import { RadioGroup } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { AhButton } from "@modules/common/components/ah"

import Divider from "@modules/common/components/divider"
import Radio from "@modules/common/components/radio"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { setShippingMethod } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const selectedShippingMethod = availableShippingMethods?.find(
    // To do: remove the previously selected shipping method instead of using the last one
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={clx("text-p1 m-0", {
            "text-ah-muted": !isOpen && cart.shipping_methods?.length === 0,
          })}
        >
          II. Delivery
        </h2>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <button
              onClick={handleEdit}
              className="text-p2 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
              data-testid="edit-delivery-button"
            >
              Edit →
            </button>
          )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className="pb-8">
            <RadioGroup value={selectedShippingMethod?.id} onChange={set}>
              {availableShippingMethods?.map((option) => {
                return (
                  <RadioGroup.Option
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    className={clx(
                      "flex items-baseline justify-between cursor-pointer py-4 border-t-hairline border-ah-ink transition-ah",
                      option.id === selectedShippingMethod?.id
                        ? "text-ah-ink"
                        : "text-ah-muted hover:text-ah-ink"
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <Radio
                        checked={option.id === selectedShippingMethod?.id}
                      />
                      <span className="text-p2">{option.name}</span>
                    </div>
                    <span className="justify-self-end text-p2">
                      {convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </span>
                  </RadioGroup.Option>
                )
              })}
            </RadioGroup>
          </div>

          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />

          <AhButton
            className="mt-6"
            onClick={handleSubmit}
            disabled={isLoading || !cart.shipping_methods?.[0]}
            data-testid="submit-delivery-option-button"
          >
            Continue to payment
          </AhButton>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                <span className="text-p2 mb-1">Method</span>
                <span className="text-p2 text-ah-muted">
                  {selectedShippingMethod?.name}{" "}
                  {convertToLocale({
                    amount: selectedShippingMethod?.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
