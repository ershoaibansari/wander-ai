import { describe, expect, it } from "vitest";
import { POST as discoverPost } from "@/app/api/discover/route";

describe("Gemini API routes", () => {
  it("returns a structured fallback response when Gemini is not configured", async () => {
    const response = await discoverPost(new Request("http://test.local/api/discover", {
      method: "POST",
      body: JSON.stringify({ query: "peaceful mountains" }),
    }));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.data.attractions).toEqual(expect.any(Array));
    expect(payload.source).toBe("fallback");
  });
});
