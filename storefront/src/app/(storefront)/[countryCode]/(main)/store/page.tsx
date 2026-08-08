import { redirect } from "next/navigation"

/** The boilerplate's /store is replaced by the designed /shop. */
export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  redirect(`/${countryCode}/shop`)
}
