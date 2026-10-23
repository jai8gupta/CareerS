import { describe, expect, it } from "vitest";
import { FREE_PLAN, planBenefits, PLANS } from "@/lib/plans";

describe("pricing entitlement presentation", () => {
  it("matches the database-enforced free allowance", () => {
    expect(FREE_PLAN).toMatchObject({ reviews: 3, reviewPeriod: "calendar month" });
  });

  it("presents paid quotas, durations, and track access from plan configuration", () => {
    expect(planBenefits("sprint")).toEqual(["10 AI reviews", "7 days of access", "All career tracks", "Progress history"]);
    expect(planBenefits("monthly")).toContain(`${PLANS.monthly.durationDays} days of access`);
    expect(planBenefits("annual")).toEqual(["25 AI reviews per calendar month", "366 days of access", "All career tracks", "Monthly review allowance resets"]);
  });
});
