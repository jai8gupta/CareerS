"use server";

import { redirect } from "next/navigation";
import { authErrorMessage, classifyAuthError } from "@/lib/auth-errors";
import { appUrl, isSupabaseConfigured } from "@/lib/env";
import { safeReturnPath } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(requestedPlan: string, requestedNext: string, formData: FormData) {
  const tier = ["sprint", "monthly", "annual"].includes(requestedPlan) ? requestedPlan : "";
  const defaultNext = tier ? `/pricing?checkout=${tier}` : "/dashboard";
  const next = safeReturnPath(requestedNext, defaultNext);
  const retry = new URLSearchParams();
  if (tier) retry.set("tier", tier);
  if (next !== "/dashboard") retry.set("next", next);
  const retrySuffix = retry.size ? `&${retry.toString()}` : "";
  if (!isSupabaseConfigured) redirect(`/signup?error=Connect+Supabase+to+enable+accounts${retrySuffix}`);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (name.length < 2) redirect(`/signup?error=Please+enter+your+name${retrySuffix}`);
  if (password.length < 8) redirect(`/signup?error=Use+at+least+8+characters+for+your+password${retrySuffix}`);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${appUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) {
    const category = classifyAuthError(error.message);
    redirect(`/signup?error=${encodeURIComponent(authErrorMessage(category, "signup"))}&error_category=${category}${retrySuffix}`);
  }
  const completed = new URLSearchParams({ message: "Check your email to confirm your account", registration: "completed", next });
  redirect(`/login?${completed.toString()}`);
}
