import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { loginHref } from "@/lib/navigation";

export async function getUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function requireUser(returnPath = "/dashboard") {
  const user = await getUser();
  if (!user) redirect(loginHref(returnPath));
  return user;
}
