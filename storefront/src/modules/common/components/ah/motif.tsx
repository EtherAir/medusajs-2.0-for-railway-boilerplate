import { CSSProperties } from "react"

/**
 * The three geometric line motifs beside the SCIENCE / CONSCIOUSNESS / NATURE
 * principles. 1px flat-black strokes, no fill, ~90px square. Recreated with
 * CSS circles and rotated hairlines exactly as the design system draws them.
 */
export default function Motif({
  kind,
  size = 90,
}: {
  kind: "science" | "consciousness" | "nature"
  size?: number
}) {
  const s = size
  const circle = (l: number, t: number, w: number): CSSProperties => ({
    position: "absolute",
    left: l,
    top: t,
    width: w,
    height: w,
    borderRadius: "50%",
    boxShadow: "inset 0 0 0 1px var(--ah-flat-black)",
  })

  return (
    <div
      role="img"
      aria-label={kind}
      className="relative flex-none"
      style={{ width: s, height: s }}
    >
      {kind === "science" && (
        <>
          <span style={circle(0, 0, s)} />
          <span style={circle(s * 0.52, s * 0.1, s * 0.38)} />
          <span style={circle(s * 0.42, s * 0.5, s * 0.3)} />
        </>
      )}
      {kind === "consciousness" && (
        <>
          <span style={circle(0, 0, s)} />
          <span style={circle(s * 0.16, s * 0.26, s * 0.62)} />
          <span style={circle(s * 0.35, s * 0.46, s * 0.3)} />
        </>
      )}
      {kind === "nature" && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: s / 2,
                top: 0,
                width: 1,
                height: s,
                background: "var(--ah-flat-black)",
                transform: `rotate(${i * 22.5}deg)`,
                transformOrigin: "50% 50%",
              }}
            />
          ))}
          <span
            style={{
              ...circle(s * 0.325, s * 0.333, s * 0.341),
              background: "var(--surface-page)",
            }}
          />
        </>
      )}
    </div>
  )
}
