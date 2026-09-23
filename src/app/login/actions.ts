"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) redirect("/login?error=Connect+Supabase+to+enable+sign+in");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const requested = String(formData.get("next") || "/dashboard");
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect(next);
}
