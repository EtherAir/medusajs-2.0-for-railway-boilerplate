"use client"

import { useEffect, useState } from "react"
import { cx } from "@modules/common/components/ah"

const STORAGE_KEY = "ah-announcement-dismissed"

/**
 * 36px bar above the header. Seafoam on page grounds; transparent with white
 * type and a white hairline when it sits over the home hero.
 */
export default function AnnouncementBar({
  tone = "seafoam",
  children,
}: {
  tone?: "seafoam" | "white"
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const white = tone === "white"

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem(STORAGE_KEY)) setOpen(false)
  }, [])

  if (!open) return null

  return (
    <div
      className={cx(
        "flex items-center justify-center gap-6 px-7 h-[var(--announcement-height)]",
        "text-p2 leading-none",
        white
          ? "bg-transparent text-ah-white border-b-hairline border-ah-white"
          : "bg-ah-seafoam text-ah-ink",
        // avoid a hydration flash before sessionStorage is read
        !mounted && "invisible"
      )}
      data-testid="announcement-bar"
    >
      <span>{children}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setOpen(false)
          sessionStorage.setItem(STORAGE_KEY, "1")
        }}
        className="transition-ah hover:opacity-60"
      >
        ×
      </button>
    </div>
  )
}
