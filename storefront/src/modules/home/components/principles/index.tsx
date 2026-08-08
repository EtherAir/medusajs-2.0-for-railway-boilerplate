import Image from "next/image"

import { PRINCIPLES } from "@lib/content/home"
import { AhArrowLink, AhReveal } from "@modules/common/components/ah"
import Motif from "@modules/common/components/ah/motif"

/**
 * Brand principles: the 491×636 macro-clay image beside the three numbered
 * principles (roman numeral + uppercase name run into large body copy),
 * each with its geometric line motif, then a Learn more link.
 */
export default function Principles() {
  return (
    <section className="content-container pt-v111 small:pt-v165 grid grid-cols-1 small:grid-cols-[491px_1fr] gap-10 small:gap-[86px] items-start">
      <AhReveal>
        <Image
          src="/images/ah/imagery/macro-clay.png"
          alt="Raw clay, macro"
          width={491}
          height={636}
          className="block object-cover w-full small:w-[491px] h-auto small:h-[636px]"
        />
      </AhReveal>
      <div className="grid gap-v49 small:pt-12">
        {PRINCIPLES.map((p, i) => (
          <AhReveal key={p.name} delay={i * 120}>
            <div className="flex items-start gap-8 small:gap-[78px]">
              <p className="text-p1 m-0 max-w-[389px]">
                <span className="uppercase">
                  {p.numeral} {p.name}
                </span>
                {"  "}
                {p.body}
              </p>
              <div className="hidden xsmall:block">
                <Motif kind={p.motif} />
              </div>
            </div>
          </AhReveal>
        ))}
        <AhReveal delay={360}>
          <AhArrowLink href="/our-story">Learn more</AhArrowLink>
        </AhReveal>
      </div>
    </section>
  )
}
