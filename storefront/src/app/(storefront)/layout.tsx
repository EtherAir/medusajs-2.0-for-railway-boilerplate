import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

const founders = localFont({
  src: "../../../public/fonts/FoundersGrotesk-Light.woff2",
  weight: "300",
  style: "normal",
  display: "swap",
  variable: "--font-founders",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={founders.variable}>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
