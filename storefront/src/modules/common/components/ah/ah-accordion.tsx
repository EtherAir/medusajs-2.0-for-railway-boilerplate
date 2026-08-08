"use client"

import * as RadixAccordion from "@radix-ui/react-accordion"
import { ReactNode } from "react"
import { cx } from "./cx"

/**
 * Ruled accordion row: label left, + / − glyph right, 0.5px top rule.
 * Glyphs are characters, not icons.
 */
export function AhAccordionItem({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <RadixAccordion.Item value={value} className="border-t-hairline border-ah-ink group">
      <RadixAccordion.Header asChild>
        <h3 className="m-0">
          <RadixAccordion.Trigger
            className={cx(
              "w-full flex items-baseline justify-between py-5 text-left",
              "text-p1 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
            )}
          >
            <span>{label}</span>
            <span aria-hidden="true" className="text-p1">
              <span className="group-radix-state-open:hidden">+</span>
              <span className="hidden group-radix-state-open:inline">−</span>
            </span>
          </RadixAccordion.Trigger>
        </h3>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="overflow-hidden radix-state-open:animate-accordion-open radix-state-closed:animate-accordion-close">
        <div className="text-p2 text-ah-ink pb-6 max-w-[620px] whitespace-pre-line">
          {children}
        </div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  )
}

export default function AhAccordion({
  children,
  type = "multiple",
  className,
}: {
  children: ReactNode
  type?: "single" | "multiple"
  className?: string
}) {
  if (type === "single") {
    return (
      <RadixAccordion.Root type="single" collapsible className={className}>
        {children}
      </RadixAccordion.Root>
    )
  }
  return (
    <RadixAccordion.Root type="multiple" className={className}>
      {children}
    </RadixAccordion.Root>
  )
}
