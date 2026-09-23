import Link from "next/link";
import { Logo } from "@/components/logo";
import { requestReset } from "./actions";
export default function ForgotPasswordPage(){return <main className="authMain"><div className="authCard"><Logo/><h1>Reset your password.</h1><p>We’ll send a secure reset link if the address matches an account.</p><form className="formStack" action={requestReset}><div className="fieldGroup"><label htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required /></div><button className="button buttonDark">Send reset link</button></form><p className="authSwitch"><Link href="/login">Back to sign in</Link></p></div></main>}
