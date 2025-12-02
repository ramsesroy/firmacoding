import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Signature For Me",
  description: "Tips, guides, and insights about email signatures, professional communication, and digital branding from Signature For Me.",
  openGraph: {
    title: "Blog - Signature For Me",
    description: "Tips, guides, and insights about email signatures and professional communication.",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Tips, guides, and insights about email signatures, professional communication, and digital branding.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 leading-relaxed font-light mb-6">
              We're working on creating valuable content about email signatures, professional communication, 
              and best practices. Check back soon for updates!
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-gray-900 hover:text-gray-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

