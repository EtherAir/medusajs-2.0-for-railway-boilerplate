"use client"

import { useState } from "react"
import Image from "next/image"

import { HOME_BLOG_CARDS, REVIEWS } from "@lib/content/home"
import { AhRule } from "@modules/common/components/ah"
import CarouselNav from "@modules/common/components/ah/carousel-nav"
import StarRating from "@modules/common/components/ah/star-rating"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Reviews carousel ("Look inside the vibrant life.") beside two journal
 * cards. One review shown at a time, arrows + dots beneath.
 */
export default function ReviewsAndBlog() {
  const [i, setI] = useState(0)
  const r = REVIEWS[i]

  return (
    <section className="content-container pt-v111 small:pt-[142px] grid grid-cols-1 small:grid-cols-[578px_1fr] gap-12 small:gap-[clamp(80px,17.9vw,258px)] items-start">
      <div>
        <h2 className="text-p1 m-0">Look inside the vibrant life.</h2>
        <div className="text-p2 mt-[10px] mb-6">
          See what our customers are saying.
        </div>
        <AhRule />
        <div className="pt-6 min-h-[150px]">
          <div className="pb-6 border-b-hairline border-ah-ink">
            <div className="flex items-center justify-between gap-6">
              <span className="text-p2 uppercase leading-none">
                {r.author}, {r.date}
              </span>
              <StarRating value={r.rating} />
            </div>
            <p className="text-p2 mt-4 m-0">{r.body}</p>
          </div>
        </div>
        <div className="mt-[26px]">
          <CarouselNav count={REVIEWS.length} index={i} onChange={setI} />
        </div>
      </div>

      <div className="flex gap-[23px]">
        {HOME_BLOG_CARDS.map((card) => (
          <LocalizedClientLink
            key={card.title}
            href={card.href}
            className="block w-[208px] no-underline text-ah-ink transition-ah hover:text-ah-dark-seafoam"
          >
            <div className="relative w-full h-[268px]">
              <Image
                src={card.image}
                alt=""
                fill
                className="object-cover"
                sizes="208px"
              />
            </div>
            <div className="mt-[14px] text-p2 uppercase leading-none">
              {card.date}
            </div>
            <div className="mt-[10px] text-p1 uppercase">{card.title}</div>
            <p className="mt-2 m-0 text-p2">{card.excerpt}</p>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
