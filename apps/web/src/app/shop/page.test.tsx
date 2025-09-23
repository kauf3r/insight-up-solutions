import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ShopPage from "./page";

describe("Shop Page", () => {
  it("renders successfully", () => {
    render(<ShopPage />);

    // Check for Header component
    expect(screen.getByText("Insight Up Solutions")).toBeInTheDocument();

    // Check for Product Catalog heading
    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("Discover our comprehensive range of innovative business solutions designed to transform your operations.")).toBeInTheDocument();

    // Check for Footer component
    expect(screen.getByText(/© 2025 Insight Up Solutions. All rights reserved./)).toBeInTheDocument();
  });

  it("uses proper semantic structure", () => {
    render(<ShopPage />);

    // Check for proper HTML structure
    expect(screen.getByRole("banner")).toBeInTheDocument(); // header
    expect(screen.getByRole("main")).toBeInTheDocument(); // main
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
  });

  it("displays Product Catalog heading prominently", () => {
    render(<ShopPage />);

    const catalogHeading = screen.getByRole("heading", { level: 1, name: "Product Catalog" });
    expect(catalogHeading).toHaveTextContent("Product Catalog");
    expect(catalogHeading).toHaveClass("text-4xl", "font-bold");
  });

  it("renders all placeholder products", () => {
    render(<ShopPage />);

    // Check that all three products are displayed
    expect(screen.getByText("Trinity Pro")).toBeInTheDocument();
    expect(screen.getByText("Sony ILX-LR1")).toBeInTheDocument();
    expect(screen.getByText("Qube 640")).toBeInTheDocument();
  });

  it("renders product summaries correctly", () => {
    render(<ShopPage />);

    // Check product descriptions
    expect(screen.getByText(/Advanced business automation platform with AI-powered insights/)).toBeInTheDocument();
    expect(screen.getByText(/Professional-grade media processing solution with real-time streaming/)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise storage and computing solution designed for high-performance/)).toBeInTheDocument();
  });

  it("has responsive grid layout", () => {
    render(<ShopPage />);

    // Check for responsive grid classes - find the grid container directly by its distinct classes
    const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-3", "gap-8");
  });

  it("renders ProductCard components with proper links", () => {
    render(<ShopPage />);

    // Check that product cards have proper links
    const trinityLink = screen.getByRole("link", { name: /Trinity Pro/ });
    expect(trinityLink).toHaveAttribute("href", "/shop/trinity-pro");

    const sonyLink = screen.getByRole("link", { name: /Sony ILX-LR1/ });
    expect(sonyLink).toHaveAttribute("href", "/shop/sony-ilx-lr1");

    const qubeLink = screen.getByRole("link", { name: /Qube 640/ });
    expect(qubeLink).toHaveAttribute("href", "/shop/qube-640");
  });

  it("displays Learn More call-to-action for each product", () => {
    render(<ShopPage />);

    // Check that "Learn More" appears for each product (3 times)
    const learnMoreElements = screen.getAllByText("Learn More →");
    expect(learnMoreElements).toHaveLength(3);
  });
});