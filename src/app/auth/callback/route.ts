import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeReturnPath } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "signup",
  "recovery",
  "invite",
  "magiclink",
  "email_change",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeReturnPath(url.searchParams.get("next"));

  const supabase = await createClient();

  // Token-hash links do not depend on a PKCE verifier cookie, so they keep
  // working when signup starts in an in-app browser and the email opens in a
  // different browser.
  if (tokenHash && type && emailOtpTypes.has(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    console.warn("auth_callback_failed", { mode: "token_hash", category: error.code || "unknown" });
  }

  // Keep supporting existing emails and OAuth callbacks that use PKCE.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    console.warn("auth_callback_failed", { mode: "pkce", category: error.code || "unknown" });

    // Supabase may already have confirmed the address before redirecting here.
    // If this browser does not have the original PKCE cookie, let the user sign
    // in normally instead of claiming that confirmation failed.
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("message", "Email link opened. Sign in to continue.");
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/login?error=This+email+link+is+invalid+or+has+expired", url.origin));
}
