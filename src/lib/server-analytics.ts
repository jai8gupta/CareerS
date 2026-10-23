import { track } from "@vercel/analytics/server";
import { headers } from "next/headers";
import { campaignKeys, safeReturnPath, sanitizeCampaignValue } from "@/lib/navigation";

export async function trackSignupCompleted(
  intent: "practice" | "plan" | "general",
  returnPath: string,
) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return;
  const requestHeaders = await headers();
  if (requestHeaders.get("dnt") === "1") return;

  const url = new URL(safeReturnPath(returnPath), "https://careerspeak.local");
  const attribution = Object.fromEntries(campaignKeys.flatMap((key) => {
    const value = sanitizeCampaignValue(url.searchParams.get(key));
    return value ? [[key, value]] : [];
  }));

  await track("signup_completed", { intent, ...attribution }, { headers: requestHeaders });
}
