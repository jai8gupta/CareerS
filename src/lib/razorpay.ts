import { createHmac, timingSafeEqual } from "node:crypto";
import { requireEnv } from "@/lib/env";

const apiBase = "https://api.razorpay.com/v1";

export async function razorpayRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const credentials = Buffer.from(`${requireEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID")}:${requireEnv("RAZORPAY_KEY_SECRET")}`).toString("base64");
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.description || "Payment provider request failed");
  return body as T;
}

export function verifyHmac(message: string, received: string, secret: string) {
  const expected = createHmac("sha256", secret).update(message).digest("hex");
  if (expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function verifyCheckoutSignature(referenceId: string, paymentId: string, signature: string, subscription = false) {
  const message = subscription ? `${paymentId}|${referenceId}` : `${referenceId}|${paymentId}`;
  return verifyHmac(message, signature, requireEnv("RAZORPAY_KEY_SECRET"));
}
