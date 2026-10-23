import { describe, expect, it } from "vitest";
import { attributedHref, practiceReturnPath, safeReturnPath, sanitizeCampaignValue, scenarioFromReturnPath } from "@/lib/navigation";

describe("safeReturnPath", () => {
  it("preserves an internal path and query", () => {
    expect(safeReturnPath("/dashboard?scenario=hr_intro")).toBe("/dashboard?scenario=hr_intro");
  });

  it("rejects absolute and protocol-relative redirects", () => {
    expect(safeReturnPath("https://evil.example/path")).toBe("/dashboard");
    expect(safeReturnPath("//evil.example/path")).toBe("/dashboard");
  });
});

describe("practice intent", () => {
  it("round-trips a valid scenario", () => {
    const path = practiceReturnPath("technical_story", { utm_source: "instagram" });
    expect(scenarioFromReturnPath(path)).toBe("technical_story");
    expect(path).toContain("utm_source=instagram");
  });

  it("does not accept an unknown scenario", () => {
    expect(scenarioFromReturnPath("/dashboard?scenario=unknown")).toBeNull();
  });

  it("preserves sanitized campaign attribution in signup and return paths", () => {
    const params = new URLSearchParams({ utm_source: "instagram", utm_campaign: "freshers launch" });
    const href = attributedHref("/signup?next=%2Fdashboard%3Fscenario%3Dhr_intro", params);
    const outer = new URL(href, "https://careerspeak.local");
    expect(outer.searchParams.get("utm_source")).toBe("instagram");
    expect(outer.searchParams.get("next")).toContain("utm_campaign=freshers+launch");
  });

  it("drops suspicious campaign values", () => {
    expect(sanitizeCampaignValue("<script>alert(1)</script>")).toBe("");
  });
});
