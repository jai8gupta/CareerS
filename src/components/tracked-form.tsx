"use client";

import { useRef } from "react";
import { trackFunnel } from "@/lib/analytics";

export function TrackedSignupForm({
  action,
  intent,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  intent: "practice" | "plan" | "general";
  children: React.ReactNode;
}) {
  const started = useRef(false);
  return (
    <form
      className="formStack"
      action={action}
      onFocusCapture={() => {
        if (started.current) return;
        started.current = true;
        trackFunnel("signup_form_started", { intent });
      }}
      onSubmit={() => trackFunnel("signup_submitted", { intent })}
    >
      {children}
    </form>
  );
}
