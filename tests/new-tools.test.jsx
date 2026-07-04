import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EtiquetteCheckerTool, SavingCheatsTool, SaveTripButton, ClaimStampButton, QuizPlayer } from "@/components/AiTools";

describe("New AI Tools", () => {
  it("renders the Etiquette Checker form correctly", () => {
    render(<EtiquetteCheckerTool />);
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what are you planning to do/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate with gemini/i })).toBeInTheDocument();
  });

  it("renders the Saving Cheats form correctly", () => {
    render(<SavingCheatsTool />);
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate with gemini/i })).toBeInTheDocument();
  });

  it("renders SaveTripButton correctly", () => {
    render(<SaveTripButton destination="Tokyo" summary="Nice trip" tags={["Fun"]} />);
    expect(screen.getByRole("button", { name: /save this trip/i })).toBeInTheDocument();
  });

  it("renders ClaimStampButton correctly", () => {
    render(<ClaimStampButton destination="Tokyo" />);
    expect(screen.getByRole("button", { name: /claim passport stamp/i })).toBeInTheDocument();
  });

  it("renders QuizPlayer and allows answering questions", () => {
    const questions = [
      {
        question: "Is this a test?",
        options: ["Yes", "No", "Maybe", "Indeed"],
        answerIndex: 0,
        explanation: "This is a test question explanation.",
      },
    ];
    render(<QuizPlayer destination="Tokyo" questions={questions} />);
    expect(screen.getByText("Question 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Is this a test?")).toBeInTheDocument();

    const correctBtn = screen.getByRole("button", { name: "Yes" });
    fireEvent.click(correctBtn);

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByText("This is a test question explanation.")).toBeInTheDocument();
  });
});
