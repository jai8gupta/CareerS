import Link from "next/link";
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
              <Link className="button buttonDark buttonSmall" href="/signup">Start free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
