"use client"

import { ReactNode, useEffect, useRef } from "react"
import { cx } from "./cx"

/**
 * Quiet scroll-reveal: 700ms fade + 16px rise. Fail-open by design — content
 * is visible by default; the hidden state is only applied by JS right before
 * observing, and a 2.5s timer force-shows if the observer never fires.
 * Respects prefers-reduced-motion via the .reveal-ready CSS.
 */
export default function AhReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in or above the viewport → show instantly, never animate.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight - 40) return

    el.classList.add("reveal-ready")

    const show = () => {
      el.classList.add("is-in")
      cleanup()
    }
    const failOpen = setTimeout(show, 2500)
    let io: IntersectionObserver | null = null
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) show()
        },
        { threshold: 0.1 }
      )
      io.observe(el)
    } else {
      show()
    }
    function cleanup() {
      clearTimeout(failOpen)
      io?.disconnect()
    }
    return cleanup
  }, [])

  return (
    <div
      ref={ref}
      className={cx(className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
