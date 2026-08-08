"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { AH_CATEGORIES } from "@lib/constants/ah"
import { cx } from "@modules/common/components/ah"

export const CONDITIONS = [
  "Acne",
  "Anxiety",
  "Athletic Performance",
  "Body Rejuvenation",
  "Bleeding Gums",
  "Chronic Fatigue",
  "Detox",
  "Energy",
  "Gum Health",
  "Longevity",
  "Skin Regeneration",
]

/**
 * The edge FILTER tab (66×57 Seafoam, "FILTER →/←") with its 383px flyout of
 * dot-toggle groups. Selections round-trip through the URL
 * (?category=&condition=) so the server refetches. Full-width sheet below
 * 1024px.
 */
export default function FilterFlyout({
  showCategories = true,
  top = 219,
}: {
  showCategories?: boolean
  top?: number
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selected = useMemo(() => {
    const cats = searchParams.get("category")?.split(",").filter(Boolean) ?? []
    const conds = searchParams.get("condition")?.split(",").filter(Boolean) ?? []
    return { cats, conds }
  }, [searchParams])

  const apply = (cats: string[], conds: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    cats.length ? params.set("category", cats.join(",")) : params.delete("category")
    conds.length ? params.set("condition", conds.join(",")) : params.delete("condition")
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
      scroll: false,
    })
  }

  const toggleCat = (handle: string) =>
    apply(
      selected.cats.includes(handle)
        ? selected.cats.filter((c) => c !== handle)
        : [...selected.cats, handle],
      selected.conds
    )

  const toggleCond = (cond: string) =>
    apply(
      selected.cats,
      selected.conds.includes(cond)
        ? selected.conds.filter((c) => c !== cond)
        : [...selected.conds, cond]
    )

  const Dot = ({ on }: { on: boolean }) => (
    <span
      className={cx(
        "w-[11px] h-[11px] flex-none rounded-full border border-ah-ink transition-ah",
        on ? "bg-ah-ink" : "bg-transparent"
      )}
    />
  )

  return (
    <div
      className="absolute left-0 z-30 flex items-start"
      style={{ top }}
      data-testid="filter-flyout"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-[66px] h-[57px] px-[10px] py-[13px] bg-ah-seafoam text-left text-p2 leading-none text-ah-ink whitespace-pre-line"
        data-testid="filter-tab"
      >
        {`FILTER\n${open ? "←" : "→"}`}
      </button>

      {open && (
        <div className="w-[calc(100vw-66px)] small:w-[383px] bg-ah-seafoam px-[33px] pt-[29px] pb-9 max-h-[70vh] overflow-y-auto">
          <div className="text-p1 uppercase mb-[18px]">Filter by</div>

          <div className="mb-[26px]">
            <div className="text-p2 uppercase pb-[11px] border-b-hairline border-ah-ink">
              Body conditions
            </div>
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCond(c)}
                className={cx(
                  "flex items-center gap-[13px] w-full text-left py-[11px] text-p2 leading-none transition-ah",
                  selected.conds.includes(c) ? "text-ah-ink" : "text-ah-muted hover:text-ah-ink"
                )}
              >
                <Dot on={selected.conds.includes(c)} />
                {c}
              </button>
            ))}
          </div>

          {showCategories && (
            <div className="mb-[26px]">
              <div className="text-p2 uppercase pb-[11px] border-b-hairline border-ah-ink">
                Category
              </div>
              {AH_CATEGORIES.map((c) => (
                <button
                  key={c.handle}
                  type="button"
                  onClick={() => toggleCat(c.handle)}
                  className={cx(
                    "flex items-center gap-[13px] w-full text-left py-[11px] text-p2 leading-none transition-ah",
                    selected.cats.includes(c.handle)
                      ? "text-ah-ink"
                      : "text-ah-muted hover:text-ah-ink"
                  )}
                >
                  <Dot on={selected.cats.includes(c.handle)} />
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {(selected.cats.length > 0 || selected.conds.length > 0) && (
            <button
              type="button"
              onClick={() => apply([], [])}
              className="text-p2 text-ah-ink transition-ah hover:text-ah-dark-seafoam"
            >
              Clear all →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
