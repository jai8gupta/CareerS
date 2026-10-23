import Link from "next/link";
import { Check } from "lucide-react";
import { TrackedLink } from "@/components/analytics-events";
import { planBenefits, PLANS } from "@/lib/plans";

export function PricingCards({ signedIn = false, subscriptionsEnabled = false }: { signedIn?: boolean; subscriptionsEnabled?: boolean }) {
  return (
    <div className="pricingGrid">
      {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((id) => {
        const plan = PLANS[id];
        return (
          <article className={`priceCard ${id === "annual" ? "featured" : ""}`} key={id}>
            {id === "annual" && <span className="valueBadge">Best value · save 37%</span>}
            <p className="priceLabel">{plan.name}</p>
            <div className="price"><strong>{plan.displayPrice}</strong><span>{id === "sprint" || subscriptionsEnabled ? plan.cadence : id === "monthly" ? "/30 days" : "/365 days"}</span></div>
            <p className="priceDescription">{plan.description}</p>
            <ul className="benefitList">
              {planBenefits(id).map((benefit) => <li key={benefit}><Check size={17} />{benefit}</li>)}
            </ul>
            {signedIn ? <Link className={`button ${id === "annual" ? "buttonLime" : "buttonOutline"}`} href={`/pricing?checkout=${id}`}>
              {id === "sprint" ? "Start my sprint" : subscriptionsEnabled ? `Choose ${plan.name.replace("Pro ", "")}` : `Buy ${plan.durationDays}-day pass`}
            </Link> : <TrackedLink className={`button ${id === "annual" ? "buttonLime" : "buttonOutline"}`} href={`/signup?tier=${id}`} event="primary_cta_clicked" properties={{ placement: "pricing_plan", destination: "signup", plan: id }}>
              {id === "sprint" ? "Start my sprint" : subscriptionsEnabled ? `Choose ${plan.name.replace("Pro ", "")}` : `Buy ${plan.durationDays}-day pass`}
            </TrackedLink>}
          </article>
        );
      })}
    </div>
  );
}
