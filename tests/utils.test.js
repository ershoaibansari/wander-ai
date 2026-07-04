import { describe, expect, it } from "vitest";
import { getInitials, passportProgress, slugify, validateEmail, validatePassword } from "@/lib/utils";

describe("utility functions", () => {
  it("validates email and password", () => {
    expect(validateEmail("traveler@example.com")).toBe(true);
    expect(validateEmail("traveler")).toBe(false);
    expect(validatePassword("long-enough")).toBe(true);
  });

  it("formats small UI helpers", () => {
    expect(slugify("Kyoto, Japan")).toBe("kyoto-japan");
    expect(getInitials("Emily Rose")).toBe("ER");
    expect(passportProgress(3, 10)).toBe(30);
  });
});
