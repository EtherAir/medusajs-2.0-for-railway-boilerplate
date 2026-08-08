/** The brand's show/hide password glyph (assets/icon-eye.svg), inlined so it
 *  can take currentColor. The only pictographic mark in the system. */
export default function EyeIcon({ open }: { open?: boolean }) {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6C1 6 4 1 9 1C14 1 17 6 17 6C17 6 14 11 9 11C4 11 1 6 1 6Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="9" cy="6" r="2.5" stroke="currentColor" strokeWidth="1" />
      {open ? null : <line x1="3" y1="11" x2="15" y2="1" stroke="currentColor" strokeWidth="1" />}
    </svg>
  )
}
