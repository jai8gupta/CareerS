import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Mic2, RefreshCw, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";
import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero container">
          <div className="heroCopy">
            <p className="eyebrow">Five-minute career rehearsal</p>
            <h1>Sound ready when it matters.</h1>
            <p className="heroLead">Practise tomorrow’s interview, stand-up, client call, or presentation. Speak naturally, see exactly what weakened your answer, and retry with confidence.</p>
            <div className="heroActions">
              <Link className="button buttonLime" href="/signup">Take a free interview test <ArrowRight size={18} /></Link>
              <Link className="textLink" href="/pricing">See simple pricing</Link>
            </div>
            <div className="trustRow"><span>No card required</span><span>3 free AI reviews</span><span>Built for Indian careers</span></div>
          </div>
          <div className="heroDemo" aria-label="CareerSpeak feedback preview">
            <div className="demoTop"><span>HR interview · Warm-up</span><span className="livePill">Practice</span></div>
            <div className="demoPrompt"><small>Your prompt</small><h2>Tell me about yourself and why you’re interested in this role.</h2></div>
            <div className="waveRow"><span className="micCircle"><Mic2 size={22} /></span><div className="wave" aria-hidden="true">{[12,24,34,18,42,28,14,38,48,22,32,16,40,25,12,30].map((height, index) => <i style={{ height }} key={index} />)}</div><span>01:08</span></div>
            <div className="scorePreview"><div><strong>82</strong><span>Overall</span></div><p><b>Strong structure.</b> Add one measurable result to make your answer memorable.</p></div>
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

        <section className="section container splitSection">
          <div>
            <p className="eyebrow">Not another English course</p>
            <h2>Rehearse the exact moment ahead of you.</h2>
            <p className="sectionLead">CareerSpeak focuses on professional outcomes: clearer stories, stronger structure, fewer fillers, and answers people remember.</p>
          </div>
          <div className="trackPreview">
            {["HR interviews", "Technical explanations", "Daily stand-ups", "Client conversations", "Presentations"].map((track, index) => <div key={track}><span>{String(index + 1).padStart(2, "0")}</span><BriefcaseBusiness size={19} /><b>{track}</b></div>)}
          </div>
        </section>

        <section className="section pricingSection" id="pricing">
          <div className="container">
            <div className="sectionHeading"><p className="eyebrow">Start for the outcome you need</p><h2>Fair Indian pricing. No giant commitment.</h2><p>Use the emergency interview plan, or turn better communication into a habit.</p></div>
            <PricingCards />
          </div>
        </section>

        <section className="container finalCta">
          <div><p className="eyebrow">Your next career moment</p><h2>Don’t practise in your head.</h2><p>Say the answer. Improve it. Walk in ready.</p></div>
          <Link className="button buttonLime" href="/signup">Start with 3 free reviews <ArrowRight size={18} /></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
