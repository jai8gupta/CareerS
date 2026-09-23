import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyHmac } from "@/lib/razorpay";

export const runtime="nodejs";
type Entity={id?:string;status?:string;order_id?:string;current_start?:number;current_end?:number;notes?:{user_id?:string;plan_id?:string}};
export async function POST(request:Request){
  const raw=await request.text();const signature=request.headers.get("x-razorpay-signature")||"";const eventId=request.headers.get("x-razorpay-event-id")||"";const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret||!signature||!verifyHmac(raw,signature,secret))return NextResponse.json({error:"Invalid signature."},{status:401});
  let payload:{event?:string;payload?:{subscription?:{entity?:Entity};payment?:{entity?:Entity};order?:{entity?:Entity}}};try{payload=JSON.parse(raw)}catch{return NextResponse.json({error:"Invalid payload."},{status:400})}
  const admin=createAdminClient();
  if(eventId){const{error}=await admin.from("webhook_events").insert({provider:"razorpay",event_id:eventId,event_type:payload.event||"unknown"});if(error?.code==="23505")return NextResponse.json({ok:true,duplicate:true});if(error)return NextResponse.json({error:"Could not record event."},{status:500})}
  const subscription=payload.payload?.subscription?.entity;const payment=payload.payload?.payment?.entity;const order=payload.payload?.order?.entity;
  if(subscription?.id&&subscription.notes?.user_id){
    const statusMap:Record<string,string>={authenticated:"authenticated",active:"active",charged:"active",completed:"completed",cancelled:"cancelled",paused:"paused",halted:"halted"};const eventStatus=(payload.event||"").split(".")[1];const status=statusMap[eventStatus]||subscription.status||"pending";
    await admin.from("subscriptions").upsert({user_id:subscription.notes.user_id,plan_id:subscription.notes.plan_id||"monthly",status,provider_subscription_id:subscription.id,current_period_start:subscription.current_start?new Date(subscription.current_start*1000).toISOString():null,current_period_end:subscription.current_end?new Date(subscription.current_end*1000).toISOString():null,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  }
  if(order?.id&&order.notes?.user_id){
    await admin.from("payment_attempts").update({status:"captured",provider_payment_id:payment?.id||null,verified_at:new Date().toISOString()}).eq("user_id",order.notes.user_id).eq("provider_reference",order.id);
    if(order.notes.plan_id==="sprint")await admin.from("subscriptions").upsert({user_id:order.notes.user_id,plan_id:"sprint",status:"active",provider_subscription_id:null,current_period_start:new Date().toISOString(),current_period_end:new Date(Date.now()+7*86400000).toISOString(),updated_at:new Date().toISOString()},{onConflict:"user_id"});
  }
  return NextResponse.json({ok:true});
}
