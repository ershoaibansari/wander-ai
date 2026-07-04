import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DiscoverTool } from "@/components/AiTools";
import { validateDestination } from "@/lib/utils";

describe("Discover form", () => {
  it("renders a required destination or mood field", () => {
    render(<DiscoverTool />);
    expect(screen.getByLabelText(/destination or mood/i)).toBeRequired();
    expect(validateDestination("I want peaceful mountains")).toBe(true);
    expect(validateDestination("")).toBe(false);
  });
});
