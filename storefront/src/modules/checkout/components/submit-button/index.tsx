"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import { AhButton } from "@modules/common/components/ah"

export function SubmitButton({
  children,
  variant,
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <AhButton
      className={className}
      type="submit"
      disabled={pending}
      data-testid={dataTestId}
    >
      {pending ? "One moment…" : children}
    </AhButton>
  )
}
