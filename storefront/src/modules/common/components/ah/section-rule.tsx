import { ReactNode } from "react"
import { cx } from "./cx"

/**
 * Section header: uppercase label sitting on a hairline rule, optional
 * right-aligned slot (links, tag filters).
 */
export default function SectionRule({
  label,
  right,
  rules = "top",
  className,
}: {
  label: string
  right?: ReactNode
  rules?: "top" | "bottom"
  className?: string
}) {
  return (
    <div
      className={cx(
        "flex items-baseline justify-between py-3",
        rules === "top" ? "border-t-hairline" : "border-b-hairline",
        "border-ah-ink",
        className
      )}
    >
      <span className="text-p2 uppercase text-ah-ink">{label}</span>
      {right}
    </div>
  )
}
