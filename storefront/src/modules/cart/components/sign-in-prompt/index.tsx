import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AhButton } from "@modules/common/components/ah"

const SignInPrompt = () => {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <div>
        <div className="text-p1">Already have an account?</div>
        <div className="text-p2 text-ah-muted mt-1">
          Sign in for a better experience.
        </div>
      </div>
      <LocalizedClientLink href="/account">
        <AhButton data-testid="sign-in-button">Sign in</AhButton>
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
