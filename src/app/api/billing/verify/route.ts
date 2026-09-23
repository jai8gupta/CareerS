import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { isPlanId, PLANS } from "@/lib/plans";
import { verifyCheckoutSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

const Schema=z.object({planId:z.string(),type:z.enum(["order","subscription"]),referenceId:z.string().min(4),razorpay_payment_id:z.string().min(4),razorpay_signature:z.string().min(16)});
export async function POST(request:Request){
  const user=await getUser();if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
  const parsed=Schema.safeParse(await request.json().catch(()=>null));if(!parsed.success||!isPlanId(parsed.data.planId))return NextResponse.json({error:"Invalid payment response."},{status:400});
  const body=parsed.data;const planId=body.planId as keyof typeof PLANS;const valid=verifyCheckoutSignature(body.referenceId,body.razorpay_payment_id,body.razorpay_signature,body.type==="subscription");if(!valid)return NextResponse.json({error:"Payment signature did not match."},{status:400});
  const supabase=createAdminClient();const{data:attempt}=await supabase.from("payment_attempts").select("id,kind").eq("user_id",user.id).eq("provider_reference",body.referenceId).eq("plan_id",body.planId).maybeSingle();if(!attempt||attempt.kind!==body.type)return NextResponse.json({error:"Unknown payment attempt."},{status:400});
  await supabase.from("payment_attempts").update({status:"verified",provider_payment_id:body.razorpay_payment_id,verified_at:new Date().toISOString()}).eq("id",attempt.id);
  const end=new Date(Date.now()+PLANS[planId].durationDays*86400000).toISOString();
  await supabase.from("subscriptions").upsert({user_id:user.id,plan_id:planId,status:body.type==="order"?"active":"authenticated",provider_subscription_id:body.type==="subscription"?body.referenceId:null,current_period_start:new Date().toISOString(),current_period_end:end},{onConflict:"user_id"});
  return NextResponse.json({ok:true});
}
