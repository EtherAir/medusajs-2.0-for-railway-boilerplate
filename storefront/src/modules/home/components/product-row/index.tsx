import { AH_CATEGORIES } from "@lib/constants/ah"
import { CATEGORY_FEATURE } from "@lib/content/home"
import { AhReveal, AhRule, SectionRule } from "@modules/common/components/ah"
import AhProductCard from "@modules/common/components/ah/product-card"

/**
 * "Ancient wisdom, modern formulas": the six featured formulas (one per
 * category) in a 6-up row, closed by a hairline rule.
 */
export default function ProductRow() {
  const featured = AH_CATEGORIES.map(
    (cat) =>
      cat.products.find((p) => p.handle === CATEGORY_FEATURE[cat.numeral]) ||
      cat.products[0]
  )

  return (
    <section className="content-container pt-v111 small:pt-[155px]">
      <AhReveal>
        <SectionRule label="Ancient wisdom, modern formulas" />
        <div className="grid grid-cols-2 xsmall:grid-cols-3 small:grid-cols-6 gap-6 pt-v42 pb-v42">
          {featured.map((p) => (
            <AhProductCard
              key={p.handle}
              image={p.image || undefined}
              name={p.name}
              descriptor={p.descriptor}
              price={p.price}
              href={`/products/${p.handle}`}
              imageHeight={178}
            />
          ))}
        </div>
        <AhRule />
      </AhReveal>
    </section>
  )
}
