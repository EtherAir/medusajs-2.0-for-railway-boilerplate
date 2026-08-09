import { Metadata } from "next"

import { POLICIES } from "@lib/content/policies"
import { AhRule } from "@modules/common/components/ah"

export const metadata: Metadata = {
  title: "Policies | Ascended Health",
  description:
    "Shipping, product and disclaimer policies for Ascended Health.",
}

/**
 * Store policies as ruled sections — the landing target for the legacy
 * ConditionsOfUse.htm URL and the footer-linkable policy reference.
 */
export default async function PoliciesPage() {
  return (
    <main className="pt-[88px] min-h-[600px]">
      <div className="content-container pb-[121px] max-w-[900px]">
        <h1 className="text-h1 m-0">Policies</h1>
        <div className="mt-[26px]">
          <AhRule />
        </div>
        {POLICIES.map((p) => (
          <section key={p.label} className="pt-v49">
            <h2 className="text-p1 m-0 mb-4">{p.label}</h2>
            {p.body.split(/\n\n+/).map((t, i) => (
              <p key={i} className={`text-p2 m-0 ${i ? "mt-[14px]" : ""}`}>
                {t}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
