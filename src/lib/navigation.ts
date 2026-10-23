import { isScenarioId, type ScenarioId } from "@/lib/scenarios";

export const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type CampaignKey = (typeof campaignKeys)[number];
export type CampaignAttribution = Partial<Record<CampaignKey, string>>;

export function sanitizeCampaignValue(value: string | null | undefined) {
  if (!value) return "";
  const normalized = value.trim().slice(0, 80);
  return /^[a-zA-Z0-9._ -]+$/.test(normalized) ? normalized : "";
}

export function campaignAttributionFromSearchParams(searchParams: URLSearchParams) {
  const attribution: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const value = sanitizeCampaignValue(searchParams.get(key));
    if (value) attribution[key] = value;
  }
  return attribution;
}

export function safeReturnPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.length > 800) return fallback;
  try {
    const parsed = new URL(value, "https://careerspeak.local");
    if (parsed.origin !== "https://careerspeak.local") return fallback;
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

export function loginHref(returnPath: string) {
  return `/login?next=${encodeURIComponent(safeReturnPath(returnPath))}`;
}

export function scenarioFromReturnPath(value: string | null | undefined): ScenarioId | null {
  const path = safeReturnPath(value, "");
  if (!path) return null;
  const scenario = new URL(path, "https://careerspeak.local").searchParams.get("scenario");
  return isScenarioId(scenario) ? scenario : null;
}

export function practiceReturnPath(scenario: ScenarioId, attribution: CampaignAttribution = {}) {
  const params = new URLSearchParams({ scenario });
  for (const key of campaignKeys) {
    const value = sanitizeCampaignValue(attribution[key]);
    if (value) params.set(key, value);
  }
  return `/dashboard?${params.toString()}`;
}

export function practicePreviewHref(scenario: ScenarioId) {
  return `/practice-preview?scenario=${scenario}`;
}

export function practicePreviewSelectionHref(searchParams: URLSearchParams, scenario: ScenarioId) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("scenario", scenario);
  return `/practice-preview?${params.toString()}`;
}

export function practiceSignupHref(scenario: ScenarioId, attribution: CampaignAttribution = {}) {
  return `/signup?next=${encodeURIComponent(practiceReturnPath(scenario, attribution))}`;
}

export function attributedHref(href: string, searchParams: URLSearchParams) {
  const parsed = new URL(href, "https://careerspeak.local");
  const attribution: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const value = sanitizeCampaignValue(searchParams.get(key));
    if (value) {
      attribution[key] = value;
      parsed.searchParams.set(key, value);
    }
  }

  const next = parsed.searchParams.get("next");
  if (next) {
    const safeNext = safeReturnPath(next, "");
    if (safeNext) {
      const nextUrl = new URL(safeNext, "https://careerspeak.local");
      for (const key of campaignKeys) {
        const value = attribution[key];
        if (value) nextUrl.searchParams.set(key, value);
      }
      parsed.searchParams.set("next", `${nextUrl.pathname}${nextUrl.search}`);
    }
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
