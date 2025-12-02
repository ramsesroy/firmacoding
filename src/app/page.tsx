import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
              Professional Email
              <span className="block mt-2 font-normal">Signatures</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed font-light">
              Create and manage your email signatures effortlessly. 
              Professional design in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 text-base font-normal hover:bg-gray-800 transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto bg-white text-gray-900 px-8 py-3 text-base font-normal hover:bg-gray-50 transition-colors duration-200 border border-gray-300"
              >
                View Features
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <span>No credit card required</span>
              <span className="hidden sm:inline">•</span>
              <span>Quick setup</span>
              <span className="hidden sm:inline">•</span>
              <span>100% free</span>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="border border-gray-200 bg-white">
              <div className="aspect-video bg-gray-50 p-12">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-6 font-light">Preview</p>
                    <div className="inline-block bg-gray-900 text-white px-6 py-3 text-sm">
                      Your professional signature here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 lg:py-40 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Features
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
              Everything you need to create professional signatures
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Feature 1 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Intuitive Editor</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Create customized signatures easily. No technical knowledge required.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Your data is protected with the highest security standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Easy Export</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Compatible with Gmail, Outlook, and any email client.
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Live Preview</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Visualize your signature in real-time as you create it.
              </p>
            </div>

            {/* Feature 5 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Multiple Templates</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Choose from different styles that fit your brand.
              </p>
            </div>

            {/* Feature 6 */}
            <div>
              <div className="w-10 h-10 mb-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">100% Responsive</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Create and edit from any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Teaser */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Premium Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Take Your Signatures to the Next Level
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Unlock powerful features designed for professionals who want more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* AI Enhancer Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}>
                    auto_awesome
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Signature Enhancer</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm mb-4">
                    Get intelligent design suggestions powered by AI. Automatically optimize your signature based on your role, industry, and best practices.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Smart layout recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Industry-specific optimizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Color scheme suggestions</span>
                    </li>
                  </ul>
                  <Link
                    href="#pricing"
                    className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-3 transition-all"
                  >
                    Upgrade to Premium
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Analytics Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}>
                    analytics
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Link Click Analytics</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm mb-4">
                    Track which links in your signature get the most clicks. Understand your audience and optimize your signature for maximum engagement.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Real-time click tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Performance dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Social media engagement insights</span>
                    </li>
                  </ul>
                  <Link
                    href="#pricing"
                    className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-3 transition-all"
                  >
                    Upgrade to Premium
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              View All Premium Features
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
              Three simple steps to create your professional signature
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white text-lg font-normal mb-6">
                1
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Enter Your Information</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Add your name, title, photo, and social links in a simple form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white text-lg font-normal mb-6">
                2
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Customize Your Design</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Choose a template and customize colors, fonts, and styles to your liking.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white text-lg font-normal mb-6">
                3
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-3">Copy & Use</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Copy the HTML and paste it into your email client. Ready to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-light">
            Create your professional signature in minutes
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-3 text-base font-normal hover:bg-gray-100 transition-colors duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

