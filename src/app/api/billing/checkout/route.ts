import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { isPlanId, PLANS } from "@/lib/plans";
import { razorpayRequest } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const Schema=z.object({planId:z.string()});

export async function POST(request:Request){
  const user=await getUser();if(!user)return NextResponse.json({error:"Sign in before choosing a plan."},{status:401});
  const parsed=Schema.safeParse(await request.json().catch(()=>null));if(!parsed.success||!isPlanId(parsed.data.planId))return NextResponse.json({error:"Invalid plan."},{status:400});
  const plan=PLANS[parsed.data.planId];
  try{
    let referenceId:string;let type:"order"|"subscription";
    if(plan.kind==="order"){
      const order=await razorpayRequest<{id:string}>("/orders",{method:"POST",body:JSON.stringify({amount:plan.price*100,currency:"INR",receipt:`sprint_${user.id.slice(0,8)}_${Date.now()}`,notes:{user_id:user.id,plan_id:plan.id}})});referenceId=order.id;type="order";
    }else{
      const planId=plan.id==="monthly"?process.env.RAZORPAY_MONTHLY_PLAN_ID:process.env.RAZORPAY_ANNUAL_PLAN_ID;if(!planId)throw new Error("This subscription plan is not configured yet.");
      const subscription=await razorpayRequest<{id:string}>("/subscriptions",{method:"POST",body:JSON.stringify({plan_id:planId,total_count:plan.id==="monthly"?12:5,quantity:1,customer_notify:1,notes:{user_id:user.id,plan_id:plan.id}})});referenceId=subscription.id;type="subscription";
    }
    const supabase=createAdminClient();await supabase.from("payment_attempts").insert({user_id:user.id,plan_id:plan.id,provider_reference:referenceId,kind:type,status:"created",amount_paise:plan.price*100});
    return NextResponse.json({key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,referenceId,type,amount:plan.price*100},{headers:{"Cache-Control":"no-store"}});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Could not create checkout."},{status:502})}
}
