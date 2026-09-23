"use server";
import { redirect } from "next/navigation";
import { appUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function requestReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${appUrl()}/auth/callback?next=/auth/reset-password` });
  redirect("/login?message=If+that+email+exists,+a+reset+link+is+on+its+way");
}
