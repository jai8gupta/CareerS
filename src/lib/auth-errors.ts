export type AuthErrorCategory = "already_registered" | "invalid_credentials" | "rate_limited" | "weak_password" | "network" | "unknown";

export function classifyAuthError(message: string): AuthErrorCategory {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered") || normalized.includes("already exists")) return "already_registered";
  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) return "invalid_credentials";
  if (normalized.includes("rate") || normalized.includes("too many") || normalized.includes("security purposes")) return "rate_limited";
  if (normalized.includes("password") && (normalized.includes("weak") || normalized.includes("characters"))) return "weak_password";
  if (normalized.includes("fetch") || normalized.includes("network")) return "network";
  return "unknown";
}

export function authErrorMessage(category: AuthErrorCategory, flow: "login" | "signup") {
  if (category === "already_registered") return "This email already has an account. Sign in instead.";
  if (category === "invalid_credentials") return "That email or password does not match. Try again or reset your password.";
  if (category === "rate_limited") return "Too many attempts in a short time. Wait a minute and try again.";
  if (category === "weak_password") return "Use a stronger password with at least 8 characters.";
  if (category === "network") return "We could not reach the sign-in service. Check your connection and try again.";
  return flow === "signup" ? "We could not create your account. Please try again." : "We could not sign you in. Please try again.";
}
