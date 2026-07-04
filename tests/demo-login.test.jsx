import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/AuthForms";
import { DEMO_USERS } from "@/lib/demo-data";
import { signIn } from "next-auth/react";

vi.mock("next-auth/react", () => ({ signIn: vi.fn(() => Promise.resolve({ ok: true })) }));

describe("Demo login", () => {
  it("renders all demo traveler cards", () => {
    render(<LoginForm demoEnabled />);
    for (const user of DEMO_USERS) {
      expect(screen.getByText(user.name)).toBeInTheDocument();
      expect(screen.getByText(user.role)).toBeInTheDocument();
    }
  });

  it("clicking a demo user triggers credential sign in with the demo id", async () => {
    render(<LoginForm demoEnabled />);
    fireEvent.click(screen.getAllByRole("button", { name: /continue as/i })[0]);
    await waitFor(() => expect(signIn).toHaveBeenCalledWith("credentials", { demoId: DEMO_USERS[0].id, redirect: false }));
  });
});
