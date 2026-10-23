import { describe, expect, it } from "vitest";
import { attributedHref, loginHref, practicePreviewHref, practicePreviewSelectionHref, practiceReturnPath, practiceSignupHref, safeReturnPath, sanitizeCampaignValue, scenarioFromReturnPath } from "@/lib/navigation";

describe("safeReturnPath", () => {
  it("preserves an internal path and query", () => {
    expect(safeReturnPath("/dashboard?scenario=hr_intro")).toBe("/dashboard?scenario=hr_intro");
  });

  it("rejects absolute and protocol-relative redirects", () => {
    expect(safeReturnPath("https://evil.example/path")).toBe("/dashboard");
    expect(safeReturnPath("//evil.example/path")).toBe("/dashboard");
  });

  it("builds a safe login handoff without allowing open redirects", () => {
    expect(loginHref("/dashboard?scenario=delayed_update")).toBe("/login?next=%2Fdashboard%3Fscenario%3Ddelayed_update");
    expect(loginHref("https://evil.example/steal")).toBe("/login?next=%2Fdashboard");
  });
});

describe("practice intent", () => {
  it("round-trips a valid scenario", () => {
    const path = practiceReturnPath("technical_story", { utm_source: "instagram" });
    expect(scenarioFromReturnPath(path)).toBe("technical_story");
    expect(path).toContain("utm_source=instagram");
  });

  it("builds contextual preview routes for acquisition pages", () => {
    expect(practicePreviewHref("hr_intro")).toBe("/practice-preview?scenario=hr_intro");
    expect(practicePreviewHref("delayed_update")).toBe("/practice-preview?scenario=delayed_update");
  });

  it("preserves campaign context when a visitor selects another preview question", () => {
    const current = new URLSearchParams({ scenario: "hr_intro", utm_source: "instagram" });
    expect(practicePreviewSelectionHref(current, "delayed_update")).toBe("/practice-preview?scenario=delayed_update&utm_source=instagram");
  });

  it("builds a signup handoff that restores the selected question", () => {
    const href = practiceSignupHref("delayed_update", { utm_source: "instagram" });
    const signup = new URL(href, "https://careerspeak.local");
    expect(signup.pathname).toBe("/signup");
    expect(signup.searchParams.get("next")).toBe("/dashboard?scenario=delayed_update&utm_source=instagram");
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
