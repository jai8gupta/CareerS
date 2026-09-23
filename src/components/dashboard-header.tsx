import Link from "next/link";
import { Settings } from "lucide-react";
import { Logo } from "@/components/logo";

export function DashboardHeader({ planName = "Free" }: { planName?: string }) {
  return <header className="dashboardHeader"><div className="container dashboardHeaderInner"><Logo/><div className="dashActions"><Link className="planPill" href="/pricing">{planName} plan</Link><Link className="iconButton" href="/account" aria-label="Account settings"><Settings size={18}/></Link></div></div></header>;
}
