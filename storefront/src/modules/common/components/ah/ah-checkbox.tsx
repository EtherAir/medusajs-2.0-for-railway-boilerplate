"use client"

import { InputHTMLAttributes, forwardRef, useId } from "react"
import { cx } from "./cx"

type AhCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

/** 11px square outline checkbox; the check state is a solid ink fill. */
const AhCheckbox = forwardRef<HTMLInputElement, AhCheckboxProps>(
  ({ label, className, ...rest }, ref) => {
    const id = useId()
    return (
      <label
        htmlFor={id}
        className={cx(
          "flex items-baseline gap-3 cursor-pointer text-p2 text-ah-ink",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cx(
            "appearance-none shrink-0 translate-y-[1px]",
            "w-[var(--checkbox-size)] h-[var(--checkbox-size)]",
            "border border-ah-ink rounded-none bg-transparent",
            "checked:bg-ah-ink transition-ah cursor-pointer"
          )}
          {...rest}
        />
        <span>{label}</span>
      </label>
    )
  }
)

AhCheckbox.displayName = "AhCheckbox"

export default AhCheckbox
