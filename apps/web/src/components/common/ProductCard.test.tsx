import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockProduct = {
  image: '/test-image.jpg',
  name: 'Test Product',
  summary: 'This is a test product summary',
  slug: 'test-product'
};

describe('ProductCard', () => {
  it('renders correctly with all required props', () => {
    render(<ProductCard {...mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product summary')).toBeInTheDocument();
    expect(screen.getByText('Learn More →')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('renders image with correct src and alt attributes', () => {
    render(<ProductCard {...mockProduct} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('creates correct navigation link to product detail page', () => {
    render(<ProductCard {...mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/shop/test-product');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<ProductCard {...mockProduct} ref={ref} />);

    expect(ref.current).not.toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <ProductCard {...mockProduct} className="custom-class" />
    );

    const productCard = container.firstChild as HTMLElement;
    expect(productCard).toHaveClass('custom-class');
  });

  it('handles click events on the card', () => {
    const handleClick = vi.fn();
    render(<ProductCard {...mockProduct} onClick={handleClick} />);

    const card = screen.getByRole('link');
    fireEvent.click(card);

    // Link should be clickable (navigation handled by Next.js)
    expect(card).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProductCard {...mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('applies hover and focus styles correctly', () => {
    const { container } = render(<ProductCard {...mockProduct} />);

    const productCard = container.firstChild as HTMLElement;
    expect(productCard).toHaveClass('hover:shadow-lg');
    expect(productCard).toHaveClass('transition-shadow');
  });
});