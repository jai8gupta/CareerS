import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { safeReturnPath } from "@/lib/navigation";
import { login } from "./actions";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);
  return <main className="authShell"><aside className="authAside"><Logo /><div className="authQuote"><p>Your next answer can be clearer than your last.</p><span>Practise the moment before it matters.</span></div><span>Career rehearsal for real working moments.</span></aside><section className="authMain"><div className="authCard"><Logo /><h1>Welcome back.</h1><p>Continue building the voice you want at work.</p><form className="formStack" action={login}><input type="hidden" name="next" value={next} />{params.error && <div className="formMessage formError">{params.error}</div>}{params.message && <div className="formMessage formSuccess">{params.message}</div>}<div className="fieldGroup"><label htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" autoComplete="email" inputMode="email" required /></div><div className="fieldGroup"><label htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" autoComplete="current-password" required /></div><div className="formMeta"><span></span><Link href="/auth/forgot-password">Forgot password?</Link></div><SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton></form><p className="authSwitch">New here? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create a free account</Link></p></div></section></main>;
}
