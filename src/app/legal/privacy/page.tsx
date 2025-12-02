import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Signature For Me",
  description: "Signature For Me privacy policy. Learn how we protect and use your personal information.",
  openGraph: {
    title: "Privacy Policy - Signature For Me",
    description: "Signature For Me privacy policy. Learn how we protect and use your personal information.",
  },
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
              <p>
                Signature For Me ("we", "our", or "the application") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and protect your personal information 
                when you use our professional email signature creation service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Account Information</h3>
              <p>
                When you create an account with Signature For Me, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address</li>
                <li>Name (optional)</li>
                <li>Authentication information (through Supabase)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Signature Information</h3>
              <p>
                When you create an email signature, we store:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and professional title</li>
                <li>Phone number (optional)</li>
                <li>Profile photo (if provided)</li>
                <li>Social media links</li>
                <li>Selected template and design preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Technical Information</h3>
              <p>
                We automatically collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent</li>
                <li>Access date and time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and store your email signatures</li>
                <li>Process your requests and manage your account</li>
                <li>Send important notifications about the service</li>
                <li>Detect and prevent fraud or unauthorized activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> We use Supabase for data storage and authentication, 
                  which is subject to their own privacy policies.
                </li>
                <li>
                  <strong>OAuth with Google:</strong> If you choose to sign in with Google, Google may collect information 
                  according to their privacy policy.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect 
                  our legal rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Storage and Security</h2>
              <p>
                Your data is stored securely using:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data encryption in transit (HTTPS)</li>
                <li>Data encryption at rest</li>
                <li>Secure authentication via Supabase</li>
                <li>Row-level security policies (RLS) in the database</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Export your data</li>
                <li>Object to processing of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, you can contact us or delete your account from the Settings section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies and Similar Technologies</h2>
              <p>
                We use cookies and similar technologies to improve your experience. For more information, 
                see our <Link href="/legal/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children</h2>
              <p>
                Our service is intended for people over 18 years of age. We do not knowingly collect information 
                from children. If we discover that we have collected information from a minor, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to this Policy</h2>
              <p>
                We may update this Privacy Policy occasionally. We will notify you of significant changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, you can contact us at:
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

