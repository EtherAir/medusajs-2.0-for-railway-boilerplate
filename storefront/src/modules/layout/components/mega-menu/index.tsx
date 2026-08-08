"use client"

import { AH_CATEGORIES } from "@lib/constants/ah"
import { AhArrowLink } from "@modules/common/components/ah"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * The Shop mega-menu: a full-width Light Seafoam panel under the header —
 * six numbered category columns with their formula lists, "Shop all →"
 * bottom-right, closed by a hairline rule.
 */
export default function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div
      className="relative min-h-[411px] bg-ah-page border-b-hairline border-ah-ink px-7 pt-v42 pb-24 hidden small:block"
      data-testid="mega-menu"
    >
      <div className="grid grid-cols-6 gap-6">
        {AH_CATEGORIES.map((cat) => (
          <div key={cat.numeral}>
            <LocalizedClientLink
              href={`/categories/${cat.handle}`}
              onClick={onNavigate}
              className="text-p2 uppercase whitespace-pre-line block mb-[22px] text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
            >
              {`${cat.numeral} ${cat.title}`}
            </LocalizedClientLink>
            <div className="grid gap-4">
              {cat.products.map((p) => (
                <LocalizedClientLink
                  key={p.handle}
                  href={`/products/${p.handle}`}
                  onClick={onNavigate}
                  className="text-p2 uppercase whitespace-pre-line text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
                >
                  {p.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute right-[38px] bottom-[34px]" onClick={onNavigate}>
        <AhArrowLink href="/shop">Shop all</AhArrowLink>
      </div>
    </div>
  )
}
