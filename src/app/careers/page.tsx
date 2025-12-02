import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers - Signature For Me",
  description: "Join the Signature For Me team. Explore open positions and opportunities to help professionals create better email signatures.",
  openGraph: {
    title: "Careers - Signature For Me",
    description: "Join the Signature For Me team. Explore open positions and opportunities.",
  },
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Help us build the future of professional email signatures. We're always looking for talented individuals to join our mission.
          </p>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className="py-20 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-12 text-center tracking-tight">Open Positions</h2>
          
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xl font-normal text-gray-900 mb-3">We're Not Currently Hiring</h3>
              <p className="text-gray-600 leading-relaxed font-light mb-4">
                While we don't have any open positions at the moment, we're always interested in connecting with talented individuals 
                who share our passion for creating great user experiences.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                If you believe you'd be a great addition to our team, feel free to send us your resume and a brief note about 
                why you're interested in Signature For Me at{" "}
                <a href="mailto:careers@signaturefor.me" className="text-gray-900 hover:underline">careers@signaturefor.me</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-12 text-center tracking-tight">Why Work With Us</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Help thousands of professionals create better first impressions every day. Your work directly improves how people present themselves online.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Growth</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Work on interesting technical challenges while contributing to a product that's growing and evolving rapidly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Flexibility</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We value work-life balance and offer flexible working arrangements to help you do your best work.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Culture</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Join a team that values collaboration, creativity, and continuous learning. We support each other and celebrate successes together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 tracking-tight">
            Interested in Working With Us?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-light">
            Even if we're not actively hiring, we'd love to hear from you.
          </p>
          <a
            href="mailto:careers@signaturefor.me"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-3 text-base font-normal hover:bg-gray-100 transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

