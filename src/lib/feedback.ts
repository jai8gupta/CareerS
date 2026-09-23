import { z } from "zod";

export const FeedbackSchema = z.object({
  overall: z.number().int().min(0).max(100),
  clarity: z.number().int().min(0).max(100),
  structure: z.number().int().min(0).max(100),
  relevance: z.number().int().min(0).max(100),
  fillers: z.number().int().min(0).max(100),
  headline: z.string().min(3).max(100),
  summary: z.string().min(10).max(300),
  worked: z.string().min(10).max(300),
  improve: z.string().min(10).max(300),
  betterAnswer: z.string().min(20).max(1200),
  hinglishTip: z.string().min(5).max(240),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export function fallbackFeedback(answer: string): Feedback {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const fillers = answer.match(/\b(um+|uh+|like|basically|actually|you know|sort of|kind of)\b/gi) || [];
  const connectors = answer.match(/\b(first|then|because|result|finally|during|after|so that|which|while)\b/gi) || [];
  const clarity = Math.max(52, Math.min(94, 82 - fillers.length * 4 + (words.length > 45 ? 6 : 0)));
  const structure = Math.max(48, Math.min(94, 58 + connectors.length * 5));
  const relevance = words.length > 35 ? 80 : 68;
  const overall = Math.round(clarity * .4 + structure * .35 + relevance * .25);
  return {
    overall, clarity, structure, relevance, fillers: fillers.length,
    headline: overall >= 80 ? "Strong answer. Make it memorable." : "Good foundation. Now make it sharper.",
    summary: "Your main idea is clear. Add one concrete example and its measurable result to make the answer more credible.",
    worked: "You answered directly and used straightforward professional language.",
    improve: fillers.length > 2 ? "Replace filler words with a short pause, then stress the result of your example." : "Use a simple context, action, and result structure.",
    betterAnswer: answer,
    hinglishTip: "Pehle context, phir aapne kya action liya, aur end mein exact result — bas in teen parts mein answer rakho.",
  };
}
