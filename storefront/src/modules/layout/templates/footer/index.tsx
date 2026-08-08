import Image from "next/image"

import {
  AH_CATEGORIES,
  AH_COMMUNITY_LINE,
  AH_FOOTER_LINKS,
} from "@lib/constants/ah"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InlineSubmitField from "@modules/common/components/ah/inline-submit-field"
import { Submark } from "@modules/layout/components/logo"

/**
 * The footer as drawn: community line and a 380×376 image left; newsletter
 * row across the right, the Shop category list and the utility column
 * beneath it, submark bottom-right; copyright and credit on the last line.
 */
export default function Footer() {
  return (
    <footer className="bg-ah-page pt-v82 pb-v42 px-gutter">
      <div className="grid grid-cols-1 small:grid-cols-[380px_1fr] gap-14 small:gap-[clamp(60px,13.7vw,197px)]">
        <div>
          <div className="text-p1 whitespace-pre-line">{AH_COMMUNITY_LINE}</div>
          <div className="relative w-full max-w-[380px] h-[376px] mt-[29px]">
            <Image
              src="/images/ah/imagery/community-water.jpg"
              alt="Community in water"
              fill
              className="object-cover"
              sizes="380px"
            />
          </div>
        </div>

        <div>
          <InlineSubmitField />

          <div className="grid grid-cols-1 xsmall:grid-cols-[267px_1fr] gap-10 mt-[66px]">
            <div>
              <div className="text-p1 mb-3">Shop</div>
              <ul className="grid gap-4 pl-v49 m-0 list-none" data-testid="footer-categories">
                {AH_CATEGORIES.map((c) => (
                  <li key={c.numeral}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
                      data-testid="category-link"
                    >
                      {`${c.numeral} ${c.title}`}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-5 content-start">
              {AH_FOOTER_LINKS.map((l) => (
                <LocalizedClientLink
                  key={l.label}
                  href={l.href}
                  className="text-p1 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
                >
                  {l.label}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-v42">
            <Submark />
          </div>
        </div>
      </div>

      <div className="flex flex-col small:flex-row justify-center gap-2 small:gap-[208px] mt-9 text-center">
        <span className="text-p1">
          © {new Date().getFullYear()} Ascended Health.
        </span>
        <span className="text-p1">Made by Nice People.</span>
      </div>
    </footer>
  )
}
