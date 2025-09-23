import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Page from "./page";

describe("Home Page", () => {
  it("renders successfully", () => {
    render(<Page />);

    // Check for Header component
    expect(screen.getByText("Insight Up Solutions")).toBeInTheDocument();

    // Check for Welcome message
    expect(screen.getByText("Welcome to Insight Up Solutions")).toBeInTheDocument();
    expect(screen.getByText("Your trusted partner for innovative business solutions.")).toBeInTheDocument();

    // Check for Footer component
    expect(screen.getByText(/© 2025 Insight Up Solutions. All rights reserved./)).toBeInTheDocument();
  });

  it("uses proper semantic structure", () => {
    render(<Page />);

    // Check for proper HTML structure
    expect(screen.getByRole("banner")).toBeInTheDocument(); // header
    expect(screen.getByRole("main")).toBeInTheDocument(); // main
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
  });

  it("displays welcome message prominently", () => {
    render(<Page />);

    const welcomeHeading = screen.getByRole("heading", { level: 2 });
    expect(welcomeHeading).toHaveTextContent("Welcome to Insight Up Solutions");
    expect(welcomeHeading).toHaveClass("text-4xl", "font-bold");
  });
});