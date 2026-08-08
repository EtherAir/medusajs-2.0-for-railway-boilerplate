import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/layout/components/logo"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-ah-page relative small:min-h-screen">
      <div className="h-nav border-b-hairline border-ah-ink">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <span aria-hidden="true">← </span>
            <span className="hidden small:inline">Back to shopping cart</span>
            <span className="small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            aria-label="Ascended Health"
            data-testid="store-link"
          >
            <Logo width={240} className="w-[180px] small:w-[240px] h-auto" />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-8" />
    </div>
  )
}
