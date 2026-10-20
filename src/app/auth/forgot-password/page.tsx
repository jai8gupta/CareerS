import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { requestReset } from "./actions";
export const metadata:Metadata={title:"Reset password",robots:{index:false,follow:false}};
export default function ForgotPasswordPage(){return <main className="authMain"><div className="authCard"><Logo/><h1>Reset your password.</h1><p>We’ll send a secure reset link if the address matches an account.</p><form className="formStack" action={requestReset}><div className="fieldGroup"><label htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" autoComplete="email" required /></div><SubmitButton pendingLabel="Sending reset link…">Send reset link</SubmitButton></form><p className="authSwitch"><Link href="/login">Back to sign in</Link></p></div></main>}
