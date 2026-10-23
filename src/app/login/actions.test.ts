import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const redirect = vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); });

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/env", () => ({ isSupabaseConfigured: true }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { signInWithPassword } }) }));

describe("login action", () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    redirect.mockClear();
  });

  it("returns an existing user to the selected scenario", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const { login } = await import("@/app/login/actions");
    const form = new FormData();
    form.set("email", "jai@example.com");
    form.set("password", "strong-password");
    form.set("next", "/dashboard?scenario=delayed_update&utm_source=instagram");

    await expect(login(form)).rejects.toThrow("REDIRECT:/dashboard?scenario=delayed_update&utm_source=instagram");
  });

  it("rejects an external return path after successful login", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const { login } = await import("@/app/login/actions");
    const form = new FormData();
    form.set("email", "jai@example.com");
    form.set("password", "strong-password");
    form.set("next", "https://evil.example/steal");

    await expect(login(form)).rejects.toThrow("REDIRECT:/dashboard");
  });
});
