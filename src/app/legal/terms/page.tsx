import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Signature For Me",
  description: "Terms and conditions of use for Signature For Me. Read our terms of service before using the platform.",
  openGraph: {
    title: "Terms of Service - Signature For Me",
    description: "Terms and conditions of use for Signature For Me. Read our terms of service before using the platform.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - Signature For Me",
    description: "Terms and conditions of use for Signature For Me.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Signature<span className="text-blue-600">For Me</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Signature For Me (the "Service"), you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you must not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
              <p>
                Signature For Me is a SaaS platform that allows users to create, customize, and manage 
                professional email signatures. The service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Signature editor with multiple templates</li>
                <li>Storage of customized signatures</li>
                <li>HTML export functionality</li>
                <li>User account management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Registration and Account</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Creation</h3>
              <p>
                To use our service, you must create an account by providing accurate and complete information. 
                You are responsible for maintaining the confidentiality of your login credentials.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Responsibility</h3>
              <p>
                You are responsible for all activities that occur under your account. You must notify us immediately 
                of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Eligibility</h3>
              <p>
                You must be at least 18 years old to use this service. By registering, you confirm that you meet 
                this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
              <p>
                You agree to use the service only for lawful purposes and in accordance with these terms. 
                You must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for illegal or unauthorized activities</li>
                <li>Attempt to access unauthorized areas of the service</li>
                <li>Interfere with the service operation</li>
                <li>Create signatures containing offensive, defamatory, or illegal content</li>
                <li>Use the service to send spam or unsolicited communications</li>
                <li>Impersonate another person or entity</li>
                <li>Violate third-party intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 User Content</h3>
              <p>
                You retain all rights to the signatures you create using our service. However, 
                by using the service, you grant us a license to store and process your signatures to 
                provide the service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Signature For Me Property</h3>
              <p>
                The service, including all templates, design, code, and functionality, is the property of 
                Signature For Me and is protected by intellectual property laws. You may not copy, modify, 
                or distribute our content without authorization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Service Availability</h2>
              <p>
                We strive to keep the service available 24 hours a day, but we do not guarantee 
                uninterrupted availability. The service may be subject to scheduled maintenance, 
                updates, or interruptions due to circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                Signature For Me is provided "as is" without warranties of any kind. To the maximum extent 
                permitted by law, we shall not be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or information</li>
                <li>Service interruptions</li>
                <li>Errors or inaccuracies in content</li>
                <li>Decisions made based on use of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Service Modifications</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the service 
                at any time, with or without notice. We will not be liable to you or any third party 
                for any modification, suspension, or discontinuation of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your access to the service immediately, without notice, if you violate 
                these Terms of Service. You may also delete your account at any time from the 
                Settings section. When you delete your account, your data and signatures will be permanently deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Privacy</h2>
              <p>
                Your use of the service is also subject to our 
                <Link href="/legal/privacy" className="text-blue-600 hover:underline"> Privacy Policy</Link>, 
                which describes how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. 
                Changes will take effect immediately after posting. Your continued use of the service 
                after changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms of Service are governed by applicable laws. Any dispute related 
                to these terms will be resolved in competent courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact</h2>
              <p>
                If you have questions about these Terms of Service, you can contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: contact@signaturefor.me</li>
                <li>Website: <Link href="/" className="text-blue-600 hover:underline">https://signaturefor.me</Link></li>
              </ul>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}




