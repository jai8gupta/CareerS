import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const getHeaders = vi.fn();

vi.mock("@vercel/analytics/server", () => ({ track: send }));
vi.mock("next/headers", () => ({ headers: getHeaders }));

describe("server funnel analytics", () => {
  beforeEach(() => {
    send.mockReset();
    getHeaders.mockReset();
    getHeaders.mockResolvedValue(new Headers({ "user-agent": "test" }));
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  });

  it("emits server-authoritative signup completion with sanitized attribution", async () => {
    const { trackSignupCompleted } = await import("@/lib/server-analytics");
    await trackSignupCompleted("practice", "/dashboard?scenario=hr_intro&utm_source=instagram&utm_campaign=%3Cscript%3E");

    expect(send).toHaveBeenCalledWith(
      "signup_completed",
      { intent: "practice", utm_source: "instagram" },
      { headers: expect.any(Headers) },
    );
  });

  it("honours Do Not Track", async () => {
    getHeaders.mockResolvedValue(new Headers({ dnt: "1" }));
    const { trackSignupCompleted } = await import("@/lib/server-analytics");
    await trackSignupCompleted("general", "/dashboard");
    expect(send).not.toHaveBeenCalled();
  });
});
