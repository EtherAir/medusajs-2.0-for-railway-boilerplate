import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    }).then((res) => res.json())

    if (!regions?.length) {
      notFound()
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Region routing:
 * - The default country (NEXT_PUBLIC_DEFAULT_REGION) lives at clean,
 *   unprefixed URLs: /shop. Requests are invisibly rewritten to
 *   /{default}/... internally, and any explicit /{default}/... URL 301s
 *   to its clean form (one canonical URL per page).
 * - Every other configured country keeps its prefix: /de/shop.
 * - cart_id / onboarding query params still set their cookies and bounce
 *   into checkout exactly as before.
 */
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")
  const cartIdCookie = request.cookies.get("_medusa_cart_id")

  const regionMap = await getRegionMap()
  const pathname = request.nextUrl.pathname
  const urlSeg = pathname.split("/")[1]?.toLowerCase()
  const urlHasCountryCode = !!urlSeg && regionMap.has(urlSeg)

  const withParamCookies = (response: NextResponse) => {
    if (cartId && !cartIdCookie) {
      response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
    }
    if (isOnboarding) {
      response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
    }
    return response
  }

  // Explicit default-country prefix → 301 to the canonical clean URL.
  if (urlHasCountryCode && urlSeg === DEFAULT_REGION) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(urlSeg.length + 1) || "/"
    if (cartId && !checkoutStep) url.searchParams.set("step", "address")
    return withParamCookies(NextResponse.redirect(url, 301))
  }

  // Non-default country prefix → serve as-is.
  if (urlHasCountryCode) {
    if (cartId && !checkoutStep) {
      const url = request.nextUrl.clone()
      url.searchParams.set("step", "address")
      return withParamCookies(NextResponse.redirect(url, 307))
    }
    return withParamCookies(NextResponse.next())
  }

  // Unprefixed URL: resolve the visitor's country.
  const countryCode = regionMap && (await getCountryCode(request, regionMap))
  if (!countryCode) {
    return NextResponse.next()
  }

  if (cartId && !checkoutStep) {
    const url = request.nextUrl.clone()
    if (countryCode !== DEFAULT_REGION) {
      url.pathname = `/${countryCode}${pathname === "/" ? "" : pathname}`
    }
    url.searchParams.set("step", "address")
    return withParamCookies(NextResponse.redirect(url, 307))
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${countryCode}${pathname === "/" ? "" : pathname}`

  if (countryCode === DEFAULT_REGION) {
    // Invisible rewrite: browser keeps the clean URL.
    return withParamCookies(NextResponse.rewrite(url))
  }

  // Geo-detected non-default country → prefixed redirect.
  return withParamCookies(NextResponse.redirect(url, 307))
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|fonts|favicon.ico|.*\\.png|.*\\.jpg|.*\\.gif|.*\\.svg|.*\\.woff2).*)",
  ], // prevents redirecting on static files and the image optimizer

}
