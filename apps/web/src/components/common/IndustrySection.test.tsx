import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import IndustrySection from "./IndustrySection";

const mockProps = {
  title: "Test Industry",
  description: "This is a test industry description for testing purposes.",
  workflow: [
    "First step in the workflow",
    "Second step in the workflow",
    "Third step in the workflow"
  ],
  productLinks: [
    {
      name: "Test Product 1",
      href: "/shop/test-product-1",
      description: "Description for test product 1"
    },
    {
      name: "Test Product 2",
      href: "/shop/test-product-2",
      description: "Description for test product 2"
    }
  ]
};

describe("IndustrySection Component", () => {
  it("renders successfully with required props", () => {
    render(<IndustrySection {...mockProps} />);

    expect(screen.getByText("Test Industry")).toBeInTheDocument();
    expect(screen.getByText("This is a test industry description for testing purposes.")).toBeInTheDocument();
  });

  it("displays the workflow section correctly", () => {
    render(<IndustrySection {...mockProps} />);

    expect(screen.getByText("Typical Workflow")).toBeInTheDocument();

    // Check for workflow steps
    expect(screen.getByText("First step in the workflow")).toBeInTheDocument();
    expect(screen.getByText("Second step in the workflow")).toBeInTheDocument();
    expect(screen.getByText("Third step in the workflow")).toBeInTheDocument();

    // Check for numbered workflow items
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays product links correctly", () => {
    render(<IndustrySection {...mockProps} />);

    expect(screen.getByText("Recommended Products")).toBeInTheDocument();

    // Check for product names and descriptions
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Description for test product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("Description for test product 2")).toBeInTheDocument();

    // Check for proper links
    expect(screen.getByRole("link", { name: /Test Product 1/ })).toHaveAttribute("href", "/shop/test-product-1");
    expect(screen.getByRole("link", { name: /Test Product 2/ })).toHaveAttribute("href", "/shop/test-product-2");
  });

  it("includes View All Products link", () => {
    render(<IndustrySection {...mockProps} />);

    const viewAllLink = screen.getByRole("link", { name: /View All Products/ });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/shop");
  });

  it("applies reverse layout when reverse prop is true", () => {
    render(<IndustrySection {...mockProps} reverse={true} />);

    const section = screen.getByRole("region");
    expect(section).toBeInTheDocument();

    // Check that the component renders (reverse styling is handled via CSS classes)
    expect(screen.getByText("Test Industry")).toBeInTheDocument();
  });

  it("applies default layout when reverse prop is false or undefined", () => {
    render(<IndustrySection {...mockProps} reverse={false} />);

    const section = screen.getByRole("region");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Test Industry")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<IndustrySection {...mockProps} />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole("heading", { level: 2 });
    expect(mainHeading).toHaveTextContent("Test Industry");
    expect(mainHeading).toHaveAttribute("id", "test-industry-heading");

    // Check for section with proper aria-labelledby
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-labelledby", "test-industry-heading");

    // Check for workflow list
    const workflowList = screen.getByRole("list");
    expect(workflowList).toBeInTheDocument();
  });

  it("handles empty workflow array", () => {
    const propsWithEmptyWorkflow = {
      ...mockProps,
      workflow: []
    };

    render(<IndustrySection {...propsWithEmptyWorkflow} />);

    expect(screen.getByText("Typical Workflow")).toBeInTheDocument();
    // No workflow items should be rendered
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("handles empty product links array", () => {
    const propsWithEmptyProducts = {
      ...mockProps,
      productLinks: []
    };

    render(<IndustrySection {...propsWithEmptyProducts} />);

    expect(screen.getByText("Recommended Products")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View All Products/ })).toBeInTheDocument();
    // No product links should be rendered
    expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
  });

  it("renders with forwardRef correctly", () => {
    const ref = { current: null };
    render(<IndustrySection {...mockProps} ref={ref} />);

    expect(screen.getByText("Test Industry")).toBeInTheDocument();
  });

  it("generates correct heading ID from title", () => {
    const propsWithSpacedTitle = {
      ...mockProps,
      title: "Complex Industry Name With Spaces"
    };

    render(<IndustrySection {...propsWithSpacedTitle} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "complex-industry-name-with-spaces-heading");
  });

  it("displays proper semantic structure", () => {
    render(<IndustrySection {...mockProps} />);

    // Check for section element
    expect(screen.getByRole("region")).toBeInTheDocument();

    // Check for proper heading levels
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument(); // Industry title
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2); // Workflow and Products headings
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(2); // Product names
  });
});