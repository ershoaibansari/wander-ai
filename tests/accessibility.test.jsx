import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/AuthForms";
import { DiscoverTool } from "@/components/AiTools";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));

describe("Accessibility smoke tests", () => {
  it("login has an h1 and labelled controls", () => {
    render(<LoginForm demoEnabled />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("discover has a main heading and labelled destination input", () => {
    render(<DiscoverTool />);
    expect(screen.getByRole("heading", { level: 1, name: /ai destination discovery/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/destination or mood/i)).toBeInTheDocument();
  });
});
