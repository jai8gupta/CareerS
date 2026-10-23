import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText } from "lucide-react";
import { TrackedLink } from "@/components/analytics-events";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { practicePreviewHref } from "@/lib/navigation";
import type { ScenarioId } from "@/lib/scenarios";
import { jsonLd, SITE_URL } from "@/lib/seo";

type Item = { title: string; copy: string };
type FAQ = { question: string; answer: string };

export function UseCasePage({
  path,
  eyebrow,
  title,
  lead,
  highlights,
  scenarioHeading,
  scenarioLead,
  scenarios,
  outcomeHeading,
  outcomeLead,
  outcomes,
  steps,
  faq,
  relatedHref,
  relatedLabel,
  previewScenario,
}: {
  path: string;
  eyebrow: string;
  title: string;
  lead: string;
  highlights: string[];
  scenarioHeading: string;
  scenarioLead: string;
  scenarios: Item[];
  outcomeHeading: string;
  outcomeLead: string;
  outcomes: Item[];
  steps: string[];
  faq: FAQ[];
  relatedHref: string;
  relatedLabel: string;
  previewScenario: ScenarioId;
}) {
  const previewHref = practicePreviewHref(previewScenario);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "CareerSpeak", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: eyebrow, item: `${SITE_URL}${path}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <SiteHeader />
    <main>
      <section className="container useCaseHero">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="useCaseLead">{lead}</p>
          <div className="heroActions"><TrackedLink className="button buttonLime" href={previewHref} event="primary_cta_clicked" properties={{ placement: "use_case_hero", destination: "practice_preview" }}>Practise free <ArrowRight size={18}/></TrackedLink><Link className="textLink" href="/pricing">See pricing</Link></div>
          <ul className="inlineChecks">{highlights.map(item=><li key={item}><CheckCircle2 size={17}/>{item}</li>)}</ul>
        </div>
        <div className="promptStack" aria-label="Example CareerSpeak prompts">{scenarios.slice(0,3).map((scenario,index)=><article key={scenario.title}><span><MessageSquareText size={17}/>Practice prompt {index+1}</span><strong>{scenario.title}</strong><p>{scenario.copy}</p></article>)}</div>
      </section>

      <section className="section container useCaseSection">
        <div className="sectionHeading narrow"><p className="eyebrow">Real practice, not generic lessons</p><h2>{scenarioHeading}</h2><p>{scenarioLead}</p></div>
        <div className="scenarioGrid">{scenarios.map((scenario,index)=><article className="scenarioCard" key={scenario.title}><span>{String(index+1).padStart(2,"0")}</span><h3>{scenario.title}</h3><p>{scenario.copy}</p></article>)}</div>
      </section>

      <section className="section useCaseWash"><div className="container splitSection">
        <div><p className="eyebrow">Feedback you can use</p><h2>{outcomeHeading}</h2><p className="sectionLead">{outcomeLead}</p><Link className="textLink relatedLink" href={relatedHref}>{relatedLabel} <ArrowRight size={16}/></Link></div>
        <div className="outcomeList">{outcomes.map(outcome=><article key={outcome.title}><CheckCircle2 size={21}/><div><h3>{outcome.title}</h3><p>{outcome.copy}</p></div></article>)}</div>
      </div></section>

      <section className="section container practiceSteps"><div><p className="eyebrow">A five-minute loop</p><h2>Speak. Understand. Retry.</h2><p>Improvement happens while the answer is still fresh—not days after the moment has passed.</p></div><ol>{steps.map((step,index)=><li key={step}><span>{index+1}</span>{step}</li>)}</ol></section>

      <section className="section container faqSection" aria-labelledby="use-case-faq"><div className="sectionHeading narrow"><p className="eyebrow">Common questions</p><h2 id="use-case-faq">Before you begin</h2></div><div className="faqGrid">{faq.map(({question,answer})=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

      <section className="container finalCta"><div><p className="eyebrow">Start with your own voice</p><h2>Your next answer can be stronger.</h2><p>Preview a real prompt, then create an account for 3 complete AI reviews free each month.</p></div><TrackedLink className="button buttonLime" href={previewHref} event="primary_cta_clicked" properties={{ placement: "use_case_final", destination: "practice_preview" }}>Start practising <ArrowRight size={18}/></TrackedLink></section>
    </main>
    <Footer />
  </>;
}
