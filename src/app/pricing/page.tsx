import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { FunnelPageEvent } from "@/components/analytics-events";
import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@/lib/auth";
import { CheckoutLauncher } from "@/components/checkout-launcher";
import { publicPageMetadata } from "@/lib/seo";
import { FREE_PLAN } from "@/lib/plans";

export const metadata: Metadata = publicPageMetadata({
  title: "Pricing — Affordable AI Career Practice",
  description: "Start free or choose an affordable CareerSpeak pass from ₹39. Practise interviews and workplace English with actionable AI feedback.",
  path: "/pricing",
});
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const user = await getUser();
  const subscriptionsEnabled = process.env.RAZORPAY_SUBSCRIPTIONS_ENABLED === "true";
  return (
    <><FunnelPageEvent event="pricing_viewed" properties={{ signed_in:Boolean(user) }} once={`pricing:${Boolean(user)}`}/><SiteHeader signedIn={Boolean(user)} />{user&&<CheckoutLauncher email={user.email} name={String(user.user_metadata?.full_name||"")}/>}<main className="pageMain"><section className="container sectionHeading narrow"><p className="eyebrow">Simple plans</p><h1>Pay for progress, not endless lessons.</h1><p>Every paid plan includes every career track and the same quality of feedback. Interview Sprint is a 7-day one-time pass; Pro plans offer longer access.</p></section><section className="container"><div className="freeBanner"><div><strong>Start free</strong><span>{FREE_PLAN.reviews} complete AI reviews every {FREE_PLAN.reviewPeriod}. No card required. {FREE_PLAN.trackAccess} included.</span></div></div><PricingCards signedIn={Boolean(user)} subscriptionsEnabled={subscriptionsEnabled} /><p className="pricingNote">Interview Sprint never renews automatically. {subscriptionsEnabled ? "Pro Monthly and Pro Annual renew until cancelled. " : "Pro Monthly and Pro Annual are currently one-time passes with no automatic renewal. "}Prices include applicable taxes where required. Paid access begins only after verified payment.</p></section></main><Footer /></>
  );
}
