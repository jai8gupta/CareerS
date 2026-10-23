"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Mic2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { FunnelPageEvent, TrackedLink } from "@/components/analytics-events";
import { practiceReturnPath } from "@/lib/navigation";
import { SCENARIOS, type ScenarioId } from "@/lib/scenarios";
import { trackFunnel } from "@/lib/analytics";

const scenarioIds = Object.keys(SCENARIOS) as ScenarioId[];

const exampleFeedback = {
  worked: "You connect your experience directly to the role instead of listing your entire résumé.",
  improve: "Add one specific result that proves the strength you mention.",
  retry: "Keep the same idea, but structure it as background → proof → why this role.",
};

export function PracticePreview({ initialScenario = "hr_intro" }: { initialScenario?: ScenarioId }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenario);
  const scenario = SCENARIOS[scenarioId];
  const signupHref = useMemo(() => {
    const next = practiceReturnPath(scenarioId);
    return `/signup?next=${encodeURIComponent(next)}`;
  }, [scenarioId]);

  useEffect(() => {
    trackFunnel("practice_prompt_viewed", { scenario: scenarioId }, { once: `preview_prompt:${scenarioId}` });
  }, [scenarioId]);

  return (
    <>
      <FunnelPageEvent event="practice_preview_viewed" properties={{ scenario: initialScenario }} once={`practice_preview:${initialScenario}`} />
      <section className="previewHero container">
        <div className="previewIntro">
          <p className="eyebrow">Preview your first practice</p>
          <h1>Start with a real question—not a sales pitch.</h1>
          <p>Choose the career moment you want to rehearse. After creating a free account, CareerSpeak brings you straight back to this question.</p>
          <div className="previewTrust"><span><ShieldCheck size={17}/> No card required</span><span><CheckCircle2 size={17}/> 3 free AI reviews every month</span></div>
        </div>

        <div className="previewFlow" aria-label="CareerSpeak practice preview">
          <div className="previewScenarioTabs" aria-label="Choose a practice question">
            {scenarioIds.map((id) => (
              <button
                type="button"
                key={id}
                className={id === scenarioId ? "active" : ""}
                aria-pressed={id === scenarioId}
                onClick={() => setScenarioId(id)}
              >
                {SCENARIOS[id].track}
              </button>
            ))}
          </div>

          <article className="previewPromptCard">
            <span>{scenario.track} · Your selected question</span>
            <h2>{scenario.title}</h2>
            <p>{scenario.hint}</p>
          </article>

          <div className="previewActionRow">
            <div className="previewMic" aria-hidden="true"><Mic2 size={22}/></div>
            <div><strong>Speak for 30–120 seconds</strong><span>Recording starts only after signup and microphone permission.</span></div>
          </div>

          <div className="exampleFeedback">
            <div className="exampleLabel"><Sparkles size={16}/><span>Illustrative feedback preview</span></div>
            <div className="exampleFeedbackGrid">
              <article><strong>What worked</strong><p>{exampleFeedback.worked}</p></article>
              <article><strong>Improve next</strong><p>{exampleFeedback.improve}</p></article>
            </div>
            <div className="retryPreview"><RefreshCw size={17}/><p><strong>Retry:</strong> {exampleFeedback.retry}</p></div>
          </div>

          <TrackedLink
            className="button buttonLime previewPrimaryCta"
            href={signupHref}
            event="practice_preview_cta_clicked"
            properties={{ scenario: scenarioId }}
          >
            Create free account and start speaking <ArrowRight size={18}/>
          </TrackedLink>
          <p className="previewFinePrint">Your question is saved through signup. AI endpoints and free-review limits remain protected.</p>
        </div>
      </section>
    </>
  );
}
