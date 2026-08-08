import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AnchorHTMLAttributes, ReactNode } from "react"
import { cx } from "./cx"

type AhArrowLinkProps = {
  href: string
  children: ReactNode
  /** ← instead of → */
  back?: boolean
  /** Suppress the arrow glyph entirely */
  arrow?: boolean
  external?: boolean
  className?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">

/**
 * Text link ending in a typographic arrow glyph. Hover → Dark Seafoam,
 * 160ms color-only. Arrows are characters, not SVGs.
 */
export default function AhArrowLink({
  href,
  children,
  back,
  arrow = true,
  external,
  className,
  ...rest
}: AhArrowLinkProps) {
  const cls = cx(
    "text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam",
    className
  )
  const body = (
    <>
      {back && arrow && <span aria-hidden="true">← </span>}
      {children}
      {!back && arrow && <span aria-hidden="true"> →</span>}
    </>
  )

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>
        {body}
      </a>
    )
  }

  return (
    <LocalizedClientLink href={href} className={cls} {...rest}>
      {body}
    </LocalizedClientLink>
  )
}
