import { Metadata } from "next"

import { getPosts, POST_IMAGE_FALLBACK } from "@lib/data/payload"
import { AhRule, SectionRule, cx } from "@modules/common/components/ah"
import BlogCard from "@modules/content/components/blog-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Learn | Ascended Health",
  description: "Ancient microbiome wisdom, in practice.",
}

const TAGS = ["All", "Our mission", "Science", "Ingredients", "Rituals"]

/**
 * Learn index: H1 + tagline, tag filter on the section rule, 3-col journal
 * cards, closed by a rule. Posts come from Payload (fail-soft to none).
 */
export default async function LearnPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag: activeTag = "All" } = await props.searchParams
  const posts = await getPosts()

  const visible = posts.filter((p) => activeTag === "All" || p.tag === activeTag)

  return (
    <main className="pt-[88px] min-h-[700px]">
      <div className="content-container pb-[92px]">
        <h1 className="text-h1 m-0">Learn</h1>
        <div className="text-p1 mt-3 mb-v42">
          Ancient microbiome wisdom, in practice.
        </div>

        <SectionRule
          label="Category or tag"
          right={
            <span className="flex gap-6 text-p2 flex-wrap">
              {TAGS.map((t) => (
                <LocalizedClientLink
                  key={t}
                  href={t === "All" ? "/learn" : `/learn?tag=${encodeURIComponent(t)}`}
                  className={cx(
                    "no-underline transition-ah",
                    t === activeTag
                      ? "text-ah-ink"
                      : "text-ah-muted hover:text-ah-ink"
                  )}
                >
                  {t}
                </LocalizedClientLink>
              ))}
            </span>
          }
        />

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-x-10 gap-y-14 pt-v49">
            {visible.map((p) => (
              <BlogCard
                key={p.slug}
                href={`/learn/${p.slug}`}
                image={p.heroImage?.url || POST_IMAGE_FALLBACK[p.slug]}
                tag={p.tag}
                title={p.title}
                excerpt={p.excerpt}
              />
            ))}
          </div>
        ) : (
          <p className="text-p1 text-ah-muted pt-v49 m-0">
            New writing is on its way.
          </p>
        )}

        <div className="mt-[62px]">
          <AhRule />
        </div>
      </div>
    </main>
  )
}
