"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { getUserLimits, getUserSubscription } from "@/lib/subscriptionUtils";
import { useToast } from "@/components/Toast";
import { MetadataHead } from "@/components/MetadataHead";
import { SkeletonCard } from "@/components/Skeleton";

interface UserLimits {
  saved_signatures_count: number;
  max_saved_signatures: number;
  remaining: number;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { subscription, isPremium, loading: subscriptionLoading } = useSubscription();
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        // Obtener límites
        const userLimits = await getUserLimits(session.user.id);
        if (userLimits) {
          const remaining = userLimits.max_saved_signatures === -1 
            ? -1 
            : Math.max(0, userLimits.max_saved_signatures - userLimits.saved_signatures_count);
          setLimits({
            saved_signatures_count: userLimits.saved_signatures_count,
            max_saved_signatures: userLimits.max_saved_signatures,
            remaining,
          });
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        showToast("Error loading subscription information", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, showToast]);

  if (loading || subscriptionLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Unable to load subscription information.</p>
        </div>
      </div>
    );
  }

  const planFeatures = {
    free: {
      name: "Free",
      description: "Perfect for trying out our service",
      features: [
        "6 Basic Templates",
        "Unlimited signature creation",
        "Save up to 3 signatures",
        "Export as HTML",
        "Export PNG & PDF (with watermark)",
        "Small watermark on exports",
      ],
      price: 0,
      color: "gray",
    },
    premium: {
      name: "Premium",
      description: "Most popular choice for professionals",
      features: [
        "20+ Premium Templates",
        "Unlimited saved signatures",
        "High-resolution PNG & PDF exports",
        "No watermark",
        "Link click analytics (coming soon)",
        "QR code generator (coming soon)",
        "Priority email support",
      ],
      price: 5,
      color: "blue",
    },
    team: {
      name: "Team",
      description: "For growing teams",
      features: [
        "Everything in Premium",
        "AI Enhancer (coming soon)",
        "Bulk CSV upload (coming soon)",
        "Team dashboard (coming soon)",
        "Custom branding (coming soon)",
        "Priority support",
      ],
      price: 29,
      color: "purple",
    },
    agency: {
      name: "Agency",
      description: "Advanced features for agencies",
      features: [
        "Everything in Team",
        "Advanced analytics (coming soon)",
        "White-label option (coming soon)",
        "API access (coming soon)",
        "Dedicated account manager",
      ],
      price: 99,
      color: "indigo",
    },
  };

  const currentPlan = planFeatures[subscription.plan_type as keyof typeof planFeatures] || planFeatures.free;
  const isActive = subscription.status === "active" || subscription.status === "trialing";
  const periodEnd = subscription.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <MetadataHead
        title="Subscription Management - Signature For Me"
        description="Manage your subscription plan and view your usage limits"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-blue-600">card_membership</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscription Management</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-11">
            Manage your plan and view your usage limits
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Plan Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Info */}
            <div className={`bg-gradient-to-br from-${currentPlan.color}-50 to-${currentPlan.color}-100 border-2 border-${currentPlan.color}-200 rounded-2xl p-6 sm:p-8 shadow-lg`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        ACTIVE
                      </span>
                    )}
                    {!isPremium && (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{currentPlan.description}</p>
                </div>
                {currentPlan.price > 0 && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">${currentPlan.price}</div>
                    <div className="text-sm text-gray-600">/month</div>
                  </div>
                )}
                {currentPlan.price === 0 && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">Free</div>
                  </div>
                )}
              </div>

              {/* Status Info */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</p>
                    <p className={`text-sm font-bold ${
                      isActive ? "text-green-600" : "text-red-600"
                    }`}>
                      {subscription.status === "active" && "Active"}
                      {subscription.status === "trialing" && "Trial"}
                      {subscription.status === "canceled" && "Canceled"}
                      {subscription.status === "past_due" && "Past Due"}
                    </p>
                  </div>
                  {periodEnd && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        {subscription.cancel_at_period_end ? "Expires on" : "Renews on"}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{periodEnd}</p>
                    </div>
                  )}
                  {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Trial Ends</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(subscription.trial_end).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Usage Stats */}
            {limits && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Saved Signatures</span>
                      <span className="text-sm font-bold text-gray-900">
                        {limits.saved_signatures_count} / {limits.max_saved_signatures === -1 ? "∞" : limits.max_saved_signatures}
                      </span>
                    </div>
                    {limits.max_saved_signatures !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            limits.remaining === 0
                              ? "bg-red-500"
                              : limits.remaining <= 1
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(100, (limits.saved_signatures_count / limits.max_saved_signatures) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    )}
                    {limits.max_saved_signatures === -1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Unlimited storage
                      </div>
                    )}
                    {limits.max_saved_signatures !== -1 && limits.remaining === 0 && (
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        ⚠️ You've reached your limit. Upgrade to Premium for unlimited signatures!
                      </p>
                    )}
                    {limits.max_saved_signatures !== -1 && limits.remaining > 0 && limits.remaining <= 1 && (
                      <p className="text-xs text-yellow-600 mt-2 font-medium">
                        ⚠️ Only {limits.remaining} signature{limits.remaining > 1 ? "s" : ""} remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Upgrade Options */}
          <div className="space-y-6">
            {/* Upgrade Card */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                  <h3 className="text-xl font-bold">Upgrade to Premium</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  Unlock all premium templates, unlimited signatures, and export without watermarks.
                </p>
                <Link
                  href="/#pricing"
                  className="block w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-xl text-center hover:bg-gray-100 transition-colors"
                >
                  View Plans & Pricing
                </Link>
                <p className="text-xs text-blue-200 mt-3 text-center">
                  Payment integration coming soon
                </p>
              </div>
            )}

            {isPremium && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-2xl text-green-600">check_circle</span>
                  <h3 className="text-lg font-bold text-gray-900">You're on Premium!</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Enjoy all premium features. Your subscription is active and you have access to everything.
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:bg-blue-700 transition-colors"
                >
                  Create Signature
                </Link>
                <Link
                  href="/dashboard/signatures"
                  className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl text-center hover:bg-gray-200 transition-colors"
                >
                  View My Signatures
                </Link>
                <Link
                  href="/#pricing"
                  className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl text-center hover:bg-gray-200 transition-colors"
                >
                  View All Plans
                </Link>
              </div>
            </div>

            {/* Help */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-xs text-gray-600 mb-3">
                Questions about your subscription or billing?
              </p>
              <Link
                href="/contact"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

