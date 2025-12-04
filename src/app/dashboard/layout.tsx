"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { analytics } from "@/lib/analytics";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isPremium, subscription } = useSubscription();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    analytics.signOut();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Signature Editor",
      icon: "edit_square",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/signatures",
      label: "My Signatures",
      icon: "badge",
      active: pathname === "/dashboard/signatures",
    },
    {
      href: "/dashboard/subscription",
      label: "Subscription",
      icon: "card_membership",
      active: pathname === "/dashboard/subscription",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: "settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">draw</span>
            <span className="text-xl font-bold text-gray-900">Signature For Me</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-gray-700">
              {sidebarOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-3xl text-blue-600">draw</span>
            <span className="text-xl font-bold text-gray-900">Signature For Me</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {item.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
              )}
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isPremium ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-blue-100"
                }`}>
                  <span className={`material-symbols-outlined text-xl ${
                    isPremium ? "text-white" : "text-blue-600"
                  }`}>person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                    </p>
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold rounded">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {subscription && !isPremium && (
                    <p className="text-xs text-gray-400 mt-0.5">Free Plan</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-lg shadow-blue-500/30"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1920px]">
          <Breadcrumbs />
          <div className="-mt-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
