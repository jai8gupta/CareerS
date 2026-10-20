"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPlanId, PLANS, type PlanId } from "@/lib/plans";

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open(): void; on(event: string, handler: (data: unknown) => void): void } }
}

function loadCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(); script.onerror = () => reject(new Error("Could not load secure checkout."));
    document.head.appendChild(script);
  });
}

export function CheckoutLauncher({ email, name }: { email?: string; name?: string }) {
  const params = useSearchParams(); const router = useRouter(); const started = useRef(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const openCheckout=useCallback(async(planId:PlanId)=>{
    setBusy(true);setMessage("Preparing secure checkout…");
    try{
      await loadCheckout();
      const response=await fetch("/api/billing/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({planId})});
      const checkout=await response.json();if(!response.ok)throw new Error(checkout.error||"Could not start checkout.");
      if(!window.Razorpay)throw new Error("Secure checkout did not load.");
      const plan=PLANS[planId];
      const options:Record<string,unknown>={key:checkout.key,name:"CareerSpeak",description:plan.name,currency:"INR",prefill:{name,email},theme:{color:"#101828"},modal:{ondismiss:()=>{setBusy(false);setMessage("");router.replace("/pricing")}},handler:async(result:Record<string,string>)=>{
        try{setMessage("Verifying payment…");
          const verified=await fetch("/api/billing/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...result,planId,referenceId:checkout.referenceId,type:checkout.type})});
          if(!verified.ok){const body=await verified.json();throw new Error(body.error||"Payment verification failed.")}
          router.push("/dashboard?payment=success");router.refresh();
        }catch(error){setBusy(false);setMessage(error instanceof Error?error.message:"Payment verification failed. Contact support with your payment ID.")}
      }};
      if(checkout.type==="subscription")options.subscription_id=checkout.referenceId;else{options.order_id=checkout.referenceId;options.amount=checkout.amount}
      const instance=new window.Razorpay(options);instance.on("payment.failed",()=>{setBusy(false);setMessage("Payment was not completed. You can safely try again.")});instance.open();
    }catch(error){setBusy(false);setMessage(error instanceof Error?error.message:"Could not start checkout.");started.current=false}
  },[email,name,router]);
  useEffect(()=>{const value=params.get("checkout");if(!isPlanId(value)||started.current)return;started.current=true;void openCheckout(value)},[params,openCheckout]);
  return message?<div className="container"><div className="statusBox" role="status" aria-live="polite">{busy&&<span className="spinner" aria-hidden="true"/>}{message}</div></div>:null;
}
