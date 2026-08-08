import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { AhRule } from "@modules/common/components/ah"
import { HttpTypes } from "@medusajs/types"

/**
 * Cart page per comp: "Cart (n)" H1 over a rule, ruled line items left,
 * 441px summary aside right (stacked on mobile, summary after items).
 */
const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const count = cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0

  return (
    <main className="pt-[88px] min-h-[600px]">
      <div className="content-container pb-v111" data-testid="cart-container">
        <h1 className="text-h1 m-0">Cart ({count})</h1>
        <div className="mt-[26px]">
          <AhRule />
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_441px] gap-10 small:gap-[clamp(80px,13.5vw,194px)] pt-v49 items-start">
            <div className="grid gap-8">
              {!customer && (
                <>
                  <SignInPrompt />
                  <AhRule />
                </>
              )}
              <ItemsTemplate items={cart?.items} />
            </div>
            <div className="small:sticky small:top-12">
              {cart && cart.region && <Summary cart={cart as any} />}
            </div>
          </div>
        ) : (
          <div className="pt-v49">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </main>
  )
}

export default CartTemplate
