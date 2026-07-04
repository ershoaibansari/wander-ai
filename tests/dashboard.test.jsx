import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardView, getDemoDashboard } from "@/components/Dashboard";

describe("Dashboard", () => {
  it("renders dashboard cards", () => {
    render(<DashboardView data={getDemoDashboard("demo-emily")} />);
    expect(screen.getByText(/saved trips/i)).toBeInTheDocument();
    expect(screen.getByText(/passport progress/i)).toBeInTheDocument();
    expect(screen.getByText(/culture quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/hidden gem of the day/i)).toBeInTheDocument();
  });
});
