"use server";

import { redirect } from "next/navigation";
import { authErrorMessage, classifyAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { safeReturnPath } from "@/lib/navigation";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) redirect("/login?error=Connect+Supabase+to+enable+sign+in");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeReturnPath(String(formData.get("next") || "/dashboard"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const category = classifyAuthError(error.message);
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(category, "login"))}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}
