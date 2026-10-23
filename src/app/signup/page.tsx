import type { Metadata } from "next";
import Link from "next/link";
import { FunnelPageEvent } from "@/components/analytics-events";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { TrackedSignupForm } from "@/components/tracked-form";
import { safeReturnPath, scenarioFromReturnPath } from "@/lib/navigation";
import { SCENARIOS } from "@/lib/scenarios";
import { signup } from "./actions";

export const metadata: Metadata = { title: "Create account", robots: { index: false, follow: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const selectedTier = typeof params.tier === "string" ? params.tier : "";
  const defaultNext = selectedTier ? `/pricing?checkout=${selectedTier}` : "/dashboard";
  const next = safeReturnPath(params.next, defaultNext);
  const scenarioId = scenarioFromReturnPath(next);
  const intent = scenarioId ? "practice" : selectedTier ? "plan" : "general";
  return <main className="authShell"><FunnelPageEvent event="signup_page_viewed" properties={{ intent }} once={`signup_page:${intent}`}/>{params.error_category&&<FunnelPageEvent event="signup_failed" properties={{ category: params.error_category }} once={`signup_failed:${params.error_category}`}/>}<aside className="authAside"><Logo /><div className="authQuote"><p>Your interview is not the place to hear your answer for the first time.</p><span>Practise it. Improve it. Walk in ready.</span></div><span>3 full AI reviews free every month.</span></aside><section className="authMain"><div className="authCard"><Logo /><h1>Your first practice starts here.</h1><p>Create a free account to practise your answer, get feedback, and try again.</p>{scenarioId&&<div className="authIntentCard"><span>Your selected question</span><strong>{SCENARIOS[scenarioId].title}</strong><small>We’ll bring you straight back to it after confirmation.</small></div>}<TrackedSignupForm action={signup.bind(null, selectedTier, next)} intent={intent}>{params.error && <div className="formMessage formError">{params.error}</div>}<div className="fieldGroup"><label htmlFor="name">Your name</label><input className="field" id="name" name="name" autoComplete="name" required minLength={2} inputMode="text" /></div><div className="fieldGroup"><label htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" autoComplete="email" inputMode="email" required /></div><div className="fieldGroup"><label htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /><small>At least 8 characters</small></div><SubmitButton className="button buttonLime" pendingLabel="Creating your account…">Create free account</SubmitButton><small>By continuing, you agree to our <Link className="textLink" href="/terms">Terms</Link> and <Link className="textLink" href="/privacy">Privacy Policy</Link>.</small></TrackedSignupForm><p className="authSwitch">Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link></p></div></section></main>;
}
