/** 5 solid flat-black stars traced from the Figma file. No half stars. */
const STAR =
  "M 7.383 0 L 9.04 5.101 L 14.404 5.101 L 10.064 8.254 L 11.722 13.355 L 7.383 10.202 L 3.043 13.355 L 4.701 8.254 L 0.361 5.101 L 5.725 5.101 L 7.383 0 Z"

export default function StarRating({
  value = 5,
  outOf = 5,
}: {
  value?: number
  outOf?: number
}) {
  return (
    <span
      role="img"
      aria-label={`${value} out of ${outOf} stars`}
      className="inline-flex items-center gap-[3.5px]"
    >
      {Array.from({ length: outOf }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 14.765 14.765"
          width={14.765}
          height={14.765}
          className="block"
          style={{ opacity: i < value ? 1 : 0.25 }}
        >
          <path d={STAR} fill="var(--ah-flat-black)" fillRule="nonzero" />
        </svg>
      ))}
    </span>
  )
}
