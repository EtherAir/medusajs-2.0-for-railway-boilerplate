import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getPost, getPosts, POST_IMAGE_FALLBACK } from "@lib/data/payload"
import { getProductsList } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { AhRule, SectionRule } from "@modules/common/components/ah"
import ProductPreview from "@modules/products/components/product-preview"

const ROM = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII."]

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getPost(slug)
  return {
    title: post ? `${post.title} | Ascended Health` : "Learn | Ascended Health",
    description: post?.excerpt ?? undefined,
  }
}

/**
 * Blog post template: split hero (title/byline/intro left, imagery right),
 * roman-numeraled ruled article sections, "Featured products in this post"
 * 3-up.
 */
export default async function PostPage(props: {
  params: Promise<{ countryCode: string; slug: string }>
}) {
  const { countryCode, slug } = await props.params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const image = post.heroImage?.url || POST_IMAGE_FALLBACK[post.slug]
  const region = await getRegion(countryCode)

  let featured: any[] = []
  if (region) {
    const { response } = await getProductsList({
      queryParams: { handle: ["heal", "rejuvenate", "remedy"], limit: 3 } as any,
      countryCode,
    }).catch(() => ({ response: { products: [] } }))
    featured = response.products
  }

  return (
    <main>
      <div className="grid grid-cols-1 small:grid-cols-2 items-stretch">
        <div className="px-gutter small:pr-[86px] pt-[88px] pb-v82">
          <h1 className="text-h1 m-0 max-w-[480px]">{post.title}</h1>
          <div className="text-p2 mt-6">
            {post.byline || `${post.tag}`}
          </div>
          {post.intro && (
            <p className="text-p2 mt-v42 max-w-[440px] m-0">{post.intro}</p>
          )}
        </div>
        {image && (
          <div className="relative min-h-[320px] small:min-h-[560px]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}
      </div>

      {post.sections && post.sections.length > 0 && (
        <section className="content-container pt-v82">
          {post.sections.map((s, i) => (
            <article
              key={s.heading}
              className="grid grid-cols-1 small:grid-cols-[441px_1fr] gap-6 small:gap-[194px] border-t-hairline border-ah-ink py-[34px] small:pb-[62px]"
            >
              <div className="text-p1 uppercase">
                {ROM[i]}&nbsp;&nbsp;{s.heading}
              </div>
              <div className="max-w-[620px]">
                {s.body.split(/\n\n+/).map((t, j) => (
                  <p key={j} className={`text-p1 m-0 ${j ? "mt-6" : ""}`}>
                    {t}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      {featured.length > 0 && region && (
        <section className="content-container pt-[108px] pb-[92px]">
          <SectionRule label="Featured products in this post" rules="top" />
          <div className="grid grid-cols-1 xsmall:grid-cols-3 gap-10 pt-v49">
            {featured.map((p) => (
              <ProductPreview key={p.id} product={p} region={region} />
            ))}
          </div>
          <div className="mt-v49">
            <AhRule />
          </div>
        </section>
      )}
    </main>
  )
}
