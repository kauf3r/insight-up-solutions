import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Insight Up Solutions
          </h2>
          <p className="text-lg text-gray-600">
            Your trusted partner for innovative business solutions.
          </p>
          <p className="text-sm text-blue-500 mt-4 font-medium">
            🚀 Preview deployment test - CI/CD pipeline working!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
