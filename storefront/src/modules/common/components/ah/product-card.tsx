import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cx } from "./cx"

/**
 * The catalog product card: packshot bottom-aligned in a fixed-height slot,
 * ALL-CAPS name, lowercase descriptor, bare price. No card, no border,
 * no shadow; the whole block hovers to Dark Seafoam.
 */
export default function AhProductCard({
  image,
  name,
  descriptor,
  price,
  href,
  imageHeight = 178,
  align = "left",
  className,
  ...rest
}: {
  image?: string | null
  name: string
  descriptor?: string | null
  price?: string | null
  href: string
  imageHeight?: number
  align?: "left" | "center"
  className?: string
}) {
  return (
    <LocalizedClientLink
      href={href}
      className={cx(
        "block no-underline text-ah-ink transition-ah hover:text-ah-dark-seafoam",
        className
      )}
      {...rest}
    >
      <div
        className={cx(
          "flex items-end",
          align === "center" ? "justify-center" : "justify-start"
        )}
        style={{ height: imageHeight }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={imageHeight}
            height={imageHeight}
            className="block w-auto max-w-full object-contain"
            style={{ maxHeight: imageHeight, height: "auto" }}
          />
        ) : (
          <div
            className="w-full h-full bg-ah-seafoam/40"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="mt-v21 text-p2 whitespace-pre-line">
        <span className="uppercase">{name}</span>
        {descriptor && (
          <>
            {"\n"}
            <span className="lowercase">{descriptor}</span>
          </>
        )}
      </div>
      {price && <div className="mt-2 text-p2 leading-none">{price}</div>}
    </LocalizedClientLink>
  )
}
