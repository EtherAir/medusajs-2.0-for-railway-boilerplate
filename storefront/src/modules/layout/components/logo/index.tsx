import Image from "next/image"

/** Ascended Health wordmark (traced SVG from the handoff — never re-typeset). */
export default function Logo({
  tone = "ink",
  width = 308,
  className,
}: {
  tone?: "ink" | "white"
  width?: number
  className?: string
}) {
  return (
    <Image
      src={tone === "white" ? "/images/ah/logo-white.svg" : "/images/ah/logo.svg"}
      alt="Ascended Health"
      width={width}
      height={Math.round((width / 551) * 44)}
      priority
      className={className}
    />
  )
}

export function Submark({
  tone = "ink",
  width = 29,
  className,
}: {
  tone?: "ink" | "white"
  width?: number
  className?: string
}) {
  return (
    <Image
      src={
        tone === "white"
          ? "/images/ah/submark-white.svg"
          : "/images/ah/submark-dark.svg"
      }
      alt=""
      aria-hidden="true"
      width={width}
      height={width}
      className={className}
    />
  )
}
