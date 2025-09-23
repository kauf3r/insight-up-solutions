import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductRepository } from "@/repositories/product.repository";
import { Product } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await ProductRepository.getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found - Insight Up Solutions",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} - Insight Up Solutions`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await ProductRepository.getProductBySlug(params.slug);

  if (!product) {
    notFound();
    return null; // This won't be reached, but helps with TypeScript
  }

  const getProductTypeDisplay = (product: Product): string => {
    switch (product.type) {
      case "UAV":
        return "Unmanned Aerial Vehicle";
      case "PAYLOAD":
        return "Imaging Payload";
      case "ACCESSORY":
        return "Ground Control System";
      default:
        return product.type;
    }
  };

  const getWhatsInTheBox = (product: Product): { hardware: string[], documentation: string[] } => {
    const baseItems = {
      hardware: [
        "Main unit",
        "Power supply unit",
        "Mounting hardware",
        "Connection cables"
      ],
      documentation: [
        "Quick start guide",
        "Warranty information",
        "Safety instructions",
        "Support contact details"
      ]
    };

    switch (product.type) {
      case "UAV":
        return {
          hardware: [
            "Trinity Pro UAV airframe",
            "Flight control computer",
            "Catapult launcher",
            "Ground control station tablet",
            "Battery pack (2x)",
            "Propeller set (2x)",
            "Landing gear"
          ],
          documentation: [
            "Flight operations manual",
            "Maintenance schedule",
            "Regulatory compliance guide",
            "Mission planning software",
            "Warranty certificate",
            "Support contact details"
          ]
        };
      case "PAYLOAD":
        return {
          hardware: [
            "Sony ILX-LR1 camera unit",
            "3-axis gimbal system",
            "Mounting bracket",
            "Data transmission module",
            "Control cables",
            "Lens protection cover"
          ],
          documentation: [
            "Camera operation manual",
            "Gimbal calibration guide",
            "Software installation guide",
            "Image processing workflow",
            "Warranty information",
            "Technical support contacts"
          ]
        };
      case "ACCESSORY":
        return {
          hardware: [
            "Qube 640 portable computer",
            "High-gain antenna system",
            "Battery pack (extended)",
            "Protective carrying case",
            "Power adapter",
            "Connection cables"
          ],
          documentation: [
            "System setup guide",
            "Mission planning manual",
            "Communication protocols",
            "Troubleshooting guide",
            "Software license",
            "Technical support"
          ]
        };
      default:
        return baseItems;
    }
  };

  const whatsIncluded = getWhatsInTheBox(product);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {getProductTypeDisplay(product)}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price and CTA */}
              <div className="space-y-4">
                {!product.quoteOnly && (
                  <div className="text-3xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </div>
                )}
                <button className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {product.quoteOnly ? "Request a Quote" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="whats-included">What&apos;s in the Box</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-8">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <dt className="font-medium text-gray-900">{key}</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="downloads" className="mt-8">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Downloads & Documentation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Product Specification Sheet</div>
                      <div className="text-sm text-gray-600">Detailed technical specifications (PDF)</div>
                    </div>
                    <a
                      href={`/downloads/${product.slug}-spec-sheet.pdf`}
                      download
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Installation Guide</div>
                      <div className="text-sm text-gray-600">Step-by-step setup instructions (PDF)</div>
                    </div>
                    <a
                      href={`/downloads/${product.slug}-installation-guide.pdf`}
                      download
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div>
                      <div className="font-medium">User Manual</div>
                      <div className="text-sm text-gray-600">Complete operation manual (PDF)</div>
                    </div>
                    <a
                      href={`/downloads/${product.slug}-user-manual.pdf`}
                      download
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whats-included" className="mt-8">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">What&apos;s in the Box</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Hardware Components</h4>
                    <ul className="space-y-1 text-gray-600">
                      {whatsIncluded.hardware.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Documentation & Support</h4>
                    <ul className="space-y-1 text-gray-600">
                      {whatsIncluded.documentation.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}