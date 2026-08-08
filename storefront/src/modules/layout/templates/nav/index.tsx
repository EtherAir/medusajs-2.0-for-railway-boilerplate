import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CartButton from "@modules/layout/components/cart-button"
import HeaderFrame from "@modules/layout/components/header-frame"
import MobileMenu from "@modules/layout/components/mobile-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <HeaderFrame
      mobileMenu={<MobileMenu regions={regions} />}
      cartButton={
        <Suspense
          fallback={
            <span className="text-p2 leading-none" data-testid="nav-cart-link">
              Cart (0)
            </span>
          }
        >
          <CartButton />
        </Suspense>
      }
    />
  )
}
