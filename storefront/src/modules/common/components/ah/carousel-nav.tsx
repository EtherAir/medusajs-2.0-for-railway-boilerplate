"use client"

/**
 * Carousel control: typographic ← → arrows flanking 8px dots.
 * Active dot is ink, inactive Seafoam.
 */
export default function CarouselNav({
  count,
  index,
  onChange,
}: {
  count: number
  index: number
  onChange: (i: number) => void
}) {
  const go = (i: number) => onChange(Math.max(0, Math.min(count - 1, i)))
  return (
    <div className="flex items-center justify-between w-full">
      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(index - 1)}
        className="text-p1 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
      >
        ←
      </button>
      <div className="flex gap-[11px]">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to ${i + 1}`}
            aria-current={i === index || undefined}
            onClick={() => go(i)}
            className={`w-[var(--dot-size)] h-[var(--dot-size)] rounded-full transition-ah ${
              i === index ? "bg-ah-ink" : "bg-ah-seafoam"
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(index + 1)}
        className="text-p1 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
      >
        →
      </button>
    </div>
  )
}
