import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PracticePreview } from "@/components/practice-preview";
import { SiteHeader } from "@/components/site-header";
import { campaignAttributionFromSearchParams, practiceSignupHref } from "@/lib/navigation";
import { isScenarioId } from "@/lib/scenarios";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Preview Your First Interview Practice",
  description: "Choose a real interview or workplace question, see how CareerSpeak reviews your answer, and start with 3 free AI reviews.",
  path: "/practice-preview",
});

export default async function PracticePreviewPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const initialScenario = isScenarioId(params.scenario) ? params.scenario : "hr_intro";
  const currentSearchParams = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => value ? [[key, value]] : []),
  );
  const signupHref = practiceSignupHref(
    initialScenario,
    campaignAttributionFromSearchParams(currentSearchParams),
  );
  return <><SiteHeader ctaHref={signupHref} ctaLabel="Join free" ctaDestination="signup"/><main className="previewMain"><PracticePreview initialScenario={initialScenario}/></main><Footer/></>;
}
