"use server";

import { redirect } from "next/navigation";
import { appUrl, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function signup(requestedPlan: string, formData: FormData) {
  const tier = ["sprint", "monthly", "annual"].includes(requestedPlan) ? requestedPlan : "";
  const retrySuffix = tier ? `&tier=${tier}` : "";
  if (!isSupabaseConfigured) redirect(`/signup?error=Connect+Supabase+to+enable+accounts${retrySuffix}`);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = tier ? `/pricing?checkout=${tier}` : "/dashboard";
  if (name.length < 2) redirect(`/signup?error=Please+enter+your+name${retrySuffix}`);
  if (password.length < 8) redirect(`/signup?error=Use+at+least+8+characters+for+your+password${retrySuffix}`);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${appUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}${retrySuffix}`);
  redirect("/login?message=Check+your+email+to+confirm+your+account");
}
