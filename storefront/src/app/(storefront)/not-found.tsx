import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 | Ascended Health",
  description: "The page you tried to access does not exist.",
}

export default function NotFound() {
  return (
    <main className="pt-[100px] min-h-[600px]">
      <div className="content-container pb-[121px]">
        <h1 className="text-h1 m-0">Page not found</h1>
        <p className="text-p1 mt-4 max-w-[600px] m-0">
          The page you tried to access does not exist.
        </p>
        <div className="mt-7">
          <Link
            href="/"
            className="text-p2 text-ah-ink no-underline transition-ah hover:text-ah-dark-seafoam"
          >
            Back home <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
