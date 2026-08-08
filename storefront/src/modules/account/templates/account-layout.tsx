import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-baseline justify-between border-t-hairline border-ah-ink py-12 gap-8">
          <div>
            <h3 className="text-p1 m-0 mb-3">Got questions?</h3>
            <span className="text-p2 text-ah-muted">
              Reach us any time — products@ascendedhealth.com or 310.683.0333.
            </span>
          </div>
          <div>
            <UnderlineLink href="/contact">Contact Us</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
