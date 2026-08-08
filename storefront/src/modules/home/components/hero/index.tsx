import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Full-bleed image band: 52px white headline, large-body line and a white
 * arrow link, sitting on the left gutter low in the frame. Fixed px height
 * at the 1440 frame, svh-based below it.
 */
export default function Hero({
  image,
  headline,
  subhead,
  ctaLabel = "Shop now",
  ctaHref = "/shop",
  height = 800,
  priority = false,
  headingLevel = "h1",
}: {
  image: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  height?: number
  priority?: boolean
  headingLevel?: "h1" | "h2"
}) {
  const Heading = headingLevel
  return (
    <section
      className="relative flex items-end"
      style={{ height: `min(${height}px, 92svh)` }}
    >
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className="relative px-gutter pb-[92px] max-w-[640px]">
        <Heading className="text-h1 text-ah-white whitespace-pre-line m-0">
          {headline}
        </Heading>
        {subhead && (
          <p className="text-p1 text-ah-white mt-[18px] max-w-[420px]">
            {subhead}
          </p>
        )}
        {ctaLabel && (
          <div className="mt-[26px]">
            <LocalizedClientLink
              href={ctaHref}
              className="text-p2 text-ah-white no-underline transition-ah hover:text-ah-seafoam"
            >
              {ctaLabel} <span aria-hidden="true">→</span>
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </section>
  )
}
