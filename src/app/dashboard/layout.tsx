"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            FirmaCoding
          </Link>
          <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle menu"
            >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          </div>
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
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 sm:p-6">
          <Link
            href="/dashboard"
            className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            onClick={() => setSidebarOpen(false)}
          >
            FirmaCoding
          </Link>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className="block px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            onClick={() => setSidebarOpen(false)}
          >
            Editor de Firmas
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard/firmas"
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                Mis Firmas
              </Link>
              <Link
                href="/dashboard/configuracion"
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                Configuración
              </Link>
            </>
          )}
          {!user && (
            <Link
              href="/register"
              className="block px-6 py-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              Crear Cuenta
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 w-full p-4 sm:p-6 border-t space-y-2">
          {user && (
            <div className="mb-3 px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Sesión iniciada como</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full text-center text-red-600 hover:text-red-700 hover:bg-red-50 transition text-sm sm:text-base font-medium py-2 px-4 rounded-lg"
            >
              Cerrar Sesión
            </button>
          )}
          <Link
            href="/"
            className="block text-center text-gray-600 hover:text-indigo-600 transition text-sm sm:text-base"
            onClick={() => setSidebarOpen(false)}
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}

