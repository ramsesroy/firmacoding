import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Signature For Me",
  description: "Signature For Me cookie policy. Learn how we use cookies and similar technologies on our website.",
  openGraph: {
    title: "Cookie Policy - Signature For Me",
    description: "Signature For Me cookie policy. Learn how we use cookies and similar technologies on our website.",
  },
};

export default function CookiesPage() {
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
            Cookie Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit a website. 
                These cookies allow the website to remember your actions and preferences over a period of time, 
                so you don't have to reconfigure them every time you return to the site or navigate from one page to another.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
              <p>
                Signature For Me uses cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Authentication:</strong> Keep your session active while using the service
                </li>
                <li>
                  <strong>Preferences:</strong> Remember your preferences and settings
                </li>
                <li>
                  <strong>Security:</strong> Detect and prevent fraudulent or unauthorized activities
                </li>
                <li>
                  <strong>Analytics:</strong> Understand how you use our service to improve it
                </li>
                <li>
                  <strong>Functionality:</strong> Allow certain site functions to operate correctly
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function correctly. They include authentication cookies 
                that keep your session active and security cookies. You cannot disable these cookies without affecting 
                the site's functionality.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Functionality Cookies</h3>
              <p>
                These cookies allow the website to remember choices you make (such as your preferred language 
                or the region you are in) and provide enhanced, personalized features.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website, 
                providing information about areas visited, time spent, and any issues encountered, such as error messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Cookies</h2>
              <p>
                We use third-party services that may set cookies on your device:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Supabase</h3>
              <p>
                We use Supabase for authentication and data storage. Supabase may use cookies 
                to manage sessions and provide their services. For more information, see 
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Supabase's privacy policy</a>.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Google OAuth</h3>
              <p>
                If you choose to sign in with Google, Google may set cookies according to their privacy policy. 
                For more information, see 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Google's privacy policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cookie Management</h2>
              <p>
                You can control and/or delete cookies as you wish. You can delete all cookies that are already 
                on your device and you can set most browsers to prevent them from being placed. 
                However, if you do this, you may have to manually adjust some preferences every time 
                you visit a site and some services and functionalities may not work.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 How to Delete or Block Cookies</h3>
              <p>
                You can manage cookies through your browser settings. Here are links 
                to instructions for the most popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/en-us/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies We Use Specifically</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        sb-access-token
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Maintain authentication session
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        sb-refresh-token
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Refresh authentication session
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        30 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Changes to this Policy</h2>
              <p>
                We may update this Cookie Policy occasionally. We will notify you of significant changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. More Information</h2>
              <p>
                For more information about how we protect your privacy, see our 
                <Link href="/legal/privacy" className="text-blue-600 hover:underline"> Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact</h2>
              <p>
                If you have questions about our Cookie Policy, you can contact us at:
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
