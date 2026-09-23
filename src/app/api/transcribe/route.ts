import OpenAI, { toFile } from "openai";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowedTypes = new Set(["audio/webm","audio/mp4","audio/mpeg","audio/wav","audio/ogg","audio/x-m4a"]);

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in to transcribe an answer." }, { status: 401 });
  const form = await request.formData();
  const audio = form.get("audio");
  if (!(audio instanceof File)) return NextResponse.json({ error: "No audio file received." }, { status: 400 });
  if (audio.size < 100 || audio.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Record between a few seconds and two minutes." }, { status: 413 });
  if (audio.type && !allowedTypes.has(audio.type)) return NextResponse.json({ error: "Unsupported audio format." }, { status: 415 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Voice transcription is not configured yet. Type your answer for now." }, { status: 503 });
  const supabase = await createClient();
  const { error: rateError } = await supabase.rpc("reserve_transcription");
  if (rateError) return NextResponse.json({ error: rateError.message.includes("rate_limited") ? "Too many recordings in a short time. Please wait and try again." : "Could not start transcription." }, { status: rateError.message.includes("rate_limited") ? 429 : 500 });
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const file = await toFile(Buffer.from(await audio.arrayBuffer()), audio.name || "answer.webm", { type: audio.type || "audio/webm" });
    const result = await client.audio.transcriptions.create({
      file,
      model: process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-transcribe",
      prompt: "Indian English career interview practice. Preserve names, company names, technical terms, and natural code-switching accurately.",
    });
    return NextResponse.json({ transcript: result.text }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "We could not transcribe that recording. Please retry or type your answer." }, { status: 502 });
  }
}
