import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/AuthForms";

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));

describe("Login page", () => {
  it("renders the normal credential login form", () => {
    render(<LoginForm demoEnabled={false} />);
    expect(screen.getByRole("heading", { name: /continue your cultural travel planning/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.queryByText(/explore wanderai instantly/i)).not.toBeInTheDocument();
  });
});
