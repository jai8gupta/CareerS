import type { Metadata } from "next";
import { UseCasePage } from "@/components/use-case-page";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Workplace English Practice for Indian Professionals",
  description: "Practise stand-ups, client calls, presentations and technical explanations in English. Get actionable AI feedback and communicate more clearly at work.",
  path: "/workplace-english-practice",
});

const scenarios = [
  { title: "Give a concise daily stand-up", copy: "Explain what changed, what comes next and where you are blocked without burying the important point." },
  { title: "Update a client about a delay", copy: "Communicate the issue, impact and recovery plan with ownership and a calm professional tone." },
  { title: "Explain a technical decision", copy: "Turn specialist detail into a clear recommendation for a manager, customer or non-technical teammate." },
  { title: "Open a presentation", copy: "Start with a useful frame, establish why the topic matters and guide the audience toward the main idea." },
];

const outcomes = [
  { title: "Concise updates", copy: "Separate context from the decision or action so busy colleagues understand the point quickly." },
  { title: "Audience-aware explanations", copy: "Identify jargon and missing context that make technical or operational updates difficult to follow." },
  { title: "Professional assertiveness", copy: "Practise stating risks, recommendations and boundaries directly without becoming abrupt or apologetic." },
  { title: "Natural workplace English", copy: "Improve clarity and structure while keeping your own voice instead of copying formal textbook phrases." },
];

const faq = [
  { question: "Is CareerSpeak an English grammar course?", answer: "No. CareerSpeak focuses on using English in specific professional moments. Feedback prioritises clarity, structure and relevance, with language suggestions when they help the listener." },
  { question: "Can I practise technical communication?", answer: "Yes. Technical explanations are a core track. You can practise explaining a decision, incident, project or trade-off to different workplace audiences." },
  { question: "Can I type instead of using the microphone?", answer: "Yes. Typed practice is available, although speaking aloud gives you a more realistic rehearsal for calls, meetings and presentations." },
  { question: "Can I use Hinglish while practising?", answer: "You can speak naturally while practising. The coaching helps you move toward clearer professional English without treating occasional Hindi words as a failure." },
];

export default function WorkplaceEnglishPage(){return <UseCasePage path="/workplace-english-practice" eyebrow="Workplace English practice" title="Practise the conversations that shape your career." lead="Rehearse stand-ups, client updates, technical explanations and presentations before the real meeting. CareerSpeak turns vague advice like ‘communicate better’ into one specific improvement you can retry." highlights={["Built around real work situations","Clarity over accent","Speak or type naturally"]} scenarioHeading="Build confidence in everyday professional moments" scenarioLead="Choose the conversation ahead of you and practise language in context instead of completing disconnected grammar exercises." scenarios={scenarios} outcomeHeading="Make every message easier to act on" outcomeLead="Useful workplace communication is clear, relevant and suited to the listener. CareerSpeak shows you where those qualities break down." outcomes={outcomes} steps={["Choose a workplace conversation or presentation prompt.","Respond as if you were speaking to the real audience.","Review the parts that were clear, vague or overloaded.","Retry with a sharper structure and more direct language."]} faq={faq} relatedHref="/ai-interview-practice" relatedLabel="Preparing for an interview? Practise answers here"/>}
