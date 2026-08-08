import { HttpTypes } from "@medusajs/types"
import { cx } from "@modules/common/components/ah"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

/**
 * Variant options as outlined chips: 1px ink outline, no radius; unselected
 * values muted, the selection in ink on a Seafoam fill.
 */
const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values?.map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-p2 text-ah-muted">Select {title}</span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions?.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.title ?? "", v ?? "")}
              key={v}
              className={cx(
                "border border-ah-ink h-10 px-4 flex-1 min-w-fit text-p2 transition-ah",
                v === current
                  ? "bg-ah-seafoam text-ah-ink"
                  : "bg-transparent text-ah-muted hover:text-ah-ink"
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
