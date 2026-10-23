import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Mic2, RefreshCw, Sparkles } from "lucide-react";
import { FunnelPageEvent, TrackedLink } from "@/components/analytics-events";
import { Footer } from "@/components/footer";
import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";
import { practicePreviewHref } from "@/lib/navigation";
import { jsonLd, publicPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "CareerSpeak — AI Interview & Career English Practice for India",
  description: "Practise real interview questions aloud, get AI feedback on clarity, structure and relevance, then retry. Start with 3 free CareerSpeak reviews.",
  path: "/",
});

const faqItems = [
  { question: "What does CareerSpeak help me practise?", answer: "CareerSpeak helps you rehearse HR interviews, technical explanations, daily stand-ups, client conversations and presentations in your own voice." },
  { question: "Do I need fluent English to begin?", answer: "No. CareerSpeak is designed for professionals improving clarity and confidence. You can speak naturally, including the occasional Hindi phrase, and focus on making each answer stronger." },
  { question: "How does the AI feedback work?", answer: "After you speak or type an answer, CareerSpeak reviews its clarity, structure and relevance, highlights what worked and suggests a stronger version to retry." },
  { question: "Can I try CareerSpeak for free?", answer: "Yes. Every account includes 3 complete AI reviews each month with no card required." },
] as const;

export default function HomePage() {
  const subscriptionsEnabled = process.env.RAZORPAY_SUBSCRIPTIONS_ENABLED === "true";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "CareerSpeak",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "CareerSpeak",
        url: `${SITE_URL}/`,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: "CareerSpeak",
        url: `${SITE_URL}/`,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: "en-IN",
        description: "AI-powered interview and workplace English practice for Indian professionals.",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
          { "@type": "Offer", name: "Interview Sprint", price: "39", priceCurrency: "INR" },
          { "@type": "Offer", name: "Pro Monthly", price: "79", priceCurrency: "INR" },
          { "@type": "Offer", name: "Pro Annual", price: "599", priceCurrency: "INR" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <FunnelPageEvent event="landing_viewed" properties={{ page: "home" }} once="home" />
      <SiteHeader />
      <main>
        <section className="hero container">
          <div className="heroCopy">
            <p className="eyebrow">AI interview practice for Indian careers</p>
            <h1>Know the answer. Struggle to say it?</h1>
            <p className="heroLead">Practise real interview questions aloud. Get feedback on clarity, structure and relevance, then try again in your own voice.</p>
            <div className="heroActions">
              <TrackedLink className="button buttonLime" href={practicePreviewHref("hr_intro")} event="primary_cta_clicked" properties={{ placement: "hero", destination: "practice_preview" }}>Practise your first answer free <ArrowRight size={18} /></TrackedLink>
              <Link className="textLink" href="#how-it-works">See how it works</Link>
            </div>
            <div className="trustRow"><span>3 free AI reviews every month</span><span>No card required</span><span>Built for Indian careers</span></div>
          </div>
          <div className="heroDemo" aria-label="CareerSpeak feedback preview">
            <div className="demoTop"><span>HR interview · Warm-up</span><span className="livePill">Illustrative preview</span></div>
            <div className="demoPrompt"><small>Your prompt</small><h2>Tell me about yourself and why you’re interested in this role.</h2></div>
            <div className="waveRow"><span className="micCircle"><Mic2 size={22} /></span><div className="wave" aria-hidden="true">{[12,24,34,18,42,28,14,38,48,22,32,16,40,25,12,30].map((height, index) => <i style={{ height }} key={index} />)}</div><span>01:08</span></div>
            <div className="scorePreview"><div><strong>3</strong><span>review areas</span></div><p><b>Example feedback:</b> Strong structure. Add one measurable result to make your answer memorable.</p></div>
          </div>
        </section>

        <section className="proofStrip">
          <div className="container proofGrid">
            <div><Mic2 /><span><b>Speak</b> naturally for 30–120 seconds</span></div>
            <div><Sparkles /><span><b>Understand</b> what helped or hurt</span></div>
            <div><RefreshCw /><span><b>Retry</b> while the lesson is fresh</span></div>
            <div><BarChart3 /><span><b>Track</b> measurable improvement</span></div>
          </div>
        </section>

        <section className="section container howSection" id="how-it-works" aria-labelledby="how-title">
          <div className="sectionHeading narrow"><p className="eyebrow">How CareerSpeak works</p><h2 id="how-title">Speak → Get feedback → Improve → Retry</h2><p>A short, focused rehearsal for the exact career moment ahead of you.</p></div>
          <div className="howGrid">
            {[
              ["01", "Choose a real career question", "Start with an HR interview, technical explanation, manager update, client conversation, or presentation."],
              ["02", "Say your answer aloud", "Speak naturally for 30–120 seconds. You can type instead if your browser cannot use the microphone."],
              ["03", "Review what can improve", "See focused feedback on clarity, structure, relevance, fillers, and one stronger version."],
              ["04", "Try again in your words", "Apply one useful change immediately while the prompt and feedback are still fresh."],
            ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="section container splitSection">
          <div><p className="eyebrow">Not another English course</p><h2>Rehearse the exact moment ahead of you.</h2><p className="sectionLead">CareerSpeak focuses on professional outcomes: clearer stories, stronger structure, fewer fillers, and answers people remember.</p></div>
          <div className="trackPreview">{["HR interviews", "Technical explanations", "Daily stand-ups", "Client conversations", "Presentations"].map((track, index) => <div key={track}><span>{String(index + 1).padStart(2, "0")}</span><BriefcaseBusiness size={19} /><b>{track}</b></div>)}</div>
        </section>

        <section className="container intentLinks" aria-label="Explore CareerSpeak practice">
          <Link href="/ai-interview-practice"><span>For your next interview</span><strong>Explore AI interview practice</strong><ArrowRight size={18}/></Link>
          <Link href="/workplace-english-practice"><span>For everyday career growth</span><strong>Explore workplace English practice</strong><ArrowRight size={18}/></Link>
        </section>

        <section className="section pricingSection" id="pricing">
          <div className="container">
            <div className="sectionHeading"><p className="eyebrow">Start for the outcome you need</p><h2>Fair Indian pricing. No giant commitment.</h2><p>Use the emergency interview plan, or turn better communication into a habit.</p></div>
            <PricingCards subscriptionsEnabled={subscriptionsEnabled} />
          </div>
        </section>

        <section className="section container faqSection" aria-labelledby="faq-title">
          <div className="sectionHeading narrow"><p className="eyebrow">Questions, answered</p><h2 id="faq-title">Practise first. Perform with confidence.</h2><p>Everything you need to know before your first CareerSpeak rehearsal.</p></div>
          <div className="faqGrid">{faqItems.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="container finalCta">
          <div><p className="eyebrow">Your next career moment</p><h2>Don’t practise in your head.</h2><p>Say the answer. Improve it. Walk in ready.</p></div>
          <TrackedLink className="button buttonLime" href={practicePreviewHref("hr_intro")} event="primary_cta_clicked" properties={{ placement: "final", destination: "practice_preview" }}>Practise your first answer free <ArrowRight size={18} /></TrackedLink>
        </section>
      </main>
      <Footer />
    </>
  );
}
