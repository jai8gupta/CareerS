"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, BriefcaseBusiness, CheckCircle2, Code2, Lightbulb, MessageSquareText, Mic2, Presentation, RefreshCw, Square, Users } from "lucide-react";
import { trackFunnel } from "@/lib/analytics";
import type { Feedback } from "@/lib/feedback";
import { SCENARIOS, type ScenarioId } from "@/lib/scenarios";

const scenarioIds = Object.keys(SCENARIOS) as ScenarioId[];
const icons = { hr_intro:Users, technical_story:Code2, delayed_update:BriefcaseBusiness, unhappy_client:MessageSquareText, presentation_open:Presentation };
const recorderMimeTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"];

function preferredRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return undefined;
  return recorderMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
}

function extensionForMimeType(mimeType:string) {
  const type=mimeType.split(";",1)[0].toLowerCase();
  if(type==="audio/mp4"||type==="audio/x-m4a")return "m4a";
  if(type==="audio/mpeg")return "mp3";
  if(type==="audio/wav"||type==="audio/x-wav")return "wav";
  if(type==="audio/ogg")return "ogg";
  return "webm";
}

export function microphoneErrorCategory(error: unknown): "denied" | "not_found" | "busy" | "unsupported" | "unknown" {
  if (!(error instanceof DOMException)) return "unknown";
  if (error.name === "NotAllowedError" || error.name === "SecurityError") return "denied";
  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return "not_found";
  if (error.name === "NotReadableError" || error.name === "TrackStartError" || error.name === "AbortError") return "busy";
  if (error.name === "NotSupportedError" || error.name === "TypeError") return "unsupported";
  return "unknown";
}

function microphoneHelp(category: ReturnType<typeof microphoneErrorCategory>) {
  if (category === "denied") return "Microphone permission was blocked. Allow it in your browser settings, reload, or type your answer below.";
  if (category === "not_found") return "No microphone was found. Connect one or type your answer below.";
  if (category === "busy") return "Your microphone is being used by another app. Close it there and try again, or type your answer.";
  if (category === "unsupported") return "This browser cannot record audio here. Open CareerSpeak in Safari or Chrome, or type your answer.";
  return "We could not start the microphone. Reload and try again, or type your answer below.";
}

function responseCategory(status: number) {
  if (status === 401) return "auth";
  if (status === 402 || status === 429) return "limit";
  if (status >= 500) return "service";
  return "validation";
}

export function PracticeStudio({remaining,initialScenarioId="hr_intro"}:{remaining:number;initialScenarioId?:ScenarioId}) {
  const [scenarioId,setScenarioId]=useState<ScenarioId>(initialScenarioId);
  const [answer,setAnswer]=useState("");
  const [recording,setRecording]=useState(false);
  const [busyStage,setBusyStage]=useState<"transcribing"|"feedback"|null>(null);
  const [status,setStatus]=useState("");
  const [statusError,setStatusError]=useState(false);
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [seconds,setSeconds]=useState(0);
  const recorder=useRef<MediaRecorder|null>(null);
  const stream=useRef<MediaStream|null>(null);
  const chunks=useRef<Blob[]>([]);
  const usedVoice=useRef(false);
  const scenario=SCENARIOS[scenarioId];
  const busy=busyStage!==null;

  const setNotice=useCallback((message:string,isError=false)=>{setStatus(message);setStatusError(isError)},[]);
  const stopRecording=useCallback(()=>{
    const active=recorder.current;if(active&&active.state!=="inactive")active.stop();stream.current?.getTracks().forEach((track)=>track.stop());setRecording(false);setNotice("Transcribing your answer…");
  },[setNotice]);

  useEffect(()=>{trackFunnel("practice_prompt_viewed",{scenario:scenarioId},{once:`dashboard_prompt:${scenarioId}`})},[scenarioId]);
  useEffect(()=>{if(feedback)trackFunnel("feedback_viewed",{scenario:scenarioId},{once:`feedback_viewed:${scenarioId}:${feedback.overall}`})},[feedback,scenarioId]);
  useEffect(()=>{if(!recording)return;const id=window.setInterval(()=>setSeconds((current)=>{if(current>=119){window.queueMicrotask(stopRecording);return 120}return current+1}),1000);return()=>window.clearInterval(id)},[recording,stopRecording]);
  useEffect(()=>()=>stream.current?.getTracks().forEach((track)=>track.stop()),[]);

  async function startRecording(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){
      const category="unsupported" as const;setNotice(microphoneHelp(category),true);trackFunnel("microphone_permission_result",{result:category});trackFunnel("practice_failed",{stage:"permission",category});return;
    }
    try{
      const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
      trackFunnel("microphone_permission_result",{result:"granted"},{once:"microphone_granted"});
      const mimeType=preferredRecorderMimeType();
      stream.current=media;chunks.current=[];const mr=mimeType?new MediaRecorder(media,{mimeType}):new MediaRecorder(media);recorder.current=mr;
      mr.ondataavailable=(event)=>{if(event.data.size)chunks.current.push(event.data)};
      mr.onstop=()=>{const recordedType=mr.mimeType||chunks.current.find((chunk)=>chunk.type)?.type||"audio/webm";const blob=new Blob(chunks.current,{type:recordedType});if(blob.size<100){setNotice("That recording was too short. Try again or type your answer.",true);return}void uploadAudio(blob,extensionForMimeType(recordedType))};
      mr.start();setSeconds(0);setRecording(true);usedVoice.current=true;setNotice("Listening… speak naturally. Tap stop when you finish.");trackFunnel("practice_started",{scenario:scenarioId,method:"voice"});
    }catch(error){
      stream.current?.getTracks().forEach((track)=>track.stop());const category=microphoneErrorCategory(error);setNotice(microphoneHelp(category),true);trackFunnel("microphone_permission_result",{result:category});trackFunnel("practice_failed",{stage:"permission",category});
    }
  }

  async function uploadAudio(blob:Blob,extension:string){
    setBusyStage("transcribing");
    try{
      const form=new FormData();form.append("audio",blob,`answer.${extension}`);const res=await fetch("/api/transcribe",{method:"POST",body:form});const data=await res.json();if(!res.ok){trackFunnel("practice_failed",{stage:"transcription",category:responseCategory(res.status)});throw new Error(data.error||"Transcription failed")}
      setAnswer(data.transcript);setNotice("Transcript ready. Fix anything we misheard, then get feedback.");
    }catch(error){setNotice(error instanceof Error?error.message:"Could not transcribe that recording.",true)}finally{setBusyStage(null)}
  }

  async function analyse(){
    if(answer.trim().length<20||busy)return;
    const method=usedVoice.current?"voice":"typed";trackFunnel("practice_submitted",{scenario:scenarioId,method});setBusyStage("feedback");setNotice("Reviewing clarity, structure, and relevance…");
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scenarioId,answer})});const data=await res.json();if(!res.ok){trackFunnel("practice_failed",{stage:"feedback",category:responseCategory(res.status)});throw new Error(data.error||"Feedback failed")}
      setFeedback(data.feedback);setNotice("");trackFunnel("feedback_ready",{scenario:scenarioId});
    }catch(error){setNotice(error instanceof Error?error.message:"Could not analyse this answer.",true)}finally{setBusyStage(null)}
  }

  function clearPractice(){setAnswer("");setFeedback(null);setSeconds(0);setNotice("");usedVoice.current=false}
  function retry(){trackFunnel("practice_retried",{scenario:scenarioId});clearPractice()}
  function chooseScenario(id:ScenarioId){if(recording||busy)return;setScenarioId(id);clearPractice()}
  const time=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;

  return <div className="studioGrid"><aside className="panel trackPanel"><div className="panelHeading"><h2>Practice track</h2><span>Choose one</span></div><div className="trackList">{scenarioIds.map((id)=>{const item=SCENARIOS[id];const Icon=icons[id];return <button type="button" key={id} className={`trackButton ${id===scenarioId?"active":""}`} aria-pressed={id===scenarioId} disabled={recording||busy} onClick={()=>chooseScenario(id)}><span className="trackIcon"><Icon size={18}/></span><span><strong>{item.track}</strong><small>{item.title.split(".")[0]}</small></span></button>})}</div></aside><section className="panel studioPanel"><div className="studioTop"><span>{scenario.track} · Guided practice</span><span className="warmPill">Speak → improve → retry</span></div><div className="practicePrompt"><small>Your prompt</small><h2>{scenario.title}</h2><p>{scenario.hint}</p></div>{feedback?<div className="resultWrap"><div className="improvementFocus"><Lightbulb size={19}/><div><strong>Your next improvement</strong><p>{feedback.improve}</p></div></div><div className="scoreBox"><div className="scoreRing" style={{"--score":feedback.overall} as React.CSSProperties}><strong>{feedback.overall}</strong><span>overall score</span></div><div className="scoreText"><h3>{feedback.headline}</h3><p>{feedback.summary}</p><div className="metricGrid"><div className="metric"><span>Clarity</span><strong>{feedback.clarity}%</strong></div><div className="metric"><span>Structure</span><strong>{feedback.structure}%</strong></div><div className="metric"><span>Relevance</span><strong>{feedback.relevance}%</strong></div><div className="metric"><span>Fillers</span><strong>{feedback.fillers}</strong></div></div></div></div><div className="feedbackGrid"><article className="feedbackCard good"><h3><CheckCircle2 size={16}/> What worked</h3><p>{feedback.worked}</p></article><article className="feedbackCard improve"><h3><AlertCircle size={16}/> Coach’s tip</h3><p>{feedback.hinglishTip}</p></article></div><div className="betterAnswer"><strong>A stronger version</strong><p>{feedback.betterAnswer}</p></div><div className="resultActions"><button type="button" className="button buttonGhost" onClick={()=>{setScenarioId(scenarioIds[(scenarioIds.indexOf(scenarioId)+1)%scenarioIds.length]);clearPractice()}}>Next prompt</button><button type="button" className="button buttonLime" onClick={retry}>Retry this answer <RefreshCw size={17}/></button></div></div>:<div className="answerArea"><div className="answerTop"><label htmlFor="answer">Your answer</label><span>{time} / 02:00</span></div><textarea id="answer" className="field answerInput" value={answer} onChange={(event)=>{setAnswer(event.target.value);if(!event.target.value)usedVoice.current=false}} placeholder="Tap the microphone and speak naturally, or type your answer here." maxLength={4000} disabled={recording||busy}/><div className="recorderRow"><div className="recorderInfo"><button type="button" className={`recordButton ${recording?"recording":""}`} onClick={recording?stopRecording:startRecording} disabled={busy||remaining<1} aria-label={recording?"Stop recording":"Start recording"}>{recording?<Square size={18} fill="currentColor"/>:<Mic2 size={21}/>}</button><div><strong>{recording?"Listening… tap to stop":busyStage==="transcribing"?"Preparing your transcript":"Record your answer"}</strong><span>{recording?"Speak normally. We stop automatically at 2 minutes.":"30–120 seconds works best"}</span></div></div><button type="button" className="button buttonLime" onClick={analyse} disabled={busy||recording||answer.trim().length<20||remaining<1}>{busyStage==="feedback"?<><span className="spinner" aria-hidden="true"/>Reviewing answer…</>:"Get feedback →"}</button></div>{status&&<div className={`statusBox ${statusError?"statusError":""}`} role={statusError?"alert":"status"} aria-live="polite">{busy&&<span className="spinner" aria-hidden="true"/>}{status}</div>}{remaining<1&&<div className="statusBox">You’ve used this month’s reviews. <a className="textLink" href="/pricing">Choose a plan to continue.</a></div>}</div>}</section></div>;
}
