import Link from "next/link";
import { TrackedLink } from "@/components/analytics-events";
import { practicePreviewHref } from "@/lib/navigation";
import { Logo } from "@/components/logo";

type SiteHeaderProps = {
  signedIn?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  ctaDestination?: "practice_preview" | "signup";
};

export function SiteHeader({
  signedIn = false,
  ctaHref = practicePreviewHref("hr_intro"),
  ctaLabel = "Start free",
  ctaDestination = "practice_preview",
}: SiteHeaderProps) {
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
              <TrackedLink className="button buttonDark buttonSmall" href={ctaHref} event="primary_cta_clicked" properties={{ placement: "header", destination: ctaDestination }}>{ctaLabel}</TrackedLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
