export default function FirmasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Firmas</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gestiona todas tus firmas guardadas
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-base sm:text-lg mb-2">No tienes firmas guardadas aún</p>
          <p className="text-xs sm:text-sm mb-4">
            Crea tu primera firma en el editor
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Ir al Editor
          </a>
        </div>
      </div>
    </div>
  );
}

