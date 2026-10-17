import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@/lib/auth";
import { CheckoutLauncher } from "@/components/checkout-launcher";

export const metadata: Metadata = { title: "Pricing" };
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const user = await getUser();
  const subscriptionsEnabled = process.env.RAZORPAY_SUBSCRIPTIONS_ENABLED === "true";
  return (
    <><SiteHeader />{user&&<CheckoutLauncher email={user.email} name={String(user.user_metadata?.full_name||"")}/>}<main className="pageMain"><section className="container sectionHeading narrow"><p className="eyebrow">Simple plans</p><h1>Pay for progress, not endless lessons.</h1><p>Every plan includes every career track and the same quality of feedback. You only choose how intensely you want to practise.</p></section><section className="container"><div className="freeBanner"><div><strong>Start free</strong><span>3 complete AI reviews every month. No card required.</span></div></div><PricingCards signedIn={Boolean(user)} subscriptionsEnabled={subscriptionsEnabled} /><p className="pricingNote">{subscriptionsEnabled ? "Recurring plans renew until cancelled. " : "Monthly and annual access are currently one-time passes with no automatic renewal. "}Prices include applicable taxes where required. Paid access begins only after verified payment.</p></section></main><Footer /></>
  );
}
