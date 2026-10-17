export const PLANS = {
  sprint: {
    id: "sprint",
    name: "Interview Sprint",
    price: 39,
    displayPrice: "₹39",
    cadence: "one time",
    description: "Seven focused days before the interview.",
    reviews: 10,
    durationDays: 7,
    kind: "order",
  },
  monthly: {
    id: "monthly",
    name: "Pro Monthly",
    price: 79,
    displayPrice: "₹79",
    cadence: "/month",
    description: "Build a consistent speaking habit.",
    reviews: 25,
    durationDays: 31,
    kind: "subscription",
  },
  annual: {
    id: "annual",
    name: "Pro Annual",
    price: 599,
    displayPrice: "₹599",
    cadence: "/year",
    description: "The lowest price for long-term progress.",
    reviews: 25,
    durationDays: 366,
    kind: "subscription",
  },
} as const;

export type PlanId = keyof typeof PLANS;
export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}
