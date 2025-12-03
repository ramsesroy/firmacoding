import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Signature For Me",
  description: "Get in touch with Signature For Me. Have questions, feedback, or need support? We're here to help.",
  openGraph: {
    title: "Contact Us - Signature For Me",
    description: "Get in touch with Signature For Me. Have questions, feedback, or need support? We're here to help.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Have questions, feedback, or need support? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 font-light">
                <a href="mailto:contact@signaturefor.me" className="hover:text-gray-900 transition-colors">
                  contact@signaturefor.me
                </a>
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 font-light">
                We typically respond within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-600 font-light">
                Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8 tracking-tight">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-normal text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-normal text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-normal text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-normal text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white px-8 py-3 text-base font-normal hover:bg-gray-800 transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
              <p className="text-sm text-gray-500 text-center font-light">
                By submitting this form, you agree to our{" "}
                <Link href="/legal/privacy" className="text-gray-900 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">How quickly will I receive a response?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Can I request a feature?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Absolutely! We love hearing from our users. Send us your feature requests and we'll consider them for future updates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Do you offer support for enterprise customers?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Yes, we offer dedicated support for enterprise customers. Contact us to learn more about our enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">How can I report a bug?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Please send us an email with details about the bug, including what you were doing when it occurred and any error messages you saw.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




