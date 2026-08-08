"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useParams } from "next/navigation"
import Image from "next/image"

import { convertToLocale } from "@lib/util/money"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { AhButton } from "@modules/common/components/ah"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Right-hand cart drawer on the Light Seafoam ground: "Cart (n)" over a rule,
 * ruled line items with a 61×29 outlined qty stepper and "Remove →", a rule
 * above the Total row, and a full-width Go to Checkout button. Slides in over
 * a warm scrim, 240ms opacity/transform only.
 *
 * Replaces the boilerplate cart-dropdown; keeps its open-on-add timer and
 * the nav-cart-link / nav-cart-dropdown / cart-item testids.
 */

function DrawerLineItem({ item }: { item: HttpTypes.StoreCartLineItem }) {
  const [updating, setUpdating] = useState(false)

  const step = async (delta: number) => {
    const next = item.quantity + delta
    setUpdating(true)
    try {
      if (next <= 0) await deleteLineItem(item.id)
      else await updateLineItem({ lineId: item.id, quantity: next })
    } finally {
      setUpdating(false)
    }
  }

  const remove = async () => {
    setUpdating(true)
    try {
      await deleteLineItem(item.id)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div
      className={`flex gap-6 justify-between ${updating ? "opacity-50" : ""}`}
      data-testid="cart-item"
    >
      <div className="flex-1">
        <LocalizedClientLink
          href={`/products/${item.variant?.product?.handle}`}
          className="no-underline text-ah-ink"
          data-testid="product-link"
        >
          <div className="text-p1">
            <span className="uppercase">{item.product_title ?? item.title}</span>
            {item.subtitle && (
              <>
                {"\n"}
                <span className="lowercase block">{item.subtitle}</span>
              </>
            )}
          </div>
        </LocalizedClientLink>
        {item.variant?.title && item.variant.title !== "Default variant" && (
          <div
            className="text-p2 mt-3"
            data-testid="cart-item-variant"
            data-value={item.variant?.title}
          >
            {item.variant.title}
          </div>
        )}
        <div className="flex items-center gap-[25px] mt-[22px]">
          <div className="w-[61px] h-[29px] border border-ah-ink flex items-center justify-between px-[6px]">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => step(-1)}
              disabled={updating}
              className="text-p2 w-4 text-left"
            >
              –
            </button>
            <span
              className="text-p2"
              data-testid="cart-item-quantity"
              data-value={item.quantity}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => step(1)}
              disabled={updating}
              className="text-p2 w-4 text-right"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={updating}
            className="text-p2 text-ah-ink underline decoration-[0.5px] underline-offset-[7px] transition-ah hover:text-ah-dark-seafoam"
            data-testid="cart-item-remove-button"
          >
            Remove →
          </button>
        </div>
      </div>
      <div className="flex-none flex items-start gap-7">
        <span className="text-p1"><LineItemPrice item={item} style="tight" /></span>
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.product_title ?? ""}
            width={88}
            height={110}
            className="object-contain w-[88px] h-[110px]"
          />
        )}
      </div>
    </div>
  )
}

export default function CartDrawer({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  const [open, setOpen] = useState(false)
  const activeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : "us"

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    setOpen(true)
    activeTimer.current = setTimeout(() => setOpen(false), 5000)
  }

  useEffect(() => {
    return () => clearTimeout(activeTimer.current)
  }, [])

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  const total = convertToLocale({
    amount: cartState?.total ?? 0,
    currency_code: cartState?.currency_code ?? "usd",
  })
  const subtotal = cartState?.subtotal ?? 0

  const keepOpen = () => {
    clearTimeout(activeTimer.current)
  }

  const items = (cartState?.items ?? []).sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-p2 text-current transition-ah hover:text-ah-dark-seafoam"
        data-testid="nav-cart-link"
      >
        {`Cart (${totalItems})`}
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-flyout ease-ah"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-flyout ease-ah"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0"
              style={{ background: "var(--ah-drawer-scrim)" }}
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-flyout ease-ah"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-flyout ease-ah"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              onMouseEnter={keepOpen}
              className="fixed inset-y-0 right-0 w-full small:w-[575px] bg-ah-page px-5 small:px-11 pt-7 pb-11 flex flex-col overflow-y-auto"
              data-testid="nav-cart-dropdown"
            >
              <div className="text-p1 pb-[18px] border-b-hairline border-ah-ink flex justify-between items-baseline">
                <span>Cart ({totalItems})</span>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setOpen(false)}
                  className="text-p1 transition-ah hover:text-ah-dark-seafoam"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-10 pt-10 flex-1 content-start">
                {items.length === 0 ? (
                  <div className="text-p1">
                    Your cart is empty.
                    <div className="mt-6">
                      <LocalizedClientLink
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
                      >
                        Shop now →
                      </LocalizedClientLink>
                    </div>
                  </div>
                ) : (
                  items.map((item) => <DrawerLineItem key={item.id} item={item} />)
                )}
              </div>

              <div className="border-t-hairline border-ah-ink pt-[18px] mt-10 flex justify-between text-p1">
                <span>Total</span>
                <span data-testid="cart-subtotal" data-value={subtotal}>
                  {total}
                </span>
              </div>
              <div className="mt-7">
                <AhButton
                  full
                  disabled={items.length === 0}
                  onClick={() => {
                    setOpen(false)
                    router.push(`/${countryCode}/checkout?step=address`)
                  }}
                  data-testid="go-to-cart-button"
                >
                  Go to Checkout
                </AhButton>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
