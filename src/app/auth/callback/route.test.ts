import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyOtp = vi.fn();
const exchangeCodeForSession = vi.fn();
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { verifyOtp, exchangeCodeForSession } }) }));

describe("auth callback", () => {
  beforeEach(() => { verifyOtp.mockReset();exchangeCodeForSession.mockReset(); });

  it("uses browser-independent token-hash verification and restores intent", async () => {
    verifyOtp.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const response = await GET(new Request("https://www.careerspeak.tech/auth/callback?token_hash=safehash&type=email&next=%2Fdashboard%3Fscenario%3Dhr_intro"));
    expect(verifyOtp).toHaveBeenCalledWith({ token_hash: "safehash", type: "email" });
    expect(response.headers.get("location")).toBe("https://www.careerspeak.tech/dashboard?scenario=hr_intro");
  });

  it("rejects an external return URL", async () => {
    verifyOtp.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const response = await GET(new Request("https://www.careerspeak.tech/auth/callback?token_hash=safehash&type=email&next=https%3A%2F%2Fevil.example"));
    expect(response.headers.get("location")).toBe("https://www.careerspeak.tech/dashboard");
  });

  it("turns a cross-browser PKCE miss into a useful login path", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: { code: "bad_code_verifier" } });
    const { GET } = await import("@/app/auth/callback/route");
    const response = await GET(new Request("https://www.careerspeak.tech/auth/callback?code=legacy&next=%2Fdashboard%3Fscenario%3Dhr_intro"));
    const location = new URL(response.headers.get("location") || "");
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("next")).toBe("/dashboard?scenario=hr_intro");
    expect(location.searchParams.get("message")).toContain("Sign in to continue");
  });
});
