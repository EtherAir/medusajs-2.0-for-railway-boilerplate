"use client"

import { useState } from "react"
import Image from "next/image"

import { AH_CATEGORIES } from "@lib/constants/ah"
import { CATEGORY_FEATURE } from "@lib/content/home"
import { AhArrowLink, AhRule, SectionRule, cx } from "@modules/common/components/ah"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TINT_CLASS: Record<string, string> = {
  dental: "bg-ah-tint-dental",
  skin: "bg-ah-tint-skin",
  superfood: "bg-ah-tint-superfood",
  energy: "bg-ah-tint-energy",
  probiotic: "bg-ah-tint-probiotic",
  longevity: "bg-ah-tint-longevity",
}

/**
 * "Shop by category": six ruled rows on the left; hovering a row crossfades
 * the 505px packaging-tint panel on the right to that category's featured
 * formula. Hover doesn't exist on touch — below 1024px the panel is removed
 * and the rows stand alone as a ruled tap list.
 */
export default function CategoryIndex() {
  const [active, setActive] = useState(0)

  const entries = AH_CATEGORIES.map((cat, i) => ({
    cat,
    i,
    product:
      cat.products.find((p) => p.handle === CATEGORY_FEATURE[cat.numeral]) ||
      cat.products[0],
  }))

  return (
    <section className="content-container pt-v111 small:pt-[155px]">
      <SectionRule label="Shop by category" />
      <div className="grid grid-cols-1 small:grid-cols-[1fr_505px] gap-10 small:gap-[86px] items-start pt-v42">
        <div>
          {entries.map(({ cat, i }) => (
            <LocalizedClientLink
              key={cat.numeral}
              href={`/categories/${cat.handle}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cx(
                "grid grid-cols-[40px_1fr_auto] small:grid-cols-[56px_1fr_auto] gap-3 small:gap-6 items-baseline",
                "py-[26px] border-t-hairline border-ah-ink no-underline transition-ah",
                i === active ? "text-ah-ink" : "text-ah-muted"
              )}
            >
              <span className="text-p1">{cat.numeral}</span>
              <span className="text-p1 uppercase">{cat.title}</span>
              <span
                className={cx(
                  "text-p2 transition-opacity duration-hover hidden small:inline",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                Shop{" "}
                {cat.products.length > 1
                  ? `${cat.products.length} formulas`
                  : "1 formula"}{" "}
                →
              </span>
            </LocalizedClientLink>
          ))}
          <AhRule />
          <div className="mt-[34px]">
            <AhArrowLink href="/shop">Shop all</AhArrowLink>
          </div>
        </div>

        {/* Desktop crossfade panel */}
        <div className="relative h-[646px] hidden small:block">
          {entries.map(({ cat, product }, i) => (
            <LocalizedClientLink
              key={cat.numeral}
              href={`/products/${product.handle}`}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              className={cx(
                "absolute inset-0 flex flex-col items-center justify-center gap-7",
                "no-underline text-ah-ink transition-opacity duration-[400ms] ease-ah",
                TINT_CLASS[cat.tint],
                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="object-contain w-[300px] h-[400px]"
                />
              ) : (
                <div className="w-[300px] h-[400px]" aria-hidden="true" />
              )}
              <span className="text-center">
                <span className="text-p1 uppercase block">{product.name}</span>
                <span className="text-p2 lowercase block mt-1">
                  {product.descriptor}
                </span>
                <span className="text-p2 block mt-[10px]">{product.price}</span>
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
