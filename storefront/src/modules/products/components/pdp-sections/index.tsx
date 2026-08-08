import { POLICIES } from "@lib/content/policies"
import { AhProductContent } from "@lib/util/product-content"
import {
  AhAccordion,
  AhAccordionItem,
  AhRule,
  SectionRule,
} from "@modules/common/components/ah"

const ROM = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII."]

/** "Strategic design" — first paragraph left, the rest right, on a rule. */
export function StrategicDesign({ content }: { content: AhProductContent }) {
  if (!content.design.length) return null
  const [first, ...rest] = content.design

  return (
    <section className="content-container pt-v111">
      <h2 className="text-h2 m-0">Strategic design</h2>
      <div className="mt-5">
        <AhRule />
      </div>
      <div className="grid grid-cols-1 small:grid-cols-[441px_1fr] gap-8 small:gap-[194px] pt-[34px]">
        <p className="text-p2 m-0">{first}</p>
        <div>
          {rest.map((t, i) => (
            <p key={i} className={`text-p2 m-0 ${i ? "mt-[18px]" : ""}`}>
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Roman-numeraled ruled rows of infused frequencies. */
export function Frequencies({ content }: { content: AhProductContent }) {
  if (!content.frequencies.length) return null

  return (
    <section className="content-container pt-[100px]">
      <SectionRule label="Infused resonant healing frequencies" />
      <div className="grid pt-2">
        {content.frequencies.map((f, i) => (
          <div
            key={f}
            className="grid grid-cols-[40px_1fr] small:grid-cols-[56px_1fr] gap-6 py-5 border-b-hairline border-ah-ink text-p1"
          >
            <span className="text-p2">{ROM[i]}</span>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Suggested use + the three global policies, as +/− accordions. */
export function UseAndPolicies({ content }: { content: AhProductContent }) {
  return (
    <section className="content-container pt-[100px]">
      <AhAccordion>
        {content.use && (
          <AhAccordionItem label="Suggested use" value="use">
            {content.use}
          </AhAccordionItem>
        )}
        {POLICIES.map((pol) => (
          <AhAccordionItem key={pol.label} label={pol.label} value={pol.label}>
            {pol.body}
          </AhAccordionItem>
        ))}
      </AhAccordion>
      <AhRule />
    </section>
  )
}
