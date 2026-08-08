"use client"

import { InputHTMLAttributes, forwardRef, useId, useState } from "react"
import { cx } from "./cx"
import EyeIcon from "./eye-icon"

type AhInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> & {
  label: string
  hint?: string
}

/**
 * Underlined text field: 39px row, label above in muted ink, 1px bottom rule.
 * Password fields get the brand eye glyph toggle (never an icon library).
 */
const AhInput = forwardRef<HTMLInputElement, AhInputProps>(
  ({ label, hint, type, className, required, ...rest }, ref) => {
    const id = useId()
    const [show, setShow] = useState(false)
    const isPassword = type === "password"

    return (
      <div className={cx("flex flex-col", className)}>
        <label htmlFor={id} className="text-p2 text-ah-muted">
          {label}
          {required && " *"}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={isPassword && show ? "text" : type}
            required={required}
            className={cx(
              "w-full h-[var(--field-height)] bg-transparent text-p2 text-ah-ink",
              "border-0 border-b border-ah-ink rounded-none outline-none",
              "focus:border-b focus:border-ah-dark-seafoam transition-ah",
              isPassword && "pr-8"
            )}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ah-muted transition-ah hover:text-ah-ink"
            >
              <EyeIcon open={show} />
            </button>
          )}
        </div>
        {hint && <span className="text-p4 text-ah-muted mt-2">{hint}</span>}
      </div>
    )
  }
)

AhInput.displayName = "AhInput"

export default AhInput
