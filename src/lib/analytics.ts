"use client";

import { track } from "@vercel/analytics";
import { campaignKeys, sanitizeCampaignValue, type CampaignAttribution } from "@/lib/navigation";

type Primitive = string | number | boolean | null;
type FunnelEventMap = {
  landing_viewed: { page: "home" };
  primary_cta_clicked: { placement: "hero" | "header" | "final"; destination: "practice_preview" };
  practice_preview_viewed: { scenario: string };
  practice_preview_cta_clicked: { scenario: string };
  signup_page_viewed: { intent: "practice" | "plan" | "general" };
  signup_form_started: { intent: "practice" | "plan" | "general" };
  signup_submitted: { intent: "practice" | "plan" | "general" };
  signup_failed: { category: string };
  signup_completed: { intent: "practice" | "plan" | "general" };
  practice_prompt_viewed: { scenario: string };
  microphone_permission_result: { result: "granted" | "denied" | "not_found" | "busy" | "unsupported" | "unknown" };
  practice_started: { scenario: string; method: "voice" };
  practice_submitted: { scenario: string; method: "voice" | "typed" };
  practice_failed: { stage: "permission" | "transcription" | "feedback"; category: string };
  feedback_ready: { scenario: string };
  feedback_viewed: { scenario: string };
  practice_retried: { scenario: string };
  pricing_viewed: { signed_in: boolean };
  checkout_started: { plan: string; kind: "order" | "subscription" };
  purchase_verified: { plan: string; kind: "order" | "subscription" };
};

const attributionKey = "careerspeak_campaign_attribution";
const eventPrefix = "careerspeak_event:";

function analyticsAllowed() {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return false;
  return navigator.doNotTrack !== "1";
}

export function captureCampaignAttribution(searchParams: URLSearchParams) {
  if (typeof window === "undefined") return;
  const attribution: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const value = sanitizeCampaignValue(searchParams.get(key));
    if (value) attribution[key] = value;
  }
  if (Object.keys(attribution).length) sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
}

function storedAttribution(): Record<string, Primitive> {
  if (typeof window === "undefined") return {};
  try {
    const stored = JSON.parse(sessionStorage.getItem(attributionKey) || "{}") as CampaignAttribution;
    return Object.fromEntries(campaignKeys.flatMap((key) => {
      const value = sanitizeCampaignValue(stored[key]);
      return value ? [[key, value]] : [];
    }));
  } catch {
    return {};
  }
}

export function trackFunnel<Event extends keyof FunnelEventMap>(
  event: Event,
  properties: FunnelEventMap[Event],
  options: { once?: string } = {},
) {
  if (!analyticsAllowed()) return;
  if (options.once) {
    const key = `${eventPrefix}${options.once}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  }
  track(event, { ...storedAttribution(), ...properties });
}
