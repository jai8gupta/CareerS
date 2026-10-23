import { describe, expect, it } from "vitest";
import { microphoneErrorCategory } from "@/components/practice-studio";

describe("microphone error guidance", () => {
  it("separates permission denial from unavailable hardware", () => {
    expect(microphoneErrorCategory(new DOMException("blocked", "NotAllowedError"))).toBe("denied");
    expect(microphoneErrorCategory(new DOMException("missing", "NotFoundError"))).toBe("not_found");
    expect(microphoneErrorCategory(new DOMException("busy", "NotReadableError"))).toBe("busy");
  });
});
