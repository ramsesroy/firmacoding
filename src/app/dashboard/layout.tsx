"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
            FirmaCoding
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 sm:p-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link
              href="/dashboard"
              className="text-xl sm:text-2xl font-bold text-indigo-600"
              onClick={() => setSidebarOpen(false)}
            >
              FirmaCoding
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition ml-auto"
            aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            title={sidebarCollapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? "Editor de Firmas" : ""}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {!sidebarCollapsed && <span>Editor de Firmas</span>}
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard/firmas"
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? "Mis Firmas" : ""}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {!sidebarCollapsed && <span>Mis Firmas</span>}
              </Link>
              <Link
                href="/dashboard/configuracion"
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? "Configuración" : ""}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {!sidebarCollapsed && <span>Configuración</span>}
              </Link>
            </>
          )}
          {!user && (
            <Link
              href="/register"
              className={`flex items-center gap-3 px-6 py-3 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition font-semibold ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? "Crear Cuenta" : ""}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {!sidebarCollapsed && <span>Crear Cuenta</span>}
            </Link>
          )}
        </nav>
        <div className={`absolute bottom-0 w-full p-4 sm:p-6 border-t space-y-2 ${sidebarCollapsed ? "px-2" : ""}`}>
          {user && !sidebarCollapsed && (
            <div className="mb-3 px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Sesión iniciada como</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 text-center text-red-600 hover:text-red-700 hover:bg-red-50 transition text-sm sm:text-base font-medium py-2 px-4 rounded-lg ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              title={sidebarCollapsed ? "Cerrar Sesión" : ""}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && <span>Cerrar Sesión</span>}
            </button>
          )}
          <Link
            href="/"
            className={`flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition text-sm sm:text-base ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? "Volver al inicio" : ""}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {!sidebarCollapsed && <span>Volver al inicio</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-0 transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}>{children}</main>
    </div>
  );
}

