import { Metadata } from "next"

import ShopTemplate from "@modules/shop/templates"

export const metadata: Metadata = {
  title: "Shop | Ascended Health",
  description:
    "Life-enhancing formulas for holistic microbiome and cellular support.",
}

export default async function ShopPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ category?: string; condition?: string }>
}) {
  const { countryCode } = await props.params
  const searchParams = await props.searchParams

  return (
    <ShopTemplate
      countryCode={countryCode}
      selectedCategories={
        searchParams.category?.split(",").filter(Boolean) ?? []
      }
      selectedConditions={
        searchParams.condition?.split(",").filter(Boolean) ?? []
      }
    />
  )
}
