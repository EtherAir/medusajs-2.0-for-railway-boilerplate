import { ButtonHTMLAttributes, forwardRef } from "react"
import { cx } from "./cx"

type AhButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Stretch to the container. Buttons in the comp are fixed-width columns. */
  full?: boolean
}

/**
 * Primary control: 45px tall (48px from 1024px), 1px ink outline, transparent
 * fill, Seafoam hover fill. No radius, no shadow, nothing scales.
 */
const AhButton = forwardRef<HTMLButtonElement, AhButtonProps>(
  ({ className, full, disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cx(
          "text-p2 h-[var(--control-height-mobile)] small:h-[var(--control-height)]",
          "border border-ah-ink bg-transparent text-ah-ink px-6",
          "transition-ah hover:bg-ah-seafoam",
          "disabled:bg-ah-disabled disabled:text-ah-muted disabled:cursor-not-allowed",
          full && "w-full",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

AhButton.displayName = "AhButton"

export default AhButton
