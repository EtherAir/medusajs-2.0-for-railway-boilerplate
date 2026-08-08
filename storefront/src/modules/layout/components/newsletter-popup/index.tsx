"use client"

import { useEffect, useState } from "react"
import InlineSubmitField from "@modules/common/components/ah/inline-submit-field"
import { AhCheckbox } from "@modules/common/components/ah"

const STORAGE_KEY = "ah-popup-seen"

/**
 * 537px Seafoam newsletter panel, appearing once, 6 seconds after first
 * arrival. Close × is two crossed hairline rules. Fail-quiet: any dismissal
 * suppresses it for good.
 */
export default function NewsletterPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setShow(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem(STORAGE_KEY, "1")
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "var(--ah-drawer-scrim)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div
        role="dialog"
        aria-label="Enhance your inbox."
        className="relative w-full max-w-[537px] min-h-[343px] bg-ah-seafoam px-7 small:px-[60px] pt-[52px] pb-10"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute top-[11px] right-[11px] w-[17px] h-[17px]"
        >
          <span className="absolute left-0 top-2 w-[17px] h-px bg-ah-ink rotate-45" />
          <span className="absolute left-0 top-2 w-[17px] h-px bg-ah-ink -rotate-45" />
        </button>
        <h2 className="text-h2 m-0">Enhance your inbox.</h2>
        <p className="text-p1 mt-[22px]">
          Sign up to receive information about new products, holistic wellness
          practices, and more.
        </p>
        <div className="mt-v42">
          <InlineSubmitField onSubmitted={() => setTimeout(dismiss, 1200)} />
        </div>
        <div className="flex items-center justify-between gap-6 mt-[29px]">
          <button
            type="button"
            onClick={dismiss}
            className="text-p2 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
          >
            No thank you
          </button>
          <AhCheckbox label="Do not show again" onChange={dismiss} />
        </div>
      </div>
    </div>
  )
}
