import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const rpc = vi.fn();
const update = vi.fn();
const eq = vi.fn();
const from = vi.fn();

vi.mock("@/lib/auth", () => ({ getUser }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ rpc, from }) }));

describe("protected feedback endpoint", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    getUser.mockReset();rpc.mockReset();from.mockReset();update.mockReset();eq.mockReset();
    eq.mockResolvedValue({ error: null });update.mockReturnValue({ eq: () => ({ eq }) });from.mockReturnValue({ update });
  });

  it("does not allow anonymous inference", async () => {
    getUser.mockResolvedValue(null);
    const { POST } = await import("@/app/api/analyze/route");
    const response = await POST(new Request("https://www.careerspeak.tech/api/analyze", { method:"POST", body:JSON.stringify({ scenarioId:"hr_intro", answer:"This answer is comfortably longer than twenty characters." }) }));
    expect(response.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("preserves the database-enforced review quota", async () => {
    getUser.mockResolvedValue({ id:"user-1" });rpc.mockResolvedValue({ data:null, error:{ message:"quota_exceeded" } });
    const { POST } = await import("@/app/api/analyze/route");
    const response = await POST(new Request("https://www.careerspeak.tech/api/analyze", { method:"POST", body:JSON.stringify({ scenarioId:"hr_intro", answer:"This answer is comfortably longer than twenty characters." }) }));
    expect(response.status).toBe(402);
  });
});
