"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { useRouter, useParams } from "next/navigation"

import { AH_CATEGORIES } from "@lib/constants/ah"
import { StoreRegion } from "@medusajs/types"
import CountrySelect from "@modules/layout/components/country-select"
import { useToggleState } from "@medusajs/ui"
import { countryPath } from "@lib/util/country-path"

type Level =
  | { kind: "root" }
  | { kind: "shop" }
  | { kind: "category"; index: number }

/**
 * Mobile fly-out: a full-screen Seafoam sheet of ruled large-body rows.
 * Drilling into Shop swaps rows for the six categories, then for that
 * category's formulas. ← returns a level, × closes.
 */
export default function MobileMenu({ regions }: { regions: StoreRegion[] | null }) {
  const [open, setOpen] = useState(false)
  const [level, setLevel] = useState<Level>({ kind: "root" })
  const router = useRouter()
  const params = useParams()
  const countryCode = typeof params?.countryCode === "string" ? params.countryCode : "us"
  const toggleState = useToggleState()

  const go = (path: string) => {
    setOpen(false)
    setLevel({ kind: "root" })
    router.push(countryPath(countryCode, path))
  }

  const close = () => {
    setOpen(false)
    setLevel({ kind: "root" })
  }

  let title: string | null = null
  let rows: { label: string; hasChildren?: boolean; onClick: () => void }[] = []

  if (level.kind === "root") {
    rows = [
      { label: "Shop", hasChildren: true, onClick: () => setLevel({ kind: "shop" }) },
      { label: "Our Story", onClick: () => go("/our-story") },
      { label: "Learn", onClick: () => go("/learn") },
      { label: "Contact Us", onClick: () => go("/contact") },
      { label: "My Account", onClick: () => go("/account") },
      { label: "Cart", onClick: () => go("/cart") },
    ]
  } else if (level.kind === "shop") {
    title = "Shop"
    rows = [
      { label: "Shop all", onClick: () => go("/shop") },
      ...AH_CATEGORIES.map((c, i) => ({
        label: `${c.numeral} ${c.title}`,
        hasChildren: true,
        onClick: () => setLevel({ kind: "category", index: i }),
      })),
    ]
  } else {
    const cat = AH_CATEGORIES[level.index]
    title = cat.title
    rows = cat.products.map((p) => ({
      label: `${p.name}\n${p.descriptor}`,
      onClick: () => go(`/products/${p.handle}`),
    }))
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-p2 text-current transition-ah hover:text-ah-dark-seafoam small:hidden"
        data-testid="nav-menu-button"
      >
        Menu
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={close} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-flyout"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-flyout"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel
              className="fixed inset-0 bg-ah-seafoam overflow-y-auto px-5 pt-6 pb-9 flex flex-col"
              data-testid="nav-menu-popup"
            >
              <div className="flex items-center justify-between mb-[26px]">
                {level.kind !== "root" ? (
                  <button
                    type="button"
                    aria-label="Back"
                    onClick={() =>
                      setLevel(
                        level.kind === "category" ? { kind: "shop" } : { kind: "root" }
                      )
                    }
                    className="text-p1 text-ah-ink"
                  >
                    ←
                  </button>
                ) : (
                  <span />
                )}
                {title ? (
                  <span className="text-p2 uppercase text-ah-ink">{title}</span>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="text-p1 text-ah-ink"
                  data-testid="close-menu-button"
                >
                  ×
                </button>
              </div>

              <div className="grid content-start flex-1">
                {rows.map((row) => (
                  <button
                    key={row.label}
                    type="button"
                    onClick={row.onClick}
                    className="flex justify-between gap-4 items-baseline text-left py-[18px] border-b-hairline border-ah-ink text-p1 text-ah-ink"
                    data-testid={`${row.label.split("\n")[0].toLowerCase().replace(/[^a-z]+/g, "-")}-link`}
                  >
                    <span className="whitespace-pre-line">{row.label}</span>
                    {row.hasChildren && <span aria-hidden="true">→</span>}
                  </button>
                ))}
              </div>

              {regions && level.kind === "root" && (
                <div
                  className="mt-8"
                  onMouseEnter={toggleState.open}
                  onMouseLeave={toggleState.close}
                >
                  <CountrySelect toggleState={toggleState} regions={regions} />
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}
