import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders copyright text correctly', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} Insight Up Solutions. All rights reserved.`);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.tagName).toBe('FOOTER');
  });

  it('applies custom className prop', () => {
    const customClass = 'custom-footer-class';
    render(<Footer className={customClass} />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass(customClass);
  });

  it('forwards additional props to footer element', () => {
    render(<Footer data-testid="custom-footer" />);

    const footerElement = screen.getByTestId('custom-footer');
    expect(footerElement).toBeInTheDocument();
  });

  it('displays copyright text with correct styling', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} Insight Up Solutions. All rights reserved.`);
    expect(copyrightText).toHaveClass('text-sm', 'text-gray-600');
  });

  it('has proper semantic structure with centered text', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    const textContainer = footerElement.querySelector('div[class*="text-center"]');

    expect(textContainer).toBeInTheDocument();
    expect(textContainer).toHaveClass('text-center');
  });

  it('displays current year dynamically', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const yearText = screen.getByText(new RegExp(`© ${currentYear}`));
    expect(yearText).toBeInTheDocument();
  });
});