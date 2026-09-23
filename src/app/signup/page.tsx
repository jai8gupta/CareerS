import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { signup } from "./actions";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const selectedTier = typeof params.tier === "string" ? params.tier : "";
  return <main className="authShell"><aside className="authAside"><Logo /><div className="authQuote"><p>Your interview is not the place to hear your answer for the first time.</p><span>Practise it. Improve it. Walk in ready.</span></div><span>3 full AI reviews free every month.</span></aside><section className="authMain"><div className="authCard"><Logo /><h1>Start practising.</h1><p>Create your account. No card required.</p><form className="formStack" action={signup.bind(null, selectedTier)}>{params.error && <div className="formMessage formError">{params.error}</div>}<div className="fieldGroup"><label htmlFor="name">Your name</label><input className="field" id="name" name="name" autoComplete="name" required minLength={2} /></div><div className="fieldGroup"><label htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" autoComplete="email" required /></div><div className="fieldGroup"><label htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /><small>At least 8 characters</small></div><button className="button buttonLime" type="submit">Create free account</button><small>By continuing, you agree to our <Link className="textLink" href="/terms">Terms</Link> and <Link className="textLink" href="/privacy">Privacy Policy</Link>.</small></form><p className="authSwitch">Already have an account? <Link href="/login">Sign in</Link></p></div></section></main>;
}
