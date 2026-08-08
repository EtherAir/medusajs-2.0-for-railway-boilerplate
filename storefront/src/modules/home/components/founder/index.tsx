import { GAIA } from "@lib/content/home"
import { AhReveal, SectionRule } from "@modules/common/components/ah"

/**
 * "From our founder": the Gaia.com interview section — H2 and lead left,
 * body paragraphs and the outbound link right.
 */
export default function Founder() {
  return (
    <section className="content-container pt-v111 small:pt-[155px]">
      <AhReveal>
        <SectionRule label="From our founder" />
        <div className="grid grid-cols-1 small:grid-cols-[578px_1fr] gap-8 small:gap-[121px] pt-v42">
          <div>
            <h2 className="text-h2 m-0">{GAIA.label}</h2>
            <div className="text-p1 mt-6">{GAIA.lead}</div>
          </div>
          <div>
            {GAIA.paras.map((t, i) => (
              <p key={i} className={`text-p2 m-0 ${i ? "mt-[18px]" : ""}`}>
                {t}
              </p>
            ))}
            <div className="mt-7">
              <a
                href={GAIA.linkHref}
                target="_blank"
                rel="noreferrer"
                className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
              >
                {GAIA.linkLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </AhReveal>
    </section>
  )
}
