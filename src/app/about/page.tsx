import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { jsonLd, publicPageMetadata, SITE_URL, SUPPORT_EMAIL } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "About CareerSpeak",
  description: "CareerSpeak is an India-first AI practice coach for job interviews, workplace English and high-stakes professional conversations.",
  path: "/about",
});

export default function AboutPage(){
  const structuredData={"@context":"https://schema.org","@type":"AboutPage",name:"About CareerSpeak",url:`${SITE_URL}/about`,description:"CareerSpeak is an India-first AI practice coach for interviews and workplace communication.",mainEntity:{"@id":`${SITE_URL}/#organization`}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(structuredData)}}/><SiteHeader/><main className="pageMain"><section className="container aboutHero"><p className="eyebrow">About CareerSpeak</p><h1>Career communication improves through rehearsal.</h1><p>CareerSpeak is an India-first AI practice coach for people who know what they want to say but need a clearer, more confident way to say it in interviews and at work.</p></section><section className="section container aboutGrid"><article><h2>Why we built it</h2><p>An interview, client call or important presentation is a difficult place to hear your answer for the first time. Generic English lessons rarely prepare you for that exact moment. CareerSpeak creates a short practice loop around the professional situation ahead of you.</p></article><article><h2>How it helps</h2><ul><li><CheckCircle2 size={19}/>Practise realistic career prompts aloud or in writing.</li><li><CheckCircle2 size={19}/>Understand clarity, structure, relevance and filler issues.</li><li><CheckCircle2 size={19}/>Review an improved example without memorising a script.</li><li><CheckCircle2 size={19}/>Retry immediately in your own words.</li></ul></article><article><h2>What it does not promise</h2><p>CareerSpeak does not guarantee a job, promotion or interview result. AI feedback can be imperfect. It is a rehearsal tool designed to make practice specific, repeatable and easier to act on.</p></article><article><h2>Built with responsible services</h2><p>CareerSpeak uses Supabase for accounts and storage, OpenAI for transcription and coaching, Razorpay for payments, Resend for account emails and Vercel for hosting. Our <Link className="textLink" href="/privacy">Privacy Policy</Link> explains how information is processed.</p></article></section><section className="container aboutContact"><div><p className="eyebrow">Questions or feedback</p><h2>Talk to CareerSpeak</h2><p>Email <a className="textLink" href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL||SUPPORT_EMAIL}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL||SUPPORT_EMAIL}</a> for product, account, privacy or billing support.</p></div><Link className="button buttonLime" href="/signup">Start practising <ArrowRight size={18}/></Link></section></main><Footer/></>;
}
