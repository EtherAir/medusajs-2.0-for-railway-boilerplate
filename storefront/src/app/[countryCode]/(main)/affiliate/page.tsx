"use client"

import { AhButton, AhInput, AhRule } from "@modules/common/components/ah"

/**
 * Affiliate login — static stub per the handoff (the affiliate system lives
 * outside Medusa core; wire to the chosen platform later).
 */
export default function AffiliatePage() {
  return (
    <main className="pt-[88px] min-h-[600px]">
      <div className="content-container pb-[121px]">
        <h1 className="text-h1 m-0">Affiliate Account</h1>
        <div className="mt-[26px] max-w-[441px]">
          <AhRule />
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-[441px] grid gap-[34px] mt-v49"
        >
          <AhInput label="Username / Email" type="email" required />
          <AhInput label="Password" type="password" required />
          <div>
            <AhButton type="submit">Login</AhButton>
          </div>
          <p className="text-p2 text-ah-muted m-0">
            The affiliate program is moving to a new home — contact
            products@ascendedhealth.com with any questions in the meantime.
          </p>
        </form>
      </div>
    </main>
  )
}
