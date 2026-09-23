import Link from "next/link";
import { Logo } from "@/components/logo";
import { getUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getUser();
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Logo />
        <nav className="mainNav" aria-label="Main navigation">
          <Link href="/pricing">Pricing</Link>
          {user ? (
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
