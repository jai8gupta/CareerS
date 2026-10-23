import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("@vercel/analytics", () => ({ track: send }));

const values = new Map<string,string>();
const storage = {
  getItem: (key:string) => values.get(key) ?? null,
  setItem: (key:string,value:string) => { values.set(key,value); },
  removeItem: (key:string) => { values.delete(key); },
  clear: () => values.clear(),
  key: (index:number) => [...values.keys()][index] ?? null,
  get length() { return values.size; },
};

describe("funnel analytics", () => {
  beforeEach(() => {
    send.mockClear();values.clear();
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", { doNotTrack: "0" });
    vi.stubGlobal("sessionStorage", storage);
  });

  it("emits sanitized attribution and deduplicates once-only events", async () => {
    const { captureCampaignAttribution, trackFunnel } = await import("@/lib/analytics");
    captureCampaignAttribution(new URLSearchParams({ utm_source: "instagram", utm_campaign: "launch", utm_term: "private search" }));
    trackFunnel("landing_viewed", { page: "home" }, { once: "home" });
    trackFunnel("landing_viewed", { page: "home" }, { once: "home" });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith("landing_viewed", { utm_source: "instagram", utm_campaign: "launch", page: "home" });
  });

  it("honours browser Do Not Track", async () => {
    vi.stubGlobal("navigator", { doNotTrack: "1" });
    const { trackFunnel } = await import("@/lib/analytics");
    trackFunnel("landing_viewed", { page: "home" });
    expect(send).not.toHaveBeenCalled();
  });
});
