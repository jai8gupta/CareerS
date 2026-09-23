export const PLANS = {
  sprint: {
    id: "sprint",
    name: "Interview Sprint",
    price: 149,
    displayPrice: "₹149",
    cadence: "one time",
    description: "Seven focused days before the interview.",
    reviews: 30,
    durationDays: 7,
    kind: "order",
  },
  monthly: {
    id: "monthly",
    name: "Pro Monthly",
    price: 299,
    displayPrice: "₹299",
    cadence: "/month",
    description: "Build a consistent speaking habit.",
    reviews: 60,
    durationDays: 31,
    kind: "subscription",
  },
  annual: {
    id: "annual",
    name: "Pro Annual",
    price: 1599,
    displayPrice: "₹1,599",
    cadence: "/year",
    description: "The lowest price for long-term progress.",
    reviews: 720,
    durationDays: 366,
    kind: "subscription",
  },
} as const;

export type PlanId = keyof typeof PLANS;
export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}
