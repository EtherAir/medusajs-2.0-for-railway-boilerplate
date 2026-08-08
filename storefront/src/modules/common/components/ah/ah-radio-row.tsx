import { InputHTMLAttributes, forwardRef, useId } from "react"
import { cx } from "./cx"

type AhRadioRowProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  description?: string
  /** Right-aligned column, e.g. a price */
  detail?: string
}

/**
 * Ruled radio row (shipping/payment options): label left, detail right,
 * selection shown by ink text vs muted, plus a small filled dot.
 */
const AhRadioRow = forwardRef<HTMLInputElement, AhRadioRowProps>(
  ({ label, description, detail, className, checked, ...rest }, ref) => {
    const id = useId()
    return (
      <label
        htmlFor={id}
        className={cx(
          "flex items-baseline gap-4 py-4 border-t-hairline border-ah-ink cursor-pointer",
          "transition-ah",
          checked ? "text-ah-ink" : "text-ah-muted hover:text-ah-ink",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          checked={checked}
          className={cx(
            "appearance-none shrink-0 translate-y-[1px] cursor-pointer",
            "w-[var(--dot-size)] h-[var(--dot-size)] rounded-full",
            "border border-ah-ink checked:bg-ah-ink transition-ah"
          )}
          {...rest}
        />
        <span className="flex-1">
          <span className="text-p2 block">{label}</span>
          {description && (
            <span className="text-p4 text-ah-muted block mt-1">
              {description}
            </span>
          )}
        </span>
        {detail && <span className="text-p2">{detail}</span>}
      </label>
    )
  }
)

AhRadioRow.displayName = "AhRadioRow"

export default AhRadioRow
