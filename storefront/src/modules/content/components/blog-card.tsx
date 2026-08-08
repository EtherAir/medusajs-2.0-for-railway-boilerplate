import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Journal card: cover image, uppercase tag, uppercase title, short excerpt.
 * Separated by whitespace and rules, never borders or shadows.
 */
export default function BlogCard({
  href,
  image,
  tag,
  title,
  excerpt,
  imageHeight = 300,
}: {
  href: string
  image?: string | null
  tag: string
  title: string
  excerpt?: string | null
  imageHeight?: number
}) {
  return (
    <LocalizedClientLink
      href={href}
      className="block no-underline text-ah-ink transition-ah hover:text-ah-dark-seafoam"
    >
      {image && (
        <div className="relative w-full" style={{ height: imageHeight }}>
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
        </div>
      )}
      <div className="mt-[14px] text-p2 uppercase leading-none">{tag}</div>
      <div className="mt-[10px] text-p1 uppercase">{title}</div>
      {excerpt && <p className="mt-2 m-0 text-p2">{excerpt}</p>}
    </LocalizedClientLink>
  )
}
