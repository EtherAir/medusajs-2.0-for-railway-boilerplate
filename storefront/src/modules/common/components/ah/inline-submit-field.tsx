"use client"

import { FormEvent, useState } from "react"
import { cx } from "./cx"

/**
 * Newsletter row: bare email input on a 1px rule with a typographic →
 * submit. Used in the footer and the newsletter pop-up.
 */
export default function InlineSubmitField({
  placeholder = "Sign up for our newsletter",
  tone = "ink",
  onSubmitted,
  className,
}: {
  placeholder?: string
  tone?: "ink" | "white"
  onSubmitted?: (email: string) => void
  className?: string
}) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const white = tone === "white"

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    onSubmitted?.(email)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cx(
        "flex items-end gap-4 w-full pb-2 border-b",
        white ? "border-ah-white" : "border-ah-ink",
        className
      )}
    >
      <input
        type="email"
        aria-label={placeholder}
        placeholder={done ? "Thank you." : placeholder}
        value={done ? "" : email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={done}
        className={cx(
          "flex-1 min-w-0 bg-transparent border-0 outline-none p-0 text-p1",
          white
            ? "text-ah-white placeholder:text-ah-white"
            : "text-ah-ink placeholder:text-ah-ink"
        )}
      />
      <button
        type="submit"
        aria-label="Submit"
        className={cx(
          "text-p2 transition-ah",
          white
            ? "text-ah-white hover:text-ah-seafoam"
            : "text-ah-ink hover:text-ah-dark-seafoam"
        )}
      >
        →
      </button>
    </form>
  )
}
