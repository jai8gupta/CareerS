import Link from "next/link";import { Logo } from "@/components/logo";
export default function NotFound(){return <main className="authMain"><div className="authCard"><Logo/><p className="eyebrow" style={{marginTop:40}}>404</p><h1>That page isn’t here.</h1><p>The practice room is still exactly where you left it.</p><Link className="button buttonDark" href="/">Back home</Link></div></main>}
