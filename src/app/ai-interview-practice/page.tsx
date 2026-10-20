import type { Metadata } from "next";
import { UseCasePage } from "@/components/use-case-page";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "AI Interview Practice for Clearer, Stronger Answers",
  description: "Practise HR and behavioural interview answers aloud. Get instant AI feedback on structure, relevance, clarity and fillers, then retry with confidence.",
  path: "/ai-interview-practice",
});

const scenarios = [
  { title: "Tell me about yourself", copy: "Build a concise career story that connects your experience to the role instead of reciting your résumé." },
  { title: "Tell me about a difficult stakeholder", copy: "Practise a behavioural answer with a clear situation, action and result that a recruiter can follow." },
  { title: "Why should we hire you?", copy: "Connect your strongest evidence to the employer’s need without sounding memorised or generic." },
  { title: "Explain a project you’re proud of", copy: "Make technical work understandable while keeping your ownership and measurable contribution clear." },
];

const outcomes = [
  { title: "Clear answer structure", copy: "See whether the listener can follow your opening, evidence and conclusion without getting lost." },
  { title: "Relevant evidence", copy: "Spot generic claims and strengthen them with decisions, actions, outcomes and numbers where appropriate." },
  { title: "Confident delivery", copy: "Notice filler-heavy or hesitant sections and retry the same answer while the improvement is obvious." },
  { title: "A stronger version", copy: "Use an improved example as a guide, not a script, then say the answer again in your own words." },
];

const faq = [
  { question: "Is CareerSpeak useful for freshers?", answer: "Yes. Freshers can practise introductions, internships, academic projects, strengths and situational questions. The feedback focuses on how clearly you connect your experience to the role." },
  { question: "Is this a complete mock interview?", answer: "CareerSpeak is focused answer rehearsal rather than a live human interview. You choose a prompt, answer aloud, review targeted feedback and retry immediately." },
  { question: "Does CareerSpeak judge my accent?", answer: "No. The goal is understandable, relevant and well-structured communication—not replacing your natural accent." },
  { question: "How long should each answer be?", answer: "Most practice answers work well between 30 and 120 seconds. The prompt and context should decide the exact length." },
];

export default function InterviewPracticePage(){return <UseCasePage path="/ai-interview-practice" eyebrow="AI interview practice" title="Practise the interview answer before it matters." lead="Say the answer aloud, see where it loses clarity or relevance, and retry while the lesson is fresh. CareerSpeak helps Indian professionals turn experience into answers recruiters can follow and remember." highlights={["HR and behavioural prompts","Spoken or typed answers","3 complete reviews free"]} scenarioHeading="Prepare for the questions that shape the interview" scenarioLead="Rehearse the substance of your answer—not a memorised script—across common HR, behavioural and project discussions." scenarios={scenarios} outcomeHeading="Know exactly what weakened the answer" outcomeLead="CareerSpeak breaks feedback into practical dimensions so you know what to change on the next attempt." outcomes={outcomes} steps={["Choose the interview situation you want to rehearse.","Answer naturally for 30–120 seconds.","Review clarity, structure, relevance and filler feedback.","Retry the same answer with one deliberate improvement."]} faq={faq} relatedHref="/workplace-english-practice" relatedLabel="Also explore workplace English practice"/>}
