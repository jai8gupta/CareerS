import Link from "next/link";
import { TrackedLink } from "@/components/analytics-events";
import { Logo } from "@/components/logo";

export function SiteHeader({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />
        <nav className="mainNav" aria-label="Main navigation">
          <Link href="/ai-interview-practice">Interviews</Link>
          <Link href="/workplace-english-practice">Workplace English</Link>
          <Link href="/pricing">Pricing</Link>
          {signedIn ? (
            <Link className="button buttonDark buttonSmall" href="/dashboard">Open practice</Link>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <TrackedLink className="button buttonDark buttonSmall" href="/practice-preview?scenario=hr_intro" event="primary_cta_clicked" properties={{ placement: "header", destination: "practice_preview" }}>Start free</TrackedLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
