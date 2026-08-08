import { cx } from "./cx"

/** 0.5px hairline rule — the system's only structural device. */
export default function AhRule({
  className,
  inverse,
}: {
  className?: string
  inverse?: boolean
}) {
  return (
    <hr
      className={cx(
        "border-0 border-t-hairline",
        inverse ? "border-ah-white" : "border-ah-ink",
        className
      )}
    />
  )
}
