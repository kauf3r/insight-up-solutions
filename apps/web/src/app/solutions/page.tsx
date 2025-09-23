import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import IndustrySection from "@/components/common/IndustrySection";

export const metadata: Metadata = {
  title: "Solutions - Insight Up Solutions",
  description: "Discover how our products solve specific problems across key industries including Surveying & Mapping, Precision Agriculture, and Public Safety.",
  keywords: ["solutions", "industry applications", "surveying", "mapping", "precision agriculture", "public safety"],
};

interface IndustryData {
  title: string;
  description: string;
  workflow: string[];
  productLinks: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

const industriesData: IndustryData[] = [
  {
    title: "Surveying & Mapping",
    description: "Precise measurement and mapping solutions for construction, engineering, and land development projects.",
    workflow: [
      "Site reconnaissance and planning",
      "Data collection using advanced instruments",
      "Processing and analysis of survey data",
      "Generation of accurate maps and reports",
      "Quality assurance and validation"
    ],
    productLinks: [
      {
        name: "Total Stations",
        href: "/shop/total-stations",
        description: "High-precision measurement instruments"
      },
      {
        name: "GPS Systems",
        href: "/shop/gps-systems",
        description: "Satellite-based positioning solutions"
      }
    ]
  },
  {
    title: "Precision Agriculture",
    description: "Technology-driven farming solutions that optimize crop yields while minimizing resource usage.",
    workflow: [
      "Field mapping and soil analysis",
      "Variable rate application planning",
      "Real-time monitoring during operations",
      "Yield data collection and analysis",
      "Optimization for next season planning"
    ],
    productLinks: [
      {
        name: "GPS Guidance Systems",
        href: "/shop/gps-guidance",
        description: "Automated steering and field navigation"
      },
      {
        name: "Yield Monitors",
        href: "/shop/yield-monitors",
        description: "Real-time harvest data collection"
      }
    ]
  },
  {
    title: "Public Safety",
    description: "Critical communication and positioning systems for emergency response and law enforcement.",
    workflow: [
      "Emergency dispatch and coordination",
      "Real-time location tracking",
      "Incident scene documentation",
      "Evidence collection and mapping",
      "Post-incident analysis and reporting"
    ],
    productLinks: [
      {
        name: "Mobile Communication Units",
        href: "/shop/mobile-comm",
        description: "Portable emergency communication systems"
      },
      {
        name: "Incident Mapping Tools",
        href: "/shop/incident-mapping",
        description: "Rapid scene documentation equipment"
      }
    ]
  }
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Industry Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our products and services are tailored to solve specific challenges
              across key industries, providing workflows that drive efficiency and success.
            </p>
          </div>

          <div className="space-y-16">
            {industriesData.map((industry, index) => (
              <IndustrySection
                key={industry.title}
                title={industry.title}
                description={industry.description}
                workflow={industry.workflow}
                productLinks={industry.productLinks}
                reverse={index % 2 === 1}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-gray-600 mb-6">
                Our team of experts can help design and implement solutions tailored to your specific industry needs.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Contact Our Experts
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}