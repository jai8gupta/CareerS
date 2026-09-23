"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function resetPassword(formData:FormData){const password=String(formData.get("password")||"");if(password.length<8)redirect("/auth/reset-password?error=Use+at+least+8+characters");const supabase=await createClient();const{error}=await supabase.auth.updateUser({password});if(error)redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`);redirect("/dashboard")}
