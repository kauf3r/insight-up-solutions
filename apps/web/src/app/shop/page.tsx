import { Metadata } from 'next';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/common/ProductCard";

export const metadata: Metadata = {
  title: "Product Catalog - Insight Up Solutions",
  description: "Browse our complete catalog of innovative business solutions and products.",
};

// Placeholder product data following the Product interface
const products = [
  {
    id: "trinity-pro",
    name: "Trinity Pro",
    slug: "trinity-pro",
    image: "/images/products/trinity-pro.jpg",
    summary: "Advanced business automation platform with AI-powered insights and comprehensive analytics dashboard.",
    price: 2999,
    quoteOnly: false,
  },
  {
    id: "sony-ilx-lr1",
    name: "Sony ILX-LR1",
    slug: "sony-ilx-lr1",
    image: "/images/products/sony-ilx-lr1.jpg",
    summary: "Professional-grade media processing solution with real-time streaming capabilities and 4K support.",
    price: 1599,
    quoteOnly: false,
  },
  {
    id: "qube-640",
    name: "Qube 640",
    slug: "qube-640",
    image: "/images/products/qube-640.jpg",
    summary: "Enterprise storage and computing solution designed for high-performance data processing workflows.",
    price: 0,
    quoteOnly: true,
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Catalog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of innovative business solutions designed to transform your operations.
            </p>
          </div>

          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                image={product.image}
                summary={product.summary}
                slug={product.slug}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}