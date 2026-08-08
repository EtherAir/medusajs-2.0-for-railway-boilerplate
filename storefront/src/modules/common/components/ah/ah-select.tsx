import { SelectHTMLAttributes, forwardRef, useId } from "react"
import { cx } from "./cx"

type AhSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
}

/** Underlined native select with a typographic ↓ affordance. */
const AhSelect = forwardRef<HTMLSelectElement, AhSelectProps>(
  ({ label, className, children, ...rest }, ref) => {
    const id = useId()
    return (
      <div className={cx("flex flex-col", className)}>
        {label && (
          <label htmlFor={id} className="text-p2 text-ah-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cx(
              "w-full h-[var(--field-height)] bg-transparent text-p2 text-ah-ink",
              "appearance-none border-0 border-b border-ah-ink rounded-none",
              "outline-none focus:border-ah-dark-seafoam transition-ah pr-6 cursor-pointer"
            )}
            {...rest}
          >
            {children}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-p2 text-ah-ink"
          >
            ↓
          </span>
        </div>
      </div>
    )
  }
)

AhSelect.displayName = "AhSelect"

export default AhSelect
