import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Signature For Me",
  description: "Learn about Signature For Me, the easiest way to create and manage professional email signatures. Our mission, vision, and values.",
  openGraph: {
    title: "About Us - Signature For Me",
    description: "Learn about Signature For Me, the easiest way to create and manage professional email signatures.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us - Signature For Me",
    description: "Learn about Signature For Me, the easiest way to create and manage professional email signatures.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            About Signature For Me
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            We make it simple for professionals to create, customize, and manage beautiful email signatures that reflect their brand.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-8 tracking-tight">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light">
            At Signature For Me, we believe that every professional deserves a polished, professional email signature that makes a great first impression. 
            Our mission is to empower individuals and teams to create stunning email signatures in minutes, without any technical expertise.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            We've built a platform that combines ease of use with powerful customization options, ensuring that your email signature 
            perfectly represents your personal or company brand.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-12 text-center tracking-tight">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Simplicity</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We believe in making complex tasks simple. Our intuitive interface ensures anyone can create professional signatures without training.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Privacy First</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Your data is yours. We implement industry-leading security measures to protect your information and ensure your privacy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Every signature created with our platform is designed to look professional and work seamlessly across all email clients.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We continuously improve our platform based on user feedback, ensuring we stay ahead of email client requirements.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Accessibility</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Professional email signatures should be accessible to everyone, regardless of technical skill or budget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-normal text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We maintain high uptime standards and ensure your signatures are always available when you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-8 tracking-tight">Why We Built This</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light">
            After spending countless hours manually creating email signatures or struggling with complex HTML editors, 
            we realized there had to be a better way. Signature For Me was born from the frustration of creating professional 
            email signatures that actually work across different email clients.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light">
            We understand that your email signature is often the first impression you make. It should be as professional 
            and polished as you are. That's why we've invested in creating templates and tools that work consistently 
            across Gmail, Outlook, Apple Mail, and other major email clients.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            Today, thousands of professionals trust Signature For Me to create and manage their email signatures. 
            We're committed to continuing to innovate and improve, ensuring you always have the best tools at your fingertips.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto font-light">
            Join thousands of professionals who trust Signature For Me for their email signatures.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-3 text-base font-normal hover:bg-gray-800 transition-colors duration-200"
          >
            Create Your Signature
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}




