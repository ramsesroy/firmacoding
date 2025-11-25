import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
            FirmaCoding
          </Link>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Editor de Firmas
          </Link>
          <Link
            href="/dashboard/firmas"
            className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Mis Firmas
          </Link>
          <Link
            href="/dashboard/configuracion"
            className="block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            Configuración
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t">
          <Link
            href="/"
            className="block text-center text-gray-600 hover:text-indigo-600 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

