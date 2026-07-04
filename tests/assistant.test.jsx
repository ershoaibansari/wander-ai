import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FloatingAssistant } from "@/components/FloatingAssistant";

describe("Floating assistant", () => {
  it("can be closed and reopened", () => {
    render(<FloatingAssistant />);
    fireEvent.click(screen.getByRole("button", { name: /open ai travel assistant/i }));
    fireEvent.click(screen.getByRole("button", { name: /close ai travel assistant/i }));
    expect(screen.queryByLabelText(/ask a travel question/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /open ai travel assistant/i }));
    expect(screen.getByLabelText(/ask a travel question/i)).toBeInTheDocument();
  });

  it("renders nested chat route replies as text", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { reply: "Bargaining is uncommon in Kyoto shops." } }),
      })
    );

    render(<FloatingAssistant />);
    fireEvent.click(screen.getByRole("button", { name: /open ai travel assistant/i }));
    fireEvent.change(screen.getByLabelText(/ask a travel question/i), {
      target: { value: "Can I bargain in Kyoto?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ask gemini/i }));

    await waitFor(() => expect(screen.getByText("Bargaining is uncommon in Kyoto shops.")).toBeInTheDocument());
  });
});
