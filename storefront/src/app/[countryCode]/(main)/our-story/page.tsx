import { Metadata } from "next"
import Image from "next/image"

import { OUR_STORY } from "@lib/content/our-story"
import {
  AhAccordion,
  AhAccordionItem,
  AhArrowLink,
  AhReveal,
  AhRule,
  SectionRule,
} from "@modules/common/components/ah"

export const metadata: Metadata = {
  title: "Our Story | Ascended Health",
  description: OUR_STORY.statement,
}

const ROM = ["I.", "II.", "III."]

/** Our Story, per the comp: statement blocks, wide imagery, ruled
 *  philosophies, the Gaia founder section and the About accordions. */
export default async function OurStoryPage() {
  const a = OUR_STORY

  return (
    <main className="pt-[100px] small:pt-[146px]">
      <section className="content-container relative">
        <AhReveal>
          <p className="text-h1 text-center max-w-[868px] mx-auto m-0">
            {a.statement}
          </p>
        </AhReveal>
        <Image
          src="/images/ah/illustrations/engraving-butterfly.png"
          alt=""
          aria-hidden="true"
          width={78}
          height={47}
          className="hidden small:block absolute left-1/2 top-[82px] object-contain opacity-90"
        />
      </section>

      <section className="content-container pt-[53px]">
        <AhReveal>
          <p className="text-h1 text-center max-w-[658px] mx-auto m-0">
            {a.passion}
          </p>
        </AhReveal>
      </section>

      <section className="px-gutter pt-[100px] small:pt-[146px]">
        <div className="relative w-full h-[320px] small:h-[637px]">
          <Image
            src="/images/ah/imagery/story-wide.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="px-gutter pt-v82 small:pt-v111 grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-[121px]">
        <p className="text-p2 m-0 whitespace-pre-line">{a.intro}</p>
        <p className="text-p2 m-0 whitespace-pre-line">{a.longevity}</p>
      </section>

      <section className="px-gutter pt-v82 small:pt-v111">
        <AhReveal>
          <p className="text-h2 max-w-[900px] m-0">
            Ascended Health is founded on scientific research &amp; indigenous
            culture teachings.
          </p>
        </AhReveal>
      </section>

      <section className="content-container pt-v82 small:pt-v111">
        <SectionRule label="Our foundational philosophies" />
        <div className="grid">
          {a.philosophies.map((t, i) => (
            <div
              key={i}
              className="grid grid-cols-[40px_1fr] small:grid-cols-[56px_1fr] gap-6 py-7 border-b-hairline border-ah-ink"
            >
              <span className="text-p1">{ROM[i]}</span>
              <p className="text-p1 m-0 max-w-[868px]">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-container pt-v82 small:pt-v111">
        <SectionRule label="From our founder" />
        <div className="grid grid-cols-1 small:grid-cols-[578px_1fr] gap-8 small:gap-[121px] pt-v42">
          <div>
            <h2 className="text-h2 m-0">{a.gaia.label}</h2>
            <div className="text-p1 mt-6">{a.gaia.lead}</div>
          </div>
          <div>
            {a.gaia.paras.map((t, i) => (
              <p key={i} className={`text-p2 m-0 ${i ? "mt-[18px]" : ""}`}>
                {t}
              </p>
            ))}
            <div className="mt-7">
              <a
                href={a.gaia.linkHref}
                target="_blank"
                rel="noreferrer"
                className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
              >
                {a.gaia.linkLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-gutter pt-v82 small:pt-[121px]">
        <h2 className="text-h2 m-0">About Ascended Health</h2>
        <div className="mt-[22px]">
          <AhRule />
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-[121px] pt-[34px]">
          <p className="text-p2 m-0">{a.aboutPara}</p>
          <div>
            <AhAccordion>
              <AhAccordionItem label="Efficacy" value="efficacy">
                {a.efficacy}
              </AhAccordionItem>
              <AhAccordionItem label="Our products" value="products">
                {a.vegan}
              </AhAccordionItem>
            </AhAccordion>
            <AhRule />
          </div>
        </div>
        <div className="text-p1 mt-v49">Align your mind, body and spirit</div>
        <div className="text-p2 mt-3">
          With all-natural formulas made to help you heal, renew, and thrive.
        </div>
        <div className="mt-7">
          <AhArrowLink href="/shop">Shop now</AhArrowLink>
        </div>
      </section>

      <section className="px-gutter pt-v82 small:pt-v111 pb-[92px]">
        <SectionRule label="Follow. Engage. Flourish." rules="top" />
      </section>
    </main>
  )
}
