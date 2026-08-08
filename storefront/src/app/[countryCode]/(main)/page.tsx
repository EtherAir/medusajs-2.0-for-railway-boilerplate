import { Metadata } from "next"

import {
  HOME_HERO,
  HOME_SECOND_HERO,
  HOME_STATEMENT,
} from "@lib/content/home"
import { AhReveal } from "@modules/common/components/ah"
import CategoryIndex from "@modules/home/components/category-index"
import FeatureTiles from "@modules/home/components/feature-tiles"
import Founder from "@modules/home/components/founder"
import Hero from "@modules/home/components/hero"
import Principles from "@modules/home/components/principles"
import ProductRow from "@modules/home/components/product-row"
import ReviewsAndBlog from "@modules/home/components/reviews-and-blog"

export const metadata: Metadata = {
  title: "Ascended Health — Regenerative wellness for a new generation",
  description:
    "Life-enhancing formulas for holistic microbiome and cellular support.",
}

export default async function Home() {
  return (
    <>
      <Hero
        image={HOME_HERO.image}
        headline={HOME_HERO.headline}
        subhead={HOME_HERO.subhead}
        ctaLabel={HOME_HERO.ctaLabel}
        height={800}
        priority
      />

      <FeatureTiles />

      <section className="content-container pt-v111 small:pt-v165">
        <AhReveal>
          <p className="text-h1 text-center max-w-[868px] mx-auto m-0">
            {HOME_STATEMENT}
          </p>
        </AhReveal>
      </section>

      <AhReveal>
        <CategoryIndex />
      </AhReveal>

      <Principles />

      <Founder />

      <ProductRow />

      <ReviewsAndBlog />

      <div className="mt-v111 small:mt-[145px]">
        <Hero
          image={HOME_SECOND_HERO.image}
          headline={HOME_SECOND_HERO.headline}
          subhead={HOME_SECOND_HERO.subhead}
          ctaLabel={HOME_SECOND_HERO.ctaLabel}
          height={931}
          headingLevel="h2"
        />
      </div>
    </>
  )
}
