import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License - Signature For Me",
  description: "Information about the license and terms of use for Signature For Me software.",
  openGraph: {
    title: "License - Signature For Me",
    description: "Information about the license and terms of use for Signature For Me software.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "License - Signature For Me",
    description: "Information about the license and terms of use for Signature For Me software.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LicensePage() {
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
            License
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Intellectual Property</h2>
              <p>
                Signature For Me and all its content, including but not limited to designs, text, graphics, 
                logos, icons, images, source code, compilations, software, and other materials (collectively, 
                the "Content"), are the property of Signature For Me or its content suppliers and are protected 
                by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. License to Use</h2>
              <p>
                You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use 
                Signature For Me solely for your personal or internal commercial use. This license is subject to the 
                following terms and conditions:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 What You CAN do:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service to create professional email signatures</li>
                <li>Create and store multiple signatures for your personal or professional use</li>
                <li>Export your signatures in HTML format for use in emails</li>
                <li>Share your created signatures with others</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 What You CANNOT do:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, modify, or distribute the service source code</li>
                <li>Attempt to extract or decompile the software</li>
                <li>Use the service to create competing products or services</li>
                <li>Reuse templates for other services without authorization</li>
                <li>Remove or alter copyright notices or registered trademarks</li>
                <li>Sell, sublicense, or transfer your access to the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Content</h2>
              <p>
                You retain all intellectual property rights to the signatures you create using Signature For Me. 
                However, by using the service, you grant us a worldwide, non-exclusive, royalty-free 
                license to store, process, and display your signatures solely to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Templates and Designs</h2>
              <p>
                The templates and designs provided by Signature For Me are the property of Signature For Me. 
                You may use these templates to create your personal signatures, but you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Extract or copy template designs for use outside the service</li>
                <li>Create competing services based on our templates</li>
                <li>Modify or redistribute the templates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Trademarks</h2>
              <p>
                "Signature For Me", the logo, and other trade names, service marks, graphics, and logos 
                used in connection with the service are trademarks or service marks of Signature For Me. 
                You may not use these marks without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Technologies</h2>
              <p>
                Signature For Me uses technologies and services from third parties, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Supabase:</strong> For authentication and data storage. 
                  Subject to Supabase's license.
                </li>
                <li>
                  <strong>Next.js:</strong> Development framework under MIT license.
                </li>
                <li>
                  <strong>React:</strong> JavaScript library under MIT license.
                </li>
                <li>
                  <strong>Tailwind CSS:</strong> CSS framework under MIT license.
                </li>
              </ul>
              <p className="mt-4">
                These technologies are subject to their own licenses and terms of use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. License Termination</h2>
              <p>
                This license is effective until terminated. It will terminate automatically if you violate any of 
                these terms. Additionally, we may terminate your access to the service at any time, with or without cause 
                or notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. No Warranties</h2>
              <p>
                The service is provided "as is" and "as available" without warranties of any kind, 
                whether express or implied, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Signature For Me shall not be liable for any direct, 
                indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use 
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to this License</h2>
              <p>
                We reserve the right to modify this License at any time. Changes will take effect 
                immediately after posting on this page. Your continued use of the service after the changes constitutes your acceptance 
                of the modified license.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
              <p>
                This License is governed by applicable laws. Any dispute related to this license will be 
                resolved in competent courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact</h2>
              <p>
                If you have questions about this License, you can contact us at:
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




