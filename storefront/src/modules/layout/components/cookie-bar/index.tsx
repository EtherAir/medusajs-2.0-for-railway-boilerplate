"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cx } from "@modules/common/components/ah"

const STORAGE_KEY = "ah-cookie-choice"

/**
 * Cookie notice: a hairline rule across the bottom of the viewport, copy on
 * the left, two arrow links right. No panel, no scrim, no rounded box.
 * White over the home hero, ink elsewhere.
 */
export default function CookieBar() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  // home is /{countryCode} — hero imagery sits behind the bar there
  const overImagery = /^\/[a-z]{2}$/.test(pathname)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
  }, [])

  const choose = (choice: "accept" | "decline") => {
    localStorage.setItem(STORAGE_KEY, choice)
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className={cx(
        "fixed bottom-0 inset-x-0 z-40",
        "border-t-hairline px-7 py-6",
        "flex flex-col small:flex-row small:items-center justify-between gap-4 small:gap-10",
        overImagery ? "border-ah-white text-ah-white" : "border-ah-ink text-ah-ink bg-ah-page"
      )}
    >
      <span className="text-p2 leading-none">
        This website uses cookies to ensure you get the best experience on our
        website.
      </span>
      <span className="flex gap-[34px] flex-none">
        <button
          type="button"
          onClick={() => choose("decline")}
          className="text-p2 transition-ah hover:opacity-60"
        >
          Decline →
        </button>
        <button
          type="button"
          onClick={() => choose("accept")}
          className="text-p2 transition-ah hover:opacity-60"
        >
          Accept minimal cookies →
        </button>
      </span>
    </div>
  )
}
