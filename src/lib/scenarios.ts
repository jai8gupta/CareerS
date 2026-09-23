export const SCENARIOS = {
  hr_intro: {
    id: "hr_intro",
    track: "HR interview",
    title: "Tell me about yourself and why you’re interested in this role.",
    hint: "Connect your background, strongest proof, and motivation in 60–90 seconds.",
  },
  technical_story: {
    id: "technical_story",
    track: "Technical interview",
    title: "Explain a difficult technical problem you solved.",
    hint: "Set the context, explain your decisions, then share a measurable result.",
  },
  delayed_update: {
    id: "delayed_update",
    track: "Workplace",
    title: "Give your manager an update about work that is behind schedule.",
    hint: "State the status, cause, impact, and the next action you recommend.",
  },
  unhappy_client: {
    id: "unhappy_client",
    track: "Client conversations",
    title: "A client is unhappy with a delay. Respond calmly and propose a next step.",
    hint: "Acknowledge the concern, take ownership, and give a specific recovery plan.",
  },
  presentation_open: {
    id: "presentation_open",
    track: "Presentations",
    title: "Open a presentation proposing one practical improvement for your team.",
    hint: "Lead with the problem, recommendation, and benefit to your audience.",
  },
} as const;

export type ScenarioId = keyof typeof SCENARIOS;
export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && value in SCENARIOS;
}
