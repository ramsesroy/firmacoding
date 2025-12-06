"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import {
  getLinkAnalyticsSummary,
  getUserTrackedLinks,
  getLinkClickHistory,
  type TrackedLink,
  type LinkClick,
  type LinkAnalyticsSummary,
} from "@/lib/linkTracking";
import Header from "@/components/Header";
import { MetadataHead } from "@/components/MetadataHead";
import {
  HiOutlineChartBar,
  HiOutlineCursorArrowRays,
  HiOutlineLink,
  HiOutlineCalendar,
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

export default function AnalyticsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<LinkAnalyticsSummary | null>(null);
  const [trackedLinks, setTrackedLinks] = useState<TrackedLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<TrackedLink | null>(null);
  const [clickHistory, setClickHistory] = useState<LinkClick[]>([]);
  const [daysFilter, setDaysFilter] = useState(30);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Check premium status
      if (!subscriptionLoading && !isPremium) {
        showToast("Link analytics is only available for Premium users", "info");
        router.push("/dashboard/subscription");
        return;
      }

      if (isPremium) {
        loadAnalytics(session.user.id);
      }
    };

    checkAuth();
  }, [isPremium, subscriptionLoading, router, showToast]);

  const loadAnalytics = async (userId: string) => {
    setLoading(true);
    try {
      const [summaryData, linksData] = await Promise.all([
        getLinkAnalyticsSummary(userId, daysFilter),
        getUserTrackedLinks(userId),
      ]);

      setSummary(summaryData);
      setTrackedLinks(linksData || []);
    } catch (error) {
      console.error("Error loading analytics:", error);
      showToast("Error loading analytics data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (link: TrackedLink) => {
    setSelectedLink(link);
    try {
      const history = await getLinkClickHistory(link.id, 50);
      setClickHistory(history);
    } catch (error) {
      console.error("Error loading click history:", error);
      showToast("Error loading click history", "error");
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <>
        <MetadataHead
          title="Link Analytics - Signature For Me"
          description="Track clicks on links in your email signatures"
        />
        <Header />
        <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isPremium) {
    return null; // Will redirect
  }

  return (
    <>
      <MetadataHead
        title="Link Analytics - Signature For Me"
        description="Track clicks on links in your email signatures"
      />
      <Header />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Link Analytics
            </h1>
            <p className="text-gray-600">
              Track clicks on links in your email signatures
            </p>
          </div>

          {/* Days Filter */}
          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Time Period:
            </label>
            <select
              value={daysFilter}
              onChange={(e) => {
                setDaysFilter(Number(e.target.value));
                if (user) {
                  loadAnalytics(user.id);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Clicks
                  </h3>
                  <HiOutlineCursorArrowRays className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary.total_clicks || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All time clicks
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    Today
                  </h3>
                  <HiOutlineCalendar className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary.clicks_today || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Clicks today
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    This Week
                  </h3>
                  <HiOutlineChartBar className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary.clicks_this_week || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last 7 days
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    Tracked Links
                  </h3>
                  <HiOutlineLink className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {summary.unique_links || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Active links
                </p>
              </div>
            </div>
          )}

          {/* Tracked Links List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Tracked Links
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {trackedLinks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <HiOutlineLink className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No tracked links yet</p>
                  <p className="text-sm mt-2">
                    Links in your signatures will be tracked automatically
                  </p>
                </div>
              ) : (
                trackedLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleLinkClick(link)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {link.link_type}
                          </span>
                          {link.link_label && (
                            <span className="text-sm text-gray-600">
                              {link.link_label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 truncate">
                          {link.original_url}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created:{" "}
                          {new Date(link.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {link.click_count}
                        </p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Click History Modal */}
          {selectedLink && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Click History
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedLink.original_url}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLink(null);
                      setClickHistory([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {clickHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <HiOutlineCursorArrowRays className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No clicks recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clickHistory.map((click) => (
                        <div
                          key={click.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {click.device_type === "mobile" ? (
                                <HiOutlineDevicePhoneMobile className="w-5 h-5 text-gray-400" />
                              ) : (
                                <HiOutlineComputerDesktop className="w-5 h-5 text-gray-400" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {click.browser} on {click.os}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(click.clicked_at).toLocaleString()}
                            </span>
                          </div>
                          {click.country && (
                            <div className="flex items-center gap-2 mt-2">
                              <HiOutlineGlobeAlt className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {click.city
                                  ? `${click.city}, ${click.country}`
                                  : click.country}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
