"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"

import { cx } from "@modules/common/components/ah"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import MegaMenu from "@modules/layout/components/mega-menu"
import Logo from "@modules/layout/components/logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * The 67px header: utility links split left/right, wordmark centred, closed
 * by a hairline rule. Over the home hero the whole bar goes white on
 * transparent with a white rule; on page grounds it takes Light Seafoam.
 * "Shop" toggles the mega-menu panel below the bar.
 *
 * Client component so tone can follow the route; the cart button and mobile
 * menu are server-rendered children passed in from the nav template.
 */
export default function HeaderFrame({
  cartButton,
  mobileMenu,
  announcement,
}: {
  cartButton: ReactNode
  mobileMenu: ReactNode
  announcement: string
}) {
  const pathname = usePathname()
  const [shopOpen, setShopOpen] = useState(false)
  // home is /{countryCode} exactly — header overlays the hero there
  const overHero = /^\/[a-z]{2}$/.test(pathname)
  const white = overHero && !shopOpen

  const navLink = cx(
    "text-p2 leading-none no-underline transition-ah hover:text-ah-dark-seafoam",
    white ? "text-ah-white" : "text-ah-ink"
  )

  return (
    <div
      className={cx(
        "z-40",
        overHero ? "absolute top-0 inset-x-0" : "relative"
      )}
    >
      <AnnouncementBar>{announcement}</AnnouncementBar>

      <header
        className={cx(
          "relative h-nav flex items-center justify-between px-5 small:px-7",
          "border-b-hairline",
          white
            ? "bg-transparent border-ah-white"
            : "bg-ah-page border-ah-ink"
        )}
      >
        {/* left — desktop nav / mobile menu button */}
        <nav className="hidden small:flex gap-[26px]">
          <button
            type="button"
            onClick={() => setShopOpen((o) => !o)}
            className={navLink}
            aria-expanded={shopOpen}
            data-testid="nav-shop-button"
          >
            Shop
          </button>
          <LocalizedClientLink href="/our-story" className={navLink}>
            Our Story
          </LocalizedClientLink>
          <LocalizedClientLink href="/learn" className={navLink}>
            Learn
          </LocalizedClientLink>
        </nav>
        <div className={cx("small:hidden", white ? "text-ah-white" : "text-ah-ink")}>
          {mobileMenu}
        </div>

        {/* centre — wordmark */}
        <LocalizedClientLink
          href="/"
          aria-label="Ascended Health"
          className="absolute left-1/2 -translate-x-1/2 block"
          data-testid="nav-store-link"
          onClick={() => setShopOpen(false)}
        >
          <Logo
            tone={white ? "white" : "ink"}
            width={308}
            className="w-[200px] small:w-[308px] h-auto"
          />
        </LocalizedClientLink>

        {/* right */}
        <nav
          className={cx(
            "flex gap-[26px] items-center",
            white ? "text-ah-white" : "text-ah-ink"
          )}
        >
          <LocalizedClientLink
            href="/contact"
            className={cx(navLink, "hidden small:block")}
          >
            Contact Us
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account"
            className={cx(navLink, "hidden small:block")}
            data-testid="nav-account-link"
          >
            My Account
          </LocalizedClientLink>
          {cartButton}
        </nav>
      </header>

      {shopOpen && <MegaMenu onNavigate={() => setShopOpen(false)} />}
    </div>
  )
}
