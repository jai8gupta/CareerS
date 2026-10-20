import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <Logo />
        <div className="footerLinks">
          <Link href="/ai-interview-practice">Interview practice</Link>
          <Link href="/workplace-english-practice">Workplace English</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refunds">Refunds</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} CareerSpeak</p>
      </div>
    </footer>
  );
}
