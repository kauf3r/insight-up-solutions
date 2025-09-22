import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders company name correctly', () => {
    render(<Header />);

    const companyName = screen.getByText('Insight Up Solutions');
    expect(companyName).toBeInTheDocument();
  });

  it('renders as a header element', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe('HEADER');
  });

  it('applies custom className prop', () => {
    const customClass = 'custom-header-class';
    render(<Header className={customClass} />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass(customClass);
  });

  it('forwards additional props to header element', () => {
    render(<Header data-testid="custom-header" />);

    const headerElement = screen.getByTestId('custom-header');
    expect(headerElement).toBeInTheDocument();
  });

  it('displays company name with correct styling', () => {
    render(<Header />);

    const companyName = screen.getByText('Insight Up Solutions');
    expect(companyName).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
  });

  it('has proper semantic structure', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    const heading = screen.getByRole('heading', { level: 1 });

    expect(headerElement).toContainElement(heading);
    expect(heading).toHaveTextContent('Insight Up Solutions');
  });
});