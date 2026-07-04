import { describe, expect, it } from "vitest";
import {
  cn,
  formatDate,
  getInitials,
  parseJsonSafe,
  passportProgress,
  slugify,
  truncate,
  validateDestination,
  validateEmail,
  validatePassword,
} from "@/lib/utils";

describe("utility functions", () => {
  it("validates email correctly", () => {
    expect(validateEmail("traveler@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail(null)).toBe(false);
  });

  it("validates password correctly", () => {
    expect(validatePassword("password123")).toBe(true);
    expect(validatePassword("short")).toBe(false);
    expect(validatePassword("")).toBe(false);
  });

  it("validates destination correctly", () => {
    expect(validateDestination("Tokyo")).toBe(true);
    expect(validateDestination("T")).toBe(false);
    expect(validateDestination("")).toBe(false);
    expect(validateDestination("a".repeat(121))).toBe(false);
  });

  it("slugifies text correctly", () => {
    expect(slugify("Kyoto, Japan")).toBe("kyoto-japan");
    expect(slugify("  New  York!!!  ")).toBe("new-york");
    expect(slugify(null)).toBe("");
  });

  it("extracts initials correctly", () => {
    expect(getInitials("Emily Rose")).toBe("ER");
    expect(getInitials("John Doe Smith")).toBe("JD");
    expect(getInitials("")).toBe("");
    expect(getInitials(null)).toBe("");
  });

  it("truncates text correctly", () => {
    expect(truncate("Hello World", 5)).toBe("Hell…");
    expect(truncate("Hello World", 20)).toBe("Hello World");
  });

  it("formats date correctly", () => {
    expect(formatDate(1762560000000)).toContain("2025");
    expect(formatDate("invalid-date")).toBe("");
  });

  it("joins class names correctly via cn", () => {
    expect(cn("class1", "class2", false && "class3", "class4")).toBe("class1 class2 class4");
    expect(cn()).toBe("");
  });

  it("parses json safely from LLM outputs", () => {
    expect(parseJsonSafe('{"foo": "bar"}')).toEqual({ foo: "bar" });
    expect(parseJsonSafe('```json\n{"foo": "bar"}\n```')).toEqual({ foo: "bar" });
    expect(parseJsonSafe("prose before {\"foo\": \"bar\"} prose after")).toEqual({ foo: "bar" });
    expect(parseJsonSafe("no json here")).toBeNull();
  });

  it("calculates passport progress", () => {
    expect(passportProgress(3, 10)).toBe(30);
    expect(passportProgress(12, 10)).toBe(100);
    expect(passportProgress(-5, 10)).toBe(0);
  });
});

