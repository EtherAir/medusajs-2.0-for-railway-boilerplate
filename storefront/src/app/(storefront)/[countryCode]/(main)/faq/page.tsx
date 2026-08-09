import { Metadata } from "next"

import { FAQ } from "@lib/content/faq"
import {
  AhAccordion,
  AhAccordionItem,
  AhRule,
} from "@modules/common/components/ah"

export const metadata: Metadata = {
  title: "FAQ | Ascended Health",
  description:
    "Answers to the most common questions about Ascended Health products, ordering and shipping.",
}

/** FAQ: ruled +/− accordions, migrated from the legacy site's FAQ page. */
export default async function FaqPage() {
  return (
    <main className="pt-[88px] min-h-[700px]">
      <div className="content-container pb-[121px] max-w-[900px]">
        <h1 className="text-h1 m-0">FAQ</h1>
        <div className="text-p1 mt-3 mb-v42">
          Answers to the questions we hear most.
        </div>
        <AhAccordion>
          {FAQ.map((item, i) => (
            <AhAccordionItem key={i} label={item.question} value={`q${i}`}>
              {item.answer}
            </AhAccordionItem>
          ))}
        </AhAccordion>
        <AhRule />
      </div>
    </main>
  )
}
