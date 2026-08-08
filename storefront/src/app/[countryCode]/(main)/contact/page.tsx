import { Metadata } from "next"
import Image from "next/image"

import { AH_CONTACT } from "@lib/constants/ah"
import { AhRule } from "@modules/common/components/ah"

export const metadata: Metadata = {
  title: "Contact Us | Ascended Health",
}

/** Contact: ruled H1, labelled contact rows left, imagery pair right. */
export default async function ContactPage() {
  const c = AH_CONTACT
  const rows: [string, string][] = [
    ["WEB", c.web],
    ["PHONE", c.phone],
    ["EMAIL", c.email],
    ["TEXT", c.text],
  ]

  return (
    <main className="pt-[88px] min-h-[700px]">
      <div className="content-container grid grid-cols-1 small:grid-cols-[1fr_505px] gap-12 small:gap-[121px] items-start pb-[121px]">
        <div>
          <h1 className="text-h1 m-0">Contact Us</h1>
          <div className="mt-[26px] max-w-[441px]">
            <AhRule />
          </div>
          <div className="grid gap-[34px] mt-v49">
            {rows.map(([k, v]) => (
              <div key={k}>
                <div className="text-p2 text-ah-muted">{k}</div>
                <div className="text-p1 mt-[6px]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[23px] small:pt-3">
          <Image
            src="/images/ah/imagery/macro-clay.png"
            alt=""
            width={241}
            height={241}
            className="w-full h-[241px] object-cover"
          />
          <Image
            src="/images/ah/imagery/feature-lesse-rocks.jpg"
            alt=""
            width={241}
            height={241}
            className="w-full h-[241px] object-cover"
          />
        </div>
      </div>
    </main>
  )
}
