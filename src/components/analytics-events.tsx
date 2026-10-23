"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { attributedHref } from "@/lib/navigation";
import { captureCampaignAttribution, trackFunnel } from "@/lib/analytics";

type EventName = Parameters<typeof trackFunnel>[0];

export function AnalyticsBootstrap() {
  const params = useSearchParams();
  useEffect(() => captureCampaignAttribution(new URLSearchParams(params.toString())), [params]);
  return null;
}

export function FunnelPageEvent({ event, properties, once }: { event: EventName; properties: Record<string, string | number | boolean>; once: string }) {
  useEffect(() => {
    trackFunnel(event as never, properties as never, { once });
  }, [event, once, properties]);
  return null;
}

export function TrackedLink({
  href,
  event,
  properties,
  className,
  children,
  preserveAttribution = true,
}: {
  href: string;
  event: EventName;
  properties: Record<string, string | number | boolean>;
  className?: string;
  children: React.ReactNode;
  preserveAttribution?: boolean;
}) {
  const destination = useSyncExternalStore(
    (notify) => {
      window.addEventListener("popstate", notify);
      return () => window.removeEventListener("popstate", notify);
    },
    () => preserveAttribution
      ? attributedHref(href, new URLSearchParams(window.location.search))
      : href,
    () => href,
  );

  return (
    <Link
      className={className}
      href={destination}
      onClick={() => trackFunnel(event as never, properties as never)}
    >
      {children}
    </Link>
  );
}
