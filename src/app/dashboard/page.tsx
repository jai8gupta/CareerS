import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard-header";
import { PracticeStudio } from "@/components/practice-studio";
import { requireUser } from "@/lib/auth";
import { isPlanId, PLANS } from "@/lib/plans";
import { isScenarioId } from "@/lib/scenarios";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Practice", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();
  const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0,0,0,0);
  const { data: subscription } = await supabase.from("subscriptions").select("plan_id,status,current_period_start,current_period_end").eq("user_id", user.id).in("status", ["active","authenticated"]).order("current_period_end", { ascending: false }).limit(1).maybeSingle();
  const planId = isPlanId(subscription?.plan_id) ? subscription.plan_id : "free";
  const usageStart = (planId === "sprint" || planId === "monthly") && subscription?.current_period_start ? new Date(subscription.current_period_start) : monthStart;
  const { count } = await supabase.from("practice_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", usageStart.toISOString());
  const allowance = planId === "free" ? 3 : PLANS[planId].reviews;
  const used = count || 0;
  const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "there").split(" ")[0];
  const initialScenarioId = isScenarioId(params.scenario) ? params.scenario : "hr_intro";
  return <div className="dashboardShell"><DashboardHeader planName={planId === "free" ? "Free" : planId === "sprint" ? "Sprint" : "Pro"}/><main className="container dashboardMain"><section className="dashIntro"><div><p className="eyebrow">Today’s five-minute practice</p><h1>Ready, {name}?</h1><p>Speak → Get feedback → Improve → Retry</p></div><div className="usageCard"><div><span>AI reviews this month</span><strong>{used} / {allowance}</strong></div><div className="miniBar"><i style={{width:`${Math.min(100,(used/allowance)*100)}%`}}/></div></div></section><PracticeStudio remaining={Math.max(0, allowance-used)} initialScenarioId={initialScenarioId}/></main></div>;
}
