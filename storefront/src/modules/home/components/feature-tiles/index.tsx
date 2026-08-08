import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AhArrowLink, AhReveal } from "@modules/common/components/ah"
import { HOME_FEATURES } from "@lib/content/home"

/**
 * "The path to wholeness starts here." — H1, an Explore link, then the
 * editorial two-up: 577×641 imagery with name / descriptor / price split
 * beneath. No cards, no borders.
 */
export default function FeatureTiles() {
  return (
    <section className="content-container pt-v111">
      <AhReveal>
        <h2 className="text-h1 m-0">The path to wholeness starts here.</h2>
        <div className="text-p2 mt-[14px]">
          <AhArrowLink href="/shop">Explore best sellers</AhArrowLink>
        </div>
      </AhReveal>
      <div className="grid grid-cols-1 small:grid-cols-2 gap-6 small:gap-[34px] mt-v42">
        {HOME_FEATURES.map((f, i) => (
          <AhReveal key={f.name} delay={i * 120}>
            <LocalizedClientLink
              href={`/products/${f.handle}`}
              className="block no-underline text-ah-ink"
            >
              <div className="relative w-full aspect-[577/641]">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 577px"
                />
              </div>
              <div className="flex justify-between gap-6 mt-[13px] text-p2">
                <span className="whitespace-pre-line">
                  <span className="uppercase">{f.name}</span>
                  {"\n"}
                  <span className="lowercase">{f.descriptor}</span>
                </span>
                <span className="flex-none text-right">{f.price}</span>
              </div>
            </LocalizedClientLink>
          </AhReveal>
        ))}
      </div>
    </section>
  )
}
