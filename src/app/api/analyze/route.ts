import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { FeedbackSchema, fallbackFeedback } from "@/lib/feedback";
import { isScenarioId, SCENARIOS } from "@/lib/scenarios";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RequestSchema = z.object({ scenarioId: z.string(), answer: z.string().trim().min(20).max(4000) });

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in to get feedback." }, { status: 401 });
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isScenarioId(parsed.data.scenarioId)) return NextResponse.json({ error: "Choose a valid prompt and answer." }, { status: 400 });
  const { scenarioId, answer } = parsed.data;
  const scenario = SCENARIOS[scenarioId];
  const supabase = await createClient();
  const { data: sessionId, error: quotaError } = await supabase.rpc("start_practice_session", { p_scenario_id: scenarioId, p_transcript: answer });
  if (quotaError) {
    const quotaExceeded = quotaError.message.includes("quota_exceeded");
    return NextResponse.json({ error: quotaExceeded ? "You’ve used your current AI-review allowance." : "Could not start this review." }, { status: quotaExceeded ? 402 : 500 });
  }
  try {
    let feedback = fallbackFeedback(answer);
    if (process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.parse({
        model: process.env.OPENAI_FEEDBACK_MODEL || "gpt-6-luna",
        reasoning: { effort: "none" },
        input: [
          { role: "system", content: "You are a precise, encouraging career communication coach for Indian students and early-career professionals. Judge the answer, not the speaker's accent. Do not penalise Indian English when it is clear. Be specific, brief, and practical. The stronger answer must preserve the user's facts and must never invent employers, numbers, achievements, or qualifications. Explain one improvement in friendly Hinglish using Roman script." },
          { role: "user", content: `Career scenario: ${scenario.track}\nPrompt: ${scenario.title}\nUser answer: ${answer}` },
        ],
        text: { format: zodTextFormat(FeedbackSchema, "career_feedback") },
      });
      if (response.output_parsed) feedback = response.output_parsed;
    }
    const { error: saveError } = await supabase.from("practice_sessions").update({ status: "completed", scores: feedback, overall_score: feedback.overall, completed_at: new Date().toISOString() }).eq("id", sessionId).eq("user_id", user.id);
    if (saveError) throw saveError;
    return NextResponse.json({ feedback }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    await supabase.from("practice_sessions").update({ status: "failed" }).eq("id", sessionId).eq("user_id", user.id);
    return NextResponse.json({ error: "Feedback is temporarily unavailable. Your review credit was not used." }, { status: 502 });
  }
}
