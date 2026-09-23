import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

const benefits = {
  sprint: ["30 AI reviews", "7 days of access", "Interview tracks", "Progress history"],
  monthly: ["60 AI reviews/month", "All career tracks", "Hinglish coaching", "Cancel any time"],
  annual: ["720 AI reviews/year", "All career tracks", "Hinglish coaching", "Best effective price"],
};

export function PricingCards({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <div className="pricingGrid">
      {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((id) => {
        const plan = PLANS[id];
        return (
          <article className={`priceCard ${id === "annual" ? "featured" : ""}`} key={id}>
            {id === "annual" && <span className="valueBadge">Best value · save 55%</span>}
            <p className="priceLabel">{plan.name}</p>
            <div className="price"><strong>{plan.displayPrice}</strong><span>{plan.cadence}</span></div>
            <p className="priceDescription">{plan.description}</p>
            <ul className="benefitList">
              {benefits[id].map((benefit) => <li key={benefit}><Check size={17} />{benefit}</li>)}
            </ul>
            <Link className={`button ${id === "annual" ? "buttonLime" : "buttonOutline"}`} href={signedIn ? `/pricing?checkout=${id}` : `/signup?tier=${id}`}>
              {id === "sprint" ? "Start my sprint" : `Choose ${plan.name.replace("Pro ", "")}`}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
