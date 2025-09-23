import React from "react";
import Link from "next/link";

interface ProductLink {
  name: string;
  href: string;
  description: string;
}

interface IndustrySectionProps {
  title: string;
  description: string;
  workflow: string[];
  productLinks: ProductLink[];
  reverse?: boolean;
}

const IndustrySection = React.forwardRef<HTMLElement, IndustrySectionProps>(
  ({ title, description, workflow, productLinks, reverse = false }, ref) => {
    return (
      <section
        ref={ref}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
      >
        <div className={`space-y-6 ${reverse ? 'lg:order-2' : ''}`}>
          <div>
            <h2
              id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Typical Workflow
            </h3>
            <ol className="space-y-2">
              {workflow.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={`${reverse ? 'lg:order-1' : ''}`}>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recommended Products
            </h3>
            <div className="space-y-4">
              {productLinks.map((product, index) => (
                <Link
                  key={index}
                  href={product.href}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.description}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/shop"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View All Products
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

IndustrySection.displayName = "IndustrySection";

export default IndustrySection;