/**
 * Seeds the rebuilt legacy articles (scripts/data/ah-articles.json) as
 * Payload posts: root-canal, fluoride, nutrigenomics.
 *
 * Run: railway run --service Storefront -- sh -c \
 *   'NODE_ENV=production PAYLOAD_DATABASE_URL="$PAYLOAD_DATABASE_PUBLIC_URL" npx payload run scripts/seed-articles.ts'
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { getPayload } from "payload"
import config from "@payload-config"

const articles = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts/data/ah-articles.json"), "utf8")
)

const payload = await getPayload({ config })

for (const [slug, post] of Object.entries(articles.posts) as [string, any][]) {
  const data = {
    slug,
    title: post.title,
    tag: post.tag,
    excerpt: post.excerpt,
    intro: post.intro,
    sections: (post.sections ?? []).map((s: any) => ({
      heading: s.heading,
      body: s.body,
    })),
    _status: "published",
  }
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    await payload.update({ collection: "posts", id: existing.docs[0].id, data: data as any })
    console.log("updated post:", slug)
  } else {
    await payload.create({ collection: "posts", data: data as any })
    console.log("created post:", slug)
  }
}
console.log("done")
process.exit(0)
