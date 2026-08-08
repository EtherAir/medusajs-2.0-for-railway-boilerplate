"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "ah-cookie-choice"

/**
 * Cookie notice: a hairline rule across the bottom of the viewport, copy
 * left, two arrow links right. Always on the Light Seafoam ground with ink
 * type — a fixed bar can end up over any content, so it never inherits a
 * white-on-imagery tone.
 */
export default function CookieBar() {
  const [show, setShow] = useState(false)

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
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 inset-x-0 z-40 bg-ah-page text-ah-ink border-t-hairline border-ah-ink px-5 small:px-7 py-5 small:py-6 flex flex-col small:flex-row small:items-center justify-between gap-4 small:gap-10"
    >
      <span className="text-p2">
        This website uses cookies to ensure you get the best experience on our
        website.
      </span>
      <span className="flex gap-6 small:gap-[34px] flex-none flex-wrap">
        <button
          type="button"
          onClick={() => choose("decline")}
          className="text-p2 transition-ah hover:text-ah-dark-seafoam"
        >
          Decline →
        </button>
        <button
          type="button"
          onClick={() => choose("accept")}
          className="text-p2 transition-ah hover:text-ah-dark-seafoam"
        >
          Accept minimal cookies →
        </button>
      </span>
    </div>
  )
}
