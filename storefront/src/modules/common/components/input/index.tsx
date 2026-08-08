import React, { useEffect, useImperativeHandle, useState } from "react"

import EyeIcon from "@modules/common/components/ah/eye-icon"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

/**
 * Underlined AH text field: muted label above, 39px input row on a 1px ink
 * rule, Dark Seafoam focus. Password fields use the brand eye glyph.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && <span className="text-p2 text-ah-ink mb-2">{topLabel}</span>}
        <label htmlFor={name} className="text-p2 text-ah-muted">
          {label}
          {required && " *"}
        </label>
        <div className="relative w-full">
          <input
            type={inputType}
            id={name}
            name={name}
            placeholder=" "
            required={required}
            className="w-full h-[var(--field-height)] bg-transparent text-p2 text-ah-ink border-0 border-b border-ah-ink rounded-none outline-none focus:border-ah-dark-seafoam transition-ah appearance-none px-0"
            {...props}
            ref={inputRef}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ah-muted transition-ah hover:text-ah-ink"
            >
              <EyeIcon open={showPassword} />
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
