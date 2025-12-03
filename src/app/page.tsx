"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useState } from "react";

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      image: "👩‍💼",
      text: "Creating professional signatures has never been easier. The templates are beautiful and the interface is intuitive. Saved me hours of work!",
    },
    {
      name: "Michael Chen",
      role: "Sales Manager",
      company: "Global Solutions",
      image: "👨‍💼",
      text: "Our entire sales team now uses Signature For Me. The consistent branding across all our emails has improved our professional image significantly.",
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Independent",
      image: "👩‍🎨",
      text: "As a freelancer, having a polished email signature is crucial. This tool helped me create multiple signatures for different clients effortlessly.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Signatures Created" },
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ];

  const faqs = [
    {
      question: "Is Signature For Me really free?",
      answer: "Yes! Our basic plan is completely free forever. You can create unlimited signatures with access to all templates and export features.",
    },
    {
      question: "Can I use the signatures with Gmail?",
      answer: "Absolutely! Our signatures work with Gmail, Outlook, Apple Mail, and virtually any email client that supports HTML signatures.",
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Not at all! Our intuitive editor makes it easy for anyone to create professional signatures. Just fill in your information and customize.",
    },
    {
      question: "Can I customize the templates?",
      answer: "Yes! You can customize colors, fonts, layouts, and add your own logo and photos. Each template is fully customizable to match your brand.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All your data is encrypted and stored securely. You can delete your data at any time from your account settings.",
    },
    {
      question: "Can I export my signature?",
      answer: "Yes! You can export your signature as HTML, PNG, or PDF. Copy and paste directly into your email client or download for offline use.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-blue-50 animate-gradient -z-10"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: "2s" }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimation direction="fade" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-sm font-medium text-blue-700 mb-8 shadow-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                New: AI Signature Enhancer Available Now
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="down" delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Professional Email
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Signatures in Minutes
                </span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={200}>
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Create stunning, professional email signatures effortlessly. 
                <span className="block mt-2 font-medium text-gray-700">No design skills required.</span>
              </p>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  href="/dashboard"
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 animate-pulse-glow"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="#features"
                  className="group w-full sm:w-auto bg-white text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    View Features
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={400}>
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Quick setup in 2 minutes</span>
                </div>
                <div className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">100% free forever</span>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Hero Preview with Animation */}
          <ScrollAnimation direction="up" delay={500} className="mt-24 max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              <div className="relative border-2 border-gray-200 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm text-gray-500 font-medium">Signature Preview</div>
                </div>
                <div className="p-8 sm:p-12 bg-gradient-to-br from-white to-gray-50">
                  <div className="max-w-2xl mx-auto">
                    {/* Sample Signature Preview */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform group-hover:scale-105 transition-transform duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          JD
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
                          <p className="text-gray-600 mb-3">Marketing Director at TechCorp</p>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <p>📧 john.doe@techcorp.com</p>
                            <p>📱 +1 (555) 123-4567</p>
                            <p>🌐 www.techcorp.com</p>
                          </div>
                          <div className="flex gap-3">
                            {["LinkedIn", "Twitter", "Instagram"].map((social) => (
                              <div key={social} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                <span className="text-xs text-gray-600">{social[0]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 100} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/90 text-sm sm:text-base font-medium">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 lg:py-40 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation direction="down" className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to create professional email signatures that make an impact
            </p>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: "✨",
                title: "Intuitive Editor",
                description: "Create customized signatures easily. No technical knowledge required. Drag, drop, and customize in minutes.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Your data is protected with the highest security standards. We never share your information with third parties.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "📤",
                title: "Easy Export",
                description: "Compatible with Gmail, Outlook, Apple Mail, and any email client. One-click export in multiple formats.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: "👁️",
                title: "Live Preview",
                description: "Visualize your signature in real-time as you create it. See exactly how it will look in emails.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: "🎨",
                title: "Multiple Templates",
                description: "Choose from 20+ professional templates. Each one is fully customizable to match your brand perfectly.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: "📱",
                title: "100% Responsive",
                description: "Create and edit from any device. Your signatures look perfect on desktop, tablet, and mobile.",
                gradient: "from-teal-500 to-blue-500",
              },
            ].map((feature, index) => (
              <ScrollAnimation
                key={index}
                direction="up"
                delay={index * 100}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollAnimation direction="down" className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Premium Features
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Take Your Signatures to the Next Level
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock powerful features designed for professionals who want more
            </p>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: "✨",
                title: "AI Signature Enhancer",
                description: "Get intelligent design suggestions powered by AI. Automatically optimize your signature based on your role, industry, and best practices.",
                features: ["Smart layout recommendations", "Industry-specific optimizations", "Color scheme suggestions"],
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: "📊",
                title: "Link Click Analytics",
                description: "Track which links in your signature get the most clicks. Understand your audience and optimize your signature for maximum engagement.",
                features: ["Real-time click tracking", "Performance dashboard", "Social media engagement insights"],
                gradient: "from-blue-500 to-cyan-600",
              },
            ].map((feature, index) => (
              <ScrollAnimation key={index} direction={index % 2 === 0 ? "right" : "left"} delay={index * 200}>
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group h-full">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                      <ul className="space-y-3 mb-6">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="#pricing"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-3 transition-all"
                      >
                        Upgrade to Premium
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation direction="fade" delay={400} className="text-center mt-12">
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
            >
              View All Premium Features
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="down" className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users are saying about Signature For Me
            </p>
          </ScrollAnimation>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimation
                  key={index}
                  direction="up"
                  delay={index * 150}
                  className={`cursor-pointer ${activeTestimonial === index ? "scale-105" : "scale-100"} transition-transform duration-300`}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className={`h-full bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                    activeTestimonial === index 
                      ? "border-blue-500 shadow-2xl" 
                      : "border-gray-100 hover:border-gray-200 hover:shadow-xl"
                  }`}>
                    <div className="text-4xl mb-4">{testimonial.image}</div>
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="down" className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create your professional signature
            </p>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-3 gap-12 lg:gap-16 relative">
            {/* Connection Line */}
            <div className="hidden sm:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>

            {[
              {
                number: "1",
                title: "Enter Your Information",
                description: "Add your name, title, photo, and social links in a simple, intuitive form. No complex setup required.",
                icon: "📝",
              },
              {
                number: "2",
                title: "Customize Your Design",
                description: "Choose from our beautiful templates and customize colors, fonts, and styles to match your brand perfectly.",
                icon: "🎨",
              },
              {
                number: "3",
                title: "Copy & Use",
                description: "Copy the HTML code or export as PNG/PDF. Paste it into your email client and you're ready to go!",
                icon: "🚀",
              },
            ].map((step, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 200} className="relative">
                <div className="text-center group">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                    <span className="text-4xl">{step.icon}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimation direction="down" className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Signature For Me
            </p>
          </ScrollAnimation>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollAnimation direction="fade">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are already creating stunning email signatures
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-white/20"
            >
              <span>Get Started Free</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-6 text-gray-400 text-sm">
              No credit card required • Setup in 2 minutes • Free forever
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ScrollAnimation direction="up" delay={index * 100}>
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-blue-200 transition-colors duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-gray-900 text-lg">{question}</span>
          <svg
            className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 text-gray-600 leading-relaxed">{answer}</div>
        </div>
      </div>
    </ScrollAnimation>
  );
}
