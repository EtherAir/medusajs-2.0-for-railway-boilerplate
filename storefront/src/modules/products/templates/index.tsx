import React, { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getAhProductContent } from "@lib/util/product-content"
import { AhReveal } from "@modules/common/components/ah"
import ProductActions from "@modules/products/components/product-actions"
import {
  Frequencies,
  StrategicDesign,
  UseAndPolicies,
} from "@modules/products/components/pdp-sections"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

const ROM = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII."]

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

/**
 * PDP per the comp: breadcrumb; 441px info column (name+descriptor, price
 * line, paragraphs, POTENTIAL APPLICATIONS, Add to Cart) beside a 536×581
 * contained packshot; then Strategic design, frequencies rows, use +
 * policy accordions, and the More-{category} 3-up. Sections render only
 * when the product carries the matching metadata.
 */
const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const content = getAhProductContent(product)
  const category = product.categories?.[0]
  const mainImage = product.thumbnail ?? product.images?.[0]?.url

  return (
    <main className="pt-16">
      <div className="content-container">
        <nav className="flex gap-[10px] text-p2 mb-[34px]">
          <LocalizedClientLink
            href="/"
            className="text-ah-muted no-underline transition-ah hover:text-ah-ink"
          >
            Home
          </LocalizedClientLink>
          <span className="text-ah-muted" aria-hidden="true">
            →
          </span>
          <LocalizedClientLink
            href="/shop"
            className="text-ah-muted no-underline transition-ah hover:text-ah-ink"
          >
            Shop
          </LocalizedClientLink>
          {category && (
            <>
              <span className="text-ah-muted" aria-hidden="true">
                →
              </span>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
              >
                {category.name}
              </LocalizedClientLink>
            </>
          )}
        </nav>
      </div>

      <div
        className="content-container grid grid-cols-1 small:grid-cols-[441px_1fr] gap-10 small:gap-[clamp(80px,13.5vw,194px)] items-start"
        data-testid="product-container"
      >
        {/* Image first on mobile */}
        <div className="small:order-2 small:sticky small:top-12">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              width={536}
              height={581}
              priority
              className="block object-contain w-full max-w-[536px] h-auto small:h-[581px] mx-auto"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          )}
        </div>

        <div className="small:order-1">
          <ProductInfo product={product} />

          {content.priceLine && (
            <div className="text-p1 mt-6">{content.priceLine}</div>
          )}

          {content.paragraphs.map((t, i) => (
            <p
              key={i}
              className={`text-p2 m-0 ${i ? "mt-[14px]" : "mt-7"}`}
              data-testid={i === 0 ? "product-description" : undefined}
            >
              {t}
            </p>
          ))}

          {content.applications.length > 0 && (
            <div className="grid gap-[14px] mt-[34px] text-p2">
              <span className="uppercase">Potential applications:</span>
              {content.applications.map((a, i) => (
                <span key={a} className="uppercase">
                  {ROM[i]}&nbsp;&nbsp;{a}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Suspense
              fallback={
                <ProductActions disabled={true} product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </div>
      </div>

      <AhReveal>
        <StrategicDesign content={content} />
      </AhReveal>
      <AhReveal>
        <Frequencies content={content} />
      </AhReveal>
      <UseAndPolicies content={content} />

      <div className="content-container pt-[108px] pb-[92px]">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </main>
  )
}

export default ProductTemplate
