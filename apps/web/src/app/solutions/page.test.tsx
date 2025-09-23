import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SolutionsPage from "./page";

describe("Solutions Page", () => {
  it("renders successfully", () => {
    render(<SolutionsPage />);

    // Check for Header component
    expect(screen.getByText("Insight Up Solutions")).toBeInTheDocument();

    // Check for main heading
    expect(screen.getByText("Industry Solutions")).toBeInTheDocument();

    // Check for page description
    expect(screen.getByText(/Discover how our products and services are tailored/)).toBeInTheDocument();

    // Check for Footer component
    expect(screen.getByText(/© 2025 Insight Up Solutions. All rights reserved./)).toBeInTheDocument();
  });

  it("uses proper semantic structure", () => {
    render(<SolutionsPage />);

    // Check for proper HTML structure
    expect(screen.getByRole("banner")).toBeInTheDocument(); // header
    expect(screen.getByRole("main")).toBeInTheDocument(); // main
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
  });

  it("displays all industry sections", () => {
    render(<SolutionsPage />);

    // Check for all three industry sections
    expect(screen.getByText("Surveying & Mapping")).toBeInTheDocument();
    expect(screen.getByText("Precision Agriculture")).toBeInTheDocument();
    expect(screen.getByText("Public Safety")).toBeInTheDocument();
  });

  it("includes workflow information for each industry", () => {
    render(<SolutionsPage />);

    // Check for workflow headings
    const workflowHeadings = screen.getAllByText("Typical Workflow");
    expect(workflowHeadings).toHaveLength(3);

    // Check for some workflow steps
    expect(screen.getByText("Site reconnaissance and planning")).toBeInTheDocument();
    expect(screen.getByText("Field mapping and soil analysis")).toBeInTheDocument();
    expect(screen.getByText("Emergency dispatch and coordination")).toBeInTheDocument();
  });

  it("includes product links for each industry", () => {
    render(<SolutionsPage />);

    // Check for product sections
    const productHeadings = screen.getAllByText("Recommended Products");
    expect(productHeadings).toHaveLength(3);

    // Check for some specific products
    expect(screen.getByText("Total Stations")).toBeInTheDocument();
    expect(screen.getByText("GPS Guidance Systems")).toBeInTheDocument();
    expect(screen.getByText("Mobile Communication Units")).toBeInTheDocument();
  });

  it("includes call-to-action section", () => {
    render(<SolutionsPage />);

    expect(screen.getByText("Need a Custom Solution?")).toBeInTheDocument();
    expect(screen.getByText("Contact Our Experts")).toBeInTheDocument();
  });

  it("has proper heading hierarchy", () => {
    render(<SolutionsPage />);

    // Main page heading (h1)
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toHaveTextContent("Industry Solutions");

    // Industry section headings (h2)
    const industryHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(industryHeadings.length).toBeGreaterThanOrEqual(4); // 3 industries + CTA section

    // Workflow and product headings (h3)
    const subHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(subHeadings.length).toBeGreaterThanOrEqual(6); // 3 workflow + 3 product sections
  });

  it("contains proper navigation links", () => {
    render(<SolutionsPage />);

    // Check for product links
    expect(screen.getByRole("link", { name: /Total Stations/ })).toHaveAttribute("href", "/shop/total-stations");
    expect(screen.getByRole("link", { name: /GPS Guidance Systems/ })).toHaveAttribute("href", "/shop/gps-guidance");
    expect(screen.getByRole("link", { name: /Mobile Communication Units/ })).toHaveAttribute("href", "/shop/mobile-comm");

    // Check for general shop link
    const shopLinks = screen.getAllByRole("link", { name: /View All Products/ });
    expect(shopLinks.length).toBeGreaterThan(0);

    // Check for contact link
    expect(screen.getByRole("link", { name: /Contact Our Experts/ })).toHaveAttribute("href", "/contact");
  });

  it("has accessible content structure", () => {
    render(<SolutionsPage />);

    // Check for proper ARIA labeling on sections
    const sections = screen.getAllByRole("region");
    expect(sections.length).toBeGreaterThan(0);

    // Check for proper list structure in workflows
    const lists = screen.getAllByRole("list");
    expect(lists.length).toBeGreaterThanOrEqual(3); // At least one for each industry workflow
  });
});