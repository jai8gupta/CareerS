import { beforeEach, describe, expect, it, vi } from "vitest";

const signUp = vi.fn();
const trackSignupCompleted = vi.fn();
const redirect = vi.fn((url:string) => { throw new Error(`REDIRECT:${url}`); });

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/env", () => ({ appUrl: () => "https://www.careerspeak.tech", isSupabaseConfigured: true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { signUp } }) }));
vi.mock("@/lib/server-analytics", () => ({ trackSignupCompleted }));

describe("signup action", () => {
  beforeEach(() => { signUp.mockReset();trackSignupCompleted.mockReset();redirect.mockClear(); });

  it("preserves a safe selected prompt after successful registration", async () => {
    signUp.mockResolvedValue({ error: null });
    const { signup } = await import("@/app/signup/actions");
    const form = new FormData();form.set("name","Jai");form.set("email","jai@example.com");form.set("password","strong-password");
    await expect(signup("", "/dashboard?scenario=hr_intro", form)).rejects.toThrow("REDIRECT:/login?");
    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({ options: expect.objectContaining({ emailRedirectTo: expect.stringContaining("scenario%3Dhr_intro") }) }));
    expect(trackSignupCompleted).toHaveBeenCalledWith("practice", "/dashboard?scenario=hr_intro");
  });

  it("returns a categorized, user-safe provider failure", async () => {
    signUp.mockResolvedValue({ error: { message: "User already registered" } });
    const { signup } = await import("@/app/signup/actions");
    const form = new FormData();form.set("name","Jai");form.set("email","jai@example.com");form.set("password","strong-password");
    await expect(signup("", "/dashboard", form)).rejects.toThrow("error_category=already_registered");
    expect(trackSignupCompleted).not.toHaveBeenCalled();
  });
});
