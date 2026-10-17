import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

const benefits = {
  sprint: ["10 AI reviews", "7 days of access", "Interview tracks", "Progress history"],
  monthly: ["25 AI reviews", "30 days of access", "All career tracks", "Hinglish coaching"],
  annual: ["25 AI reviews/month", "365 days of access", "All career tracks", "Best effective price"],
};

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
              {benefits[id].map((benefit) => <li key={benefit}><Check size={17} />{benefit}</li>)}
            </ul>
            <Link className={`button ${id === "annual" ? "buttonLime" : "buttonOutline"}`} href={signedIn ? `/pricing?checkout=${id}` : `/signup?tier=${id}`}>
              {id === "sprint" ? "Start my sprint" : subscriptionsEnabled ? `Choose ${plan.name.replace("Pro ", "")}` : `Buy ${id === "monthly" ? "30-day" : "annual"} pass`}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
