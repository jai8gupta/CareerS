"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Code2, MessageSquareText, Mic2, Presentation, RefreshCw, Square, Users } from "lucide-react";
import { SCENARIOS, type ScenarioId } from "@/lib/scenarios";

type Feedback = { overall:number; clarity:number; structure:number; relevance:number; fillers:number; headline:string; summary:string; worked:string; improve:string; betterAnswer:string };
const scenarioIds = Object.keys(SCENARIOS) as ScenarioId[];
const icons = { hr_intro:Users, technical_story:Code2, delayed_update:BriefcaseBusiness, unhappy_client:MessageSquareText, presentation_open:Presentation };
const recorderMimeTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"];

function preferredRecorderMimeType() {
  return recorderMimeTypes.find(type => MediaRecorder.isTypeSupported(type));
}

function extensionForMimeType(mimeType:string) {
  const type=mimeType.split(";",1)[0].toLowerCase();
  if(type==="audio/mp4"||type==="audio/x-m4a")return "m4a";
  if(type==="audio/mpeg")return "mp3";
  if(type==="audio/wav"||type==="audio/x-wav")return "wav";
  if(type==="audio/ogg")return "ogg";
  return "webm";
}

export function PracticeStudio({remaining}:{remaining:number}) {
  const [scenarioId,setScenarioId]=useState<ScenarioId>("hr_intro");
  const [answer,setAnswer]=useState("");
  const [recording,setRecording]=useState(false);
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [seconds,setSeconds]=useState(0);
  const recorder=useRef<MediaRecorder|null>(null);
  const stream=useRef<MediaStream|null>(null);
  const chunks=useRef<Blob[]>([]);
  const scenario=SCENARIOS[scenarioId];

  useEffect(()=>{if(!recording)return;const id=window.setInterval(()=>setSeconds(s=>s+1),1000);return()=>window.clearInterval(id)},[recording]);
  useEffect(()=>()=>stream.current?.getTracks().forEach(track=>track.stop()),[]);

  async function startRecording(){
    try{
      const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
      const mimeType=preferredRecorderMimeType();
      stream.current=media;chunks.current=[];const mr=mimeType?new MediaRecorder(media,{mimeType}):new MediaRecorder(media);recorder.current=mr;
      mr.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data)};
      mr.onstop=()=>{const recordedType=mr.mimeType||chunks.current.find(chunk=>chunk.type)?.type||"audio/webm";void uploadAudio(new Blob(chunks.current,{type:recordedType}),extensionForMimeType(recordedType))};
      mr.start();setSeconds(0);setRecording(true);setStatus("Listening… speak naturally. Short pauses are okay.");
    }catch{setStatus("Microphone access was unavailable. You can type your answer instead.")}
  }
  function stopRecording(){recorder.current?.stop();stream.current?.getTracks().forEach(track=>track.stop());setRecording(false);setStatus("Transcribing your answer…")}
  async function uploadAudio(blob:Blob,extension:string){
    setBusy(true);try{const form=new FormData();form.append("audio",blob,`answer.${extension}`);const res=await fetch("/api/transcribe",{method:"POST",body:form});const data=await res.json();if(!res.ok)throw new Error(data.error||"Transcription failed");setAnswer(data.transcript);setStatus("Transcript ready. Edit anything we misheard, then get feedback.")}catch(error){setStatus(error instanceof Error?error.message:"Could not transcribe that recording.")}finally{setBusy(false)}
  }
  async function analyse(){
    if(answer.trim().length<20)return;setBusy(true);setStatus("Reviewing clarity, structure, and relevance…");
    try{const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scenarioId,answer})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Feedback failed");setFeedback(data.feedback);setStatus("")}catch(error){setStatus(error instanceof Error?error.message:"Could not analyse this answer.")}finally{setBusy(false)}
  }
  function reset(){setAnswer("");setFeedback(null);setSeconds(0);setStatus("")}
  const time=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  return <div className="studioGrid"><aside className="panel trackPanel"><div className="panelHeading"><h2>Practice track</h2><span>Choose one</span></div><div className="trackList">{scenarioIds.map(id=>{const item=SCENARIOS[id];const Icon=icons[id];return <button key={id} className={`trackButton ${id===scenarioId?"active":""}`} onClick={()=>{setScenarioId(id);reset()}}><span className="trackIcon"><Icon size={18}/></span><span><strong>{item.track}</strong><small>{item.title.split(".")[0]}</small></span></button>})}</div></aside><section className="panel studioPanel"><div className="studioTop"><span>{scenario.track} · Guided practice</span><span className="warmPill">Warm-up</span></div><div className="practicePrompt"><small>Your prompt</small><h2>{scenario.title}</h2><p>{scenario.hint}</p></div>{feedback?<div className="resultWrap"><div className="scoreBox"><div className="scoreRing" style={{"--score":feedback.overall} as React.CSSProperties}><strong>{feedback.overall}</strong><span>overall score</span></div><div className="scoreText"><h3>{feedback.headline}</h3><p>{feedback.summary}</p><div className="metricGrid"><div className="metric"><span>Clarity</span><strong>{feedback.clarity}%</strong></div><div className="metric"><span>Structure</span><strong>{feedback.structure}%</strong></div><div className="metric"><span>Relevance</span><strong>{feedback.relevance}%</strong></div><div className="metric"><span>Fillers</span><strong>{feedback.fillers}</strong></div></div></div></div><div className="feedbackGrid"><article className="feedbackCard good"><h3>What worked</h3><p>{feedback.worked}</p></article><article className="feedbackCard improve"><h3>Try this next</h3><p>{feedback.improve}</p></article></div><div className="betterAnswer"><strong>A stronger version</strong><p>{feedback.betterAnswer}</p></div><div className="resultActions"><button className="button buttonGhost" onClick={()=>{setScenarioId(scenarioIds[(scenarioIds.indexOf(scenarioId)+1)%scenarioIds.length]);reset()}}>Next prompt</button><button className="button buttonLime" onClick={reset}>Retry answer <RefreshCw size={17}/></button></div></div>:<div className="answerArea"><div className="answerTop"><label htmlFor="answer">Your answer</label><span>{time} / 02:00</span></div><textarea id="answer" className="field answerInput" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Tap the microphone and speak naturally, or type your answer here." maxLength={4000}/><div className="recorderRow"><div className="recorderInfo"><button className={`recordButton ${recording?"recording":""}`} onClick={recording?stopRecording:startRecording} aria-label={recording?"Stop recording":"Start recording"}>{recording?<Square size={18} fill="currentColor"/>:<Mic2 size={21}/>}</button><div><strong>{recording?"Listening… tap to stop":"Record your answer"}</strong><span>30–120 seconds works best</span></div></div><button className="button buttonLime" onClick={analyse} disabled={busy||answer.trim().length<20||remaining<1}>{busy?"Working…":"Get feedback →"}</button></div>{status&&<div className="statusBox" role="status">{status}</div>}{remaining<1&&<div className="statusBox">You’ve used this month’s reviews. <a className="textLink" href="/pricing">Choose a plan to continue.</a></div>}</div>}</section></div>;
}
