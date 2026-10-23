import { describe, expect, it } from "vitest";
import { authErrorMessage, classifyAuthError } from "@/lib/auth-errors";

describe("authentication errors", () => {
  it("maps provider details to safe categories", () => {
    expect(classifyAuthError("User already registered")).toBe("already_registered");
    expect(classifyAuthError("Invalid login credentials")).toBe("invalid_credentials");
    expect(classifyAuthError("For security purposes, wait 60 seconds")).toBe("rate_limited");
  });

  it("shows useful messages without provider internals", () => {
    expect(authErrorMessage("invalid_credentials", "login")).toContain("does not match");
    expect(authErrorMessage("unknown", "signup")).toBe("We could not create your account. Please try again.");
  });
});
