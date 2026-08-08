import { AhArrowLink } from "@modules/common/components/ah"

const EmptyCartMessage = () => {
  return (
    <div data-testid="empty-cart-message">
      <div className="text-p1">Your cart is empty.</div>
      <div className="mt-6">
        <AhArrowLink href="/shop">Shop now</AhArrowLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
