/** Tiny class joiner so AH primitives don't depend on @medusajs/ui. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}
