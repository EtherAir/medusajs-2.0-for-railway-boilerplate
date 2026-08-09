import { cache } from "react"

/**
 * Server-side accessors for Payload content (local API — same process, no
 * HTTP hop). Every accessor fails soft: if the CMS database is unreachable
 * (e.g. local dev without credentials) the storefront falls back to the
 * in-repo copy so pages never break.
 */

async function payloadClient() {
  const { getPayload } = await import("payload")
  const config = (await import("@payload-config")).default
  return getPayload({ config })
}

export type CmsPost = {
  id: string | number
  title: string
  slug: string
  tag: string
  byline?: string | null
  excerpt?: string | null
  intro?: string | null
  heroImage?: { url?: string | null } | null
  sections?: { heading: string; body: string }[] | null
}

/** Handoff imagery per seeded slug, used while posts have no uploaded hero. */
export const POST_IMAGE_FALLBACK: Record<string, string> = {
  concept: "/images/ah/imagery/macro-clay.png",
  "science-of-skin-resonance": "/images/ah/imagery/editorial-portrait-bw.png",
  "why-we-cold-press-everything": "/images/ah/imagery/feature-lesse-rocks.jpg",
  "rose-otto": "/images/ah/imagery/feature-rowse-moss.jpg",
  "minimalist-nightly-ritual": "/images/ah/illustrations/botanical-dandelion.png",
  "sun-skin-regeneration-myth": "/images/ah/imagery/community-water.jpg",
  "root-canal": "/images/ah/imagery/editorial-portrait-bw.png",
  "fluoride": "/images/ah/imagery/macro-clay.png",
  "nutrigenomics": "/images/ah/imagery/hero-moss-landscape.png",
}

export const getPosts = cache(async (): Promise<CmsPost[]> => {
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: "posts",
      limit: 50,
      sort: "-createdAt",
    })
    return res.docs as unknown as CmsPost[]
  } catch {
    return []
  }
})

export const getPost = cache(async (slug: string): Promise<CmsPost | null> => {
  try {
    const payload = await payloadClient()
    const res = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return (res.docs[0] as unknown as CmsPost) ?? null
  } catch {
    return null
  }
})

export const getSiteSettings = cache(
  async (): Promise<{ announcement: string; communityLine: string }> => {
    const fallback = {
      announcement: "Free shipping on US orders over $250.",
      communityLine:
        "FOLLOW. ENGAGE. FLOURISH.\nFind our community online @ascendedhealth.",
    }
    try {
      const payload = await payloadClient()
      const g = (await payload.findGlobal({ slug: "site-settings" })) as any
      return {
        announcement: g?.announcement || fallback.announcement,
        communityLine: g?.communityLine || fallback.communityLine,
      }
    } catch {
      return fallback
    }
  }
)

export const getReviews = cache(
  async (): Promise<
    { author: string; date?: string | null; rating?: number | null; body: string }[]
  > => {
    try {
      const payload = await payloadClient()
      const g = (await payload.findGlobal({ slug: "reviews" })) as any
      if (g?.items?.length) return g.items
    } catch {
      // fall through
    }
    const { REVIEWS } = await import("@lib/content/home")
    return REVIEWS
  }
)
