"use client";

import { useState } from "react";
import Link from "next/link";

interface Feature {
  text: string;
}

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: Feature[];
  ctaText: string;
  ctaHref: string;
  badge?: string;
  ribbon?: string;
  gradient?: boolean;
  popular?: boolean;
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers: PricingTier[] = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for trying out our service",
      features: [
        { text: "Unlimited signature creation" },
        { text: "Save up to 3 signatures (registered users only)" },
        { text: "Export as HTML" },
        { text: "Export PNG & PDF (standard quality, registered users only)" },
        { text: "Basic templates" },
        { text: 'Small "Signature For Me" watermark' },
      ],
      ctaText: "Get started",
      ctaHref: "/dashboard",
    },
    {
      name: "Premium",
      monthlyPrice: 5,
      yearlyPrice: 49,
      description: "Most popular choice for professionals",
      features: [
        { text: "Everything in Free" },
        { text: "AI Signature Helper (smart suggestions)" },
        { text: "Unlimited saved signatures" },
        { text: "High-resolution PNG & PDF exports (vector-sharp)" },
        { text: "Link click analytics (basic dashboard)" },
        { text: "QR code generator (dynamic)" },
        { text: "No watermark" },
        { text: "Priority email support" },
      ],
      ctaText: "Upgrade now",
      ctaHref: "/dashboard",
      badge: "MOST POPULAR",
      popular: true,
      gradient: true,
    },
    {
      name: "Team",
      monthlyPrice: 29,
      yearlyPrice: 279,
      description: "For growing teams",
      features: [
        { text: "Everything in Premium" },
        { text: "AI Enhancer (auto-optimize based on role/industry)" },
        { text: "Bulk CSV upload → generate signatures for entire team" },
        { text: "Team dashboard & member management" },
        { text: "Custom branding (logo + colors)" },
        { text: "Custom subdomain (yourcompany.signaturefor.me)" },
        { text: "Priority support" },
      ],
      ctaText: "Upgrade now",
      ctaHref: "/dashboard",
      ribbon: "Coming January 2026",
    },
    {
      name: "Agency",
      monthlyPrice: 99,
      yearlyPrice: 949,
      description: "Advanced features for agencies",
      features: [
        { text: "Everything in Team" },
        { text: "Advanced analytics (clicks, impressions, heatmaps)" },
        { text: "Rotating promotional banners" },
        { text: "White-label (remove all Signature For Me branding)" },
        { text: "Google Workspace & Microsoft 365 sync" },
        { text: "API access" },
        { text: "Dedicated account manager" },
      ],
      ctaText: "Upgrade now",
      ctaHref: "/dashboard",
      badge: "Perfect for agencies",
    },
  ];

  const calculateYearlyDiscount = (monthly: number, yearly: number) => {
    const monthlyYearly = monthly * 12;
    const discount = ((monthlyYearly - yearly) / monthlyYearly) * 100;
    return Math.round(discount);
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light mb-8">
            Choose the perfect plan for your needs. All plans include our core features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className={`text-sm font-medium transition-colors ${
                !isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-300 shadow-lg transition-transform ${
                  isAnnual ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className="flex items-center gap-2">
              <span
                className={`text-sm font-medium transition-colors ${
                  isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Annual
              </span>
              <span className="text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.yearlyPrice : tier.monthlyPrice;
            const displayPrice =
              price === 0
                ? "$0"
                : isAnnual
                ? `$${tier.yearlyPrice}`
                : `$${tier.monthlyPrice}`;
            const period = isAnnual ? "/year" : "/month";
            const discount =
              tier.monthlyPrice > 0
                ? calculateYearlyDiscount(tier.monthlyPrice, tier.yearlyPrice)
                : 0;

            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                  tier.ribbon
                    ? "opacity-75 cursor-default"
                    : "hover:scale-105 hover:shadow-2xl"
                } ${
                  tier.popular
                    ? "border-blue-500 dark:border-blue-400 shadow-xl lg:scale-105"
                    : tier.ribbon
                    ? "border-gray-200 dark:border-gray-700"
                    : "border-gray-200 dark:border-gray-700 shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
                } ${
                  tier.gradient
                    ? "bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950 dark:via-purple-950 dark:to-blue-950"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold z-10 ${
                      tier.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                {/* Coming Soon Ribbon */}
                {tier.ribbon && (
                  <div className="absolute top-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl z-10">
                    {tier.ribbon}
                  </div>
                )}

                <div className={`flex-1 p-6 lg:p-8 ${tier.badge ? "pt-8" : ""}`}>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                        {displayPrice}
                      </span>
                      {price > 0 && (
                        <span className="text-lg text-gray-600 dark:text-gray-400 font-light">
                          {period}
                        </span>
                      )}
                    </div>
                    {isAnnual && price > 0 && discount > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                        Save {discount}% vs monthly
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={tier.ctaHref}
                    className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-6 ${
                      tier.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    } ${tier.ribbon ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e) => {
                      if (tier.ribbon) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {tier.ctaText}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-4 flex-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}

