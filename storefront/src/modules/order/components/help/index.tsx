import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-v49">
      <div className="text-p1 pb-3 border-b-hairline border-ah-ink uppercase">Need help?</div>
      <ul className="grid gap-2 mt-4 list-none m-0 p-0">
        <li>
          <LocalizedClientLink
            href="/contact"
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
          >
            Contact <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/policies"
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
          >
            Returns &amp; policies <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </li>
      </ul>
    </div>
  )
}

export default Help
