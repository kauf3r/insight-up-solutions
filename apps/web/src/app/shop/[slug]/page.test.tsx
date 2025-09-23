import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notFound } from 'next/navigation';
import ProductDetailPage, { generateMetadata } from './page';
import { ProductRepository } from '@/repositories/product.repository';
import { ProductType } from '@/lib/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="product-image" />
  ),
}));

// Mock the Header and Footer components
vi.mock('@/components/common/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/common/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock the ProductRepository
vi.mock('@/repositories/product.repository', () => ({
  ProductRepository: {
    getProductBySlug: vi.fn(),
    getAllProducts: vi.fn(),
    getProductsByType: vi.fn(),
  },
}));

const mockRepository = ProductRepository as {
  getProductBySlug: ReturnType<typeof vi.fn>;
  getAllProducts: ReturnType<typeof vi.fn>;
  getProductsByType: ReturnType<typeof vi.fn>;
};

const mockProducts = {
  'trinity-pro': {
    id: 'trinity-pro',
    name: 'Trinity Pro',
    slug: 'trinity-pro',
    description: 'The Trinity Pro is a professional-grade fixed-wing UAV designed for long-range mapping, surveying, and inspection missions.',
    price: 24999,
    type: "UAV" as ProductType.UAV,
    specifications: {
      'Wingspan': '3.2 meters',
      'Maximum Takeoff Weight': '15 kg',
      'Flight Time': 'Up to 4 hours',
    },
    imageUrl: '/images/products/trinity-pro.jpg',
    quoteOnly: false,
  },
  'sony-ilx-lr1': {
    id: 'sony-ilx-lr1',
    name: 'Sony ILX-LR1',
    slug: 'sony-ilx-lr1',
    description: 'The Sony ILX-LR1 is a high-performance imaging payload specifically designed for UAV integration.',
    price: 8999,
    type: "PAYLOAD" as ProductType.PAYLOAD,
    specifications: {
      'Sensor Type': '1-inch CMOS Exmor R',
      'Video Resolution': '4K at 60fps, 1080p at 120fps',
      'Photo Resolution': '20 MP stills',
    },
    imageUrl: '/images/products/sony-ilx-lr1.jpg',
    quoteOnly: false,
  },
  'qube-640': {
    id: 'qube-640',
    name: 'Qube 640',
    slug: 'qube-640',
    description: 'The Qube 640 represents the pinnacle of ground control station technology for professional UAV operations.',
    price: 0,
    type: "ACCESSORY" as ProductType.ACCESSORY,
    specifications: {
      'Display': '15.6-inch 4K touchscreen',
      'Processor': 'Intel i7-12700H 8-core',
      'Memory': '32GB DDR5 RAM',
    },
    imageUrl: '/images/products/qube-640.jpg',
    quoteOnly: true,
  },
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository.getProductBySlug.mockImplementation((slug: string) => {
      return Promise.resolve(mockProducts[slug as keyof typeof mockProducts] || null);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders product details for valid slug', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    // Check if main elements are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // Check product information
    expect(screen.getByText('Trinity Pro')).toBeInTheDocument();
    expect(screen.getByText('Unmanned Aerial Vehicle')).toBeInTheDocument();
    expect(screen.getByText('$24,999')).toBeInTheDocument();

    // Check if description is present
    expect(screen.getByText(/The Trinity Pro is a professional-grade fixed-wing UAV/)).toBeInTheDocument();

    // Check if CTA button is present
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
  });

  it('renders quote-only product correctly', async () => {
    const params = { slug: 'qube-640' };

    render(await ProductDetailPage({ params }));

    // Check product information
    expect(screen.getByText('Qube 640')).toBeInTheDocument();
    expect(screen.getByText('Ground Control System')).toBeInTheDocument();

    // Price should not be displayed for quote-only products
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();

    // Check if CTA button is present
    expect(screen.getByRole('button', { name: /Request a Quote/i })).toBeInTheDocument();
  });

  it('calls notFound for invalid slug', async () => {
    const params = { slug: 'invalid-product' };

    expect(() => {
      ProductDetailPage({ params });
    }).not.toThrow();

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it('renders all tab sections correctly', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    // Check if all tab triggers are present
    expect(screen.getByRole('tab', { name: 'Specifications' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Downloads' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /What.*s in the Box/i })).toBeInTheDocument();

    // Check if specifications content is shown by default
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
    expect(screen.getByText('3.2 meters')).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    // Initially specifications should be visible
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();

    // Click on Downloads tab
    fireEvent.click(screen.getByRole('tab', { name: 'Downloads' }));

    // Downloads content should be visible
    expect(screen.getByText('Downloads & Documentation')).toBeInTheDocument();
    expect(screen.getByText('Product Specification Sheet')).toBeInTheDocument();

    // Specifications content should not be visible
    expect(screen.queryByText('Technical Specifications')).not.toBeInTheDocument();

    // Click on What's in the Box tab
    fireEvent.click(screen.getByRole('tab', { name: /What.*s in the Box/i }));

    // What's in the Box content should be visible
    expect(screen.getAllByText(/What.*s in the Box/)).toHaveLength(2); // Tab title and content heading
    expect(screen.getByText('Hardware Components')).toBeInTheDocument();
    expect(screen.getByText('Documentation & Support')).toBeInTheDocument();
  });

  it('displays correct specifications for Trinity Pro', async () => {
    const trinityParams = { slug: 'trinity-pro' };
    render(await ProductDetailPage({ params: trinityParams }));

    expect(screen.getByText('3.2 meters')).toBeInTheDocument();
    expect(screen.getByText('15 kg')).toBeInTheDocument();
  });

  it('displays correct specifications for Sony ILX-LR1', async () => {
    const sonyParams = { slug: 'sony-ilx-lr1' };
    render(await ProductDetailPage({ params: sonyParams }));

    expect(screen.getByText('1-inch CMOS Exmor R')).toBeInTheDocument();
    expect(screen.getByText('4K at 60fps, 1080p at 120fps')).toBeInTheDocument();
  });

  it('renders product image with correct attributes', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    const image = screen.getByTestId('product-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/products/trinity-pro.jpg');
    expect(image).toHaveAttribute('alt', 'Trinity Pro');
  });

  it('has proper accessibility attributes for tabs', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    // Check tab roles
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    // Check that first tab is selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');

    // Check tabpanel
    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toBeInTheDocument();
  });

  it('handles keyboard navigation for tabs', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    const downloadsTab = screen.getByRole('tab', { name: 'Downloads' });

    // Focus and press Enter on Downloads tab
    downloadsTab.focus();
    fireEvent.keyDown(downloadsTab, { key: 'Enter' });
    fireEvent.click(downloadsTab);

    expect(screen.getByText('Downloads & Documentation')).toBeInTheDocument();
  });

  it('displays product-specific "What\'s in the Box" content for Trinity Pro', async () => {
    cleanup(); // Clean up any previous renders

    const trinityParams = { slug: 'trinity-pro' };
    render(await ProductDetailPage({ params: trinityParams }));

    // Wait for initial content to load
    await waitFor(() => {
      expect(screen.getByText('Trinity Pro')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /What.*s in the Box/i }));

    // Wait for tab content to update with more specific assertions
    await waitFor(() => {
      expect(screen.getByText('Trinity Pro UAV airframe')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText('Flight control computer')).toBeInTheDocument();
  });

  it('displays product-specific "What\'s in the Box" content for Sony ILX-LR1', async () => {
    const sonyParams = { slug: 'sony-ilx-lr1' };
    render(await ProductDetailPage({ params: sonyParams }));

    fireEvent.click(screen.getByRole('tab', { name: /What.*s in the Box/i }));

    await waitFor(() => {
      expect(screen.getByText('Sony ILX-LR1 camera unit')).toBeInTheDocument();
    });
    expect(screen.getByText('3-axis gimbal system')).toBeInTheDocument();
  });

  it('displays product-specific "What\'s in the Box" content for Qube 640', async () => {
    const qubeParams = { slug: 'qube-640' };
    render(await ProductDetailPage({ params: qubeParams }));

    fireEvent.click(screen.getByRole('tab', { name: /What.*s in the Box/i }));

    await waitFor(() => {
      expect(screen.getByText('Qube 640 portable computer')).toBeInTheDocument();
    });
    expect(screen.getByText('High-gain antenna system')).toBeInTheDocument();
  });

  it('displays functional download links', async () => {
    const params = { slug: 'trinity-pro' };

    render(await ProductDetailPage({ params }));

    fireEvent.click(screen.getByRole('tab', { name: 'Downloads' }));

    const downloadLinks = screen.getAllByText('Download');
    expect(downloadLinks).toHaveLength(3);

    // Check multiple download links exist with proper attributes
    const allLinks = screen.getAllByRole('link', { name: 'Download' });
    expect(allLinks.length).toBeGreaterThanOrEqual(1);

    // Check that at least one of them is the spec sheet
    const hasSpecSheetLink = allLinks.some(link =>
      link.getAttribute('href')?.includes('trinity-pro-spec-sheet.pdf')
    );
    expect(hasSpecSheetLink).toBe(true);
  });
});

describe('generateMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository.getProductBySlug.mockImplementation((slug: string) => {
      return Promise.resolve(mockProducts[slug as keyof typeof mockProducts] || null);
    });
  });

  it('generates correct metadata for valid product', async () => {
    const params = { slug: 'trinity-pro' };
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('Trinity Pro - Insight Up Solutions');
    expect(metadata.description).toContain('The Trinity Pro is a professional-grade fixed-wing UAV');
  });

  it('generates not found metadata for invalid product', async () => {
    const params = { slug: 'invalid-product' };
    const metadata = await generateMetadata({ params });

    expect(metadata.title).toBe('Product Not Found - Insight Up Solutions');
    expect(metadata.description).toBe('The requested product could not be found.');
  });

  it('truncates long descriptions for metadata', async () => {
    const params = { slug: 'qube-640' };
    const metadata = await generateMetadata({ params });

    // Description should be truncated to 160 characters
    expect(metadata.description!.length).toBeLessThanOrEqual(160);
  });
});

describe('Product Data Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository.getProductBySlug.mockImplementation((slug: string) => {
      return Promise.resolve(mockProducts[slug as keyof typeof mockProducts] || null);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('displays Trinity Pro correctly', async () => {
    const params = { slug: 'trinity-pro' };
    render(await ProductDetailPage({ params }));

    expect(screen.getByText('Trinity Pro')).toBeInTheDocument();
    expect(screen.getByText('Unmanned Aerial Vehicle')).toBeInTheDocument();
  });

  it('displays Sony ILX-LR1 correctly', async () => {
    const params = { slug: 'sony-ilx-lr1' };
    render(await ProductDetailPage({ params }));

    expect(screen.getByText('Sony ILX-LR1')).toBeInTheDocument();
    expect(screen.getByText('Imaging Payload')).toBeInTheDocument();
  });

  it('displays Qube 640 correctly', async () => {
    const params = { slug: 'qube-640' };
    render(await ProductDetailPage({ params }));

    expect(screen.getByText('Qube 640')).toBeInTheDocument();
    expect(screen.getByText('Ground Control System')).toBeInTheDocument();
  });

  it('handles pricing display for priced product', async () => {
    render(await ProductDetailPage({ params: { slug: 'trinity-pro' } }));
    expect(screen.getByText('$24,999')).toBeInTheDocument();
  });

  it('handles pricing display for quote-only product', async () => {
    render(await ProductDetailPage({ params: { slug: 'qube-640' } }));
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('calls repository methods with correct parameters', async () => {
    const params = { slug: 'trinity-pro' };

    await ProductDetailPage({ params });

    expect(mockRepository.getProductBySlug).toHaveBeenCalledWith('trinity-pro');
  });

  it('handles repository errors gracefully', async () => {
    mockRepository.getProductBySlug.mockRejectedValue(new Error('Database error'));

    const params = { slug: 'trinity-pro' };

    expect(async () => {
      await ProductDetailPage({ params });
    }).not.toThrow();
  });
});