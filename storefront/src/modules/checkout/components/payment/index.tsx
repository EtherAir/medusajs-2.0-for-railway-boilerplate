"use client"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RadioGroup } from "@headlessui/react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { CreditCard } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { AhButton } from "@modules/common/components/ah"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import Divider from "@modules/common/components/divider"
import PaymentContainer from "@modules/checkout/components/payment-container"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { StripeContext } from "@modules/checkout/components/payment-wrapper"
import { initiatePaymentSession } from "@lib/data/cart"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(activeSession?.provider_id)
  const stripeReady = useContext(StripeContext)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Founders Grotesk, sans-serif",
          fontWeight: "300",
          color: "#231F20",
          "::placeholder": {
            color: "#83998C",
          },
        },
      },
      classes: {
        base: "block w-full pt-2 pb-2 bg-transparent border-0 border-b border-ah-ink focus-within:border-ah-dark-seafoam",
      },
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      if (!activeSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={clx("text-p1 m-0", {
            "text-ah-muted": !isOpen && !paymentReady,
          })}
        >
          III. Payment
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-p2 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
            data-testid="edit-payment-button"
          >
            Edit →
          </button>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setSelectedPaymentMethod(value)}
              >
                {availablePaymentMethods
                  .sort((a, b) => {
                    return a.provider_id > b.provider_id ? 1 : -1
                  })
                  .map((paymentMethod) => {
                    return (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        key={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )
                  })}
              </RadioGroup>
              {isStripe && stripeReady && (
                <div className="mt-5 transition-all duration-150 ease-in-out">
                  <span className="text-p2 mb-1">Enter your card details:</span>

                  <CardElement
                    options={useOptions as StripeCardElementOptions}
                    onChange={(e) => {
                      setCardBrand(
                        e.brand &&
                          e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                      )
                      setError(e.error?.message || null)
                      setCardComplete(e.complete)
                    }}
                  />
                </div>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col">
              <span className="text-p2 mb-1">Payment method</span>
              <span
                className="text-p2 text-ah-muted"
                data-testid="payment-method-summary"
              >
                Gift card
              </span>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <AhButton
            className="mt-6"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? " Enter card details"
              : "Continue to review"}
          </AhButton>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="grid grid-cols-1 xsmall:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col">
                <span className="text-p2 mb-1">Payment method</span>
                <span
                  className="text-p2 text-ah-muted"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[selectedPaymentMethod]?.title ||
                    selectedPaymentMethod}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-p2 mb-1">Payment details</span>
                <div
                  className="flex gap-2 text-p2 text-ah-muted items-center"
                  data-testid="payment-details-summary"
                >
                  <span className="flex items-center h-7 w-fit">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </span>
                  <span>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col">
              <span className="text-p2 mb-1">Payment method</span>
              <span
                className="text-p2 text-ah-muted"
                data-testid="payment-method-summary"
              >
                Gift card
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
